from fastapi import FastAPI
from app.db.session import Base, engine
from app.api.main import api_router

# Inicializar tablas si no hay migraciones todavía
# Base.metadata.create_all(bind=engine)

app = FastAPI()

@app.get("/")
def read_root():
    return {"message": "Welcome to the virtual library"}

app.include_router(api_router, prefix="/api")
