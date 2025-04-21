# Library - SOA

## ¿Cómo correr la aplicación?

1. Crear el archivo `.env` en la carpeta `backend`

```bash
PORT=3000
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=libreria
DATABASE_URL="postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@localhost:5431/${POSTGRES_DB}"

JWT_SECRET=mysuperhypersecretpassword
JWT_EXPIRATION=1209600

EPAYCO_BASE_URL=https://api.epayco.co
EPAYCO_PUBLIC_KEY=b20b1a41f0afd512f9fdc1b0dc66437f
EPAYCO_PRIVATE_KEY=a491912b5818feb04f730255d981068a
EPAYCO_TEST=True
```

2. Iniciar la base de datos postgres con docker

   ```bash
   docker compose up
   ```

3. Configurar backend (Entrar a la carpeta `backend` en una terminal **nueva**)

   1. Crear un entorno virtual

   ```bash
   python3 -m venv .venv
   ```

   2. Activar el entorno virtual

      - En Linux/Mac:

      ```bash
      source .venv/bin/activate
      ```

      - En Windows:

      ```bash
      .venv\Scripts\activate
      ```

   3. Instalar las dependencias

   ```bash
   pip install -r requirements.txt
   ```

   4. Ejecutar migraciones en la base de datos

   ```bash
       alembic upgrade head
   ```

   5. Ejecutar el servidor de fastapi

   ```bash
   uvicorn app.main:app --reload
   ```

4. Configurar frontend (Entrar a la carpeta `frontend` en una terminal **nueva**)

   1. Instalar dependencias

   ```bash
   npm install
   ```

   2. Ejecutar el servidor de desarrollo

   ```bash
   npm run dev
   ```
