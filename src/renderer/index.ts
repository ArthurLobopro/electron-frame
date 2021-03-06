import { ipcRenderer } from 'electron'
import { makeFrame, electronFrame } from './frame'
import { injectCSS } from './Util'

interface frameColors {
    background?: string
    color?: string
    svgIconsColor?: string
    svgIconsColorHover?: string
    lastSvgIconHover?: string
}
interface insertFrameOptions {
    darkMode?: boolean
    title?: string
    icon?: HTMLImageElement | string
    colors?: frameColors
    onClose?: {
        beforeCallback?: () => true | false
    }
}

async function insertFrame(options: insertFrameOptions = {}) {
    const frame = await makeFrame({ ...options, ...ipcRenderer.sendSync('request-window-config') })
    injectCSS(__dirname, 'style.css')
    document.body.appendChild(frame)

    //This delay is necessary, dont quest
    setTimeout(() => {
        const bodyPaddingTop = getComputedStyle(document.body).paddingTop
        const frameHeight = getComputedStyle(frame).height
        document.body.style.paddingTop = `calc(${bodyPaddingTop} + ${frameHeight})`
    }, 50);
}

function removeFrame() {
    const frame = document.getElementById("electron-frame")

    if (frame) {
        const bodyPaddingTop = getComputedStyle(document.body).paddingTop
        const frameHeight = getComputedStyle(frame).height

        document.body.style.paddingTop = `calc(${bodyPaddingTop} - ${frameHeight})`
        document.body.removeChild(frame)
    }
}

export { insertFrame, removeFrame, electronFrame }