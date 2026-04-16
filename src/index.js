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
let clients = []

// ✅ STREAM (ANTI CRASH)
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

async function startBot() {
    const { state, saveCreds } = await useMultiFileAuthState("session")
    const { version } = await fetchLatestBaileysVersion()

    const sock = makeWASocket({
        auth: state,
        version,
        browser: ["Windows", "Chrome", "120.0.0"]
    })

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

app.post("/kirim", async (req, res) => {
    try {
        const { nomorList, sekolahList } = req.body

        if (!sockGlobal) {
            return res.json({ status: false, msg: "WA belum connect" })
        }

        senderWeb(sockGlobal, nomorList, sekolahList, sendProgress)

        res.json({ status: true })

    } catch (err) {
        res.json({ status: false, msg: err.message })
    }
})

app.listen(3000, () => {
    console.log("🌐 http://localhost:3000")
})