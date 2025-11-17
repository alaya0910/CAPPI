# CAPPI - Plan de Integración Frontend (Lovable) ↔️ Backend (NestJS)

## 🎯 Objetivo

Conectar el frontend de CAPPI (desarrollado en Lovable/React) con el backend NestJS recién creado.

---

## 📋 Checklist de Integración

### Backend: Preparación

- [x] ✅ API REST completa implementada
- [x] ✅ Swagger docs en `/docs`
- [x] ✅ CORS configurado
- [x] ✅ JWT authentication
- [x] ✅ Seed data disponible
- [x] ✅ Deploy-ready

### Frontend: Tareas Pendientes

- [ ] Configurar base URL del API
- [ ] Implementar cliente HTTP (axios/fetch)
- [ ] Gestión de tokens JWT
- [ ] Interceptors para autenticación
- [ ] Tipado TypeScript de responses
- [ ] Error handling
- [ ] Loading states
- [ ] Refresh token logic

---

## 🔧 Paso 1: Configuración Inicial

### 1.1 Backend: Verificar CORS

Asegúrate que tu frontend esté en `CORS_ORIGIN`:

```env
# .env
CORS_ORIGIN="http://localhost:5173,https://lovable.dev,https://tu-dominio-lovable.app"
```

### 1.2 Frontend: Configurar Variables de Entorno

En tu proyecto Lovable/React, crea `.env`:

```env
VITE_API_BASE_URL=http://localhost:3000/api/v1
# O para producción:
# VITE_API_BASE_URL=https://cappi-backend.railway.app/api/v1
```

---

## 🔌 Paso 2: Cliente HTTP

### 2.1 Instalar Axios (Recomendado)

```bash
npm install axios
```

### 2.2 Crear Cliente API

Crea `src/lib/api/client.ts`:

```typescript
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar token automáticamente
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor para manejar errores y refresh token
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Si el error es 401 y no hemos intentado refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        const { data } = await axios.post(`${API_BASE_URL}/auth/refresh`, {
          refreshToken,
        });

        localStorage.setItem('accessToken', data.accessToken);
        localStorage.setItem('refreshToken', data.refreshToken);

        originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        // Refresh falló, logout
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
```

---

## 🔐 Paso 3: Autenticación

### 3.1 Crear Servicio de Auth

Crea `src/lib/api/auth.ts`:

```typescript
import apiClient from './client';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData extends LoginCredentials {
  phone?: string;
  role?: 'TRAVELER' | 'PARTNER' | 'ADMIN';
}

export interface AuthResponse {
  user: {
    id: string;
    email: string;
    role: string;
    status: string;
  };
  accessToken: string;
  refreshToken: string;
}

export const authApi = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const { data } = await apiClient.post('/auth/login', credentials);
    
    // Guardar tokens
    localStorage.setItem('accessToken', data.accessToken);
    localStorage.setItem('refreshToken', data.refreshToken);
    localStorage.setItem('user', JSON.stringify(data.user));
    
    return data;
  },

  async register(userData: RegisterData): Promise<AuthResponse> {
    const { data } = await apiClient.post('/auth/register', userData);
    
    localStorage.setItem('accessToken', data.accessToken);
    localStorage.setItem('refreshToken', data.refreshToken);
    localStorage.setItem('user', JSON.stringify(data.user));
    
    return data;
  },

  async getMe() {
    const { data } = await apiClient.get('/auth/me');
    return data;
  },

  logout() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
  },

  isAuthenticated(): boolean {
    return !!localStorage.getItem('accessToken');
  },

  getUser() {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },
};
```

### 3.2 Context de Autenticación (React)

Crea `src/contexts/AuthContext.tsx`:

```typescript
import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi, AuthResponse } from '@/lib/api/auth';

interface AuthContextType {
  user: any | null;
  login: (email: string, password: string) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verificar si hay sesión al cargar
    const initAuth = async () => {
      if (authApi.isAuthenticated()) {
        try {
          const userData = await authApi.getMe();
          setUser(userData);
        } catch (error) {
          authApi.logout();
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    const data = await authApi.login({ email, password });
    setUser(data.user);
  };

  const register = async (userData: any) => {
    const data = await authApi.register(userData);
    setUser(data.user);
  };

  const logout = () => {
    authApi.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        isAuthenticated: !!user,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
```

---

## 📍 Paso 4: Endpoints Principales

### 4.1 Catalog (Places & Experiences)

Crea `src/lib/api/catalog.ts`:

```typescript
import apiClient from './client';

export const catalogApi = {
  async getPlaces(filters?: {
    city?: string;
    type?: string;
    tags?: string[];
    safetyScoreMin?: number;
    page?: number;
    limit?: number;
  }) {
    const { data } = await apiClient.get('/places', { params: filters });
    return data;
  },

  async getPlaceById(id: string) {
    const { data } = await apiClient.get(`/places/${id}`);
    return data;
  },

  async getExperiences(filters?: {
    city?: string;
    category?: string;
    priceMin?: number;
    priceMax?: number;
    ratingMin?: number;
    page?: number;
    limit?: number;
  }) {
    const { data } = await apiClient.get('/experiences', { params: filters });
    return data;
  },

  async getExperienceById(id: string) {
    const { data } = await apiClient.get(`/experiences/${id}`);
    return data;
  },
};
```

