# Panduan Deploy ke Railway

## Langkah-langkah Deployment:

### 1. Persiapan Repository
- Pastikan semua file sudah ter-commit ke Git repository
- Push semua perubahan ke GitHub/GitLab

### 2. Setup Railway Project
1. Login ke [Railway.app](https://railway.app)
2. Klik "New Project" 
3. Pilih "Deploy from GitHub repo"
4. Pilih repository aplikasi Anda

### 3. Environment Variables di Railway
Tambahkan environment variables berikut di Railway dashboard:

```
MONGODB_URI=mongodb+srv://pioo:Avionika27@cluster0.feboa.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
DB_NAME=tugas_app
NODE_ENV=production
```

### 4. Build Settings
Railway akan otomatis menggunakan Dockerfile yang sudah disediakan.

## File-file yang sudah disiapkan:
- ✅ `Dockerfile` - Menggunakan Node.js 20 (kompatibel dengan Vite 7+)
- ✅ `railway.json` - Konfigurasi Railway
- ✅ `vite.config.js` - Fixed ES modules compatibility 
- ✅ `.env.railway` - Template environment variables
- ✅ Server sudah dikonfigurasi untuk production
- ✅ Build process telah ditest dan berjalan sukses

## Troubleshooting:
- Pastikan MONGODB_URI sudah benar di environment variables Railway
- Check logs Railway jika ada error saat deployment
- Port akan otomatis di-assign oleh Railway (tidak perlu diubah)