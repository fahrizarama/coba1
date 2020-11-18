const { create, Client } = require('@open-wa/wa-automate')
const figlet = require('figlet')
const options = require('./utils/options')
const { color, messageLog } = require('./utils')
const HandleMsg = require('./HandleMsg')

const start = (pakforlay = new Client()) => {
    console.log(color(figlet.textSync('----------------', { horizontalLayout: 'default' })))
    console.log(color(figlet.textSync('Mr.Peanut BOT', { font: 'Ghost', horizontalLayout: 'default' })))
    console.log(color(figlet.textSync('----------------', { horizontalLayout: 'default' })))
    console.log(color('[DEV]'), color('Mr.Peanut', 'yellow'))
    console.log(color('[~>>]'), color('BOT Started!', 'green'))

    // Mempertahankan sesi agar tetap nyala
    pakforlay.onStateChanged((state) => {
        console.log(color('[~>>]', 'red'), state)
        if (state === 'CONFLICT' || state === 'UNLAUNCHED') pakforlay.forceRefocus()
    })

    // ketika seseorang mengirim pesan
    pakforlay.onMessage(async (message) => {
        pakforlay.getAmountOfLoadedMessages() // menghapus pesan cache jika sudah 3000 pesan.
            .then((msg) => {
                if (msg >= 3000) {
                    console.log('[Mr.Peanut]', color(`Loaded Message Reach ${msg}, cuting message cache...`, 'yellow'))
                    pakforlay.cutMsgCache()
                }
            })
        HandleMsg(pakforlay, message)

    })

    // Message log for analytic
    pakforlay.onAnyMessage((anal) => {
        messageLog(anal.fromMe, anal.type)
    })
}

//create session
create(options(true, start))
    .then((pakforlay) => start(pakforlay))
    .catch((err) => new Error(err))
