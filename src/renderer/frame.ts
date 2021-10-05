import path from 'path'
import { loadSVG, getIconString } from './Util'
import { minimize, expand, close } from './renderer-actions'

const assetsFolder = path.resolve(__dirname, "assets")

interface makeFrameOptions {
    darkMode?: boolean
    title?: string
    icon?: HTMLImageElement | string
    minimizable: boolean
    maximizable: boolean
    closeable: boolean
    colors?: {
        background?: string
        color?: string
        svgIconsColor?: string
        svgIconsColorHover?: string
        lastSvgIconHover?: string
    }
}

const format = (str: string) => str.replaceAll(/([A-Z])/g, s => `-${s.toLowerCase()}`)

async function makeFrame(frameOptions: makeFrameOptions) {
    const {
        title, icon,
        darkMode = true, minimizable = true, maximizable = true, closeable = true,
        colors = {}
    } = frameOptions

    const colorsArray = Object.entries(colors)
    const properties = colorsArray.map(([key, value]) => `--${format(key)} : ${value} !important`).join(';')
   

    const windowIconString = icon || await getIconString()

    const frame = document.createElement('div')
    const name = title || document.title

    frame.className = darkMode ? "dark" : "light"
    if(colorsArray.length !== 0){
        frame.classList.add('custom')
    }

    frame.id = "electron-frame"
    frame.innerHTML = `
    <div class="left">
        <div id="window-icon">${windowIconString instanceof Image ? windowIconString.outerHTML : windowIconString
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
    </div>
    <style>
        #electron-frame.custom {
            ${properties}
        }
    </style>
    `

    const frameGet = (id: string) => frame.querySelector(`#${id}`) as HTMLElement

    frameGet('minimize').onclick = minimize
    frameGet('expand').onclick = expand
    frameGet('close').onclick = close
    return frame
}

export { makeFrame }