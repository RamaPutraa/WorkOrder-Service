---
title: Proses Work Order (auto) - Permintaan Pegawai
description: Proses ini merupakan proses bisnis dari pengguna dengan role `Pegawai Perusahaan` untuk melakukan permintaan layanan internal perusahaan.
order: 1
---

## Proses Permintaan Layanan
Proses permintaan layanan adalah proses yang terjadi ketika seorang pegawai melakukan permintaan sebuah layanan internal.

### Pegawai Perusahaan
Langkah awal login sebagai pegawai perusahaan yang sudah terdaftar. 

#### Mobile
```ui:alert
variant: info
title: Penting
message: Pastikan layanan yang di-request berbeda dengan departemen akun pegawai yang anda gunakan untuk login
```
1. Pilih menu "Permintaan Layanan"
2. Klik tombol "Buat Permintaan Layanan"
3. Pilih salah satu layanan yang disediakan oleh departemen berbeda 
4. Isi formulir
5. Klik tombol "Kirim"

#### Website 
```ui:alert
variant: info
title: Penting
message: Pastikan layanan yang di-request berbeda dengan departemen akun pegawai yang anda gunakan untuk login
```
1. Pilih menu dropdown "Layanan Perusahaan", lalu pilih menu "Daftar Layanan"
2. Pilih salah satu layanan yang disediakan oleh departemen berbeda 
3. Isi formulir
4. Klik tombol "Pesan Layanan"

## Proses Pengerjaan Permintaan Layanan oleh Pegawai
Proses ini akan dilakukan oleh pegawai yang ditugaskan secara otomatis oleh sistem untuk mengerjakan permintaan layanan tersebut.

### Login pegawai (pegawai dengan departemen yang bersangkutan)
Login menggunakan akun pegawai yang sudah didaftarkan

#### Mobile
1. Pilih menu "Perintah Kerja"
2. Pilih perintah kerja yang masuk
3. Klik tombol "Mulai" pada bagian bawah kanan
4. Klik "Laporan Kerja"
5. Pilih "Perbarui Laporan Kerja", untuk mengisi formulir laporan kerja
6. Isi formulir laporan kerja, lalu klik tombol "Simpan"
7. Apabila laporan sudah benar, klik tombol "Final" pada bagian bawah kanan

#### Website
1. Pilih menu "Daftar Tugas Kerja" pada sidebar
2. Pilih tugas kerja yang sudah ditugaskan tadi
3. Klik tombol "Mulai Perintah Kerja" pada bagian atas kanan
4. Klik tombol "Lihat Detail Laporan" pada bagian halaman detail perintah kerja
5. Isi formulir laporan perintah kerja, lalu klik tombol "Simpan"
6. Apabila laporan sudah benar, klik tombol "Finalisasi Laporan" pada bagian atas kanan

```ui:alert
variant: info
title: Proses menyetujui laporan perintah kerja (akan dilewati)
message: Proses ini akan dilewati (tidak perlu), karena konfigurasi layanan adalah otomatis. Artinya laporan perintah kerja ini akan otomatis disetujui oleh pihak perusahaan.
```

```ui:alert
variant: info
title: Proses menyelesaikan perintah kerja (akan dilewati)
message: Proses ini akan dilewati (tidak perlu), karena konfigurasi layanan adalah otomatis. Artinya perintah kerja ini akan otomatis dinyatakan selesai
```

## Proses review permintaan layanan
Proses review permintaan layanan adalah proses yang terjadi ketika seorang pegawai (requester) mereview permintaan layanan yang sudah selesai dikerjakan oleh pegawai yang ditugaskan

### Pegawai (Requester)
Login sebagai pegawai, untuk mereview permintaan layanan

#### Mobile
1. Pilih menu "Permintaan Layanan Saya"
2. Pilih permintaan layanan yang sudah selesai dikerjakan
3. Klik tombol "Isi Ulasan" pada pojok kanan bawah
4. Isi formulir ulasan, lalu klik tombol "Kirim"

#### Website
1. Pilih menu "Riwayat Permintaan" pada sidebar
2. Pilih permintaan layanan yang bersangkutan, lalu scroll kebawah
3. Isi formulir review yang tersedia pada detail permintaan layanan
4. Klik tombol "Kirim Ulasan" pada bagian bawah kanan