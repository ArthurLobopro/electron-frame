import { loadSVG } from './Util'
import { assets_dir } from "./paths"

export const icons = {
    macos: {
        minimize: loadSVG(assets_dir, "mac-minimize.svg").toString(),
        expand: loadSVG(assets_dir, "mac-expand.svg").toString(),
        close: loadSVG(assets_dir, "mac-close.svg").toString(),
        restore: loadSVG(assets_dir, "mac-restore.svg").toString()
    },
    windows: {
        minimize: loadSVG(assets_dir, "win-minimize.svg").toString(),
        expand: loadSVG(assets_dir, "win-expand.svg").toString(),
        close: loadSVG(assets_dir, "win-close.svg").toString()
    }
}
