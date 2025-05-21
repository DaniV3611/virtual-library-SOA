# Etapa de construcción
FROM node:20-alpine as build

WORKDIR /app

# Copiar archivos de configuración
COPY package*.json ./
COPY *.config.* ./
COPY tsconfig*.json ./
COPY components.json ./

# Instalar dependencias
RUN npm ci

# Copiar código fuente
COPY . .

# Compilar aplicación
RUN npm run build

# Etapa de producción con Nginx
FROM nginx:alpine

# Copiar la configuración personalizada de Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copiar los archivos compilados desde la etapa de construcción
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"] 