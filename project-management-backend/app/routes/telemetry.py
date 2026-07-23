from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt
from app import db
from app.models import TaskStateHistory, Task, User
from app.utils import get_current_user_id

telemetry_bp = Blueprint('telemetry', __name__, url_prefix='/api/telemetry')

@telemetry_bp.route('', methods=['GET'])
@jwt_required()
def get_telemetry():
    """
    Obtener el historial completo de cambios de estado (telemetría de tiempo de ciclo)
    Filtrado por el proyecto al que pertenece el usuario autenticado.
    """
    try:
        user_id = get_current_user_id()
        claims = get_jwt()
        user_role = claims.get('role')
        project_id = claims.get('project_id') or claims.get('user_project_id')
        
        # Si no hay project_id en claims, buscar del usuario actual
        if not project_id:
            user = db.session.get(User, user_id)
            if user:
                if user.role == 'OWNER' and user.owned_project:
                    project_id = user.owned_project.id
                elif user.role == 'EMPLOYEE' and user.memberships:
                    active_membership = next((m for m in user.memberships if m.status == 'active'), None)
                    if active_membership:
                        project_id = active_membership.project_id
        
        if not project_id:
            return jsonify({
                'success': True,
                'data': []
            }), 200

        # Obtener todas las tareas de este proyecto
        project_tasks = Task.query.filter_by(project_id=project_id).all()
        project_task_ids = [t.id for t in project_tasks]

        if not project_task_ids:
            return jsonify({
                'success': True,
                'data': []
            }), 200

        # Consultar el historial de las tareas del proyecto
        histories = TaskStateHistory.query.filter(
            TaskStateHistory.task_id.in_(project_task_ids)
        ).order_by(TaskStateHistory.changed_at.desc()).all()

        history_list = []
        for h in histories:
            task = db.session.get(Task, h.task_id)
            user = db.session.get(User, h.changed_by_id) if h.changed_by_id else None
            
            history_list.append({
                'id': h.id,
                'task_id': h.task_id,
                'task_title': task.title if task else 'Tarea eliminada',
                'from_state': h.from_state,
                'to_state': h.to_state,
                'changed_at': h.changed_at.isoformat() if h.changed_at else None,
                'changed_by_id': h.changed_by_id,
                'changed_by_name': user.name if user else 'Sistema / Automatizado'
            })

        return jsonify({
            'success': True,
            'data': history_list
        }), 200

    except Exception as e:
        return jsonify({
            'success': False,
            'error': {
                'code': 'SERVER_ERROR',
                'message': str(e)
            }
        }), 500
