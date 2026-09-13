````markdown
# Dōki – Real-Time Collaboration Workspace

## Single Source of Truth (SSOT) / Master Context Document

---

### 1. Visi & Identitas Proyek

- **Nama Aplikasi:** Dōki (dari bahasa Jepang 同期 / Dōki yang berarti Sinkronisasi)[cite: 1].
- **Format Penulisan di CV:** Dōki – Real-Time Collaboration Workspace[cite: 1].
- **Tujuan Utama:** Membangun aplikasi manajemen tugas kolaboratif (_Kanban-style_) berskala produksi untuk portofolio magang (_internship_) dengan target penguasaan "Junior to Mid-Level"[cite: 1].
- **Pendekatan Pengembangan:** _Full-code_ dari nol (tanpa BaaS seperti Firebase/Supabase untuk backend) demi mendemonstrasikan penguasaan arsitektur sistem, database relasional, manajemen state, dan _real-time engine_[cite: 1]. AI digunakan murni untuk percepatan _styling_ UI (Tailwind & boilerplate komponen)[cite: 1].
- **Prinsip Eksekusi:** **Core Feature First**. Fitur tambahan di luar alur inti baru boleh disentuh setelah seluruh target Fase 1–5 (MVP) selesai dan berhasil dideploy ke cloud[cite: 1].

---

### 2. Alur Penggunaan & Matriks Hak Akses (RBAC)

#### User Journey Inti[cite: 1]

1. **Workspace & Board:** Pengguna membuat Workspace (organisasi/tim) dan di dalamnya membuat Board (proyek spesifik)[cite: 1].
2. **List & Task:** Di dalam Board, pengguna menyusun kolom tahapan (List) dan kartu tugas (Task)[cite: 1].
3. **Drag-and-Drop & Real-Time Sync:** Memindahkan kartu antar-kolom secara instan[cite: 1]. Pengguna lain di Board yang sama langsung melihat pergerakan kartu tanpa perlu _refresh_ (F5)[cite: 1].
4. **Undangan Anggota:** Pemilik Workspace mengundang anggota baru melalui _Magic Link_ dengan role tertentu[cite: 1].

#### Matriks Perizinan Role (RBAC)

| Tindakan                                | OWNER | EDITOR | VIEWER |
| :-------------------------------------- | :---: | :----: | :----: |
| Hapus Workspace & Kelola Role Anggota   |  ✅   |   ❌   |   ❌   |
| Buat / Hapus / Edit Board               |  ✅   |   ✅   |   ❌   |
| Buat / Hapus / Edit List                |  ✅   |   ✅   |   ❌   |
| Buat / Hapus / Edit / Geser Task        |  ✅   |   ✅   |   ❌   |
| Menulis Komentar pada Task              |  ✅   |   ✅   |   ✅   |
| Melihat Board, List, & Task (Read-Only) |  ✅   |   ✅   |   ✅   |

---

### 3. Tech Stack & Standar Arsitektur

- **Frontend:** Next.js (App Router, React), Tailwind CSS[cite: 1].
- **State Management:** **Zustand** (terpusat, mengelola cache kartu, active board, dan snapshot rollback).
- **Drag-and-Drop:** **`@dnd-kit/core`** & **`@dnd-kit/sortable`**[cite: 1].
- **Backend:** Node.js + Express.js (TypeScript)[cite: 1].
- **Validasi Input:** **Zod** (validasi skema payload di Express sebelum masuk ke Service/Prisma).
- **Database & ORM:** PostgreSQL + Prisma ORM[cite: 1] _(Database Indexing dikerjakan mandiri untuk sarana belajar optimasi query)_.
- **Real-Time Engine:** WebSockets via **Socket.io**[cite: 1].
- **Algoritma Sorting:** Pustaka npm **`fractional-indexing`** dieksekusi di **sisi server Express**[cite: 1].
- **Deployment:** Vercel (Frontend), Render/Railway (Backend & Socket.io), Neon/Supabase DB (PostgreSQL Cloud)[cite: 1].

---

### 4. Diagram Alur Sistem (Flow Diagrams)

#### Diagram 1: Drag-and-Drop, Optimistic UI, & Server-Side Fractional Indexing

