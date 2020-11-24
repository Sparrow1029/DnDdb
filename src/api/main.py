from fastapi import FastAPI

from .routes import UserRouter, AuthRouter, CharacterRouter

api = FastAPI()


api.include_router(UserRouter, tags=["user"], prefix="/users")
api.include_router(AuthRouter, tags=["auth"], prefix="/auth")
api.include_router(CharacterRouter, tags=["char"], prefix="/characters")



# @app.get("/", tags=["Root"])
# def read_root():
#     return {"message": "Welcome to this fantastic app!"}
