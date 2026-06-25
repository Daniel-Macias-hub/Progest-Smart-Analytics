from datetime import datetime
from app import db
import uuid


class TaskStateHistory(db.Model):
    __tablename__ = 'task_state_histories'
    
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    task_id = db.Column(db.String(36), db.ForeignKey('tasks.id', ondelete='CASCADE'), nullable=False, index=True)
    
    from_state = db.Column(
        db.Enum('pending', 'in_progress', 'in_review', 'blocked', 'done', name='task_status', inherit_schema=True),
        nullable=True
    )
    to_state = db.Column(
        db.Enum('pending', 'in_progress', 'in_review', 'blocked', 'done', name='task_status', inherit_schema=True),
        nullable=False
    )
    
    changed_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    changed_by_id = db.Column(db.String(36), db.ForeignKey('users.id', ondelete='SET NULL'), nullable=True)
    
    # Relationships
    task = db.relationship('Task', back_populates='state_history')
    changed_by = db.relationship('User', foreign_keys=[changed_by_id])
    
    def __repr__(self):
        return f'<TaskStateHistory Task:{self.task_id} {self.from_state} -> {self.to_state} at {self.changed_at}>'
    
    def to_dict(self):
        return {
            'id': self.id,
            'task_id': self.task_id,
            'from_state': self.from_state,
            'to_state': self.to_state,
            'changed_at': self.changed_at.isoformat() if self.changed_at else None,
            'changed_by_id': self.changed_by_id
        }
