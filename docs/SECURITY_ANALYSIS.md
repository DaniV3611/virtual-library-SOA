# Análisis de Seguridad de la Aplicación Virtual Library

## Introducción
Este documento presenta el análisis de seguridad de la aplicación "Virtual Library", enfocado en los requerimientos de seguridad definidos en la fase de planificación del SDLC seguro. Se detallan los mecanismos implementados para mitigar amenazas comunes y se vinculan con el estándar OWASP API Top 10.

## 1. Autenticación
- **Implementación**: La aplicación utiliza JWT (JSON Web Tokens) para la autenticación.
  - Los tokens se generan utilizando la función `create_access_token` en el backend.
  - Los tokens incluyen tiempos de expiración, configurados en el archivo `.env` (`JWT_EXPIRATION`).
- **Control de Sesiones**: Los tokens se almacenan en el frontend utilizando `localStorage` para persistencia.
  - El hook `useAuth` gestiona la recuperación de tokens y el estado del usuario.

## 2. Autorización
- **Control Basado en Roles**: La aplicación implementa roles (por ejemplo, admin, usuario).
  - Las rutas y acciones exclusivas para administradores están protegidas utilizando la dependencia `UserIsAdminDep` en el backend.
  - Ejemplo: Solo los administradores pueden acceder al panel `/admin` o realizar acciones de gestión de libros.

## 3. Validación de Entradas
- **Validación en el Frontend**:
  - Los formularios validan entradas como correo electrónico, contraseña y otros campos (por ejemplo, atributos `required`, `minLength`, `type`).
  - Ejemplo: El formulario de registro asegura que las contraseñas coincidan y cumplan con la longitud mínima requerida.
- **Validación en el Backend**:
  - Se utilizan modelos de Pydantic para la validación de solicitudes en el backend.
  - Ejemplo: El esquema `UserCreate` valida los datos de registro de usuarios.

## 4. Manejo de Errores
- **Mensajes Amigables para el Usuario**:
  - Los errores se capturan y se muestran como mensajes amigables para el usuario utilizando notificaciones `toast` en el frontend.
  - Ejemplo: "Correo electrónico o contraseña inválidos" para errores de inicio de sesión.
- **Evitar Detalles Técnicos**:
  - Las excepciones en el backend devuelven mensajes de error genéricos (por ejemplo, "Error al procesar el pago").
  - Los registros detallados de errores se imprimen en la consola para depuración, pero no se exponen a los usuarios.

## 5. Estudio del OWASP API Top 10

## ¿Qué es OWASP API Top 10?
El OWASP API Top 10 es un documento que identifica las principales vulnerabilidades de seguridad en APIs. Proporciona una guía para proteger las aplicaciones contra ataques comunes y mejorar la seguridad general de las APIs. A continuación, se relacionan los puntos clave del OWASP API Top 10 con las implementaciones de seguridad en esta librería.

## Relación de OWASP API Top 10 con la librería

1. **Broken Object Level Authorization**:
   - **Implementación**: Los endpoints como `/orders/{order_id}` validan que el usuario autenticado tenga permiso para acceder a los recursos solicitados. Esto se logra mediante dependencias de autorización en el backend.

2. **Broken User Authentication**:
   - **Implementación**: El endpoint de inicio de sesión (`/users/login`) maneja la autenticación de usuarios. Se asegura de validar correctamente las credenciales y generar tokens JWT seguros.

3. **Excessive Data Exposure**:
   - **Implementación**: Los esquemas de Pydantic en el backend limitan los datos expuestos en las respuestas de la API, asegurando que solo se devuelvan los campos necesarios.

4. **Lack of Resources & Rate Limiting**:
   - **Implementación**: Aunque no se ha implementado explícitamente un sistema de limitación de tasas, el diseño actual de la API permite agregar fácilmente middleware para proteger contra abusos como ataques de fuerza bruta.

5. **Mass Assignment**:
   - **Implementación**: Los modelos de Pydantic y SQLAlchemy aseguran que solo los campos explícitamente definidos puedan ser asignados, previniendo la asignación masiva de datos no deseados.

6. **Security Misconfiguration**:
   - **Implementación**: La configuración de CORS en el backend permite únicamente orígenes específicos en producción, reduciendo el riesgo de accesos no autorizados. Además, se utilizan encabezados de seguridad en las respuestas HTTP.

7. **Injection**:
   - **Implementación**: El uso de SQLAlchemy ORM previene inyecciones SQL al parametrizar las consultas. Además, los datos de entrada se validan utilizando esquemas de Pydantic.

8. **Improper Assets Management**:
   - **Implementación**: La estructura del proyecto está bien organizada, con una separación clara entre los módulos de frontend, backend y servicios. Esto facilita la gestión de activos y reduce el riesgo de exposición de recursos no deseados.

9. **Insufficient Logging & Monitoring**:
   - **Implementación**: Aunque no se ha implementado un sistema de monitoreo avanzado, los registros de errores en el backend proporcionan información útil para la depuración y el análisis de incidentes.

10. **Server-Side Request Forgery (SSRF)**:
    - **Implementación**: No se permite que los usuarios envíen solicitudes directas a recursos internos. Además, las dependencias externas están controladas y validadas.