import { ipcRenderer } from 'electron'
import { makeFrame } from './frame'
import { injectCSS } from './Util'
interface insertFrameOptions {
    darkMode?: boolean
    title?: string
    icon?: HTMLImageElement | string
    colors?: {
        background?: string
        color?: string
        svgIconsColor?: string
        svgIconsColorHover?: string
        lastSvgIconHover?: string
    }
}

async function insertFrame( options: insertFrameOptions = {}) {
    const frame = await makeFrame({...options, ...ipcRenderer.sendSync('request-window-config')})
    injectCSS(__dirname, 'style.css')
    document.body.appendChild(frame)
    
    //This delay is necessary, dont quest
    setTimeout(() => {
        const bodyPaddingTop = getComputedStyle(document.body).paddingTop
        const frameHeight = getComputedStyle(frame).height
        document.body.style.paddingTop = `calc(${bodyPaddingTop} + ${frameHeight})`
    }, 50);
}

export { insertFrame }