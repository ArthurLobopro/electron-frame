import path from 'path'
import { loadSVG, getIconString } from './Util'
import { minimize, expand, close } from './renderer-actions'

const assetsFolder = path.resolve(__dirname, "assets")

async function makeFrame({ darkMode = true, minimizable = true, maximizable = true, closeable = true }) {
    const windowIconString = await getIconString()

    const frame = document.createElement('div')
    const name = document.title

    frame.className = darkMode ? "dark" : "light"

    frame.id = "electron-frame"
    frame.innerHTML = `
    <div class="left">
        ${windowIconString}
        <div id="window-name">${name}</div>
    </div>
    <div class="right">
        <div id="minimize" class="${minimizable ? "" : "disable"}">
            ${loadSVG(assetsFolder, 'minimize.svg')}
        </div>
        <div id="expand" class="${maximizable ? "" : "disable"}">
            ${loadSVG(assetsFolder, 'square.svg')}
        </div>
        <div id="close" class="${closeable ? "" : "disable"}">
            ${loadSVG(assetsFolder, 'close.svg')}
        </div>
    </div>`

    const frameGet = (id: string) => frame.querySelector(`#${id}`) as HTMLElement

    frameGet('minimize').onclick = minimize
    frameGet('expand').onclick = expand
    frameGet('close').onclick = close
    return frame
}

export { makeFrame }