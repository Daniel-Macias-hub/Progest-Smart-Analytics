"""Add risk engine fields and task state history table

Revision ID: 5a3c2d1e9f8b
Revises: 48b30321d2db
Create Date: 2026-06-25 00:30:00.000000

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '5a3c2d1e9f8b'
down_revision = '48b30321d2db'
branch_labels = None
depends_on = None


def upgrade():
    # 1. Crear el tipo Enum para 'risk_status'
    risk_status_enum = sa.Enum('no_risk', 'low', 'medium', 'high', name='risk_status')
    risk_status_enum.create(op.get_bind(), checkfirst=True)
    
    # 2. Agregar campos a la tabla 'tasks'
    with op.batch_alter_table('tasks', schema=None) as batch_op:
        batch_op.add_column(sa.Column('risk_status', sa.Enum('no_risk', 'low', 'medium', 'high', name='risk_status'), nullable=False, server_default='no_risk'))
        batch_op.add_column(sa.Column('delay_probability', sa.Float(), nullable=False, server_default='0.0'))
        batch_op.add_column(sa.Column('predicted_delay_days', sa.Integer(), nullable=False, server_default='0'))
        batch_op.add_column(sa.Column('risk_factors', sa.JSON(), nullable=True))

    # 3. Crear la tabla 'task_state_histories'
    op.create_table(
        'task_state_histories',
        sa.Column('id', sa.String(length=36), nullable=False),
        sa.Column('task_id', sa.String(length=36), nullable=False),
        sa.Column('from_state', sa.Enum('pending', 'in_progress', 'in_review', 'blocked', 'done', name='task_status', inherit_schema=True), nullable=True),
        sa.Column('to_state', sa.Enum('pending', 'in_progress', 'in_review', 'blocked', 'done', name='task_status', inherit_schema=True), nullable=False),
        sa.Column('changed_at', sa.DateTime(), nullable=False, server_default=sa.func.now()),
        sa.Column('changed_by_id', sa.String(length=36), nullable=True),
        sa.ForeignKeyConstraint(['task_id'], ['tasks.id'], name='fk_task_state_histories_task_id_tasks', ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['changed_by_id'], ['users.id'], name='fk_task_state_histories_changed_by_id_users', ondelete='SET NULL'),
        sa.PrimaryKeyConstraint('id')
    )
    
    with op.batch_alter_table('task_state_histories', schema=None) as batch_op:
        batch_op.create_index(batch_op.f('ix_task_state_histories_task_id'), ['task_id'], unique=False)


def downgrade():
    # 1. Eliminar la tabla 'task_state_histories' e índice
    with op.batch_alter_table('task_state_histories', schema=None) as batch_op:
        batch_op.drop_index(batch_op.f('ix_task_state_histories_task_id'))
    op.drop_table('task_state_histories')

    # 2. Eliminar campos de la tabla 'tasks'
    with op.batch_alter_table('tasks', schema=None) as batch_op:
        batch_op.drop_column('risk_factors')
        batch_op.drop_column('predicted_delay_days')
        batch_op.drop_column('delay_probability')
        batch_op.drop_column('risk_status')

    # 3. Eliminar el tipo Enum 'risk_status'
    risk_status_enum = sa.Enum('no_risk', 'low', 'medium', 'high', name='risk_status')
    risk_status_enum.drop(op.get_bind(), checkfirst=True)
