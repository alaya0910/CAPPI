# CAPPI Backend - AI Travel Concierge for LATAM

Backend productivo para CAPPI, un concierge de viaje con IA que ofrece recomendaciones seguras y experiencias premium en LATAM.

## 🚀 Stack Tecnológico

- **Framework**: NestJS (TypeScript)
- **Database**: PostgreSQL (Supabase)
- **ORM**: Prisma
- **Authentication**: JWT + Passport
- **Documentation**: Swagger/OpenAPI
- **Validation**: class-validator/class-transformer
- **Security**: Helmet, CORS, Rate Limiting
- **Testing**: Jest

## 📋 Requisitos Previos

- Node.js 18+
- PostgreSQL (o cuenta de Supabase)
- Redis (opcional, para caching)

## 🛠️ Instalación

### 1. Clonar e instalar dependencias

```bash
npm install
```

### 2. Configurar variables de entorno

Copia el archivo `.env.example` a `.env` y configura las variables:

```bash
cp .env.example .env
```

Edita `.env` con tus credenciales:

```env
DATABASE_URL="postgresql://user:password@host:5432/cappi?schema=public"
JWT_SECRET="your-super-secret-jwt-key"
REDIS_URL="redis://localhost:6379"
```

### 3. Generar Prisma Client y ejecutar migraciones

```bash
npm run prisma:generate
npm run prisma:migrate
```

### 4. Ejecutar seed de datos iniciales

```bash
npm run prisma:seed
```

Esto creará:
- ✅ Usuario admin: `admin@cappi.com` / `Admin123!`
- ✅ Usuario viajero: `traveler@example.com` / `Traveler123!`
- ✅ 2 Partners verificados
- ✅ Zonas de seguridad para Cancún y Medellín
- ✅ 6 lugares (restaurantes, rooftops, beach clubs)
- ✅ 3 experiencias premium
- ✅ 1 viaje de ejemplo

### 5. Ejecutar el servidor

**Desarrollo:**
```bash
npm run dev
```

**Producción:**
```bash
npm run build
npm run start:prod
```

El servidor estará disponible en:
- 🌐 API: http://localhost:3000/api/v1
- 📚 Documentación: http://localhost:3000/docs

## 📖 Documentación de la API

### Swagger/OpenAPI

Accede a la documentación interactiva en: `http://localhost:3000/docs`

### Endpoints Principales

#### **Authentication** (`/auth`)
- `POST /auth/register` - Registrar nuevo usuario
- `POST /auth/login` - Login
- `POST /auth/refresh` - Refrescar token
- `GET /auth/me` - Perfil actual

#### **Users & Profiles** (`/profile`, `/users`)
- `GET /profile/me` - Obtener perfil
- `PATCH /profile/me` - Actualizar perfil
- `GET /users/:id` - Usuario por ID

#### **Catalog** (`/places`, `/experiences`)
- `GET /places` - Listar lugares (filtros: type, city, tags, safetyScore, q)
- `GET /places/:id` - Detalle de lugar
- `GET /experiences` - Listar experiencias (filtros: category, city, priceMin/Max, rating, q)
- `GET /experiences/:id` - Detalle de experiencia

#### **Safety** (`/safety`)
- `GET /safety/zones?city=Cancún` - Zonas seguras por ciudad
- `GET /safety/alerts?city=Cancún` - Alertas activas

#### **Trips & Itinerary** (`/trips`)
- `POST /trips` - Crear viaje
- `GET /trips` - Listar viajes del usuario
- `GET /trips/:id` - Detalle de viaje
- `POST /trips/:id/items` - Agregar ítem al itinerario
- `PATCH /trips/items/:itemId` - Actualizar ítem
- `DELETE /trips/items/:itemId` - Eliminar ítem

#### **Chat** (`/chat`)
- `POST /chat/send` - Enviar mensaje al concierge IA
- `GET /chat/history?sessionId=...` - Historial de conversación

#### **Recommendations** (`/recommendations`)
- `POST /recommendations/generate` - Generar recomendaciones personalizadas
- `GET /recommendations/latest` - Últimas recomendaciones

