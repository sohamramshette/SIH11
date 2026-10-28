from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import or_
from app.db.session import get_db
from app.models.user import User
from app.schemas.auth import LoginRequest, TokenResponse, UserOut
from app.core.security import verify_password, create_access_token
from app.core.permissions import get_current_user

router = APIRouter(prefix="/auth", tags=["Authentication & Access Control"])


@router.post("/login", response_model=TokenResponse)
def login(payload: LoginRequest, db: Session = Depends(get_db)):
    """Authenticate with Email or Official User ID and password, issuing a signed JWT."""
    identifier = payload.identifier.strip()
    
    # Query by email or official_id
    user = db.query(User).filter(
        or_(
            User.email.ilike(identifier),
            User.official_id.ilike(identifier),
        )
    ).first()

    # If role_id provided and user not found, try finding by role for demo convenience
    if not user and payload.role_id:
        user = db.query(User).filter(User.role == payload.role_id).first()

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email / User ID or password.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # Verify password
    if not verify_password(payload.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email / User ID or password.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Your institutional account has been deactivated. Contact AICTE administrative support.",
        )

    # Issue JWT token
    token = create_access_token(
        subject=user.id,
        role=user.role,
        email=user.email,
        extra_claims={
            "name": user.full_name,
            "official_id": user.official_id,
            "role": user.role,
            "institution_id": str(user.institution_id) if user.institution_id else None,
        }
    )

    return TokenResponse(
        access_token=token,
        token_type="bearer",
        user=UserOut.model_validate(user),
    )


@router.get("/me", response_model=UserOut)
def get_current_user_profile(current_user: User = Depends(get_current_user)):
    """Fetch profile of currently authenticated user."""
    return UserOut.model_validate(current_user)


@router.post("/logout")
def logout(current_user: User = Depends(get_current_user)):
    """Client logout confirmation and audit checkpoint."""
    return {
        "status": "success",
        "message": f"User {current_user.email} successfully logged out.",
    }
