# 🍽️ Restaurante SaaS - Sistema de Gestión

Plataforma empresarial modular para restaurantes con POS terminal, gestión de inventario, personal y analytics.

**Tech Stack:** Next.js 16 | React 19 | TypeScript | Supabase | TanStack Query | Zustand | Tailwind CSS v4 | Framer Motion

---

## ✨ Características Principales

### 🔐 Seguridad Avanzada
- ✅ Autenticación multi-método: Email/Contraseña, Magic Link, PIN, OAuth (Google/Azure), 2FA TOTP
- ✅ PIN seguro con PBKDF2 (100k iteraciones) + Salt
- ✅ ABAC (Attribute-Based Access Control) con validación granular
- ✅ RBAC (Role-Based Access Control) por rol: SUPERADMIN, ADMIN, MANAGER, WAITER, CHEF

### 📱 Terminal POS
- ✅ Grid de productos con búsqueda e filtros por categoría
- ✅ Carrito dinámico con modificadores, combos y notas
- ✅ Descuentos y propinas (porcentaje o monto fijo)
- ✅ Múltiples métodos de pago: Efectivo, Tarjeta, Transferencia, Mixto
- ✅ Checkout rápido con receipt

### 📦 Inventario
- ✅ Gestión de stock por ubicación
- ✅ Kardex (historial) de movimientos
- ✅ Tipos de movimiento: Compra, Venta, Producción, Residuo, Ajuste, Transferencia
- ✅ Transferencias entre sedes
- ✅ Costo promedio ponderado automático

### 👥 Personal
- ✅ CRUD de usuarios con validaciones
- ✅ Asignación de roles y permisos
- ✅ Paginación (20 items/página)
- ✅ Búsqueda por nombre/email con debounce 300ms
- ✅ Suspender/Activar usuarios
- ✅ Reset de contraseña y PIN

### 📊 Analytics
- ✅ Dashboard con KPIs: Ingresos, Órdenes, Ticket Promedio
- ✅ Gráficos de Revenue (línea/área)
- ✅ Horas pico de venta
- ✅ Platos más vendidos
- ✅ Estado de mesas
- ✅ Próximas reservaciones

### 🎨 UI/UX Premium
- ✅ 15+ animaciones Framer Motion estilo Apple
- ✅ Dark mode por defecto
- ✅ Glassmorphism y efectos hover suaves
- ✅ Notificaciones elegantes con toasts
- ✅ Componentes shadcn UI
- ✅ Responsive design (mobile-first)

---

## 🚀 Quick Start

### Instalación
```bash
# Clonar proyecto
git clone <repo>
cd RESTAURANTE_FINAL

# Instalar dependencias
pnpm install

# Variables de entorno (.env.local)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Desarrollo
```bash
# Dev server (http://localhost:3000)
pnpm dev

# Build producción
pnpm build

# Start producción
pnpm start

# Linting
pnpm lint
```

### Tests
```bash
# Tests unitarios (Vitest)
pnpm test

# E2E tests (Playwright)
pnpm test:e2e

