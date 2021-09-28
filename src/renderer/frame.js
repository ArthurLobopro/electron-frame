const path = require('path')
const { loadSVG, getIconString } = require('./Util')
const { minimize, expand, close } = require('./renderer-actions')

const assetsFolder = path.resolve(__dirname, "../../", "assets")

async function makeFrame() {
    const windowIconString = await getIconString()

    const header = document.createElement('div')
    const name = document.title

    header.id = "electron-header"
    header.innerHTML = `
    <div class="left">
        ${windowIconString}
        <div id="window-name">${name}</div>
    </div>
    <div class="right">
        <div id="minimize">
            ${loadSVG(assetsFolder, 'minimize.svg')}
        </div>
        <div id="expand">
            ${loadSVG(assetsFolder, 'square.svg')}
        </div>
        <div id="close">
            ${loadSVG(assetsFolder, 'close.svg')}
        </div>
    </div>`

    header.querySelector('#minimize').onclick = minimize
    header.querySelector('#expand').onclick = expand
    header.querySelector('#close').onclick = close
    return header
}

module.exports = { makeFrame }