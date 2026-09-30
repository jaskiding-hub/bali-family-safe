# ⚠️ MIGRATION REQUIRED - CRITICAL

## Database Migration Pending

Sebelum aplikasi bisa berjalan normal, **WAJIB** jalankan migration ini:

```bash
php artisan migrate
```

## What This Migration Does

Migration `2026_09_30_055644_update_team_members_add_role_remove_driver_id.php` akan:

1. ✅ Menambah kolom `role` (string, default 'Staff') ke table `team_members`
2. ✅ Menghapus foreign key constraint `driver_id`
3. ✅ Menghapus kolom `driver_id` dari table `team_members`

## Why This is Critical

Tanpa migration ini, aplikasi akan mengalami:
- ❌ Homepage error (500)
- ❌ Our Team page error (500)
- ❌ CMS Admin Website Content error (500)
- ❌ Query `TeamMember::with('driver')` akan fail karena relation sudah tidak ada

## Rollback (If Needed)

Jika perlu rollback:

```bash
php artisan migrate:rollback --step=1
```

Ini akan:
- Menghapus kolom `role`
- Mengembalikan kolom `driver_id` dengan foreign key

## Verification

Setelah migration, verify dengan:

```bash
php artisan tinker
>>> \App\Models\TeamMember::first()
>>> # Harus ada kolom 'role', tidak ada 'driver_id'
```

## Code Changes Already Applied

✅ All controllers sudah diupdate untuk tidak pakai `driver` relation:
- `HomeController.php` - removed `with('driver')` and `driver_id` mapping
- `WebsiteContentController.php` - removed `with('driver')` and drivers query
- `OurTeamController.php` - already using `role` field

✅ Model `TeamMember.php` sudah diupdate:
- Removed `driver()` relationship
- Added `role` to fillable
- Removed `driver_id` from fillable

✅ Frontend components sudah siap pakai field `role`.

---

**Status:** Safe to run migration - All code already migrated to new structure.
