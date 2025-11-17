# CAPPI Backend - Contratos JSON

Este documento define los contratos JSON de ejemplo para cada endpoint principal.

## Authentication

### POST /auth/register

**Request:**
```json
{
  "email": "user@example.com",
  "password": "SecureP@ssw0rd",
  "phone": "+52 998 123 4567",
  "role": "TRAVELER"
}
```

**Response:**
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "role": "TRAVELER",
    "status": "ACTIVE",
    "createdAt": "2025-11-17T10:00:00Z"
  },
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### POST /auth/login

**Request:**
```json
{
  "email": "user@example.com",
  "password": "SecureP@ssw0rd"
}
```

**Response:**
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "role": "TRAVELER",
    "status": "ACTIVE"
  },
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

## Profile

### PATCH /profile/me

**Request:**
```json
{
  "fullName": "Juan Pérez",
  "birthdate": "1990-05-15",
  "gender": "MALE",
  "homeAirport": "CUN",
  "preferences": {
    "cuisines": ["Mexican", "Mediterranean", "Japanese"],
    "activities": ["Beach", "Nightlife", "Gastronomy"],
    "ambiance": ["Luxury", "Trendy"]
  },
  "riskTolerance": "MEDIUM"
}
```

**Response:**
```json
{
  "id": "uuid",
  "userId": "uuid",
  "fullName": "Juan Pérez",
  "birthdate": "1990-05-15T00:00:00Z",
  "gender": "MALE",
  "homeAirport": "CUN",
  "preferences": {
    "cuisines": ["Mexican", "Mediterranean", "Japanese"],
    "activities": ["Beach", "Nightlife", "Gastronomy"],
    "ambiance": ["Luxury", "Trendy"]
  },
  "riskTolerance": "MEDIUM",
  "loyaltyTier": "SILVER"
}
```

## Catalog

### GET /places?city=Cancún&type=ROOFTOP&safetyScoreMin=80

**Response:**
```json
{
  "data": [
    {
      "id": "uuid",
      "type": "ROOFTOP",
      "name": "Rooftop 22",
      "description": "Bar de rooftop premium con vista al mar Caribe",
      "address": "Blvd. Kukulcan Km 9, Zona Hotelera",
      "lat": 21.1333,
      "lng": -86.7467,
      "city": "Cancún",
      "country": "Mexico",
      "images": [
        { "url": "https://...", "alt": "Vista panorámica" }
      ],
      "tags": ["premium", "sunset", "cocktails", "ocean-view"],
      "safetyScore": 95,
      "verified": true
    }
  ],
  "meta": {
    "total": 15,
    "page": 1,
    "limit": 20,
    "totalPages": 1
  }
}
```

### GET /experiences?category=DINNER&city=Cancún&ratingMin=4.5

**Response:**
```json
{
  "data": [
    {
      "id": "uuid",
      "placeId": "uuid",
      "title": "Cena VIP en RosaNegra con show en vivo",
      "shortDesc": "Cena de 5 tiempos con espectáculo latino",
      "category": "DINNER",
      "durationMins": 180,
      "priceMin": 2500,
      "priceMax": 4000,
      "currency": "MXN",
      "includes": ["Menú 5 tiempos", "Maridaje", "Show en vivo"],
      "ratingAvg": 4.8,
      "ratingCount": 127,
      "place": {
        "id": "uuid",
        "name": "RosaNegra",
        "city": "Cancún",
        "safetyScore": 92
      }
    }
  ],
  "meta": {
    "total": 8,
    "page": 1,
    "limit": 20,
    "totalPages": 1
  }
}
```

## Safety

### GET /safety/zones?city=Cancún

**Response:**
```json
[
  {
    "id": "uuid",
    "city": "Cancún",
    "country": "Mexico",
    "polygon": "{\"type\":\"Polygon\",\"coordinates\":[...]}",
    "riskLevel": "SAFE",
    "source": "local_authorities",
    "lastReviewedAt": "2025-11-01T00:00:00Z",
    "alerts": [
      {
        "id": "uuid",
        "title": "Tráfico intenso en Zona Hotelera",
        "message": "Se recomienda usar transporte alternativo",
        "severity": "LOW",
        "startAt": "2025-11-17T08:00:00Z",
        "endAt": "2025-11-17T20:00:00Z"
      }
    ]
  }
]
```

## Trips

### POST /trips

**Request:**
```json
{
  "title": "Escapada a Cancún",
  "city": "Cancún",
  "country": "Mexico",
  "startDate": "2025-12-01",
  "endDate": "2025-12-05",
  "partySize": 2,
  "budgetLevel": "LUXURY",
  "notes": "Aniversario - buscar experiencias románticas"
}
```

