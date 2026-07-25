import sys; sys.path.insert(0, '.')
from run import app, db
from app.models import Task, TaskStateHistory

with app.app_context():
    print('=== ESTADO FINAL POST-TRANSICIONES (DB DIRECT) ===')
    print()
    tasks = Task.query.filter(Task.title.like('%RISK-AUDIT%')).order_by(Task.title).all()
    
    summary = {'no_risk': 0, 'low': 0, 'medium': 0, 'high': 0}
    for t in tasks:
        factors = ', '.join(t.risk_factors.keys()) if t.risk_factors else '-'
        summary[t.risk_status] += 1
        line = f'{t.risk_status:8s} prob={t.delay_probability:.2f} delay={t.predicted_delay_days}d | {t.status:11s} | {t.title[14:60]}'
        print(line)
        if t.risk_factors:
            print(f'         -> {factors}')
    
    print()
    print('=== DISTRIBUCION DE RIESGO ===')
    for k, v in summary.items():
        print(f'  {k}: {v}')
    
    print()
    audit_ids = [t.id for t in tasks]
    histories = TaskStateHistory.query.filter(TaskStateHistory.task_id.in_(audit_ids)).order_by(TaskStateHistory.changed_at).all()
    print(f'=== HISTORIAL COMPLETO ({len(histories)} transiciones) ===')
    for h in histories:
        task = db.session.get(Task, h.task_id)
        name = task.title[14:35] if task else '???'
        from_s = h.from_state or 'NULL'
        line2 = f'  {from_s:11s} -> {h.to_state:11s} at {h.changed_at} | {name}'
        print(line2)
