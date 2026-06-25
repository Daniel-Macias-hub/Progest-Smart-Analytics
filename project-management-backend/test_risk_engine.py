import unittest
from datetime import datetime, timedelta
from run import app, db
from app.models import Task, User, Project, TaskStateHistory
from app.services.risk_engine_service import SmartRiskEngineService


class TestSmartRiskEngine(unittest.TestCase):
    def setUp(self):
        # Configurar la app para pruebas en base de datos SQLite en memoria
        app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///:memory:'
        app.config['TESTING'] = True
        self.app_context = app.app_context()
        self.app_context.push()
        
        # Inicializar tablas
        db.create_all()
        
        # Crear datos semilla básicos
        self.user = User(
            id='user-01',
            email='test@example.com',
            password_hash='hashed',
            name='Test User',
            role='OWNER'
        )
        self.project = Project(
            id='project-01',
            name='Test Project',
            owner_id='user-01'
        )
        db.session.add(self.user)
        db.session.add(self.project)
        db.session.commit()

    def tearDown(self):
        db.session.remove()
        db.drop_all()
        self.app_context.pop()

    def test_calculate_risk_no_due_date(self):
        """Si la tarea no tiene due_date y está pending, el riesgo debería ser 'no_risk'"""
        task = Task(
            id='task-01',
            project_id='project-01',
            title='Task without due date',
            status='pending',
            created_by='user-01'
        )
        db.session.add(task)
        db.session.commit()

        metrics = SmartRiskEngineService.calculate_task_risk(task.id)
        
        self.assertEqual(metrics['risk_status'], 'no_risk')
        self.assertEqual(metrics['delay_probability'], 0.0)
        self.assertFalse(metrics['risk_factors'].get('overdue', False))

    def test_calculate_risk_overdue(self):
        """Si la tarea está vencida y no completada, el riesgo debe ser alto con probabilidad 1.0"""
        past_date = datetime.utcnow() - timedelta(days=2)
        task = Task(
            id='task-02',
            project_id='project-01',
            title='Overdue task',
            status='pending',
            created_by='user-01',
            due_date=past_date
        )
        db.session.add(task)
        db.session.commit()

        metrics = SmartRiskEngineService.calculate_task_risk(task.id)
        
        self.assertEqual(metrics['risk_status'], 'high')
        self.assertEqual(metrics['delay_probability'], 1.0)
        self.assertTrue(metrics['risk_factors'].get('overdue'))
        self.assertGreaterEqual(metrics['predicted_delay_days'], 2)

    def test_calculate_risk_due_soon(self):
        """Si la tarea vence pronto (< 24h) y no tiene checklist, el riesgo debe ser alto o medio"""
        soon_date = datetime.utcnow() + timedelta(hours=12)
        task = Task(
            id='task-03',
            project_id='project-01',
            title='Urgent task due soon',
            status='pending',
            created_by='user-01',
            due_date=soon_date
        )
        db.session.add(task)
        db.session.commit()

        metrics = SmartRiskEngineService.calculate_task_risk(task.id)
        
        # Al vencer en menos de 24h sin empezar, tiene probabilidad alta y factores correspondientes
        self.assertTrue(metrics['risk_factors'].get('due_date_proximity_critical') or metrics['risk_factors'].get('unstarted_critical_task'))
        self.assertGreater(metrics['delay_probability'], 0.40)

    def test_log_state_transition(self):
        """Debería registrar correctamente las transiciones de estado en la telemetría"""
        task = Task(
            id='task-04',
            project_id='project-01',
            title='State transition task',
            status='pending',
            created_by='user-01'
        )
        db.session.add(task)
        db.session.commit()

        # Cambiar estado y registrar
        SmartRiskEngineService.log_state_transition(task.id, 'pending', 'in_progress', 'user-01')
        
        history = TaskStateHistory.query.filter_by(task_id=task.id).first()
        self.assertIsNotNone(history)
        self.assertEqual(history.from_state, 'pending')
        self.assertEqual(history.to_state, 'in_progress')
        self.assertEqual(history.changed_by_id, 'user-01')


if __name__ == '__main__':
    unittest.main()