**Response:**
```json
{
  "id": "uuid",
  "userId": "uuid",
  "title": "Escapada a Cancún",
  "city": "Cancún",
  "country": "Mexico",
  "startDate": "2025-12-01T00:00:00Z",
  "endDate": "2025-12-05T00:00:00Z",
  "partySize": 2,
  "budgetLevel": "LUXURY",
  "notes": "Aniversario - buscar experiencias románticas",
  "createdAt": "2025-11-17T10:00:00Z"
}
```

### POST /trips/:id/items

**Request:**
```json
{
  "dayIndex": 0,
  "entityType": "EXPERIENCE",
  "entityId": "uuid",
  "startTime": "2025-12-01T19:00:00Z",
  "endTime": "2025-12-01T22:00:00Z",
  "customNote": "Cena especial aniversario"
}
```

**Response:**
```json
{
  "id": "uuid",
  "tripId": "uuid",
  "dayIndex": 0,
  "entityType": "EXPERIENCE",
  "entityId": "uuid",
  "status": "PLANNED",
  "startTime": "2025-12-01T19:00:00Z",
  "endTime": "2025-12-01T22:00:00Z",
  "customNote": "Cena especial aniversario"
}
```

## Chat

### POST /chat/send

**Request:**
```json
{
  "sessionId": "uuid",
  "message": "Recomiéndame un lugar seguro para cenar en Cancún",
  "context": {
    "city": "Cancún",
    "tripId": "uuid"
  }
}
```

**Response:**
```json
{
  "sessionId": "uuid",
  "message": {
    "id": "uuid",
    "role": "ASSISTANT",
    "content": "¡Hola! Soy tu concierge de viaje para Cancún. Tengo información actualizada sobre 5 zonas seguras. Te recomiendo RosaNegra, un restaurante de alta cocina latinoamericana en la Zona Hotelera con safetyScore de 92. ¿Te gustaría reservar?",
    "createdAt": "2025-11-17T10:00:00Z"
  }
}
```

## Recommendations

### POST /recommendations/generate

**Request:**
```json
{
  "city": "Cancún",
  "country": "Mexico",
  "budgetLevel": "LUXURY",
  "partySize": 2,
  "preferences": {
    "cuisines": ["Mediterranean", "Japanese"],
    "activities": ["Beach", "Nightlife"]
  }
}
```

**Response:**
```json
{
  "id": "uuid",
  "userId": "uuid",
  "context": {
    "city": "Cancún",
    "budgetLevel": "LUXURY",
    "partySize": 2
  },
  "items": [
    {
      "entityType": "PLACE",
      "entityId": "uuid",
      "name": "Rooftop 22",
      "score": 92,
      "reasons": ["Zona segura verificada", "Partner verificado", "Experiencia premium"],
      "safetyScore": 95
    },
    {
      "entityType": "EXPERIENCE",
      "entityId": "uuid",
      "name": "Cena VIP en RosaNegra",
      "score": 89,
      "reasons": ["Altamente calificado", "Ubicación segura", "Muy popular"],
      "safetyScore": 92
    }
  ],
  "modelVersion": "v1-safe-first",
  "safetyInfo": {
    "zones": 3,
    "minSafetyScore": 50,
    "riskTolerance": "MEDIUM"
  }
}
```

## Bookings

### POST /bookings

**Request:**
```json
{
  "entityType": "EXPERIENCE",
  "entityId": "uuid",
  "partnerId": "uuid",
  "quantity": 2,
  "price": 5000,
  "currency": "MXN",
  "meta": {
    "dateTime": "2025-12-01T19:00:00Z",
    "guestNames": ["Juan Pérez", "María García"],
    "specialRequests": "Mesa con vista al mar"
  }
}
```

**Response:**
```json
{
  "id": "uuid",
  "userId": "uuid",
  "entityType": "EXPERIENCE",
  "entityId": "uuid",
  "partnerId": "uuid",
  "status": "CONFIRMED",
  "quantity": 2,
  "price": 5000,
  "currency": "MXN",
  "meta": {
    "dateTime": "2025-12-01T19:00:00Z",
    "guestNames": ["Juan Pérez", "María García"]
  },
  "payment": {
    "id": "uuid",
    "amount": 5000,
    "currency": "MXN",
    "status": "SUCCEEDED",
    "provider": "DUMMY"
  }
}
```

## Reviews

### POST /reviews

**Request:**
```json
{
  "entityType": "EXPERIENCE",
  "entityId": "uuid",
  "rating": 5,
  "title": "Experiencia increíble",
  "body": "La cena fue espectacular, el show en vivo superó expectativas. 100% recomendado.",
  "photos": [
    { "url": "https://...", "alt": "Plato principal" }
  ]
}
```

**Response:**
```json
{
  "id": "uuid",
  "userId": "uuid",
  "entityType": "EXPERIENCE",
  "entityId": "uuid",
  "rating": 5,
  "title": "Experiencia increíble",
  "body": "La cena fue espectacular...",
  "photos": [{ "url": "https://...", "alt": "Plato principal" }],
  "status": "PENDING",
  "createdAt": "2025-11-17T10:00:00Z"
}
```
