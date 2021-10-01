import path from 'path'
import { loadSVG, getIconString } from './Util'
import { minimize, expand, close } from './renderer-actions'

const assetsFolder = path.resolve(__dirname, "assets")

interface makeFrame {
    darkMode?: boolean
    title?: string
    icon: HTMLImageElement | string
    minimizable: boolean
    maximizable: boolean
    closeable: boolean
}

async function makeFrame({ darkMode = true, title, icon, minimizable = true, maximizable = true, closeable = true }: makeFrame) {
    const windowIconString = icon || await getIconString()

    const frame = document.createElement('div')
    const name = title || document.title

    frame.className = darkMode ? "dark" : "light"

    frame.id = "electron-frame"
    frame.innerHTML = `
    <div class="left">
        <div id="window-icon">${
            windowIconString instanceof Image ? windowIconString.outerHTML : windowIconString
        }</div>
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