```mermaid
sequenceDiagram
    autonumber
    actor UserA as Pengguna A (Next.js)
    participant StoreA as Zustand (Client A)
    participant API as Express Server & Zod
    participant DB as PostgreSQL (Prisma)
    participant Socket as Socket.io Server
    actor UserB as Pengguna B (Next.js / Room)

    UserA->>StoreA: Drag kartu antar-kolom / posisi
    StoreA->>StoreA: Simpan snapshot posisi lama (Rollback state)
    StoreA->>StoreA: Optimistic Update (Render kartu di posisi baru seketika)

    StoreA->>API: PATCH /api/tasks/:id/move { targetListId, prevTaskOrderIndex, nextTaskOrderIndex }

    alt Request Gagal / Network Error
        API-->>StoreA: Response 4xx / 5xx Error
        StoreA->>StoreA: Trigger Rollback! (Kembalikan kartu ke snapshot posisi lama)
        StoreA->>UserA: Tampilkan Toast Notifikasi Gagal
    else Request Berhasil
        API->>API: Hitung newOrderIndex via generateKeyBetween(prev, next)
        API->>DB: prisma.task.update({ where: { id }, data: { listId, orderIndex } })
        DB-->>API: Data Task Updated
        API->>Socket: Emit ke room: socket.to("board:" + boardId).emit("card_moved", payload)
        API-->>StoreA: Response 200 OK { success: true, data: updatedTask }
        Socket-->>UserB: Broadcast event card_moved (Anti-Echo: User A tidak menerima)
        UserB->>UserB: Zustand update posisi kartu di layar Pengguna B seketika
    end
```
````

#### Diagram 2: Skema Autentikasi Dual-Token & Queue Interceptor

```mermaid
sequenceDiagram
    autonumber
    actor Client as Frontend (Next.js)
    participant Interceptor as Axios / Fetch Interceptor
    participant API as Express Auth Endpoint
    participant DB as PostgreSQL (RefreshToken)

    Client->>Interceptor: Request API Data (Contoh: GET /api/boards/:id)
    Interceptor->>API: HTTP Request (Menyertakan Cookie jwt_access)

    alt Token Masih Valid
        API-->>Client: 200 OK (Data Response)
    else Token Expired (401 Unauthorized)
        API-->>Interceptor: 401 Unauthorized
        Note over Interceptor: Tahan request lain yang masuk ke dalam antrean (Queue Lock)
        Interceptor->>API: POST /api/auth/refresh (Cookie jwt_refresh)

        alt Refresh Token Valid di DB
            API->>DB: Validasi token & masa aktif di tabel RefreshToken
            DB-->>API: Token Match
            API-->>Interceptor: Set-Cookie jwt_access (Baru, 15 menit)
            Note over Interceptor: Buka kunci antrean & jalankan ulang request yang tertunda
            Interceptor->>API: Retry GET /api/boards/:id dengan token baru
            API-->>Client: 200 OK (Data Response)
        else Refresh Token Expired / Invalid
            API-->>Interceptor: 403 Forbidden (Session Habis)
            Interceptor->>Client: Redirect ke Halaman /login
        end
    end

```

#### Diagram 3: Alur Undangan Anggota via Magic Link

```mermaid
flowchart TD
    A[Owner klik Buat Undangan] --> B[POST /api/workspaces/:id/invitations]
    B --> C[Server simpan token unik ke WorkspaceInvitation]
    C --> D[Generate URL: /invite?token=UUID]
    D --> E[Tautan dibagikan ke Calon Anggota]

    E --> F{Buka URL Invite}
    F --> G{Sudah Login?}

    G -- Ya --> H[POST /api/workspaces/join { token }]
    G -- Tidak --> I[Simpan token di query URL / Storage]
    I --> J[Redirect ke /register?inviteToken=UUID]
    J --> K[User submit Form Register]
    K --> L[Akun dibuat & otomatis panggil join workspace]

    H --> M{Validasi Token Server}
    L --> M

    M -- Token Expired / Invalid --> N[Tampilkan Error Link Kadaluarsa]
    M -- Token Valid --> O[Tambahkan ke WorkspaceMember]
    O --> P[Hapus / Invalidate Token Undangan]
    P --> Q[Redirect langsung ke Dashboard Workspace]

```

#### Diagram 4: Siklus Koneksi WebSocket & Auto-Recovery Reconnect

