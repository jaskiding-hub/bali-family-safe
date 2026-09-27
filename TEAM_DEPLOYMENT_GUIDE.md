# 🚀 DEPLOYMENT GUIDE UNTUK TIM - 27 September 2026

## ⚠️ PENTING: Baca Sebelum Pull!

Perubahan besar di `vehicle_units` table. Ikuti steps ini **WAJIB** agar database ga error.

---

## 📋 Summary Perubahan

### Backend Changes:
- ✅ `vehicle_units` table restructure: hapus `plate_number`, `status`, `deleted_at`
- ✅ `vehicle_units.category` sekarang VARCHAR (bukan ENUM)
- ✅ Auto-assign vehicle_unit di booking
- ✅ Capacity validation realtime
- ✅ Driver app tampil category, bukan merk
- ✅ User homepage dropdown 3 kategori

### Frontend Changes:
- ✅ BookingManagement.jsx: Auto-parse manual, capacity warning
- ✅ Home.jsx: 3 kategori dropdown
- ✅ AdminLayout.jsx: Hapus logo box sidebar
- ✅ MasterData.jsx: Unit kendaraan jadi kategori

---

## 🔧 STEP-BY-STEP UNTUK TIM

### 1️⃣ **Backup Database Dulu** (WAJIB!)

```bash
# Export database sebelum pull
mysqldump -u root -p db_balifamilysafetours > backup_before_pull_$(date +%Y%m%d).sql
```

### 2️⃣ **Pull dari GitHub**

```bash
git pull origin develop
```

### 3️⃣ **Install Dependencies (kalau ada update)**

```bash
composer install
npm install
```

### 4️⃣ **Jalankan Migration**

```bash
php artisan migrate
```

**Expected Output**:
```
2026_09_27_073700_restructure_vehicle_units_to_categories ............ DONE
2026_09_27_084200_change_vehicle_units_category_to_varchar ........... DONE
```

⚠️ **Kalau migration sudah pernah jalan** (status: `Nothing to migrate`), skip step ini.

### 5️⃣ **Truncate & Seed Vehicle Units**

⚠️ **PENTING**: Data lama `vehicle_units` (unit fisik dengan plat nomor) akan dihapus!

```bash
# Masuk ke tinker
php artisan tinker
```

Di dalam tinker:
```php
// Disable foreign key checks, truncate, enable lagi
DB::statement('SET FOREIGN_KEY_CHECKS=0;');
DB::table('vehicle_units')->truncate();
DB::statement('SET FOREIGN_KEY_CHECKS=1;');
exit
```

Setelah truncate, seed 3 kategori:
```bash
php artisan db:seed --class=VehicleUnitCategorySeeder
```

**Expected Output**:
```
Database seeding completed successfully.
```

Check hasil:
```bash
php artisan tinker
```
```php
DB::table('vehicle_units')->get();
// Harus return 3 rows: Regular Family SUV, Luxury Touring Van, Family Minibus
exit
```

### 6️⃣ **Build Frontend**

```bash
npm run build
```

⏳ Tunggu 10-30 detik sampai selesai.

### 7️⃣ **Clear Cache**

```bash
php artisan cache:clear
php artisan config:clear
php artisan route:clear
php artisan view:clear
```

### 8️⃣ **Test**

```bash
php artisan serve
```

Buka browser:
- **Admin**: http://127.0.0.1:8000/admin/bookings
- **User**: http://127.0.0.1:8000

---

## ✅ Testing Checklist

### Admin Panel:
- [ ] Login admin berhasil
- [ ] Add Booking → textarea Auto-Parse tinggi, ga ada badge "AI Assistant"
- [ ] Add Booking → Paste template booking → Generate → form auto-fill
- [ ] Add Booking → Pilih Luxury, adults 6, children 3 → warning merah + button disabled
- [ ] Assign Driver → unit kendaraan auto-select, tampil "Luxury Touring Van" (bukan "Toyota Alphard")
- [ ] Master Data → Tab "Unit Kendaraan" tampil 3 kategori (bukan unit fisik)
- [ ] Sidebar → Ga ada logo box, cuma text "Bali Family Safe"

### User Homepage:
- [ ] Dropdown "Vehicle Model Preference" → cuma 3 options: Regular Family SUV, Luxury Touring Van, Family Minibus

### Driver App:
- [ ] Trip Detail → Vehicle tampil "Luxury Touring Van" (bukan "Toyota Alphard")

---

## 🚨 Troubleshooting

### Error: "SQLSTATE[42S22]: Column not found: 'plate_number'"
**Solusi**: Migration belum jalan. Run:
```bash
php artisan migrate
```

### Error: "SQLSTATE[23000]: Cannot truncate a table referenced in a foreign key"
**Solusi**: Disable foreign key checks dulu:
```bash
php artisan tinker
DB::statement('SET FOREIGN_KEY_CHECKS=0;');
DB::table('vehicle_units')->truncate();
DB::statement('SET FOREIGN_KEY_CHECKS=1;');
exit
```

### Error: "Class 'VehicleUnitStatus' not found"
**Solusi**: Enum udah dihapus. Clear cache:
```bash
composer dump-autoload
php artisan cache:clear
```

### Frontend ga update (masih tampil logo box / dropdown merk mobil)
**Solusi**: Build ulang frontend:
```bash
npm run build
# Kalau masih ga mau, hard refresh browser: Ctrl+Shift+R
```

### Migration sudah jalan tapi table masih punya `plate_number`
**Solusi**: Migration ga jalan sempurna. Rollback manual:
```sql
-- Di MySQL client
ALTER TABLE vehicle_units DROP COLUMN plate_number;
ALTER TABLE vehicle_units DROP COLUMN status;
ALTER TABLE vehicle_units DROP COLUMN deleted_at;
ALTER TABLE vehicle_units ADD UNIQUE(category);
```

---

## 📂 Files Modified (untuk review)

### Backend (PHP):
- `app/Http/Controllers/Admin/BookingController.php`
- `app/Http/Controllers/DriverController.php`
- `app/Http/Controllers/Public/HomeController.php`
- `app/Models/VehicleUnit.php`
- `app/Models/Booking.php`
- `database/migrations/2026_09_27_073700_restructure_vehicle_units_to_categories.php` ⭐ NEW
- `database/migrations/2026_09_27_084200_change_vehicle_units_category_to_varchar.php` ⭐ NEW
- `database/seeders/VehicleUnitCategorySeeder.php` ⭐ NEW

### Frontend (JSX):
- `resources/js/Pages/Admin/BookingManagement.jsx`
- `resources/js/Pages/Admin/MasterData.jsx`
- `resources/js/Pages/User/Home.jsx`
- `resources/js/Layouts/AdminLayout.jsx`

### Deleted:
- `app/Enums/VehicleUnitStatus.php` ❌ DELETED

---

## 💾 Rollback Plan (kalau perlu balik ke versi lama)

```bash
# 1. Restore database backup
mysql -u root -p db_balifamilysafetours < backup_before_pull_YYYYMMDD.sql

# 2. Checkout ke commit sebelum perubahan
git log --oneline | head -10  # cari commit sebelum restructure
git checkout <commit_hash>

# 3. Build frontend lama
npm run build
```

---

## 👥 Contact

Kalau ada error yang ga bisa diselesaikan:
- **WhatsApp Team Lead**: Bagas
- **Screenshot error** + kirim ke group

---

**Last Updated**: 27 September 2026, 10:07 UTC  
**Status**: ✅ Production Ready (setelah testing)
