interface frameColors {

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
    colors?: frameColors
    onClose?: {
        beforeCallback?: () => true | false
        /**
         * Callback called before the window is closed and if it returns false the window will not be closed
         */
    }
}

declare module "electron-frame/renderer" {
    export function insertFrame(options?: insertFrameOptions): void
    /**
     * Insert frame in the window
     */

    export function removeFrame(): void
    /**
     * Remore frame from window
     */
    export class electronFrame {

        setTitle(title: string): void
        /**
         * Set the frame title.
         */

        setIcon(icon: HTMLImageElement | string): void
        /**
         * Set the frame icon.
         */

        async insert(): Promise<void>
        /**
         * Insert the frame.
         */

        remove(): void

        update(): void

        updateStyle(): void

        setColors(colors: frameColors): void
    }
}

declare module "electron-frame/main";