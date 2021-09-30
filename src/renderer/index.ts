import { makeFrame } from './frame'
import { injectCSS } from './Util'

async function insertFrame({darkMode = true}) {
    const frame = await makeFrame({darkMode})
    injectCSS(__dirname, 'style.css')
    document.body.appendChild(frame)
}

export { insertFrame }