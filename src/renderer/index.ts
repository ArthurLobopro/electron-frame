import { ipcRenderer } from 'electron'
import { makeFrame } from './frame'
import { injectCSS } from './Util'

async function insertFrame({darkMode = true}) {
    const frame = await makeFrame({darkMode, ...ipcRenderer.sendSync('request-window-config')})
    injectCSS(__dirname, 'style.css')
    document.body.appendChild(frame)
}

export { insertFrame }