# Watch mode
pnpm test:watch
```

---

## 📁 Estructura del Proyecto

```
src/
├── app/                          # Next.js App Router
│   ├── layout.tsx               # Root layout con providers
│   ├── page.tsx                 # Dashboard principal
│   ├── (auth)/                  # Rutas de autenticación
│   │   ├── login/page.tsx
│   │   ├── register/page.tsx
│   │   ├── forgot-password/page.tsx
│   │   └── reset-password/page.tsx
│   └── (dashboard)/             # Rutas protegidas
│       ├── pos/page.tsx         # Terminal POS
│       ├── inventory/page.tsx   # Gestión inventario
│       └── users/page.tsx       # Gestión personal
│
├── features/                     # Módulos por funcionalidad
│   ├── auth/
│   │   ├── api/
│   │   │   └── actions.ts       # Server Actions (login, signup, etc.)
│   │   ├── components/
│   │   │   ├── login-form.tsx
│   │   │   └── register-form.tsx
│   │   ├── store/
│   │   │   └── session-store.ts # Zustand global session
│   │   ├── types/
│   │   └── validations/
│   │
│   ├── users/
│   │   ├── api/
│   │   │   ├── actions.ts       # CRUD + suspend + password reset
│   │   │   ├── queries.ts       # useUsers hook (con paginación)
│   │   │   └── mutations.ts     # useMutation wrappers
│   │   ├── components/
│   │   │   ├── user-form.tsx
│   │   │   └── user-data-table.tsx
│   │   ├── types/
│   │   ├── store/
│   │   │   └── user-store.ts    # Modal state management
│   │   └── validations/
│   │       └── user-schemas.ts
│   │
│   ├── pos/
│   │   ├── api/
│   │   │   └── pos-queries.ts
│   │   ├── components/
│   │   │   ├── pos-layout.tsx
│   │   │   ├── pos-product-grid.tsx
│   │   │   ├── pos-cart.tsx
│   │   │   └── checkout-modal.tsx
│   │   ├── store/
│   │   │   └── pos-store.ts
│   │   ├── types/
│   │   └── validations/
│   │
│   └── inventory/
│       ├── api/
│       │   ├── server-actions.ts
│       │   └── queries.ts
│       ├── components/
│       │   ├── stock-table.tsx
│       │   └── movement-form-modal.tsx
│       ├── types/
│       └── validations/
│           └── inventory-schemas.ts
│
├── components/
│   ├── ui/                      # Shadcn components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── table.tsx
│   │   └── ...
│   ├── dashboard/               # Dashboard widgets
│   │   ├── sidebar.tsx
│   │   ├── topbar.tsx
│   │   ├── stat-cards.tsx
│   │   ├── revenue-chart.tsx
│   │   └── ...
│   ├── animations/
│   │   └── index.ts             # Variantes Framer Motion
│   ├── error-boundary.tsx
│   ├── pagination.tsx
│   └── ...
│
├── lib/
│   ├── supabase/
│   │   ├── server.ts            # Cliente SSR
│   │   ├── client.ts            # Cliente browser
│   │   ├── admin.ts             # Cliente admin
│   │   └── middleware.ts        # Auth guard
│   ├── crypto.ts                # PBKDF2 para PIN
│   ├── auditing.ts              # Audit logs
│   └── utils.ts
│
├── hooks/
│   ├── useDebounce.ts           # Debounce genérico
│   ├── useToastError.ts         # Error handling
│   └── index.ts
│
└── providers/
    ├── session-provider.tsx     # Hydrate session
    ├── toaster-provider.tsx     # Toast notifications
    ├── theme-provider.tsx       # Dark/Light theme
    └── query-provider.tsx       # TanStack Query
```

---

## 🔐 Autenticación & Autorización

### Métodos de Login
```typescript
// Email + Contraseña
POST /api/auth/login
{ email, password }

// Magic Link (OTP)
POST /api/auth/magic-link
{ email }

// PIN (Meseros/POS)
POST /api/auth/login-pin
{ email, pin }

// OAuth (Google/Azure)
GET /api/auth/oauth
{ provider: 'google' | 'azure' }
```

### ABAC Enforcement
Antes de cada acción se valida:
```typescript
1. ¿Usuario está autenticado?
2. ¿Acción está en sus permisos?
3. ¿Recurso pertenece a su empresa?
4. ¿Si MANAGER: recurso en su sede?
```

### Roles y Permisos
- **SUPERADMIN:** Acceso total a todo
- **ADMIN:** Solo su empresa
- **MANAGER:** Su empresa + su sede
- **WAITER:** Solo lectura asignada
- **CHEF:** Acceso a órdenes/producción

---

## 📊 API & Data Model

### Users Query (con paginación y búsqueda)
```typescript
const { data: response } = useUsers(companyId, {
  page: 1,
  limit: 20,
  searchQuery: 'juan',
  locationId: 'optional-uuid'
});

// Response: { users[], total, page, limit, totalPages }
```

### Inventory Query (con búsqueda)
```typescript
const { data: stock } = useInventoryStock(locationId, 'búsqueda');