```mermaid
sequenceDiagram
    autonumber
    actor Client as Next.js Client
    participant Socket as Socket.io Server
    participant API as REST API Backend

    Client->>Socket: Inisialisasi Handshake (Mengirim Cookie jwt_access)
    Socket->>Socket: Middleware: Verifikasi JWT dari Handshake Header

    alt Handshake Gagal
        Socket-->>Client: Connection Error (Unauthorized)
    else Handshake Sukses
        Socket-->>Client: Connected
        Client->>Socket: Emit join_board { boardId }
        Socket->>Socket: socket.join("board:" + boardId)
        Note over Client,Socket: Klien siap menerima broadcast real-time
    end

    Note over Client,Socket: Skenario: Koneksi Internet Klien Terputus (Drop)
    Socket->>Socket: socket.leave("board:" + boardId)

    Note over Client,Socket: Koneksi Internet Pulih Kembali
    Client->>Socket: Reconnecting... Handshake ulang
    Socket-->>Client: Reconnected
    Client->>Socket: Emit join_board { boardId }
    Client->>API: Silent Refetch: GET /api/boards/:id
    API-->>Client: Kondisi Board Terbaru Server
    Client->>Client: Zustand menimpa state lokal (Data kembali sinkron tanpa refresh F5)

```

---

### 5. Standar Respons API, Error Handling, & Variabel Lingkungan

#### Format Standar JSON Response

- **Sukses:**

```json
{
  "success": true,
  "data": { ... }
}

```

- **Gagal:**

```json
{
  "success": false,
  "message": "Pesan deskriptif error",
  "errors": [ ... ]
}

```

#### Global Error Handler Express

Middleware error terpusat menangani:

- `ZodError` $\rightarrow$ Status HTTP 400 beserta rincian field yang tidak valid.
- Prisma `P2025` (Record not found) $\rightarrow$ Status HTTP 404.
- Prisma `P2002` (Unique constraint failed) $\rightarrow$ Status HTTP 409.
- Exception umum $\rightarrow$ Status HTTP 500 dengan pesan aman (_no stack trace leak_ di production).

#### Daftar Variabel Lingkungan Wajib (`.env`)

- **Backend (`backend/.env`):**
- `PORT=5000`
- `NODE_ENV=development` (atau `production`)
- `DATABASE_URL="postgresql://user:pass@host:port/db?sslmode=require"`
- `JWT_ACCESS_SECRET="string_rahasia_access"`
- `JWT_REFRESH_SECRET="string_rahasia_refresh"`
- `CLIENT_ORIGIN="http://localhost:3000"` (atau domain Vercel production)

- **Frontend (`frontend/.env.local`):**
- `NEXT_PUBLIC_API_URL="http://localhost:5000/api"`
- `NEXT_PUBLIC_SOCKET_URL="http://localhost:5000"`

---

### 6. Skema Autentikasi & Keamanan (Dual-Token via HTTP-Only Cookies)

- **Access Token:** Masa aktif 15 menit, dikirim via cookie `jwt_access`.
- **Refresh Token:** Masa aktif 7 hari, disimpan di tabel `RefreshToken`, dikirim via cookie `jwt_refresh` (`path: "/api/auth/refresh"`).
- **CORS & Cookie Rules (Production Cross-Origin):**
- Express: `cors({ origin: process.env.CLIENT_ORIGIN, credentials: true })`.
- Cookie flags: `httpOnly: true`, `secure: true` (saat production), `sameSite: process.env.NODE_ENV === "production" ? "none" : "lax"`.

- **Socket Handshake Auth:**

```typescript
io.use((socket, next) => {
  const cookieHeader = socket.request.headers.cookie;
  if (!cookieHeader) return next(new Error("Unauthorized"));
  const cookies = parseCookies(cookieHeader);
  const token = cookies.jwt_access;
  if (!token) return next(new Error("Unauthorized"));
  try {
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET!);
    socket.data.user = decoded;
    next();
  } catch (err) {
    next(new Error("Unauthorized"));
  }
});
```

---

### 7. Aturan Fractional Indexing & Optimistic UI

1. **Pembuatan ID Kartu:** Klien membangkitkan UUID langsung via `crypto.randomUUID()` dan mengirimkannya dalam payload `POST /api/lists/:id/tasks`. Server menyimpan UUID tersebut apa adanya.
2. **Kalkulasi Posisi (Server-Side):**

- Saat kartu digeser, Frontend hanya mengirimkan:

```json
{
  "targetListId": "list-uuid",
  "prevTaskOrderIndex": "a0" | null,
  "nextTaskOrderIndex": "a1" | null
}

```

- Server mengeksekusi perhitungan leksikografis:

