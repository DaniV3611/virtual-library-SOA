FROM python:3.11-slim

WORKDIR /app

# Instalar postgresql-client para el comando psql
RUN apt-get update && apt-get install -y postgresql-client && rm -rf /var/lib/apt/lists/*

# Update pip version
RUN pip install --upgrade pip

# Instalar dependencias
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copiar código fuente
COPY . .

# Script de inicio para esperar por la base de datos y ejecutar alembic
COPY docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

EXPOSE 8000

# Usar el script como punto de entrada
ENTRYPOINT ["/docker-entrypoint.sh"] 