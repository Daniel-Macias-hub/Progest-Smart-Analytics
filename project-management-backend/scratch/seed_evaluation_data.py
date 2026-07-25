import sys
import os
import uuid
from datetime import datetime, timedelta, timezone
from werkzeug.security import generate_password_hash

backend_dir = r"C:\Users\DanielMacias\Progest-Smart-Analytics\project-management-backend"
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

from run import app
from app import db
from app.models import User, Project, Membership, Task, Sprint, Comment, TaskStateHistory
from app.services.risk_engine_service import SmartRiskEngineService

def seed_data():
    with app.app_context():
        print("[START] Iniciando Seeding Masivo de Evaluacion (4 Proyectos, 40 Tareas)...")
        
        # 1. Recuperar o crear usuario QA Principal
        qa_user_email = "qa_restart_20260720135856@test.com"
        qa_user = User.query.filter_by(email=qa_user_email).first()
        if not qa_user:
            qa_user = User(
                email=qa_user_email,
                name="Jesús Daniel Macías Matus (Lead Owner)",
                password_hash=generate_password_hash("Test1234!"),
                role="OWNER",
                status="active"
            )
            db.session.add(qa_user)
            db.session.commit()
            
        devs_data = [
            ("dev_matus@test.com", "Daniel Macías (Lead Dev)", "EMPLOYEE"),
            ("dev_garcia@test.com", "Carlos García (Backend)", "EMPLOYEE"),
            ("dev_lopez@test.com", "Ana López (Frontend)", "EMPLOYEE")
        ]
        devs = []
        for email, name, role in devs_data:
            u = User.query.filter_by(email=email).first()
            if not u:
                u = User(
                    email=email,
                    name=name,
                    password_hash=generate_password_hash("Test1234!"),
                    role=role,
                    status="active"
                )
                db.session.add(u)
                db.session.commit()
            devs.append(u)

        now = datetime.now(timezone.utc)
        
        projects_config = [
            {
                "name": "E-Commerce Pro (Salud Perfecta)",
                "owner_email": "owner_perfect@test.com",
                "owner_name": "Owner Salud Perfecta",
                "description": "Plataforma de comercio electrónico con 100% de cumplimiento y 0 tareas en riesgo",
                "category": "Tecnología",
                "state": "Jalisco",
                "tasks": [
                    ("Diseño de Catálogo de Productos", "done", "high", -10, -2, [("Mockup UI", True), ("Componentes React", True)], devs[2].id),
                    ("Integración de Pasarela de Pagos Stripe", "done", "high", -8, -1, [("API Keys", True), ("Webhooks", True)], devs[1].id),
                    ("Optimización de Carrito de Compras", "in_progress", "medium", -5, 10, [("Cache Redis", True), ("Persistencia Local", False)], devs[0].id),
                    ("Configuración de Checkout Rápido", "in_progress", "high", -3, 14, [("Validación de Dirección", True), ("Cálculo Envíos", False)], devs[2].id),
                    ("Implementación de Filtros Avanzados", "done", "low", -12, -4, [("Elasticsearch Setup", True)], devs[1].id),
                    ("Panel de Gestión de Inventario", "in_progress", "medium", -2, 12, [("Tabla Shadcn", True)], devs[0].id),
                    ("Módulo de Reseñas y Calificaciones", "pending", "low", 1, 15, [("Esquema DB", True)], devs[2].id),
                    ("Notificaciones Transaccionales por Email", "done", "medium", -15, -5, [("Plantillas Sendgrid", True)], devs[1].id),
                    ("SEO Dinámico y Metatags", "in_progress", "low", -1, 18, [("Sitemap XML", True)], devs[0].id),
                    ("Pruebas Unitarias de Checkout", "pending", "high", 2, 20, [("Jest Tests", False)], devs[1].id)
                ]
            },
            {
                "name": "Migración Cloud AWS (Riesgo Controlado)",
                "owner_email": "owner_controlled@test.com",
                "owner_name": "Owner Riesgo Controlado",
                "description": "Migración de infraestructura on-premise a AWS con riesgos menores bajo monitoreo",
                "category": "Tecnología",
                "state": "Nuevo Leon",
                "tasks": [
                    ("Migración de Base de Datos PostgreSQL a RDS", "done", "high", -15, -5, [("Dump de datos", True), ("Restore en RDS", True)], devs[1].id),
                    ("Configuración de VPC y Subredes de Seguridad", "in_progress", "high", -4, 2, [("VPC Peering", True), ("Security Groups", False)], devs[0].id),
                    ("Despliegue de Clusters Kubernetes (EKS)", "in_progress", "medium", -3, 3, [("Ingress Controller", True), ("Cert-manager", False)], devs[1].id),
                    ("Setup de Pipeline CI/CD en GitHub Actions", "done", "medium", -10, -2, [("Workflows YAML", True)], devs[2].id),
                    ("Configuración de CloudWatch Log Streams", "pending", "low", 1, 10, [("Agent Setup", False)], devs[0].id),
                    ("Implementación de Caching CloudFront", "in_progress", "low", -2, 8, [("CDN distribution", True)], devs[2].id),
                    ("Auditoría de Certificados SSL/TLS", "done", "low", -8, -1, [("ACM Renewal", True)], devs[1].id),
                    ("Plan de Disaster Recovery y Backups Automated", "pending", "high", 2, 4, [("S3 Lifecycle Rules", False)], devs[0].id),
                    ("Hardening de Parches de Seguridad Linux", "done", "medium", -12, -3, [("Kernel updates", True)], devs[1].id),
                    ("Monitoreo de Costos AWS Budgets", "in_progress", "low", -1, 15, [("Alertas SMS", True)], devs[2].id)
                ]
            },
            {
                "name": "Core Bancario Refactor (Proyecto Crítico)",
                "owner_email": "owner_critical@test.com",
                "owner_name": "Owner Proyecto Crítico",
                "description": "Refactorización crítica de microservicios financieros con múltiples cuellos de botella",
                "category": "Tecnología",
                "state": "Ciudad de Mexico",
                "tasks": [
                    ("[CRITICAL] Módulo de Conciliación Bancaria Diaria", "in_progress", "urgent", -10, -1, [("Algoritmo Match", False), ("Parsing SWIFT", False)], devs[1].id),
                    ("[CRITICAL] Cifrado de Transacciones HSM", "pending", "urgent", -5, 0, [("Llaves maestras", False)], devs[1].id),
                    ("Migración de Servicio de Libros Contables", "blocked", "high", -8, -2, [("Schema migration", False)], devs[0].id),
                    ("API REST de Transferencias SPEI", "in_progress", "urgent", -3, 1, [("Payload ISO20022", False)], devs[1].id),
                    ("Servicio de Detección de Fraude en Tiempo Real", "pending", "high", -2, 1, [("Modelo ML", False)], devs[0].id),
                    ("Refactor de Log de Auditoría de Cuentas", "done", "medium", -20, -10, [("Triggers DB", True)], devs[2].id),
                    ("Normalización de Tablas de Clientes VIP", "in_progress", "low", -2, 7, [("Indexación B-Tree", True)], devs[2].id),
                    ("Verificación de Cumplimiento Normativo CNBV", "pending", "high", 1, 3, [("Reporte Anual", False)], devs[0].id),
                    ("Optimizador de Consultas de Saldos", "done", "medium", -14, -4, [("Query optimization", True)], devs[2].id),
                    ("Benchmark de Latencia en Transferencias", "in_progress", "medium", -1, 5, [("JMeter Tests", True)], devs[1].id)
                ]
            },
            {
                "name": "App Móvil Analytics (Proyecto Mixto Agile)",
                "owner_email": "owner_mixed@test.com",
                "owner_name": "Owner Proyecto Mixto",
                "description": "Aplicación móvil de análisis predictivo con sobrecarga de trabajo y entregas mixtas",
                "category": "Tecnología",
                "state": "Querétaro",
                "tasks": [
                    ("SDK de Captura de Eventos Off-line", "in_progress", "high", -6, 2, [("SQLite storage", True), ("Sync Worker", False)], devs[0].id),
                    ("Dashboard Gráfico de Retención de Usuarios", "in_progress", "urgent", -4, 1, [("Recharts Native", False)], devs[0].id),
                    ("Notificaciones Push Geolocalizadas", "blocked", "medium", -7, -1, [("APNS Setup", False), ("FCM Setup", False)], devs[2].id),
                    ("Módulo de Exportación PDF de Reportes", "done", "low", -12, -4, [("PDFKit Integration", True)], devs[1].id),
                    ("Autenticación Biométrica (FaceID / TouchID)", "in_progress", "high", -2, 6, [("Keychain integration", True)], devs[0].id),
                    ("Integración de Google Analytics v4", "done", "low", -15, -6, [("SDK import", True)], devs[2].id),
                    ("Modo Oscuro Adaptativo", "done", "low", -18, -8, [("Tailwind classes", True)], devs[1].id),
                    ("Optimizador de Batería en Fondo", "pending", "medium", 2, 8, [("JobScheduler", False)], devs[0].id),
                    ("Pruebas E2E en iOS Simulator", "in_progress", "high", -1, 4, [("Detox Tests", False)], devs[2].id),
                    ("Widget de Pantalla de Inicio para Android", "pending", "low", 3, 12, [("AppWidgetProvider", False)], devs[1].id)
                ]
            }
        ]

        total_projects_created = 0
        total_tasks_created = 0

        for p_conf in projects_config:
            # Crear o buscar el owner único de este proyecto
            p_owner = User.query.filter_by(email=p_conf["owner_email"]).first()
            if not p_owner:
                p_owner = User(
                    email=p_conf["owner_email"],
                    name=p_conf["owner_name"],
                    password_hash=generate_password_hash("Test1234!"),
                    role="OWNER",
                    status="active"
                )
                db.session.add(p_owner)
                db.session.commit()

            # Buscar o crear proyecto
            proj = Project.query.filter_by(name=p_conf["name"]).first()
            if not proj:
                proj = Project(
                    name=p_conf["name"],
                    description=p_conf["description"],
                    category=p_conf["category"],
                    state=p_conf["state"],
                    status="active",
                    owner_id=p_owner.id,
                    sprint_enabled=True,
                    sprint_length_days=14
                )
                db.session.add(proj)
                db.session.commit()
                print(f"[PROJ] Proyecto Creado: {proj.name} (ID: {proj.id})")
            else:
                print(f"[PROJ] Proyecto Existente Encontrado: {proj.name} (ID: {proj.id})")
            
            total_projects_created += 1

            # Inscribir a qa_user y a los devs como miembros en este proyecto
            all_users_to_add = [qa_user] + devs + [p_owner]
            for u_item in all_users_to_add:
                mem = Membership.query.filter_by(project_id=proj.id, user_id=u_item.id).first()
                if not mem:
                    db.session.add(Membership(
                        project_id=proj.id,
                        user_id=u_item.id,
                        role="OWNER" if u_item.id in (p_owner.id, qa_user.id) else "EMPLOYEE"
                    ))
            db.session.commit()

            # Crear Sprint Activo en el proyecto
            sprint = Sprint.query.filter_by(project_id=proj.id, status="active").first()
            if not sprint:
                sprint = Sprint(
                    name=f"Sprint 1 - {p_conf['name'][:15]}",
                    project_id=proj.id,
                    start_date=now - timedelta(days=5),
                    end_date=now + timedelta(days=9),
                    status="active"
                )
                db.session.add(sprint)
                db.session.commit()

            # Crear las 10 Tareas para este proyecto
            for title, status, priority, start_days, due_days, chk_list, assigned_id in p_conf["tasks"]:
                task = Task.query.filter_by(project_id=proj.id, title=title).first()
                start_dt = now + timedelta(days=start_days)
                due_dt = now + timedelta(days=due_days)

                checklist_obj = [
                    {"id": f"chk-{idx}", "title": t_name, "completed": done}
                    for idx, (t_name, done) in enumerate(chk_list)
                ]

                if not task:
                    task = Task(
                        title=title,
                        description=f"Descripción detallada para la tarea de evaluación: {title}.",
                        status=status,
                        priority=priority,
                        project_id=proj.id,
                        sprint_id=sprint.id if status != "pending" else None,
                        assigned_to=assigned_id,
                        created_by=p_owner.id,
                        start_date=start_dt,
                        due_date=due_dt,
                        checklist=checklist_obj,
                        completed_at=now - timedelta(days=1) if status == "done" else None
                    )
                    db.session.add(task)
                    db.session.commit()
                    total_tasks_created += 1
                else:
                    task.status = status
                    task.priority = priority
                    task.assigned_to = assigned_id
                    task.start_date = start_dt
                    task.due_date = due_dt
                    task.checklist = checklist_obj
                    if status == "done" and not task.completed_at:
                        task.completed_at = now - timedelta(days=1)
                    db.session.commit()

                # Recalcular el riesgo con el SmartRiskEngine en tiempo real
                SmartRiskEngineService.update_task_risk_metrics(task.id)


        db.session.commit()
        print("\n[SUCCESS] SEEDING COMPLETADO CON EXITO:")
        print(f"   - Proyectos verificados/creados: {total_projects_created}")
        print(f"   - Tareas totales procesadas y enlazadas al Smart Risk Engine: {total_tasks_created}")

if __name__ == "__main__":
    seed_data()