```typescript
import { generateKeyBetween } from "fractional-indexing";
const newOrderIndex = generateKeyBetween(
  prevTaskOrderIndex,
  nextTaskOrderIndex,
);
```

3. **Database Tie-Breaker:** Semua query Prisma yang mengambil List dan Task **wajib** menyertakan urutan:

```typescript
orderBy: [{ orderIndex: "asc" }, { id: "asc" }];
```

4. **Broadcast Isolation (Anti-Echo):** Server wajib memancarkan perubahan menggunakan `socket.to("board:" + boardId).emit(...)` agar pengirim aksi tidak menerima ulang event buatannya sendiri.
5. **Auto-Recovery on Reconnect:** Jika socket terputus dan terhubung kembali (`socket.on("connect")`), Frontend langsung menjalankan pemanggilan latar belakang `GET /api/boards/:id` untuk menyelaraskan kembali state Zustand.

---

### 8. Kontrak REST API Lengkap

#### Autentikasi (`/api/auth`)

- `POST /api/auth/register` — Body: `{ email, password, name }`

- `POST /api/auth/login` — Body: `{ email, password }`

- `POST /api/auth/refresh` — Membaca cookie `jwt_refresh`, menerbitkan `jwt_access` baru
- `POST /api/auth/logout` — Menghapus session di DB dan membersihkan cookies
- `GET /api/auth/me` — Mengambil data profil user yang sedang login

#### Workspace & Anggota (`/api/workspaces`)

- `POST /api/workspaces` — Body: `{ name }`

- `GET /api/workspaces` — Daftar workspace milik pengguna

- `GET /api/workspaces/:id` — Detail spesifik workspace beserta daftar board

- `PATCH /api/workspaces/:id` — Body: `{ name }` (`OWNER` only)

- `DELETE /api/workspaces/:id` — Cascade delete transaksional (`prisma.$transaction`) (`OWNER` only)

- `POST /api/workspaces/:id/invitations` — Body: `{ email, role }` (`OWNER` only) $\rightarrow$ Menghasilkan `{ inviteUrl }`
- `POST /api/workspaces/join` — Body: `{ token }`
- `DELETE /api/workspaces/:id/members/:userId` — Menghapus anggota (`OWNER` only)

#### Board (`/api/boards`)

- `POST /api/workspaces/:workspaceId/boards` — Body: `{ title }` (`OWNER`, `EDITOR`)

- `GET /api/boards/:id` — Mengambil struktur penuh board (Lists dan Tasks terurut)

- `PATCH /api/boards/:id` — Body: `{ title }` (`OWNER`, `EDITOR`)

- `DELETE /api/boards/:id` — Menghapus board (`OWNER`, `EDITOR`)

#### List (`/api/lists`)

- `POST /api/boards/:boardId/lists` — Body: `{ title, prevListOrderIndex?, nextListOrderIndex? }` (`OWNER`, `EDITOR`)
- `PATCH /api/lists/:id` — Body: `{ title }` (`OWNER`, `EDITOR`)
- `PATCH /api/lists/:id/move` — Body: `{ prevListOrderIndex, nextListOrderIndex }` (`OWNER`, `EDITOR`)
- `DELETE /api/lists/:id` — Menghapus list (`OWNER`, `EDITOR`)

#### Task (`/api/tasks`)

- `POST /api/lists/:listId/tasks` — Body: `{ id: string (UUID), title: string, description?: string, prevTaskOrderIndex?, nextTaskOrderIndex? }` (`OWNER`, `EDITOR`)
- `GET /api/tasks/:id` — Mengambil detail task beserta comments
- `PATCH /api/tasks/:id` — Body: `{ title?, description? }` (`OWNER`, `EDITOR`)
- `PATCH /api/tasks/:id/move` — Body: `{ targetListId: string, prevTaskOrderIndex: string | null, nextTaskOrderIndex: string | null }` (`OWNER`, `EDITOR`)
- `DELETE /api/tasks/:id` — Menghapus task (`OWNER`, `EDITOR`)

#### Comment (`/api/tasks/:taskId/comments`)

- `POST /api/tasks/:taskId/comments` — Body: `{ content: string }` (`OWNER`, `EDITOR`, `VIEWER`)
- `GET /api/tasks/:taskId/comments` — Mengambil komentar pada task

---

### 9. Kontrak Event WebSocket (Socket.io)

