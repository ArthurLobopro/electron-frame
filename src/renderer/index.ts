import { ipcRenderer } from 'electron'
import { makeFrame } from './frame'
import { injectCSS } from './Util'

interface insertFrameArgs{
    darkMode?: boolean
    icon?: string | HTMLImageElement
    title?: string
}

async function insertFrame( options: insertFrameArgs = {}) {
    const frame = await makeFrame({...options, ...ipcRenderer.sendSync('request-window-config')})
    injectCSS(__dirname, 'style.css')
    document.body.appendChild(frame)
}

export { insertFrame }