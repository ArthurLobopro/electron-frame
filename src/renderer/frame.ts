import path from 'path'
import { loadSVG, getIconString } from './Util'
import { minimize, expand, close } from './renderer-actions'

const assetsFolder = path.resolve(__dirname, "assets")

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

    const headerGet = (id:string) => header.querySelector(`#${id}`) as HTMLElement

    headerGet('minimize').onclick = minimize
    headerGet('expand').onclick = expand
    headerGet('close').onclick = close
    return header
}

export { makeFrame }