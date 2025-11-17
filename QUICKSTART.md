# CAPPI Backend - Quick Start Guide

## 🚀 Inicio Rápido (5 minutos)

### Opción 1: Con Supabase (Recomendado)

1. **Crear proyecto en Supabase**
   - Ve a [supabase.com](https://supabase.com)
   - Crea un nuevo proyecto
   - Copia el `DATABASE_URL` desde Settings > Database

2. **Configurar el proyecto**
```bash
# Instalar dependencias
npm install

# Copiar variables de entorno
cp .env.example .env

# Editar .env y pegar tu DATABASE_URL de Supabase
# DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@[YOUR-HOST]:5432/postgres"
```

3. **Ejecutar migraciones y seed**
```bash
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed
```

4. **Iniciar el servidor**
```bash
npm run dev
```

5. **Probar la API**
   - Docs: http://localhost:3000/docs
   - Login: `POST http://localhost:3000/api/v1/auth/login`
   - Credenciales: `traveler@example.com` / `Traveler123!`

### Opción 2: Con PostgreSQL Local

1. **Instalar PostgreSQL**
```bash
# macOS
brew install postgresql@15
brew services start postgresql@15

# Crear base de datos
createdb cappi
```

2. **Configurar y ejecutar**
```bash
npm install
cp .env.example .env

# Editar .env:
# DATABASE_URL="postgresql://postgres:postgres@localhost:5432/cappi?schema=public"

npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed
npm run dev
```

## ✅ Verificación

### 1. Salud del servidor
```bash
curl http://localhost:3000/api/v1/health
```

### 2. Login
```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"traveler@example.com","password":"Traveler123!"}'
```

Guarda el `accessToken` de la respuesta.

### 3. Obtener perfil
```bash
curl -X GET http://localhost:3000/api/v1/profile/me \
  -H "Authorization: Bearer TU_ACCESS_TOKEN"
```

### 4. Buscar lugares en Cancún
```bash
curl -X GET "http://localhost:3000/api/v1/places?city=Cancún&safetyScoreMin=80" \
  -H "Authorization: Bearer TU_ACCESS_TOKEN"
```

### 5. Generar recomendaciones
```bash
curl -X POST http://localhost:3000/api/v1/recommendations/generate \
  -H "Authorization: Bearer TU_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"city":"Cancún","budgetLevel":"LUXURY"}'
```

### 6. Chat con el concierge
```bash
curl -X POST http://localhost:3000/api/v1/chat/send \
  -H "Authorization: Bearer TU_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"message":"Recomiéndame un lugar seguro para cenar","context":{"city":"Cancún"}}'
```

## 🔧 Comandos Útiles

```bash
# Ver base de datos en UI
npm run prisma:studio

# Regenerar Prisma Client después de cambios en schema
npm run prisma:generate

# Crear nueva migración
npm run prisma:migrate

# Reset completo de base de datos (⚠️ borra todos los datos)
npx prisma migrate reset

# Linter y formato
npm run lint
npm run format
```

## 📊 Datos de Prueba

Después del seed, tendrás:

**Usuarios:**
- Admin: `admin@cappi.com` / `Admin123!`
- Viajero: `traveler@example.com` / `Traveler123!`

**Contenido:**
- 6 lugares en Cancún y Medellín
- 3 experiencias premium
- Zonas de seguridad
- 1 viaje de ejemplo

## 🐛 Troubleshooting

### Error: "Can't reach database server"
- Verifica que PostgreSQL esté corriendo: `pg_isready`
- Verifica el `DATABASE_URL` en `.env`

### Error: "Module not found"
- Ejecuta `npm install` de nuevo
- Verifica que Node.js sea versión 18+: `node --version`

### Error en migraciones
```bash
# Reset completo
npx prisma migrate reset
npm run prisma:migrate
npm run prisma:seed
```

### Puerto 3000 ocupado
Cambia el `PORT` en `.env`:
```env
PORT=3001
```

## 📱 Conectar con Frontend

En tu frontend (Lovable/React), configura:

```typescript
const API_BASE_URL = 'http://localhost:3000/api/v1';

// Guardar token después de login
localStorage.setItem('accessToken', data.accessToken);

// Usar token en requests
fetch(`${API_BASE_URL}/profile/me`, {
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
  }
});
```

## 🚀 Despliegue Rápido

### Railway
```bash
# Instalar CLI
npm i -g @railway/cli

# Login y deploy
railway login
railway init
railway up
```

### Render
1. Conecta tu repo de GitHub
2. Configura build command: `npm install && npm run build && npx prisma generate`
3. Start command: `npm run start:prod`
4. Agrega variables de entorno

---

**¿Problemas?** Abre un issue en GitHub o contacta al equipo.