// Retorna: InventoryItem[] ordenado por stock ASC
```

### Soft Deletes
```typescript
// No se borra, se marca como eliminado
DELETE /users/:id
→ user_profiles.deleted_at = now()
→ user_profiles.deleted_by = currentUser.id

// Query excluye automáticamente
WHERE deleted_at IS NULL
```

### Auditing
Cada cambio registra:
- `updated_at`: timestamp del cambio
- `updated_by`: UUID del usuario que cambió
- `deleted_by`: UUID del usuario que eliminó (si aplica)

---

## 🎨 Componentes & Animaciones

### Animaciones Base (Framer Motion)
```typescript
import { fadeInScale, slideUp, pulse } from '@/components/animations';

// Uso
<motion.div variants={fadeInScale} initial="initial" animate="animate">
  Content
</motion.div>
```

### Componentes Principales
- **Button:** Active scale-95, hover shadow
- **Card:** Glassmorphism, hover elevation
- **Sidebar:** Smooth transitions, pulse badges
- **Pagination:** Animated page numbers
- **UserDataTable:** Stagger rows, hover effects
- **POS Grid:** Scale on hover, tap feedback

---

## 📈 Performance

### Optimizaciones Implementadas
- ✅ React Query con stale time 30s
- ✅ Debounce búsqueda 300ms
- ✅ Paginación 20 items/página
- ✅ Lazy loading de rutas (dynamic imports)
- ✅ Image optimization (next/image)
- ✅ PWA support ready (next-pwa)

### Metrics Target
- Lighthouse score: > 90
- Core Web Vitals: Green
- TTFB: < 600ms
- FCP: < 1.5s
- LCP: < 2.5s

---

## 🔒 Seguridad Checklist

- ✅ PIN hashed con PBKDF2 (100k iteraciones)
- ✅ Contraseñas aleatorias en creación de usuarios
- ✅ ABAC validation en server actions
- ✅ Soft deletes (sin data loss)
- ✅ Auditing de cambios
- ✅ 2FA TOTP support
- ✅ Rate limiting recomendado (Supabase)
- ✅ RLS policies en DB (recomendado)
- ✅ HTTPS en producción
- ✅ CORS configured

---

## 📚 Guía de Desarrollo

### Agregar Nueva Feature
1. Crear carpeta en `src/features/feature-name/`
2. Estructura: `api/`, `components/`, `types/`, `validations/`
3. Crear Server Actions en `api/actions.ts`
4. Crear React Query hooks en `api/queries.ts`
5. Validar con Zod en `validations/`
6. Implementar componentes con animaciones

### Testing
```typescript
// Tests unitarios
pnpm test

// Cobertura
pnpm test -- --coverage

// E2E (WIP)
pnpm test:e2e
```

### Deployment
```bash
# Vercel (recomendado)
vercel deploy

# Docker (opcional)
docker build -t restaurante:latest .
docker run -p 3000:3000 restaurante:latest

# Self-hosted
npm run build && npm start
```

---

## 🐛 Troubleshooting

### Build Error: "Both middleware and proxy detected"
→ Usa `src/proxy.ts` en lugar de `src/middleware.ts`

### Auth redirect loop
→ Verificar NEXT_PUBLIC_APP_URL en .env.local

### Supabase connection timeout
→ Revisar NEXT_PUBLIC_SUPABASE_URL y ANON_KEY

### Tests fail: "Cannot find module"
→ Ejecutar `pnpm install` nuevamente

---

## 📝 Licenses

MIT License - Libre para usar, modificar y distribuir.

---

## 🤝 Contribuciones

1. Fork el proyecto
2. Crear rama feature: `git checkout -b feature/nombre`
3. Commit cambios: `git commit -m "Agregar feature"`
4. Push a rama: `git push origin feature/nombre`
5. Abrir Pull Request

---

## 📞 Soporte

- 📧 Email: soporte@restaurante-saas.com
- 💬 Discord: [Comunidad]
- 🐛 Bugs: GitHub Issues
- 💡 Features: GitHub Discussions

---

**Última actualización:** 2026-06-22
**Versión:** 0.4.0 (80% feature-complete)
**Mantenedor:** GIAN-B
