import path from "path"
import { loadSVG } from './Util'

const assetsFolder = path.resolve(__dirname, "assets")

export const icons = {
    macos: {
        minimize: loadSVG(assetsFolder, "mac-minimize.svg").toString(),
        expand: loadSVG(assetsFolder, "mac-expand.svg").toString(),
        close: loadSVG(assetsFolder, "mac-close.svg").toString(),
        restore: loadSVG(assetsFolder, "mac-restore.svg").toString()
    },
    windows: {
        minimize: loadSVG(assetsFolder, "win-minimize.svg").toString(),
        expand: loadSVG(assetsFolder, "win-expand.svg").toString(),
        close: loadSVG(assetsFolder, "win-close.svg").toString()
    }
}
