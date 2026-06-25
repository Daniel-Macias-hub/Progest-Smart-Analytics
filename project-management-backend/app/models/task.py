from datetime import datetime
from app import db
import uuid


class Task(db.Model):
    __tablename__ = 'tasks'
    
    # Primary Key
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    
    # Foreign Keys
    project_id = db.Column(db.String(36), db.ForeignKey('projects.id'), nullable=False, index=True)
    sprint_id = db.Column(db.String(36), db.ForeignKey('sprints.id'), nullable=True, index=True)
    
    # Basic Info
    title = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text, nullable=True)
    
    # Status: pending, in_progress, in_review, blocked, done (RF-013)
    status = db.Column(
        db.Enum('pending', 'in_progress', 'in_review', 'blocked', 'done', name='task_status'),
        default='pending',
        nullable=False
    )
    
    # Priority: low, medium, high, urgent
    priority = db.Column(
        db.Enum('low', 'medium', 'high', 'urgent', name='task_priority'),
        default='medium',
        nullable=False
    )
    
    # Assignment
    assigned_to = db.Column(db.String(36), db.ForeignKey('users.id'), nullable=True, index=True)
    created_by = db.Column(db.String(36), db.ForeignKey('users.id'), nullable=False, index=True)
    
    # Dates
    due_date = db.Column(db.DateTime, nullable=True)
    start_date = db.Column(db.DateTime, nullable=True)
    completed_at = db.Column(db.DateTime, nullable=True)
    
    # Tags (JSON array)
    tags = db.Column(db.JSON, nullable=True)
    
    # Checklist (JSON array of objects with id, text, completed)
    checklist = db.Column(db.JSON, nullable=True, default=list)
    
    # Smart Risk Engine fields (RF-086+)
    risk_status = db.Column(
        db.Enum('no_risk', 'low', 'medium', 'high', name='risk_status'),
        default='no_risk',
        nullable=False
    )
    delay_probability = db.Column(db.Float, default=0.0, nullable=False)
    predicted_delay_days = db.Column(db.Integer, default=0, nullable=False)
    risk_factors = db.Column(db.JSON, nullable=True, default=dict)
    
    # Timestamps
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    project = db.relationship('Project', back_populates='tasks')
    sprint = db.relationship('Sprint', back_populates='tasks')
    assignee = db.relationship('User', back_populates='assigned_tasks', foreign_keys=[assigned_to])
    creator = db.relationship('User', back_populates='created_tasks', foreign_keys=[created_by])
    
    # Comentarios de la tarea
    comments = db.relationship('Comment', back_populates='task', cascade='all, delete-orphan')
    
    # Historial de cambios de estado (telemetría de tiempo de ciclo)
    state_history = db.relationship(
        'TaskStateHistory',
        back_populates='task',
        cascade='all, delete-orphan',
        order_by='TaskStateHistory.changed_at.asc()'
    )
    
    def __repr__(self):
        return f'<Task {self.title} ({self.status})>'
    
    def to_dict(self):
        return {
            'id': self.id,
            'project_id': self.project_id,
            'sprint_id': self.sprint_id,
            'title': self.title,
            'description': self.description,
            'status': self.status,
            'priority': self.priority,
            'assigned_to': self.assigned_to,
            'created_by': self.created_by,
            'due_date': self.due_date.isoformat() if self.due_date else None,
            'start_date': self.start_date.isoformat() if self.start_date else None,
            'tags': self.tags,
            'checklist': self.checklist if self.checklist else [],
            'risk_status': self.risk_status,
            'delay_probability': self.delay_probability,
            'predicted_delay_days': self.predicted_delay_days,
            'risk_factors': self.risk_factors if self.risk_factors else {},
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }
