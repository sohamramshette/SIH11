from app.db.session import SessionLocal
from app.models import Institution, User, Application, RuleDefinition, AuditLedger


def test_database_institutions():
    db = SessionLocal()
    try:
        institutions = db.query(Institution).all()
        assert len(institutions) >= 2
        aishe_codes = [i.aishe_code for i in institutions]
        assert "C-49210" in aishe_codes
        assert "C-62914" in aishe_codes
    finally:
        db.close()


def test_database_users_roles():
    db = SessionLocal()
    try:
        users = db.query(User).all()
        assert len(users) >= 4
        roles = {u.role for u in users}
        assert {"admin", "college", "verification", "senior-officer"}.issubset(roles)
    finally:
        db.close()


def test_database_applications():
    db = SessionLocal()
    try:
        apps = db.query(Application).all()
        assert len(apps) >= 2
        public_ids = [a.public_id for a in apps]
        assert "APP-2026-ENG-1042" in public_ids
        assert "APP-2026-ENG-5284" in public_ids

        # Test relationship
        app1 = db.query(Application).filter(Application.public_id == "APP-2026-ENG-1042").first()
        assert app1.institution is not None
        assert app1.institution.aishe_code == "C-49210"
        assert len(app1.timeline) >= 1
    finally:
        db.close()


def test_database_rule_definitions():
    db = SessionLocal()
    try:
        rules = db.query(RuleDefinition).all()
        assert len(rules) >= 5
        codes = [r.rule_code for r in rules]
        assert "APH-LAND-01" in codes
        assert "APH-FIRE-01" in codes
        assert "APH-SFR-01" in codes
        assert "APH-DEDUP-01" in codes
    finally:
        db.close()


def test_database_genesis_audit_block():
    db = SessionLocal()
    try:
        audit = db.query(AuditLedger).order_by(AuditLedger.sequence_no.asc()).first()
        assert audit is not None
        assert audit.action == "System Initialization"
        assert len(audit.record_hash) == 64
        assert len(audit.previous_hash) == 64
    finally:
        db.close()