#### **Bookings** (`/bookings`)
- `POST /bookings` - Crear reserva
- `GET /bookings` - Listar reservas del usuario
- `GET /bookings/:id` - Detalle de reserva
- `PATCH /bookings/:id/cancel` - Cancelar reserva

#### **Reviews** (`/reviews`)
- `POST /reviews` - Crear reseña
- `GET /reviews?entityType=PLACE&entityId=...` - Listar reseñas
- `PATCH /reviews/:id` - Moderar reseña (ADMIN)

## 🔐 Autenticación

Todas las rutas (excepto `/auth/register` y `/auth/login`) requieren un token JWT.

**Ejemplo de uso:**

1. Login:
```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"traveler@example.com","password":"Traveler123!"}'
```

2. Usar el token en requests:
```bash
curl -X GET http://localhost:3000/api/v1/profile/me \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

## 🧪 Testing

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

## 🏗️ Arquitectura

### Estrategia "Safe-First, Fit-Then-Luxury"

El motor de recomendaciones prioriza:

1. **Seguridad** (40%) - `safetyScore >= threshold` basado en `riskTolerance`
2. **Verificación** (20%) - Partners verificados
3. **Budget Fit** (20%) - Coincidencia con nivel de presupuesto
4. **Rating & Popularidad** (20%) - Calificaciones y reviews

### Servicios Core

- **PrismaService**: Conexión global a PostgreSQL
- **SafetyService**: Gestión de zonas y alertas de seguridad
- **RecommendationEngineService**: Motor de recomendaciones con ML placeholders
- **ChatAiService**: Enriquecimiento de contexto para IA conversacional
- **ContextService**: Agregación de señales (perfil, ubicación, clima, seguridad)

## 📦 Scripts Disponibles

```bash
npm run dev              # Desarrollo con hot-reload
npm run build            # Compilar para producción
npm run start:prod       # Ejecutar en producción
npm run lint             # Linter
npm run format           # Formatear código con Prettier
npm run prisma:generate  # Generar Prisma Client
npm run prisma:migrate   # Ejecutar migraciones
npm run prisma:studio    # Abrir Prisma Studio (UI de DB)
npm run prisma:seed      # Ejecutar seed
```

## 🔒 Seguridad

- **Helmet**: Headers de seguridad HTTP
- **CORS**: Configurado para orígenes específicos
- **Rate Limiting**: 100 req/min por IP
- **JWT**: Tokens seguros con expiración
- **Input Validation**: DTOs validados con class-validator
- **Password Hashing**: Argon2

## 🌐 Deployment

### Supabase + Railway/Render

1. **Database**: Crear proyecto en Supabase y obtener `DATABASE_URL`
2. **Backend**: Deploy en Railway/Render
3. **Variables de entorno**: Configurar todas las vars en el dashboard
4. **Migrations**: Ejecutar `npm run prisma:migrate:prod`

### Docker (Opcional)

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
RUN npx prisma generate
CMD ["npm", "run", "start:prod"]
```

## 🤝 Contribución

Este es un MVP. Para contribuir:

1. Fork el repositorio
2. Crea una branch: `git checkout -b feature/amazing-feature`
3. Commit: `git commit -m 'Add amazing feature'`
4. Push: `git push origin feature/amazing-feature`
5. Abre un Pull Request

## 📝 Roadmap

- [ ] Integración real con OpenAI/Anthropic para chat
- [ ] Webhook de pagos con Stripe
- [ ] Sistema de notificaciones (BullMQ)
- [ ] Caché con Redis
- [ ] Webhooks para partners
- [ ] Analytics y telemetría
- [ ] Tests E2E completos
- [ ] CI/CD con GitHub Actions

## 📄 Licencia

Propietario - ALAYA Team © 2025

## 🆘 Soporte

Para problemas o preguntas:
- Email: dev@cappi.com
- GitHub Issues: [Crear issue](https://github.com/alaya0910/CAPPI/issues)

---

**Hecho con ❤️ para viajeros en LATAM** 
