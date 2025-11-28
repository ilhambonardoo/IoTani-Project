# Struktur Folder IoTani Project

Dokumen ini menjelaskan struktur folder yang telah diorganisir ulang sesuai best practices untuk fullstack development.

## 📁 Struktur Utama

```
src/
├── app/                    # Next.js App Router (Pages & Routes)
│   ├── (admin)/           # Admin route group
│   ├── (auth)/            # Authentication route group
│   ├── (owner)/           # Owner route group
│   ├── (user)/            # User route group
│   ├── api/               # API Routes
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Landing page
│   └── ...
│
├── components/             # Reusable UI Components
│   ├── ui/                # Basic UI components (buttons, modals, etc.)
│   ├── layout/            # Layout components (Sidebar, Footer)
│   ├── features/          # Feature-specific components
│   └── index.ts           # Barrel exports
│
├── lib/                    # Utilities & Configurations
│   ├── api/               # API clients & helpers
│   │   └── email/         # Email service
│   ├── auth/              # Authentication configuration
│   ├── db/                # Database clients
│   │   ├── supabase/     # Supabase client
│   │   └── firebase/      # Firebase services
│   └── utils/             # Utility functions
│
├── types/                  # TypeScript type definitions
├── hooks/                  # Custom React hooks
├── constants/              # Application constants
└── middleware.ts           # Next.js middleware
```

## 📂 Penjelasan Folder

### `/app`
Folder utama untuk Next.js App Router. Berisi:
- Route groups dengan prefix `(group)` untuk organisasi routing
- API routes di `/api`
- Layout dan page components

### `/components`
Komponen UI yang dapat digunakan kembali, diorganisir menjadi:
- **`ui/`**: Komponen dasar seperti modals, buttons, dll
- **`layout/`**: Komponen layout seperti Sidebar, Footer
- **`features/`**: Komponen spesifik fitur seperti SensorAlert, AnimatedChart

### `/lib`
Library dan utilities:
- **`api/`**: API clients dan helpers (email service, dll)
- **`auth/`**: Konfigurasi authentication (NextAuth)
- **`db/`**: Database clients (Supabase, Firebase)
- **`utils/`**: Utility functions (sensor data, export, dll)

### `/types`
TypeScript type definitions untuk type safety di seluruh aplikasi.

### `/hooks`
Custom React hooks untuk logic yang dapat digunakan kembali.

### `/constants`
Konstanta aplikasi seperti routes, thresholds, dll.

### `/middleware`
Next.js middleware untuk authentication dan authorization.

## 🔄 Perubahan dari Struktur Lama

1. **Components**: Diorganisir menjadi `ui/`, `layout/`, dan `features/`
2. **Lib**: Database clients dipindah ke `lib/db/`, API services ke `lib/api/`
3. **Middleware**: Folder `middlewares/` diubah menjadi `middleware/`
4. **Types & Constants**: Ditambahkan folder terpisah untuk better organization
5. **Index Files**: Ditambahkan barrel exports untuk import yang lebih clean

## 📝 Best Practices yang Diterapkan

1. **Separation of Concerns**: Setiap folder memiliki tanggung jawab yang jelas
2. **Barrel Exports**: Menggunakan index.ts untuk export yang lebih clean
3. **Type Safety**: Types terpusat di folder `/types`
4. **Constants**: Konstanta aplikasi terpusat di `/constants`
5. **Consistent Naming**: Menggunakan naming convention yang konsisten

## 🚀 Cara Menggunakan

### Import Components
```typescript
// Menggunakan barrel exports
import { Sidebar, Footer } from "@/components/layout";
import { SensorAlertBanner } from "@/components/features";
import { ConfirmationModal } from "@/components/ui";
```

### Import Types
```typescript
import type { User, SensorData, Template } from "@/types";
```

### Import Constants
```typescript
import { ROUTES, ROLES, SENSOR_THRESHOLDS } from "@/constants";
```

### Import Database Services
```typescript
import { getSupabaseAdmin } from "@/lib/db/supabase/client";
import { getUser } from "@/lib/db/firebase/service";
```

### Import API Services
```typescript
import { sendResetPasswordEmail } from "@/lib/api/email/service-email";
```















