# CAPPI Backend - Comandos y Troubleshooting

## 🚀 Comandos Esenciales

### Instalación y Setup

```bash
# Instalación completa
npm install

# Generar Prisma Client
npm run prisma:generate

# Ejecutar migraciones
npm run prisma:migrate

# Ejecutar seed (datos de prueba)
npm run prisma:seed

# Todo en uno (después de clonar)
npm install && npm run prisma:generate && npm run prisma:migrate && npm run prisma:seed
```

### Desarrollo

```bash
# Servidor en modo desarrollo (hot-reload)
npm run dev

# Build de producción
npm run build

# Ejecutar producción
npm run start:prod

# Ver base de datos en UI
npm run prisma:studio
```

### Base de Datos

```bash
# Ver estado de migraciones
npx prisma migrate status

# Crear nueva migración
npx prisma migrate dev --name descripcion-cambio

# Reset completo (⚠️ BORRA TODOS LOS DATOS)
npx prisma migrate reset

# Aplicar migraciones en producción
npx prisma migrate deploy

# Generar SQL de migración sin aplicar
npx prisma migrate dev --create-only
```

### Código

```bash
# Linter
npm run lint

# Fix automático de linter
npm run lint -- --fix

# Formatear código
npm run format

# Tests (cuando estén implementados)
npm run test
npm run test:watch
npm run test:cov
```

### Docker

```bash
# Build imagen
docker build -t cappi-backend .

# Ejecutar con docker-compose
docker-compose up -d

# Ver logs
docker-compose logs -f api

# Detener
docker-compose down

# Reset completo
docker-compose down -v
```

---

## 🐛 Troubleshooting

### 1. Error: "Cannot find module '@prisma/client'"

**Causa:** Prisma Client no generado

**Solución:**
```bash
npm run prisma:generate
```

### 2. Error: "Can't reach database server"

**Causa:** PostgreSQL no está corriendo o DATABASE_URL incorrecto

**Soluciones:**

**Opción A - PostgreSQL Local:**
```bash
# macOS
brew services start postgresql@15

# Linux
sudo systemctl start postgresql

# Verificar
pg_isready
```

**Opción B - Verificar DATABASE_URL:**
```bash
# Ver tu .env
cat .env | grep DATABASE_URL

# Formato correcto:
# DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public"
```

**Opción C - Usar Supabase:**
1. Crear proyecto en https://supabase.com
2. Copiar Connection String desde Settings > Database
3. Pegar en `.env` como `DATABASE_URL`

### 3. Error: "Schema parsing" o errores de Prisma

**Causa:** Sintaxis incorrecta en `schema.prisma`

**Solución:**
```bash
# Validar schema
npx prisma validate

# Formatear schema
npx prisma format
```

### 4. Error: "Port 3000 is already in use"

**Causa:** Puerto ocupado

**Solución:**
```bash
# Cambiar puerto en .env
echo "PORT=3001" >> .env

# O matar proceso
lsof -ti:3000 | xargs kill
```

### 5. Error: "Module not found" o imports rojos

**Causa:** Dependencias no instaladas o paths incorrectos

**Solución:**
```bash
# Reinstalar dependencias
rm -rf node_modules package-lock.json
npm install

# Verificar tsconfig paths
cat tsconfig.json
```

### 6. Migraciones fallidas

**Causa:** Schema inconsistente con DB

**Solución:**
```bash
# Opción 1: Reset completo (desarrollo)
npx prisma migrate reset
npx prisma migrate dev
npm run prisma:seed

# Opción 2: Baseline (producción)
npx prisma migrate resolve --applied "MIGRATION_NAME"
```

### 7. Error: "Invalid token" en requests

**Causa:** Token expirado o JWT_SECRET incorrecto

**Solución:**
```bash
# 1. Verificar JWT_SECRET en .env
cat .env | grep JWT_SECRET

# 2. Hacer login de nuevo para obtener token fresco
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"traveler@example.com","password":"Traveler123!"}'
```

### 8. Seed falla

**Causa:** Datos duplicados o constraints

**Solución:**
```bash
# Reset completo
npx prisma migrate reset

# O limpiar manualmente
npx prisma studio
# Borrar datos desde UI

# Ejecutar seed
npm run prisma:seed
```

### 9. Performance lento

**Causa:** Queries no optimizados

