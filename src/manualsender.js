const fs = require("fs")
const path = require("path")
const { delay } = require("@whiskeysockets/baileys")

// 🔥 fungsi delay random
function randomDelay(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min
}

module.exports = async function (sock, nomorList, sekolahList, sendProgress) {
    const filePath = path.join(__dirname, "../media/flyer.jpeg")

    for (let i = 0; i < nomorList.length; i++) {
        let nomor = nomorList[i].replace(/\D/g, "")
        const sekolah = sekolahList[i]

        if (!nomor.startsWith("62")) {
            sendProgress({
                index: i + 1,
                total: nomorList.length,
                sekolah,
                status: "format salah"
            })
            continue
        }

        const jid = nomor + "@s.whatsapp.net"

        // 🔥 VALIDASI NOMOR WA
        const [cek] = await sock.onWhatsApp(jid)

        if (!cek?.exists) {
            sendProgress({
                index: i + 1,
                total: nomorList.length,
                sekolah,
                status: "tidak terdaftar"
            })
            continue
        }

        const pesan = `Assalamu’alaikum Wr. Wb.

Yth. *Bapak/Ibu Pimpinan* Pihak Sekolah
*${sekolah}*

Perkenalkan, kami dari *UKMI - Ar-Rahman* Selaku Pentas Islami 19 ingin mengundang siswa/i dari *${sekolah}* untuk berpartisipasi dalam kegiatan Pentas Islami 19 yang akan diselenggarakan pada:

📅 Hari/Tanggal : Rabu, 13 Mei 2026
📍 Tempat : Universitas Teknokrat Indonesia
🎯 Peserta : Siswa/i SMA/SMK/Sederajat tingkat Nasional

Adapun cabang lomba yang dapat diikuti antara lain:
🎤 Da’i & Da’iyah
📖 Tahfidz Juz 30
📢 Adzan
📝 Cerpen Islami
🎨 Kaligrafi Kontemporer
📖 Qori & Qori’ah
🎭 Cipta & Baca Puisi Islami
🧠 Lomba Cepat Tepat Islami (Tim)
🎶 Nasyid (Tim)
🥁 Hadroh (Tim)
🖌️ Desain Poster Islami
🎥 Konten Video Islami (Tim)

Kegiatan ini bertujuan untuk mengembangkan bakat, kreativitas, serta memperkuat nilai-nilai keislaman di kalangan generasi muda.
Kami sangat berharap partisipasi dari siswa/i terbaik sekolah Bapak/Ibu untuk turut serta memeriahkan acara ini.

Untuk informasi lebih lanjut dan pendaftaran, dapat menghubungi Contact Person di bawah ini:
1. *Dimas Savyar* 087864100447 (Ikhwan)
2. *Sufi Annisa* 085381470002 (Akhwat)
3. *Angga Bayu Santoso, M.Kom* 082177021122 (Umum)

📲 Link Pendaftaran: s.id/PentasIslami19
📝Link Panduan: s.id/Panduan_PI19

Wassalamu’alaikum Wr. Wb.

Hormat kami,
*Panitia Pentas Islami 19*`

        try {
            await sock.sendMessage(jid, {
                image: fs.readFileSync(filePath),
                caption: pesan
            })

            sendProgress({
                index: i + 1,
                total: nomorList.length,
                sekolah,
                status: "berhasil"
            })

        } catch (err) {
            sendProgress({
                index: i + 1,
                total: nomorList.length,
                sekolah,
                status: "gagal"
            })
        }

        // 🔥 DELAY RANDOM (10–25 detik)
        const jeda = randomDelay(10000, 25000)
        console.log(`⏳ Delay ${jeda / 1000} detik...`)
        await delay(jeda)

        // 🔥 ISTIRAHAT SETIAP 5 NOMOR
        if ((i + 1) % 5 === 0) {
            console.log("☕ Istirahat 1 menit...")
            await delay(60000)
        }
    }
}