from typing import Optional, List
from string import ascii_lowercase, ascii_uppercase, digits

from pydantic import BaseModel, EmailStr, Field, validator
from datetime import datetime


class UserSchema(BaseModel):
    username: str
    realname: str = Field(default_factory=lambda: "Anonymous")
    # realname: Optional[str] = None
    email: EmailStr = Field(...)
    password: str = Field(...,min_length=8)
    characters: List[str] = []
    created_at: datetime = datetime.now()

    class Config:
        schema_extra = {
            "example": {
                "username": "tolkien01",
                "realname": "Anonymous",  # Default "Anonymous"
                "email": "jdoe@example.com",
                "password": "password",
            }
        }

    @validator("username")
    def username_is_valid_characters(cls, v):
        if not all(c in ascii_lowercase + ascii_uppercase + digits + "_-" for c in v):
            raise ValueError("username must contain only A-Z, a-z, 0-9, and -, _")
        return v

    @validator("realname")
    def realname_is_valid(cls, v):
        #if v != "Anonymous":
        if v not in ["", None]:
            if not all(c in ascii_lowercase + ascii_uppercase + ' .' for c in v):
                raise ValueError("must contain alphabetic chars and spaces only")
            if len(v.split()) > 4 or len(v) not in range(2, 65):
                raise ValueError("Name must be between 2-64 characters and a max of 3 spaces")
            return ' '.join(v.split())
        return "Anonymous"


class UpdateUserModel(BaseModel):
    realname: Optional[str] = None
    email: Optional[EmailStr] = None
    password: Optional[str] = None
    characters: Optional[List[str]] = None

    @validator("realname")
    def realname_is_valid(cls, v):
        #if v != "Anonymous":
        if v not in ["", None]:
            if not all(c in ascii_lowercase + ascii_uppercase + ' ' for c in v):
                raise ValueError("must contain alphabetic chars and spaces only")
            if len(v.split()) > 3 or len(v) not in range(2, 65):
                raise ValueError("Name too short, too long or had too many surnames")
            return ' '.join(v.split())
        return "Anonymous"


class UserOutModel(BaseModel):
    username: str
    realname: str
    email: EmailStr
    characters: List[str]
    created_at: datetime


def ResponseModel(data, message):
    return {
        "data": data,
        # "code": 200,
        "message": message,
    }


def ErrorResponseModel(error, code, message):
    return {"error": error, "code": code, "message": message}