**Solución:**
```bash
# Activar query logging
# En .env:
DATABASE_URL="postgresql://...?schema=public&connection_limit=5"

# Ver queries en consola
# main.ts agregar:
# import { PrismaClient } from '@prisma/client'
# const prisma = new PrismaClient({ log: ['query'] })
```

### 10. CORS errors desde frontend

**Causa:** CORS_ORIGIN no incluye tu frontend

**Solución:**
```bash
# Agregar tu frontend URL en .env
CORS_ORIGIN="http://localhost:5173,https://lovable.dev,http://localhost:3001"

# Reiniciar servidor
npm run dev
```

---

## 🔧 Utilidades

### Verificar salud del servidor

```bash
# Health check (crear endpoint primero)
curl http://localhost:3000/api/v1/health

# Ver docs Swagger
open http://localhost:3000/docs
```

### Probar endpoints

```bash
# Login y guardar token
TOKEN=$(curl -s -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"traveler@example.com","password":"Traveler123!"}' \
  | jq -r '.accessToken')

# Usar token
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:3000/api/v1/profile/me
```

### Inspeccionar DB

```bash
# Abrir Prisma Studio (mejor opción)
npm run prisma:studio

# O conectar con psql
psql $DATABASE_URL

# Ver tablas
\dt

# Contar usuarios
SELECT count(*) FROM users;
```

### Logs y debugging

```bash
# Ver logs en tiempo real
npm run dev | bunyan

# O con pino-pretty (si está instalado)
npm run dev | pino-pretty

# Debugging con VSCode
# Crear .vscode/launch.json:
{
  "type": "node",
  "request": "launch",
  "name": "Debug NestJS",
  "runtimeExecutable": "npm",
  "runtimeArgs": ["run", "start:debug"],
  "console": "integratedTerminal"
}
```

---

## 📊 Monitoreo

### Ver métricas

```bash
# Conexiones de DB
SELECT count(*) FROM pg_stat_activity 
WHERE datname = 'cappi';

# Tamaño de tablas
SELECT 
  schemaname,
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables 
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```

### Backup de DB

```bash
# Backup
pg_dump $DATABASE_URL > backup.sql

# Restore
psql $DATABASE_URL < backup.sql
```

---

## 🎯 Checklist Pre-Deploy

```bash
# 1. Build sin errores
npm run build

# 2. Linter pasa
npm run lint

# 3. Tests pasan (cuando estén)
npm run test

# 4. Migraciones aplicadas
npx prisma migrate status

# 5. Variables de entorno configuradas
cat .env.production

# 6. CORS configurado para producción
echo $CORS_ORIGIN

# 7. JWT_SECRET seguro (no default)
echo $JWT_SECRET | wc -c  # Debe ser >32 caracteres

# 8. DATABASE_URL de producción
echo $DATABASE_URL

# 9. Seed ejecutado (si es primera vez)
npm run prisma:seed
```

---

## 🚀 Deploy

### Railway

```bash
# Instalar CLI
npm i -g @railway/cli

# Login
railway login

# Link proyecto
railway link

# Deploy
railway up

# Ver logs
railway logs
```

### Render

1. Conectar repo de GitHub
2. Configurar:
   - **Build Command:** `npm install && npm run build && npx prisma generate`
   - **Start Command:** `npm run prisma:migrate:prod && npm run start:prod`
3. Agregar variables de entorno
4. Deploy

### Heroku

```bash
# Login
heroku login

# Crear app
heroku create cappi-backend

# Agregar PostgreSQL
heroku addons:create heroku-postgresql:mini

# Deploy
git push heroku main

# Ejecutar migraciones
heroku run npx prisma migrate deploy

# Ver logs
heroku logs --tail
```

---

## 💡 Tips

1. **Siempre ejecuta `prisma:generate` después de cambios en schema**
2. **Usa `prisma:studio` para inspeccionar datos visualmente**
3. **Los errores de TypeScript antes de `npm install` son normales**
4. **Mantén JWT_SECRET seguro y largo (64+ chars)**
5. **Usa variables de entorno para todo lo sensible**
6. **Documenta cambios en migrations con nombres descriptivos**
7. **Prueba endpoints con Swagger UI en `/docs`**

---

**¿Más problemas?** Abre un issue en GitHub con:
- Logs completos del error
- Comando ejecutado
- Variables de entorno (SIN credenciales)
- Versión de Node: `node --version`
