# 🤖 WhatsApp Sender (Input Manual)

Bot WhatsApp sender sederhana untuk mengirim pesan secara manual menggunakan Node.js. Cocok untuk testing, broadcast ringan, atau kebutuhan personal.

---

## 🚀 Fitur

* Kirim pesan WhatsApp secara manual
* Input nomor & pesan langsung dari terminal
* Menggunakan session (tidak perlu scan QR terus-menerus)
* Ringan dan mudah digunakan

---

## 📦 Instalasi

1. Clone repository:

```bash
git clone https://github.com/AzrRja/bot-wa-sender-input-manual.git
cd bot-wa-sender-input-manual
```

2. Install dependencies:

```bash
npm install
```

---

## ▶️ Cara Menjalankan

Jalankan bot dengan:

```bash
node index.js
```

Saat pertama kali:

* Akan muncul code
* Masukkan code ke tautan whatsapp

Setelah itu:

* Session akan tersimpan 
* Tidak perlu masukkan code ulang

---

## 💬 Cara Penggunaan

1. Masukkan nomor tujuan (contoh: 628xxxxxxx)
2. Masukkan pesan yang ingin dikirim pada manualsender.js
3. Bot akan mengirim pesan ke nomor tersebut

---

## 🔐 Keamanan

**PENTING! Jangan upload file berikut ke GitHub:**

* `.env`
* folder `session/` / `.wwebjs_auth/`
* file berisi token atau auth

Tambahkan ke `.gitignore`:

```bash
node_modules/
.env
session/
.wwebjs_auth/
.wwebjs_cache/
```

---

## ⚠️ Catatan

* Gunakan nomor WhatsApp khusus (jangan nomor pribadi utama)
* Hindari spam berlebihan (bisa kena banned)
* Gunakan delay jika kirim banyak pesan

---

## 🛠️ Teknologi

* Node.js
* whatsapp-web.js / Baileys (tergantung yang kamu pakai)

---

## 👨‍💻 Author

* GitHub: https://github.com/AzrRja

---

## ⭐ Support

Kalau project ini membantu, jangan lupa kasih ⭐ di repo ya!