### 4.2 Safety

Crea `src/lib/api/safety.ts`:

```typescript
import apiClient from './client';

export const safetyApi = {
  async getZones(city: string, country?: string) {
    const { data } = await apiClient.get('/safety/zones', {
      params: { city, country },
    });
    return data;
  },

  async getAlerts(city?: string) {
    const { data } = await apiClient.get('/safety/alerts', {
      params: { city },
    });
    return data;
  },
};
```

### 4.3 Trips

Crea `src/lib/api/trips.ts`:

```typescript
import apiClient from './client';

export const tripsApi = {
  async createTrip(tripData: any) {
    const { data } = await apiClient.post('/trips', tripData);
    return data;
  },

  async getTrips() {
    const { data } = await apiClient.get('/trips');
    return data;
  },

  async getTripById(id: string) {
    const { data } = await apiClient.get(`/trips/${id}`);
    return data;
  },

  async addItineraryItem(tripId: string, item: any) {
    const { data } = await apiClient.post(`/trips/${tripId}/items`, item);
    return data;
  },

  async updateItineraryItem(itemId: string, status: string) {
    const { data } = await apiClient.patch(`/trips/items/${itemId}`, null, {
      params: { status },
    });
    return data;
  },

  async deleteItineraryItem(itemId: string) {
    await apiClient.delete(`/trips/items/${itemId}`);
  },
};
```

### 4.4 Chat

Crea `src/lib/api/chat.ts`:

```typescript
import apiClient from './client';

export const chatApi = {
  async sendMessage(message: string, context?: any, sessionId?: string) {
    const { data } = await apiClient.post('/chat/send', {
      message,
      context,
      sessionId,
    });
    return data;
  },

  async getHistory(sessionId: string, limit?: number) {
    const { data } = await apiClient.get('/chat/history', {
      params: { sessionId, limit },
    });
    return data;
  },
};
```

### 4.5 Recommendations

Crea `src/lib/api/recommendations.ts`:

```typescript
import apiClient from './client';

export const recommendationsApi = {
  async generate(context: {
    city: string;
    country?: string;
    budgetLevel?: string;
    preferences?: any;
  }) {
    const { data } = await apiClient.post('/recommendations/generate', context);
    return data;
  },

  async getLatest() {
    const { data } = await apiClient.get('/recommendations/latest');
    return data;
  },
};
```

---

## 🎨 Paso 5: Componentes de Ejemplo

### 5.1 Login Form

```typescript
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';

export function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
      // Redirigir al dashboard
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al iniciar sesión');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        required
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        required
      />
      {error && <p className="error">{error}</p>}
      <button type="submit">Login</button>
    </form>
  );
}
```

### 5.2 Places List

```typescript
import { useEffect, useState } from 'react';
import { catalogApi } from '@/lib/api/catalog';

export function PlacesList({ city }: { city: string }) {
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        const data = await catalogApi.getPlaces({ city, safetyScoreMin: 70 });
        setPlaces(data.data);
      } catch (error) {
        console.error('Error fetching places:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPlaces();
  }, [city]);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      {places.map((place: any) => (
        <div key={place.id}>
          <h3>{place.name}</h3>
          <p>{place.description}</p>
          <span>Safety: {place.safetyScore}/100</span>
        </div>
      ))}
    </div>
  );
}
```

---

## ✅ Testing de Integración

### 1. Test Manual con Postman/Thunder Client

Importa la colección desde Swagger:
```
http://localhost:3000/docs-json
```

### 2. Test desde Frontend

```typescript
// En DevTools Console
fetch('http://localhost:3000/api/v1/places?city=Cancún', {
  headers: {
    'Authorization': 'Bearer YOUR_TOKEN'
  }
})
.then(r => r.json())
.then(console.log)
```

---

## 🚀 Deploy Conjunto

### Backend (Railway)
```bash
railway up
# URL: https://cappi-backend.railway.app
```

### Frontend (Lovable)
```env
VITE_API_BASE_URL=https://cappi-backend.railway.app/api/v1
```

---

## 📊 Checklist Final

- [ ] Backend corriendo y accesible
- [ ] CORS configurado correctamente
- [ ] Frontend puede hacer login
- [ ] Tokens se guardan en localStorage
- [ ] Refresh token funciona
- [ ] Endpoints principales conectados
- [ ] Error handling implementado
- [ ] Loading states en UI
- [ ] TypeScript types sincronizados
- [ ] Deploy exitoso

---

## 🆘 Troubleshooting

### CORS Error
```typescript
// Verificar que el backend tenga:
CORS_ORIGIN="https://tu-frontend.lovable.app"
```

### 401 Unauthorized
```typescript
// Verificar que el token esté en headers:
console.log(localStorage.getItem('accessToken'));
```

### Network Error
```typescript
// Verificar URL del API:
console.log(import.meta.env.VITE_API_BASE_URL);
```

---

**¡Listo!** Tu frontend Lovable ahora está completamente integrado con el backend CAPPI. 🎉
