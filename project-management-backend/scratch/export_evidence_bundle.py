import json
import urllib.request
import os
import sys

BASE_URL = "http://localhost:5000/api"
EVIDENCES_DIR = r"C:\Users\DanielMacias\.gemini\antigravity-ide\brain\4a6d343d-6b23-45c1-b692-0024d08c81b9\evidences"

def http_get(url, token):
    req = urllib.request.Request(url, headers={"Authorization": f"Bearer {token}"})
    try:
        with urllib.request.urlopen(req) as resp:
            body = resp.read().decode("utf-8")
            return resp.status, json.loads(body)
    except urllib.error.HTTPError as e:
        body = e.read().decode("utf-8")
        print(f"HTTPError {e.code} on GET {url}: {body}")
        try:
            return e.code, json.loads(body)
        except Exception:
            return e.code, {"error": body}


def http_post(url, data_dict):
    data_bytes = json.dumps(data_dict).encode("utf-8")
    req = urllib.request.Request(url, data=data_bytes, headers={"Content-Type": "application/json"})
    try:
        with urllib.request.urlopen(req) as resp:
            body = resp.read().decode("utf-8")
            return resp.status, json.loads(body)
    except urllib.error.HTTPError as e:
        body = e.read().decode("utf-8")
        return e.code, json.loads(body)

def export_evidences():
    os.makedirs(os.path.join(EVIDENCES_DIR, "json_responses"), exist_ok=True)
    os.makedirs(os.path.join(EVIDENCES_DIR, "sql_dumps"), exist_ok=True)
    
    print("[1/4] Autenticando usuario QA Owner para obtener JWT Token...")
    status, login_res = http_post(f"{BASE_URL}/auth/login", {
        "email": "qa_restart_20260720135856@test.com",
        "password": "Test1234!"
    })
    
    token = login_res.get("data", {}).get("access_token")
    if not token:
        print("FAIL: No se pudo autenticar")
        sys.exit(1)
        
    print("[2/4] Exportando muestras JSON de la API REST...")
    
    # Projects API
    st, projects_res = http_get(f"{BASE_URL}/projects/my-project", token)
    with open(os.path.join(EVIDENCES_DIR, "json_responses", "api_projects.json"), "w", encoding="utf-8") as f:
        json.dump(projects_res, f, indent=2, ensure_ascii=False)
    print("  + api_projects.json guardado")

    
    # Tasks API
    st, tasks_res = http_get(f"{BASE_URL}/tasks", token)
    with open(os.path.join(EVIDENCES_DIR, "json_responses", "api_tasks.json"), "w", encoding="utf-8") as f:
        json.dump(tasks_res, f, indent=2, ensure_ascii=False)
    print("  + api_tasks.json guardado")
    
    # Telemetry API
    st, telemetry_res = http_get(f"{BASE_URL}/telemetry", token)
    with open(os.path.join(EVIDENCES_DIR, "json_responses", "api_telemetry.json"), "w", encoding="utf-8") as f:
        json.dump(telemetry_res, f, indent=2, ensure_ascii=False)
    print("  + api_telemetry.json guardado")

    print("[3/4] Generando informe SQL y conteos de la base de datos...")
    
    backend_dir = r"C:\Users\DanielMacias\Progest-Smart-Analytics\project-management-backend"
    if backend_dir not in sys.path:
        sys.path.insert(0, backend_dir)
        
    from run import app
    from app import db
    from sqlalchemy import text
    
    with app.app_context():
        sql_query = text("""
            SELECT p.name AS proyecto, t.risk_status, COUNT(t.id) AS total_tareas, AVG(t.delay_probability) AS prob_promedio
            FROM tasks t
            JOIN projects p ON t.project_id = p.id
            GROUP BY p.name, t.risk_status
            ORDER BY p.name, t.risk_status;
        """)
        results = db.session.execute(sql_query).fetchall()
        
        sql_dump_path = os.path.join(EVIDENCES_DIR, "sql_dumps", "risk_distribution_audit.sql")
        with open(sql_dump_path, "w", encoding="utf-8") as f:
            f.write("-- AUDITORÍA DE DISTRIBUCIÓN DE RIESGOS EN BASE DE DATOS PROGEST --\n\n")
            f.write(f"-- Fecha de ejecución: {urllib.request.quote('2026-07-23')}\n")
            f.write("-- SQL Query Executed:\n")
            f.write("SELECT p.name, t.risk_status, COUNT(t.id), AVG(t.delay_probability) FROM tasks t JOIN projects p ON t.project_id = p.id GROUP BY p.name, t.risk_status;\n\n")
            f.write("PROYECTO | RISK_STATUS | TOTAL_TAREAS | PROB_PROMEDIO\n")
            f.write("-" * 65 + "\n")
            for row in results:
                f.write(f"{row[0]:<35} | {row[1]:<10} | {row[2]:<12} | {row[3]:.2f}\n")

    print("  + risk_distribution_audit.sql guardado")
    print("\n[SUCCESS] PACK DE EVIDENCIAS RECOLECTADO CON EXITO EN:")
    print(f"  {EVIDENCES_DIR}")

if __name__ == "__main__":
    export_evidences()
