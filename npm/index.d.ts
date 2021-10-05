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

declare module 'electron-frame/renderer'{
    export function insertFrame( options: insertFrameOptions ) : void
}