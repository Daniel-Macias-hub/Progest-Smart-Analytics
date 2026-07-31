import os
import sys
import uuid

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from run import app, db
from app.models import User, Project, Membership
from app.services import AuthService

with app.app_context():
    # 1. Buscar o crear proyecto por defecto
    project = Project.query.first()
    if not project:
        project = Project(
            id=str(uuid.uuid4()),
            name="ProGest Smart Analytics Demo",
            description="Proyecto principal de evaluacion",
            owner_id=None
        )
        db.session.add(project)
        db.session.commit()

    # 2. Manejar owner@progest.com
    owner = User.query.filter_by(email="owner@progest.com").first()
    if not owner:
        owner = User(
            id=str(uuid.uuid4()),
            email="owner@progest.com",
            name="Daniel Macias (Owner)",
            password_hash=AuthService.hash_password("admin123"),
            role="OWNER",
            status="active"
        )
        db.session.add(owner)
        db.session.commit()
    else:
        owner.password_hash = AuthService.hash_password("admin123")
        owner.status = "active"
        db.session.commit()

    # Asignar owner como propietario del proyecto
    if not project.owner_id:
        project.owner_id = owner.id
        db.session.commit()

    # Membresía de Owner
    m_owner = Membership.query.filter_by(user_id=owner.id, project_id=project.id).first()
    if not m_owner:
        m_owner = Membership(
            id=str(uuid.uuid4()),
            user_id=owner.id,
            project_id=project.id,
            role="OWNER",
            status="active"
        )
        db.session.add(m_owner)
        db.session.commit()

    # 3. Manejar employee@progest.com
    emp = User.query.filter_by(email="employee@progest.com").first()
    if not emp:
        emp = User(
            id=str(uuid.uuid4()),
            email="employee@progest.com",
            name="Desarrollador Demo (Employee)",
            password_hash=AuthService.hash_password("user123"),
            role="EMPLOYEE",
            status="active"
        )
        db.session.add(emp)
        db.session.commit()
    else:
        emp.password_hash = AuthService.hash_password("user123")
        emp.status = "active"
        db.session.commit()

    # Membresía de Employee
    m_emp = Membership.query.filter_by(user_id=emp.id, project_id=project.id).first()
    if not m_emp:
        m_emp = Membership(
            id=str(uuid.uuid4()),
            user_id=emp.id,
            project_id=project.id,
            role="EMPLOYEE",
            status="active"
        )
        db.session.add(m_emp)
        db.session.commit()

    print("=== USUARIOS OFICIALES CREADOS / ACTUALIZADOS CON ÉXITO ===")
    print("1. Owner: email='owner@progest.com' | password='admin123'")
    print("2. Employee: email='employee@progest.com' | password='user123'")
