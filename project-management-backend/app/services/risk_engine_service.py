from datetime import datetime, timedelta
from app import db
from app.models import Task, TaskStateHistory, User


class SmartRiskEngineService:
    """
    Smart Risk Engine Service (Heurísticas y Telemetría)
    Calcula de manera preventiva la probabilidad y nivel de riesgo de retraso de una tarea.
    """

    @staticmethod
    def calculate_task_risk(task_id: str) -> dict:
        """
        Calcula el riesgo de retraso para una tarea específica basándose en:
        1. Proximidad de la fecha límite (due_date)
        2. Avance del checklist
        3. Carga de trabajo del desarrollador asignado
        4. Estancamiento de estado (tiempo de ciclo)
        
        Retorna un diccionario con:
        - risk_status: 'no_risk', 'low', 'medium', 'high'
        - delay_probability: float (0.0 - 1.0)
        - predicted_delay_days: int (días estimados de retraso)
        - risk_factors: dict (factores detectados)
        """
        task = Task.query.get(task_id)
        if not task:
            return {
                'risk_status': 'no_risk',
                'delay_probability': 0.0,
                'predicted_delay_days': 0,
                'risk_factors': {}
            }

        # Si la tarea ya está finalizada, no hay riesgo
        if task.status == 'done':
            return {
                'risk_status': 'no_risk',
                'delay_probability': 0.0,
                'predicted_delay_days': 0,
                'risk_factors': {}
            }

        now = datetime.utcnow()
        risk_factors = {}
        delay_probability = 0.0
        predicted_delay_days = 0
        
        # -------------------------------------------------------------
        # 1. Análisis de Fecha Límite (Due Date)
        # -------------------------------------------------------------
        has_due_date = task.due_date is not None
        time_remaining = None
        is_overdue = False

        if has_due_date:
            time_remaining = task.due_date - now
            is_overdue = time_remaining.total_seconds() < 0
            
            if is_overdue:
                # Tarea ya vencida
                overdue_days = abs(time_remaining.days)
                risk_factors['overdue'] = True
                delay_probability = 1.0
                predicted_delay_days = overdue_days if overdue_days > 0 else 1
            else:
                # Horas restantes
                hours_left = time_remaining.total_seconds() / 3600.0
                if hours_left <= 24:
                    risk_factors['due_date_proximity_critical'] = True
                    delay_probability += 0.60
                elif hours_left <= 72:
                    risk_factors['due_date_proximity_warning'] = True
                    delay_probability += 0.35
                elif hours_left <= 168: # 1 semana
                    risk_factors['due_date_proximity_notice'] = True
                    delay_probability += 0.15

        # -------------------------------------------------------------
        # 2. Análisis del Checklist (Progreso Interno)
        # -------------------------------------------------------------
        checklist = task.checklist if task.checklist else []
        total_items = len(checklist)
        
        if total_items > 0:
            completed_items = sum(1 for item in checklist if item.get('completed', False))
            completion_rate = completed_items / total_items
            
            # Penalizar si le queda poco tiempo y el avance del checklist es bajo
            if completion_rate < 1.0:
                risk_factors['incomplete_checklist'] = True
                
                # Si falta menos de 48 horas y tiene menos del 50% completado
                if has_due_date and not is_overdue:
                    hours_left = (task.due_date - now).total_seconds() / 3600.0
                    if hours_left <= 48 and completion_rate < 0.50:
                        risk_factors['low_checklist_velocity'] = True
                        delay_probability += 0.25
                    elif hours_left <= 24 and completion_rate < 0.80:
                        risk_factors['low_checklist_velocity'] = True
                        delay_probability += 0.30
                
                # Penalización base por tareas pendientes sin checklist completado
                if completion_rate == 0.0:
                    delay_probability += 0.10
        elif task.status != 'done' and has_due_date and not is_overdue:
            # Si no tiene checklist, pero está en pending/in_progress sin avance explícito
            hours_left = (task.due_date - now).total_seconds() / 3600.0
            if hours_left <= 24 and task.status == 'pending':
                risk_factors['unstarted_critical_task'] = True
                delay_probability += 0.40

        # -------------------------------------------------------------
        # 3. Análisis de Carga del Desarrollador (Workload)
        # -------------------------------------------------------------
        if task.assigned_to:
            # Contar tareas activas (no terminadas) del mismo usuario en el mismo proyecto
            active_assigned_tasks = Task.query.filter(
                Task.assigned_to == task.assigned_to,
                Task.project_id == task.project_id,
                Task.status != 'done',
                Task.id != task.id
            ).count()
            
            # Si tiene más de 3 tareas activas, hay riesgo de saturación
            if active_assigned_tasks >= 3:
                risk_factors['developer_overload'] = True
                delay_probability += 0.15

        # -------------------------------------------------------------
        # 4. Análisis de Estancamiento (Time in Status)
        # -------------------------------------------------------------
        # Buscar la última transición de estado
        last_history = TaskStateHistory.query.filter_by(task_id=task.id).order_by(TaskStateHistory.changed_at.desc()).first()
        if last_history:
            days_in_current_state = (now - last_history.changed_at).days
            # Si lleva más de 5 días en in_progress o blocked
            if task.status in ['in_progress', 'blocked'] and days_in_current_state >= 5:
                risk_factors['status_stagnation'] = True
                delay_probability += 0.20
                if task.status == 'blocked':
                    risk_factors['task_blocked'] = True
                    delay_probability += 0.10
        else:
            # Si no hay historial, usar la fecha de actualización o creación
            days_since_update = (now - (task.updated_at or task.created_at)).days
            if task.status in ['in_progress', 'blocked'] and days_since_update >= 5:
                risk_factors['status_stagnation'] = True
                delay_probability += 0.15

        # Limitar la probabilidad entre 0.0 y 1.0
        delay_probability = min(max(delay_probability, 0.0), 1.0)

        # -------------------------------------------------------------
        # Determinar el Nivel de Riesgo (Risk Status)
        # -------------------------------------------------------------
        if delay_probability >= 0.75 or is_overdue:
            risk_status = 'high'
            # Calcular días estimados de retraso adicionales
            if not is_overdue and has_due_date:
                predicted_delay_days = 2
        elif delay_probability >= 0.40:
            risk_status = 'medium'
            if has_due_date:
                predicted_delay_days = 1
        elif delay_probability >= 0.15:
            risk_status = 'low'
            predicted_delay_days = 0
        else:
            risk_status = 'no_risk'
            predicted_delay_days = 0

        # Si el estado es blocked, forzar al menos riesgo medio
        if task.status == 'blocked' and risk_status == 'no_risk':
            risk_status = 'medium'
            delay_probability = max(delay_probability, 0.45)

        return {
            'risk_status': risk_status,
            'delay_probability': round(delay_probability, 2),
            'predicted_delay_days': predicted_delay_days,
            'risk_factors': risk_factors
        }

    @staticmethod
    def update_task_risk_metrics(task_id: str) -> Task:
        """
        Calcula y actualiza directamente las métricas de riesgo en el modelo de tareas.
        """
        task = Task.query.get(task_id)
        if not task:
            return None

        metrics = SmartRiskEngineService.calculate_task_risk(task_id)
        
        task.risk_status = metrics['risk_status']
        task.delay_probability = metrics['delay_probability']
        task.predicted_delay_days = metrics['predicted_delay_days']
        task.risk_factors = metrics['risk_factors']
        
        db.session.commit()
        return task

    @staticmethod
    def log_state_transition(task_id: str, from_state: str, to_state: str, changed_by_id: str = None) -> TaskStateHistory:
        """
        Registra una transición de estado en el historial de telemetría.
        """
        if from_state == to_state:
            return None

        history = TaskStateHistory(
            task_id=task_id,
            from_state=from_state,
            to_state=to_state,
            changed_by_id=changed_by_id
        )
        db.session.add(history)
        db.session.commit()
        return history