- **Join Board:** `join_board` (Client $\rightarrow$ Server) $\rightarrow$ Payload: `{ boardId: string }`
- **Leave Board:** `leave_board` (Client $\rightarrow$ Server) $\rightarrow$ Payload: `{ boardId: string }`
- **Card Moved:** `card_moved` (Server $\rightarrow$ Client Broadcast ke Room)

```json
{
  "taskId": "uuid",
  "sourceListId": "uuid",
  "targetListId": "uuid",
  "newOrderIndex": "a0V"
}
```

- **List Moved:** `list_moved` (Server $\rightarrow$ Client Broadcast ke Room)

```json
{
  "listId": "uuid",
  "boardId": "uuid",
  "newOrderIndex": "a0V"
}
```

- **Comment Added:** `comment_added` (Server $\rightarrow$ Client Broadcast ke Room)

```json
{
  "taskId": "uuid",
  "comment": {
    "id": "uuid",
    "content": "string",
    "createdAt": "ISOString",
    "user": { "name": "Budi" }
  }
}
```

---

### 10. Arsitektur Database (Prisma Schema)

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id              String               @id @default(uuid())
  name            String
  email           String               @unique
  password_hash   String
  refreshTokens   RefreshToken[]
  createdAt       DateTime             @default(now())

  ownedWorkspaces Workspace[]          @relation("WorkspaceOwner")
  memberships     WorkspaceMember[]
  createdTasks    Task[]               @relation("TaskCreator")
  assignedTasks   Task[]               @relation("TaskAssignee") // Ekspansi Fase 6
  comments        Comment[]
  activities      ActivityLog[]        // Ekspansi Fase 6
}

