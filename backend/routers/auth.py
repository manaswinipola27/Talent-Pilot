"""
Auth Router — Register, Login, Profile
"""
from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel, EmailStr
import bcrypt

from auth_utils import create_access_token
from database import get_supabase

router = APIRouter()

def hash_password(plain: str) -> str:
    return bcrypt.hashpw(plain.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")

def verify_password(plain: str, hashed: str) -> bool:
    return bcrypt.checkpw(plain.encode("utf-8"), hashed.encode("utf-8"))


class RegisterRequest(BaseModel):
    name: str
    email: EmailStr
    password: str


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


@router.post("/register", summary="Register a new user")
async def register(body: RegisterRequest):
    sb = get_supabase()
    hashed = hash_password(body.password)
    try:
        result = sb.table("users").insert({
            "name": body.name,
            "email": body.email,
            "password_hash": hashed,
        }).execute()
        user = result.data[0]
        token = create_access_token({"sub": user["id"], "email": user["email"]})
        return {"access_token": token, "token_type": "bearer", "user": {"id": user["id"], "name": user["name"], "email": user["email"]}}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/login", summary="Login and receive JWT")
async def login(body: LoginRequest):
    sb = get_supabase()
    result = sb.table("users").select("*").eq("email", body.email).execute()
    if not result.data:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    user = result.data[0]
    if not verify_password(body.password, user["password_hash"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    token = create_access_token({"sub": user["id"], "email": user["email"]})
    return {"access_token": token, "token_type": "bearer", "user": {"id": user["id"], "name": user["name"], "email": user["email"]}}
