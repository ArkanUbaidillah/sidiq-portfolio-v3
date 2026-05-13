# 📘 Panduan Instalasi & Deployment — Sidiq Portfolio

## 1. INSTALASI LOKAL

### Prasyarat

- Node.js v18+ → https://nodejs.org
- Git → https://git-scm.com
- Akun Supabase sudah ada

### Clone & Install

```bash
git clone https://github.com/MSIDIQ472/sidiq-portfolio.git
cd sidiq-portfolio
npm install
npm run dev
```

Buka http://localhost:5173

---

## 2. SETUP SUPABASE

### A. Jalankan SQL Schema

1. Buka https://supabase.com/dashboard
2. Pilih project → **SQL Editor**
3. Copy seluruh isi file `supabase-schema.sql`
4. Klik **Run** → semua tabel + RLS akan terbuat

### B. Buat Storage Bucket untuk Gambar

1. Supabase Dashboard → **Storage** → **New Bucket**
2. Nama: `images`
3. Centang **Public bucket** → Create
4. Pergi ke **SQL Editor**, jalankan:

```sql
CREATE POLICY "images_public_read" ON storage.objects
  FOR SELECT USING (bucket_id = 'images');

CREATE POLICY "images_admin_upload" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'images' AND auth.role() = 'authenticated');

CREATE POLICY "images_admin_delete" ON storage.objects
  FOR DELETE USING (bucket_id = 'images' AND auth.role() = 'authenticated');
```

### C. Buat Admin User

1. Supabase Dashboard → **Authentication** → **Users**
2. Klik **Add user** → masukkan email & password admin
3. User ini digunakan untuk login ke `/sidiq-admin`

---

## 3. GANTI FOTO PROFIL

Edit file `src/components/sections/Hero.jsx`:

- Cari komentar `{/* Placeholder - replace src with actual photo */}`
- Ganti elemen `<div>` placeholder dengan:

```jsx
<img
  src="/sidiq/sidiq.jpeg"
  alt="Muhamad Sidiq"
  className="w-full h-full object-cover"
/>
```

- Letakkan file `foto.jpg` di folder `public/`

---

## 4. SETUP EMAILJS

1. Buka https://emailjs.com → Login
2. **Email Services** → Add Gmail/SMTP → copy Service ID: `service_hxxq1i6`
3. **Email Templates** → buat template dengan variabel:
   - `{{from_name}}`, `{{from_email}}`, `{{message}}`, `{{to_name}}`
   - Template ID: `template_8qpa7qq`
4. **Account** → Public Key: `tlLPvlsrbWp7LMzsq`
5. Semua sudah terkonfigurasi di `src/lib/emailjs.js`

---

## 5. DEPLOY OTOMATIS (GitHub Actions + FTP)

### A. Push ke GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/MSIDIQ472/sidiq-portfolio.git
git push -u origin main
```

### B. Setting GitHub Secrets

1. Buka repo GitHub → **Settings** → **Secrets and variables** → **Actions**
2. Klik **New repository secret** — tambahkan 3 secret berikut:

| Secret Name  | Value                                        |
| ------------ | -------------------------------------------- |
| FTP_SERVER   | `ftp.namadomainmu.com` (dari hosting cPanel) |
| FTP_USERNAME | `username_ftp@namadomainmu.com`              |
| FTP_PASSWORD | password FTP dari cPanel                     |

### C. Dimana dapat FTP credentials?

- Login ke **cPanel** hosting → **FTP Accounts**
- Buat akun FTP baru atau gunakan akun default
- Server biasanya: `ftp.namadomainmu.com` atau IP server

### D. Cara deploy berjalan

1. Setiap `git push origin main` → GitHub Actions otomatis:
   - Install dependencies
   - Build project (`npm run build`)
   - Upload folder `dist/` ke `./sidiq/` di server via FTP
2. Website tersedia di: `https://namadomainmu.com/sidiq/`

### E. Konfigurasi SPA di hosting

Buat file `public/.htaccess` dengan isi:

```apache
Options -MultiViews
RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteRule ^ index.html [QSA,L]
```

File ini otomatis masuk ke `dist/` saat build.

---

## 6. CARA MENGGUNAKAN ADMIN CMS

1. Buka `https://namadomainmu.com/sidiq/sidiq-admin`
2. Login dengan email & password yang dibuat di Supabase Auth
3. **Mata Kuliah** → tambah mata kuliah dulu sebelum membuat laporan
4. **Laporan** → pilih mata kuliah → klik "+ Baru" → susun blok teks/gambar
5. **Proyek** → tambah proyek dengan tech stack, GitHub URL, live URL
6. **Sertifikat** → tambah sertifikat dengan tanggal dan URL kredensial

---

## 7. STRUKTUR FOLDER

```
sidiq-portfolio/
├── .github/
│   └── workflows/
│       └── deploy.yml          ← GitHub Actions CI/CD
├── public/
│   └── favicon.svg
├── src/
│   ├── components/
│   │   ├── admin/
│   │   │   ├── AdminSidebar.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   ├── layout/
│   │   │   ├── Navbar.jsx
│   │   │   └── Footer.jsx
│   │   └── sections/
│   │       ├── Hero.jsx
│   │       ├── About.jsx
│   │       ├── Projects.jsx
│   │       ├── Praktikum.jsx
│   │       ├── Certificates.jsx
│   │       └── Contact.jsx
│   ├── hooks/
│   │   └── useAuth.js
│   ├── lib/
│   │   ├── supabase.js
│   │   └── emailjs.js
│   ├── pages/
│   │   ├── admin/
│   │   │   ├── AdminLayout.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── ManageCourses.jsx
│   │   │   ├── ManageReports.jsx
│   │   │   ├── ManageProjects.jsx
│   │   │   └── ManageCertificates.jsx
│   │   ├── praktikum/
│   │   │   ├── CourseDetail.jsx
│   │   │   └── ReportDetail.jsx
│   │   ├── Home.jsx
│   │   └── AdminLogin.jsx
│   ├── index.css
│   └── main.jsx
├── supabase-schema.sql         ← Jalankan di Supabase SQL Editor
├── index.html
├── vite.config.js
├── tailwind.config.js
├── package.json
└── PANDUAN.md
```
