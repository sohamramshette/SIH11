import uuid
from datetime import datetime, timezone, timedelta
from app.db.session import engine, SessionLocal
from app.models import (
    Base,
    Institution,
    User,
    Application,
    ApplicationTimeline,
    Document,
    RuleDefinition,
    AuditLedger,
)


def init_db():
    print("Creating all 18 tables in PostgreSQL database...")
    Base.metadata.create_all(bind=engine)
    print("All tables successfully created in database!")

    db = SessionLocal()
    try:
        # Check if already seeded
        existing_admin = db.query(User).filter(User.email == "admin.sih@aicte-demo.gov.in").first()
        if existing_admin:
            print("Database already contains seed users. Skipping seeding.")
            return

        print("Seeding initial institutions and users...")

        # 1. Institutions
        bits_bhopal = Institution(
            id=uuid.uuid4(),
            institution_name="Bhartiya Institute of Technology & Science",
            short_name="BITS Bhopal",
            aishe_code="C-49210",
            permanent_institute_id="1-49210492",
            institution_type="Private Self-Financing Technical Institute",
            region="Central Region (Bhopal)",
            state="Madhya Pradesh",
            district="Bhopal",
            pin_code="462036",
            campus_address="Sector 4, Gandhinagar Bypass Road, Bhopal - 462036, Madhya Pradesh",
            land_area_acres=7.5,
            built_up_area_sqm=14200.0,
            affiliation_details={"university": "Rajiv Gandhi Proudyogiki Vishwavidyalaya (RGPV)"},
        )

        vidyapeeth = Institution(
            id=uuid.uuid4(),
            institution_name="Vidyapeeth College of Engineering & AI",
            short_name="VCEAI Indore",
            aishe_code="C-62914",
            permanent_institute_id="1-62914001",
            institution_type="Private Technical Institute",
            region="Central Region (Indore Zone)",
            state="Madhya Pradesh",
            district="Indore",
            pin_code="452010",
            campus_address="Knowledge Park, Bypass Road, Indore - 452010",
            land_area_acres=8.2,
            built_up_area_sqm=16800.0,
            affiliation_details={"university": "RGPV Indore Campus"},
        )

        db.add_all([bits_bhopal, vidyapeeth])
        db.flush()

        # 2. Users (Plain placeholder hash for now, Phase 3 connects real bcrypt)
        admin_user = User(
            id=uuid.uuid4(),
            email="admin.sih@aicte-demo.gov.in",
            password_hash="pbkdf2_sha256$placeholder$admin123",
            full_name="AICTE National System Administrator",
            role="admin",
            official_id="AICTE-ADM-001",
            designation="Chief Technical Officer (Data & Compliance)",
            phone="+91 11 29581000",
        )

        college_user = User(
            id=uuid.uuid4(),
            email="principal@engg-college.demo.edu.in",
            password_hash="pbkdf2_sha256$placeholder$college123",
            full_name="Dr. Arvind Joshi",
            role="college",
            official_id="COLLEGE-INST-104",
            designation="Principal & Authorized Institutional Signatory",
            phone="+91 98260 12345",
            institution_id=bits_bhopal.id,
        )

        verifier_user = User(
            id=uuid.uuid4(),
            email="scrutiny.officer@aicte-demo.gov.in",
            password_hash="pbkdf2_sha256$placeholder$officer123",
            full_name="Dr. R. K. Sharma",
            role="verification",
            official_id="AICTE-SCR-202",
            designation="Senior Scrutiny Officer (Grade I)",
            phone="+91 755 2660421",
        )

        senior_officer = User(
            id=uuid.uuid4(),
            email="regional.director@aicte-demo.gov.in",
            password_hash="pbkdf2_sha256$placeholder$director123",
            full_name="Dr. S. K. Roy, Ph.D.",
            role="senior-officer",
            official_id="AICTE-DIR-303",
            designation="Senior Regional Director (Cadre I)",
            phone="+91 755 2781490",
        )

        db.add_all([admin_user, college_user, verifier_user, senior_officer])
        db.flush()

        # 3. Core APH Rule Definitions
        rules = [
            RuleDefinition(
                id=uuid.uuid4(),
                rule_code="APH-LAND-01",
                category="Land Norms",
                description="Campus land must be a single contiguous parcel meeting minimum acreage (Rural >= 7.5 acres, Metro >= 2.5 acres).",
                config_json={"min_rural_acres": 7.5, "min_metro_acres": 2.5, "contiguous_required": True},
                severity="danger",
            ),
            RuleDefinition(
                id=uuid.uuid4(),
                rule_code="APH-FIRE-01",
                category="Safety Clearances",
                description="Civic Fire NOC must be active on scrutiny date with verified municipal division endorsement.",
                config_json={"max_expiry_days_past": 0, "verified_endorsement_required": True},
                severity="danger",
            ),
            RuleDefinition(
                id=uuid.uuid4(),
                rule_code="APH-SFR-01",
                category="Faculty Cadre",
                description="Student-to-Faculty Ratio (SFR) must satisfy mandated ratio (1:15 or 1:20 depending on course).",
                config_json={"max_sfr_tech": 20.0, "recommended_sfr_tech": 15.0},
                severity="danger",
            ),
            RuleDefinition(
                id=uuid.uuid4(),
                rule_code="APH-CADRE-01",
                category="Faculty Cadre",
                description="Department cadre ratio must adhere to 1:2:6 with at least 1 full Professor in department.",
                config_json={"min_professors_per_dept": 1, "cadre_ratio": "1:2:6"},
                severity="warning",
            ),
            RuleDefinition(
                id=uuid.uuid4(),
                rule_code="APH-DEDUP-01",
                category="Fraud & Deduplication",
                description="Faculty PAN, Aadhaar hash, and PFMS payroll account must not exist in another active institution.",
                config_json={"auto_escalate_on_collision": True},
                severity="danger",
            ),
        ]
        db.add_all(rules)
        db.flush()

        # 4. Seed Applications
        app1 = Application(
            id=uuid.uuid4(),
            public_id="APP-2026-ENG-1042",
            institution_id=bits_bhopal.id,
            application_type="Extension of Approval (EoA)",
            academic_year="2026-27",
            stream="Engineering & Technology",
            current_status="Under Review",
            status_severity="info",
            priority="Normal",
            priority_severity="info",
            preliminary_outcome="In Scrutiny Queue",
            submission_date=datetime.now(timezone.utc) - timedelta(days=5),
            deadline_date=datetime.now(timezone.utc) + timedelta(days=10),
            assigned_officer_id=verifier_user.id,
            officer_notes="Land title and building plans verified against APH 2026-27. Contiguous plot of 7.50 acres confirmed.",
            review_notes="Preliminary documents ingested. Ready for officer examination.",
        )

        app2 = Application(
            id=uuid.uuid4(),
            public_id="APP-2026-ENG-5284",
            institution_id=vidyapeeth.id,
            application_type="Addition of New Course",
            academic_year="2026-27",
            stream="Engineering & Technology",
            current_status="Escalated",
            status_severity="danger",
            priority="Critical",
            priority_severity="danger",
            preliminary_outcome="Inconsistency Detected",
            submission_date=datetime.now(timezone.utc) - timedelta(days=3),
            deadline_date=datetime.now(timezone.utc) + timedelta(days=2),
            assigned_officer_id=verifier_user.id,
            escalation_reason="Possible Inconsistency: Duplicate Faculty Profile Detected Across Institutions",
            escalation_summary="Automated deduplication flagged Dr. S. K. Verma actively enrolled with concurrent salary records at another institute.",
            proposed_course="B.Tech Artificial Intelligence & Data Science",
            proposed_intake=60,
        )

        db.add_all([app1, app2])
        db.flush()

        # 5. Timeline Entries
        tl1 = ApplicationTimeline(
            id=uuid.uuid4(),
            application_id=app1.id,
            actor_user_id=college_user.id,
            actor_name="Dr. Arvind Joshi (College)",
            stage="Application Filed",
            details="Institutional proposal for Extension of Approval (EoA 2026-27) submitted.",
        )
        tl2 = ApplicationTimeline(
            id=uuid.uuid4(),
            application_id=app2.id,
            actor_user_id=verifier_user.id,
            actor_name="Dr. R. K. Sharma (Scrutiny Officer)",
            stage="Escalated to Directorate",
            details="Case escalated to Regional Director due to duplicate faculty profile match.",
        )
        db.add_all([tl1, tl2])

        # 6. Initial Audit Ledger Genesis Block
        genesis_audit = AuditLedger(
            id=uuid.uuid4(),
            actor_name="AICTE Regulatory Genesis Engine",
            action="System Initialization",
            entity_type="system",
            entity_id="AICTE-GENESIS-2026",
            payload_hash="e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
            previous_hash="0000000000000000000000000000000000000000000000000000000000000000",
            record_hash="7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069",
            desk="National Headquarters, New Delhi",
            details="AICTE VerifyAI statutory ledger initiated with SHA-256 cryptographic chaining.",
        )
        db.add(genesis_audit)

        db.commit()
        print("Database seeded with sample institutions, demo users, applications, rules, and genesis audit block!")
    except Exception as e:
        db.rollback()
        print(f"Error seeding database: {e}")
        raise e
    finally:
        db.close()


if __name__ == "__main__":
    init_db()
