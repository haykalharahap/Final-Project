# 🍽️ Singgah Kita — Food Ordering App

Aplikasi pemesanan makanan online berbasis web yang dibangun dengan **React**, **Vite**, dan **TailwindCSS**. Terhubung langsung ke Food API untuk mengelola data makanan, pengguna, keranjang belanja, dan transaksi secara real-time.

## ✨ Fitur

### 👤 Pengguna
- **Register & Login** — Daftar akun baru dan masuk dengan autentikasi JWT
- **Profil** — Lihat dan kelola informasi profil
- **Riwayat Pesanan** — Lihat semua transaksi yang pernah dibuat

### 🍔 Menu Makanan
- **Daftar Menu** — Jelajahi semua makanan yang tersedia
- **Pencarian** — Cari makanan berdasarkan nama atau deskripsi
- **Detail Makanan** — Lihat detail lengkap, bahan, harga, dan ulasan
- **Like/Unlike** — Tandai makanan favorit
- **Rating & Review** — Beri rating dan ulasan untuk makanan

### 🛒 Keranjang & Checkout
- **Tambah ke Keranjang** — Tambah makanan ke keranjang belanja
- **Atur Jumlah** — Ubah jumlah item di keranjang
- **Checkout** — Pilih metode pembayaran dan buat transaksi

### 🔧 Admin Panel
- **Dashboard** — Statistik pendapatan, jumlah pesanan, pengguna, dan makanan
- **Kelola Makanan** — Tambah, edit, dan hapus menu makanan (CRUD)
- **Kelola Pesanan** — Lihat semua transaksi dan ubah status pesanan
- **Kelola Pengguna** — Lihat daftar pengguna dan ubah role (admin/user)

## 🛠️ Teknologi

| Teknologi | Keterangan |
|-----------|------------|
| React 18 | Library UI |
| Vite | Build tool & dev server |
| TailwindCSS 4 | Styling |
| React Router 7 | Routing & navigasi |
| Sonner | Toast notifications |
| Lucide React | Ikon |
| Motion | Animasi |
| Radix UI | Komponen UI (Dialog, Table, Badge, dll) |

## 📦 Prasyarat

Pastikan sudah terinstall:
- **Node.js** versi 18 atau lebih baru
- **npm** (biasanya sudah terinstall bersama Node.js)

## 🚀 Cara Menjalankan

### 1. Clone Repository

```bash
git clone <url-repository>
cd Final-Project
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Jalankan Development Server

```bash
npm run dev
```

Aplikasi akan berjalan di **http://localhost:5173**

### 4. Build untuk Production

```bash
npm run build
```

Hasil build akan tersimpan di folder `dist/`.

## 🔑 Konfigurasi API

Aplikasi ini terhubung ke API berikut:

- **Base URL**: `https://api-bootcamp.do.dibimbing.id`
- **API Key**: `w05KkI9AWhKxzvPFtXotUva-`

Konfigurasi dapat diubah di file `src/app/services/api.ts`.

## 📁 Struktur Folder

```
src/
├── main.tsx                    # Entry point
├── app/
│   ├── App.tsx                 # Root component
│   ├── routes.ts               # Konfigurasi routing
│   ├── utils.ts                # Utility functions
│   ├── services/
│   │   └── api.ts              # API service layer
│   ├── context/
│   │   ├── AuthContext.tsx      # Autentikasi state
│   │   └── CartContext.tsx      # Keranjang belanja state
│   ├── components/
│   │   ├── Navbar.tsx           # Navigasi
│   │   ├── Footer.tsx           # Footer
│   │   ├── FoodCard.tsx         # Kartu makanan
│   │   └── ui/                  # Komponen UI reusable
│   ├── layouts/
│   │   ├── MainLayout.tsx       # Layout utama
│   │   └── AdminLayout.tsx      # Layout admin
│   └── pages/
│       ├── HomePage.tsx         # Halaman utama
│       ├── MenuPage.tsx         # Halaman menu
│       ├── FoodDetailPage.tsx   # Detail makanan
│       ├── CartPage.tsx         # Keranjang belanja
│       ├── LoginPage.tsx        # Halaman login
│       ├── RegisterPage.tsx     # Halaman registrasi
│       ├── ProfilePage.tsx      # Halaman profil
│       └── admin/
│           ├── AdminDashboard.tsx   # Dashboard admin
│           ├── FoodManagement.tsx   # Kelola makanan
│           ├── OrderManagement.tsx  # Kelola pesanan
│           └── UserManagement.tsx   # Kelola pengguna
└── styles/                     # File CSS
```

## 👥 Akun Demo

| Role | Email | Password |
|------|-------|----------|
| Admin | haykalharahap@gmail.com | qwerty123 |

Atau buat akun baru melalui halaman **Register** (`/register`).

## 🎉 Promo & Diskon

Dapatkan **diskon 20%** untuk pesanan pertama kamu!

1. Buka halaman utama (`/`)
2. Scroll ke bawah ke bagian **"Get 20% Discount On First Order"**
3. Masukkan **email** kamu dan klik **Subscribe**
4. Kamu akan mendapatkan kode promo: **`SINGGAH20`**

> **Catatan:** Fitur subscribe menggunakan localStorage untuk menyimpan status langganan pengguna.

## 📝 API Endpoints

Aplikasi ini menggunakan endpoint berikut:

| Fitur | Method | Endpoint |
|-------|--------|----------|
| Register | POST | `/api/v1/register` |
| Login | POST | `/api/v1/login` |
| Logout | GET | `/api/v1/logout` |
| Get User | GET | `/api/v1/user` |
| All Users | GET | `/api/v1/all-user` |
| Get Foods | GET | `/api/v1/foods` |
| Food by ID | GET | `/api/v1/foods/:id` |
| Create Food | POST | `/api/v1/create-food` |
| Update Food | POST | `/api/v1/update-food/:id` |
| Delete Food | DELETE | `/api/v1/delete-food/:id` |
| Like Food | POST | `/api/v1/like` |
| Unlike Food | POST | `/api/v1/unlike` |
| Liked Foods | GET | `/api/v1/like-foods` |
| Rate Food | POST | `/api/v1/rate-food/:id` |
| Food Rating | GET | `/api/v1/food-rating/:id` |
| Add Cart | POST | `/api/v1/add-cart` |
| Update Cart | POST | `/api/v1/update-cart/:id` |
| Delete Cart | DELETE | `/api/v1/delete-cart/:id` |
| Get Carts | GET | `/api/v1/carts` |
| Create Transaction | POST | `/api/v1/create-transaction` |
| My Transactions | GET | `/api/v1/my-transactions` |
| All Transactions | GET | `/api/v1/all-transactions` |
| Payment Methods | GET | `/api/v1/payment-methods` |
| Upload Image | POST | `/api/v1/upload-image` |
