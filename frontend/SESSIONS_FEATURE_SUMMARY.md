# User Sessions Feature - Frontend Implementation

## Overview

Se ha implementado una completa funcionalidad de gestión de sesiones de usuario en el frontend que permite a los usuarios ver y administrar todas sus sesiones activas desde diferentes dispositivos.

## Archivos Creados/Modificados

### 1. Tipos TypeScript

- **`src/types/userSession.ts`**: Define todas las interfaces necesarias para las sesiones de usuario
  - `UserSession`: Interfaz principal para los datos de sesión
  - `UserSessionsResponse`: Respuesta de la API para múltiples sesiones
  - `RevokeSessionRequest/Response`: Para revocar sesiones específicas
  - `RevokeAllSessionsResponse`: Para revocar todas las sesiones

### 2. Hook Personalizado

- **`src/hooks/useUserSessions.ts`**: Hook que maneja toda la lógica de sesiones
  - Fetching de sesiones activas
  - Revocación de sesiones específicas
  - Revocación masiva de sesiones (excepto la actual)
  - Funciones utilitarias (formateo de tiempo, iconos de dispositivos, etc.)
  - Manejo de errores y estados de carga

### 3. Componente de Perfil

- **`src/routes/profile/me.tsx`**: Componente principal del perfil de usuario
  - Muestra información básica del usuario
  - Lista todas las sesiones activas
  - Permite revocar sesiones individuales
  - Incluye diálogo de confirmación para revocar todas las sesiones
  - Previene la revocación de la sesión actual

## Características Principales

### Información de Usuario

- **Datos Básicos**: Nombre, email, rol, ID de usuario
- **Roles**: Distinción visual entre administrador y cliente
- **Layout Responsivo**: Grid adaptativo para diferentes tamaños de pantalla

### Gestión de Sesiones

- **Visualización Detallada**:

  - Tipo de dispositivo con iconos emoji (📱, 💻, 🖥️)
  - Información del navegador y sistema operativo
  - Dirección IP y ubicación (si está disponible)
  - Última actividad formateada de manera legible
  - Estado de sesión (actual, sospechosa, etc.)

- **Controles de Seguridad**:

  - Botón individual para revocar cada sesión
  - Botón "Revoke All Others" para cerrar todas excepto la actual
  - Prevención de cierre de sesión actual
  - Diálogo de confirmación para acciones destructivas

- **Estados y Retroalimentación**:
  - Indicadores de carga con animaciones
  - Mensajes de error detallados
  - Notificaciones toast para acciones exitosas
  - Botón de refresh para actualizar la lista

### Seguridad y UX

- **Sesión Actual Protegida**: No se puede cerrar la sesión desde la cual se está trabajando
- **Confirmación de Acciones**: Diálogo modal para confirmar revocación masiva
- **Retroalimentación Visual**:
  - Destacado visual de la sesión actual
  - Badges para sesiones sospechosas
  - Estados de loading y error claros

## Integración con el Backend

El frontend se conecta a los siguientes endpoints del backend:

- `GET /api/users/sessions?active_only=true` - Obtener sesiones activas
- `POST /api/users/sessions/revoke` - Revocar sesión específica
- `POST /api/users/sessions/revoke-all?keep_current=true` - Revocar todas excepto actual

## Dependencias Utilizadas

- **Componentes UI**: shadcn/ui (Card, Button, Badge, Dialog)
- **Iconos**: react-icons/fa
- **Notificaciones**: sonner
- **Routing**: @tanstack/react-router
- **Estilos**: Tailwind CSS

## Funcionalidades Técnicas

### Hook useUserSessions

```typescript
const {
  sessions, // Array de sesiones
  loading, // Estado de carga
  error, // Errores
  fetchSessions, // Función para refrescar
  revokeSession, // Revocar sesión específica
  revokeAllSessions, // Revocar todas excepto actual
  getDeviceIcon, // Icono según tipo de dispositivo
  formatLastActivity, // Formateo de tiempo relativo
  isCurrentSession, // Identificar sesión actual
} = useUserSessions();
```

### Formateo de Tiempo

- "Just now" para menos de 1 minuto
- "X minutes ago" para menos de 1 hora
- "X hours ago" para menos de 1 día
- "X days ago" para más de 1 día

### Iconos de Dispositivos

- 📱 para móviles y tablets
- 💻 para desktop
- 🖥️ para dispositivos desconocidos

## Estados de Sesión

1. **Sesión Actual**: Destacada visualmente, botón de revocación deshabilitado
2. **Sesiones Normales**: Completamente funcionales
3. **Sesiones Sospechosas**: Marcadas con badge rojo
4. **Sesiones Inactivas**: Filtradas por defecto (solo se muestran activas)

## Responsive Design

- **Mobile**: Layout vertical, información condensada
- **Tablet/Desktop**: Grid de 2 columnas para información de usuario
- **Sesiones**: Lista vertical en todos los tamaños

## Manejo de Errores

- **Error de Red**: Mensaje de error con botón "Try Again"
- **Sin Sesiones**: Mensaje informativo con icono
- **Falla en Revocación**: Toast de error con mensaje específico
- **Sin Autenticación**: Redirección a login

## Próximas Mejoras Posibles

1. **Geolocalización**: Mostrar ubicación más precisa
2. **Filtros**: Por tipo de dispositivo, fecha, etc.
3. **Detalles de Sesión**: Modal con información expandida
4. **Historial**: Ver sesiones revocadas/expiradas
5. **Alertas**: Notificaciones de nuevas sesiones sospechosas
