const { makeFrame } = require('./frame')
const { injectCSS } = require('./Util')

async function insertFrame() {
    const frame = await makeFrame()
    injectCSS(__dirname, 'style.css')
    document.body.appendChild(frame)
}

module.exports = { insertFrame }