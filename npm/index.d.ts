export interface insertFrameOptions {
    darkMode?: boolean
    title?: string
    icon?: HTMLImageElement | string
    colors?: {
        background?: string
        color?: string
        svgIconsColor?: string
        svgIconsColorHover?: string
        lastSvgIconHover?: string
    },
    onClose?: {
        beforeCallback?: () => true | false
    }
}

declare module "electron-frame/renderer" {
    export function insertFrame(options?: insertFrameOptions): void
}

declare module "electron-frame/main" { }