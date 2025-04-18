from fastapi import FastAPI
from app.db.session import Base, engine
from app.api.main import api_router
from fastapi.middleware.cors import CORSMiddleware

# Inicializar tablas si no hay migraciones todavía
# Base.metadata.create_all(bind=engine)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Todos los orígenes (solo para desarrollo)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Welcome to the virtual library"}

app.include_router(api_router, prefix="/api")
