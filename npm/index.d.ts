export interface insertFrameOptions {
    darkMode?: boolean
    /**
     * Define if DarkMode is enabled. Default is `true`
     */
    title?: string
    /**
     * The title of window. Default is HTML title
     */
    icon?: HTMLImageElement | string
    /**
     * The icon of window. Default is HTML favicon
     */
    colors?: {
        background?: string
        /**
         * The background-color of the frame.
         */
        color?: string
        /**
         * The font color of the frame.
         */
        svgIconsColor?: string
        /**
         * The window control icons color
         */
        svgIconsColorHover?: string
        /**
         * The window control icons color on hover
         */
        lastSvgIconHover?: string
        /**
         * The last window control icon color on hover
         */
    }
    onClose?: {
        beforeCallback?: () => true | false
        /**
         * Callback called before the window is closed and if it returns false the window will not be closed
         */
    }
}

declare module "electron-frame/renderer" {
    export function insertFrame(options?: insertFrameOptions): void
    export class electronFrame {}
}

declare module "electron-frame/main";