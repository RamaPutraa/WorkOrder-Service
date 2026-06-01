---
title : Work Order - Memberships (manual)
description: Proses bisnis work order dengan konfigurasi manual untuk anggota memberships
order: 
---

## Perbarui konfigurasi layanan
Perbarui konfigurasi layanan dengan tipe layanan manual (publik). Menjadi tipe layanan manual (memberships)

### Manager Perusahaan
Login sebagai manager perusahaan.

#### Mobile 
1. Pilih menu "Layanan" pada Menu Konfigurasi Perusahaan
2. Pilih layanan yang akan diubah
3. Tekan tombol dengan Icon "Pencil" pada pojok kanan atas
4. Pada tab "Konfigurasi", cari Tipe Akses lalu ubah konfigurasi dari "Publik" menjadi "Hanya Langganan"
5. Lalu tekan tombol "Selanjutnya" pada pojok kanan bawah hingga tab terakhir
6. Tekan tombol "Simpan" pada pojok kanan bawah

#### Website
1. Pilih menu dropdown "Tugas Kerja" pada sidebar, lalu pilih menu "Kelola Layanan"
2. Pilih layanan yang akan diubah
3. Tekan tombol "Edit Layanan" pada bagian atas kanan
4. Pada tab "Informasi Layanan", cari Tipe Akes lalu ubah konfigurasi dari "Publik" menjadi "Khusus Langganan"
5. Lalu tekan tombol "Simpan Perubahan" pada pojok kanan atas

## Proses menghubungkan akun kustomer (pairing) pada sistem Manajemen Work Order
Proses ini bertujuan untuk mengintegrasikan akun pelanggan tetap perusahaan ke dalam sistem Manajemen Work Order. Integrasi ini berfungsi untuk memvalidasi status kepesertaan, sehingga pelanggan dengan status langganan aktif berhak mengakses berbagai layanan eksklusif.

### Kustomer
Login sebagai kustomer yang sudah anda daftarkan tadi

#### Mobile
```
ui:tabs
defaultValue: pairing_account
tabs:
  - label: Hubungkan Akun
    value: pairing_account
    content: 
    #### Proses menghubungkan akun kustomer (pairing) pada sistem Manajemen Work Order
    Proses ini bertujuan untuk mengintegrasikan akun pelanggan tetap perusahaan ke dalam sistem Manajemen Work Order. Integrasi ini berfungsi untuk memvalidasi status kepesertaan, sehingga pelanggan dengan status langganan aktif berhak mengakses berbagai layanan eksklusif.
---
    1. Pilih menu "Ajukan Permintaan Layanan"
    2. Pilih perusahaan
    3. Tekan tombol "Hubungkan Akun"
    4. Masukan Email dan Password pada sistem pihak external
    5. Lalu tekan tombol "Authorize & Connect"
    6. Lalu cek status keanggotaan

  - label: Klaim Voucher
    value: claim_voucher
    content:
    #### Proses klaim voucer
    Proses ini merupakan alternatif bagi perusahaan yang tidak memiliki sistem perusahaannya sendiri. Maka perusahaan tersebut dapat menggunakan fitur klaim voucer untuk memvalidasi status pelanggan yang berlangganan.
---
    1. Pilih menu "Daftar Perusahaan" pada sidebar
    2. Pilih perusahaan
    3. Tekan tombol "Klaim Voucer"
    4. Masukan kode voucer
    5. Tekan tombol "Klaim Sekarang"
    6. Cek status keanggotaan
```
#### Website
```
ui:tabs
defaultValue: pairing_account
tabs:
  - label: Hubungkan Akun
    value: pairing_account
    content: 
    #### Proses menghubungkan akun kustomer (pairing) pada sistem Manajemen Work Order
    Proses ini bertujuan untuk mengintegrasikan akun pelanggan tetap perusahaan ke dalam sistem Manajemen Work Order. Integrasi ini berfungsi untuk memvalidasi status kepesertaan, sehingga pelanggan dengan status langganan aktif berhak mengakses berbagai layanan eksklusif.
---
    1. Pilih menu "Daftar Perusahaan" pada sidebar
    2. Pilih perusahaan
    3. Tekan tombol "Hubungkan Akun"
    4. Masukan Email dan Password pada sistem pihak external
    5. Lalu tekan tombol "Authorize & Connect"
    6. Lalu cek status keanggotaan

  - label: Klaim Voucher
    value: claim_voucher
    content:
    #### Proses klaim voucer
    Proses ini merupakan alternatif bagi perusahaan yang tidak memiliki sistem perusahaannya sendiri. Maka perusahaan tersebut dapat menggunakan fitur klaim voucer untuk memvalidasi status pelanggan yang berlangganan.
---
    1. Pilih menu "Daftar Perusahaan" pada sidebar
    2. Pilih perusahaan
    3. Tekan tombol "Klaim Voucer"
    4. Masukan kode voucer
    5. Tekan tombol "Klaim Sekarang"
    6. Cek status keanggotaan
```
## Repeat Flow Work Order (Otomatis)
```
ui:alert
variant: warning
title: Penting
message: Saat melakukan permintaan layanan pastikan layanan yang diminta merupakan layanan khusus berlangganan, bukan layanan publik.
```

```
ui:alert
variant: info
title: Informasi
message: Repeat Flow Work Order Manual "Proses Permintaan Layanan" > "Proses Mensetujui & menyusun perinta kerja" > "Proses pengerjaan laporan perintah kerja" > "Proses menyetujui laporan perintah kerja" > "Proses selesaikan perintah kerja" > "Proses review permintaan layanan"
```
