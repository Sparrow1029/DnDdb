from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .routes import UserRouter, AuthRouter, CharacterRouter

api = FastAPI()

origins = [
    "http://localhost:8002",
    "http://localhost:3000",
    "http://localhost"
]
api.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

api.include_router(UserRouter, tags=["user"], prefix="/users")
api.include_router(AuthRouter, tags=["auth"], prefix="/auth")
api.include_router(CharacterRouter, tags=["char"], prefix="/characters")



# @app.get("/", tags=["Root"])
# def read_root():
#     return {"message": "Welcome to this fantastic app!"}
