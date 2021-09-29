import { makeFrame } from './frame'
import { injectCSS } from './Util'

async function insertFrame() {
    const frame = await makeFrame()
    injectCSS(__dirname, 'style.css')
    document.body.appendChild(frame)
}

export { insertFrame }