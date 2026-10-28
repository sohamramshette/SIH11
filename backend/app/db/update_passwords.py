from app.db.session import SessionLocal
from app.models.user import User
from app.core.security import get_password_hash

PASSWORDS = {
    "admin.sih@aicte-demo.gov.in": "admin123",
    "principal@engg-college.demo.edu.in": "college123",
    "scrutiny.officer@aicte-demo.gov.in": "officer123",
    "regional.director@aicte-demo.gov.in": "director123",
}


def update_passwords():
    db = SessionLocal()
    try:
        for email, plain_pw in PASSWORDS.items():
            user = db.query(User).filter(User.email == email).first()
            if user:
                user.password_hash = get_password_hash(plain_pw)
                print(f"[OK] Updated password hash for {user.role}: {email}")
        db.commit()
        print("All user passwords successfully hashed with bcrypt in Supabase!")
    finally:
        db.close()


if __name__ == "__main__":
    update_passwords()