model RefreshToken {
  id        String   @id @default(uuid())
  token     String   @unique
  userId    String
  expiresAt DateTime
  createdAt DateTime @default(now())
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model Workspace {
  id          String                @id @default(uuid())
  name        String
  ownerId     String
  createdAt   DateTime              @default(now())
  owner       User                  @relation("WorkspaceOwner", fields: [ownerId], references: [id])
  members     WorkspaceMember[]
  boards      Board[]
  invitations WorkspaceInvitation[]
}

model WorkspaceMember {
  id          String    @id @default(uuid())
  workspaceId String
  userId      String
  role        Role      @default(VIEWER)
  joinedAt    DateTime  @default(now())
  workspace   Workspace @relation(fields: [workspaceId], references: [id], onDelete: Cascade)
  user        User      @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([workspaceId, userId])
}

model WorkspaceInvitation {
  id          String    @id @default(uuid())
  workspaceId String
  email       String
  token       String    @unique
  role        Role      @default(VIEWER)
  expiresAt   DateTime
  createdAt   DateTime  @default(now())
  workspace   Workspace @relation(fields: [workspaceId], references: [id], onDelete: Cascade)
}

model Board {
  id          String        @id @default(uuid())
  workspaceId String
  title       String
  createdAt   DateTime      @default(now())
  workspace   Workspace     @relation(fields: [workspaceId], references: [id], onDelete: Cascade)
  lists       List[]
  activities  ActivityLog[] // Ekspansi Fase 6
}

model List {
  id         String   @id @default(uuid())
  boardId    String
  title      String
  orderIndex String   // Menampung string fractional-indexing
  createdAt  DateTime @default(now())
  board      Board    @relation(fields: [boardId], references: [id], onDelete: Cascade)
  tasks      Task[]
}

model Task {
  id          String    @id // UUID dibuat oleh Client (Optimistic UI friendly)
  listId      String
  createdById String
  title       String
  description String?
  orderIndex  String    // Menampung string fractional-indexing
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt

  list        List      @relation(fields: [listId], references: [id], onDelete: Cascade)
  creator     User      @relation("TaskCreator", fields: [createdById], references: [id])
  comments    Comment[]

  // Field Ekspansi (Fase 6)
  dueDate     DateTime?
  priority    Priority  @default(MEDIUM)
  assigneeId  String?
  assignee    User?     @relation("TaskAssignee", fields: [assigneeId], references: [id], onDelete: SetNull)
}

model Comment {
  id        String   @id @default(uuid())
  taskId    String
  userId    String
  content   String
  createdAt DateTime @default(now())
  task      Task     @relation(fields: [taskId], references: [id], onDelete: Cascade)
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model ActivityLog {
  id        String   @id @default(uuid())
  boardId   String
  userId    String
  action    String
  detail    String
  createdAt DateTime @default(now())
  board     Board    @relation(fields: [boardId], references: [id], onDelete: Cascade)
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}

enum Role {
  OWNER
  EDITOR
  VIEWER
}

enum Priority {
  LOW
  MEDIUM
  HIGH
  URGENT
}

```

---

### 11. Roadmap Checkpoint Pengembangan

#### Tahap 1: Core Architecture & MVP (Wajib Selesai & Deploy Dulu)

##### Minggu 1: Fondasi Proyek, Database & Skema Relasional

- [ ] **1.1 — Git & Arsitektur Direktori:** Inisialisasi folder proyek (monorepo atau backend/frontend terpisah).

- [ ] **1.2 — Inisialisasi Backend:** Setup Node.js + Express.js dengan TypeScript, pasang Zod, cookie-parser, dan cors.

- [ ] **1.3 — Database PostgreSQL:** Setup database di platform cloud (Neon / Supabase DB).

- [ ] **1.4 — Prisma Migration:** Terapkan skema database di atas, jalankan `npx prisma migrate dev --name init`.

##### Minggu 2: Autentikasi, Keamanan Cookie & REST API Inti

- [ ] **2.1 — Auth Engine:** Setup `bcrypt` dan pembuatan Access/Refresh token via HTTP-only cookie.

- [ ] **2.2 — RBAC Middleware:** Middleware verifikasi cookie JWT dan otorisasi role (`OWNER`, `EDITOR`, `VIEWER`).

- [ ] **2.3 — Magic Link System:** Endpoint generate token undangan dan mekanisme klaim join workspace.
- [ ] **2.4 — CRUD Workspace & Board:** Endpoint transaksi aman menggunakan `prisma.$transaction`.

##### Minggu 3: Frontend Layout, Zustand Store & Board View

- [ ] **3.1 — Setup Frontend:** Inisialisasi Next.js (App Router) + Tailwind CSS.

- [ ] **3.2 — Auth Integration:** Halaman Login, Register, proteksi rute, dan interceptor refresh token antrean.
- [ ] **3.3 — Zustand Store:** Setup store terpusat untuk cache board data dan optimistic rollback state.

- [ ] **3.4 — Kanban Board Layout:** Komponen UI kolom List dan kartu Task.

##### Minggu 4: Drag-and-Drop, Fractional Indexing & Real-Time Sync

- [ ] **4.1 — Integrasi DnD Kit:** Implementasi `@dnd-kit/core` dan `@dnd-kit/sortable` untuk pemindahan kartu.

- [ ] **4.2 — Fractional Indexing Server:** Integrasi library `fractional-indexing` di Express; Frontend hanya mengirimkan index kartu sebelum dan sesudahnya.

- [ ] **4.3 — Socket.io Handshake Auth:** Middleware autentikasi token saat handshake WebSocket dan pembagian room `board:<id>`.

- [ ] **4.4 — Real-Time Broadcast:** Broadcast event `card_moved` (menggunakan `socket.to(...)`) ke anggota board lain.

##### Minggu 5: Optimistic UI Rollback, Hardening & Deployment

- [ ] **5.1 — Optimistic UI & Auto-Rollback:** Pindahkan kartu instan di layar via Zustand; lakukan rollback jika API merespons error.

- [ ] **5.2 — Auto-Recovery Reconnect:** Trigger silent refetch Board saat socket reconnect.
- [ ] **5.3 — Comment Modal:** Modal detail tugas untuk melihat dan menambah komentar (termasuk akses untuk `VIEWER`).
- [ ] **5.4 — Deployment Production:** Deploy backend ke Render/Railway dan frontend ke Vercel (dengan pengaturan cookie cross-origin).

---

#### Tahap 2: Feature Expansion (Dikerjakan HANYA SETELAH Minggu 5 Sukses Deploy)

##### Minggu 6: Visual Presence & Task Metadata

- [ ] **6.1 — Live User Presence:** Tampilkan avatar pengguna yang aktif di room board via Socket.io (`user_joined`, `user_left`).
- [ ] **6.2 — Task Metadata Panel:** Input tenggat waktu (`dueDate`), pemilihan prioritas (`priority`), dan penugasan tim (`assigneeId`).

##### Minggu 7: Enterprise Audit & Produktivitas

- [ ] **7.1 — Activity Log Panel:** Catat pemindahan dan aksi penting ke tabel `ActivityLog`, tampilkan di sidebar board.
- [ ] **7.2 — Search & Filter:** Filter instan kartu berdasarkan teks, prioritas, atau penugasan anggota di Zustand.

```

```
