import os
import sys
from sqlalchemy import text

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from run import app, db

with app.app_context():
    db.session.execute(text("UPDATE users SET role = 'OWNER' WHERE LOWER(role) = 'owner'"))
    db.session.execute(text("UPDATE users SET role = 'EMPLOYEE' WHERE LOWER(role) = 'employee'"))
    db.session.execute(text("UPDATE users SET role = 'SUPERADMIN' WHERE LOWER(role) = 'superadmin'"))
    db.session.execute(text("UPDATE memberships SET role = 'OWNER' WHERE LOWER(role) = 'owner'"))
    db.session.execute(text("UPDATE memberships SET role = 'EMPLOYEE' WHERE LOWER(role) = 'employee'"))
    db.session.commit()
    print("=== ROLES SANITIZADOS EN SQLITE DE FORMA CORRECTA ===")
