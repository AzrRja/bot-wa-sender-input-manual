const {
    default: makeWASocket,
    useMultiFileAuthState,
    fetchLatestBaileysVersion,
    DisconnectReason
} = require("@whiskeysockets/baileys")

const express = require("express")
const senderWeb = require("./manualsender")

const app = express()
app.use(express.json())
app.use(express.static("public"))

let sockGlobal = null
let currentSock = null
let clients = []

// 🔥 STREAM REALTIME
app.get("/stream", (req, res) => {
    res.writeHead(200, {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive"
    })

    res.write("\n")
    clients.push(res)

    req.on("close", () => {
        clients = clients.filter(c => c !== res)
    })
})

function sendProgress(data) {
    clients.forEach(c => {
        c.write(`data: ${JSON.stringify(data)}\n\n`)
    })
}

// 🔥 START BOT
async function startBot() {
    const { state, saveCreds } = await useMultiFileAuthState("session")
    const { version } = await fetchLatestBaileysVersion()

    const sock = makeWASocket({
        auth: state,
        version,
        browser: ["Ubuntu", "Chrome", "120.0.0"]
    })

    currentSock = sock

    sock.ev.on("creds.update", saveCreds)

    sock.ev.on("connection.update", (update) => {
        const { connection, lastDisconnect } = update

        if (connection === "open") {
            console.log("✅ WA CONNECTED")
            sockGlobal = sock
        }

        if (connection === "close") {
            const reason = lastDisconnect?.error?.output?.statusCode
            console.log("❌ DISCONNECT:", reason)

            if (reason !== DisconnectReason.loggedOut) {
                setTimeout(startBot, 5000)
            }
        }
    })
}

startBot()

// 🔥 PAIRING VIA WEB
app.post("/pairing", async (req, res) => {
    try {
        const { nomor } = req.body

        const code = await currentSock.requestPairingCode(nomor)

        res.json({ status: true, code })

    } catch (err) {
        res.json({ status: false, msg: err.message })
    }
})

// 🔥 KIRIM PESAN
app.post("/kirim", async (req, res) => {
    const { nomorList, sekolahList } = req.body

    if (!sockGlobal) {
        return res.json({ status: false, msg: "WA belum connect" })
    }

    senderWeb(sockGlobal, nomorList, sekolahList, sendProgress)

    res.json({ status: true })
})

app.listen(3000, () => {
    console.log("🌐 http://localhost:3000")
})