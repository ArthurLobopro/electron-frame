declare namespace renderer {
    interface frameColors {

        /**
         * The background-color of the frame.
         */
        background?: string
    
        /**
         * The font color of the frame.
         */
        color?: string
    
        /**
         * The window control icons color
         */
        svgIconsColor?: string
    
        /**
         * The window control icons color on hover
         */
        svgIconsColorHover?: string
    
        /**
         * The last window control icon color on hover
         */
        lastSvgIconHover?: string
    }
    
    interface insertFrameOptions {
        /**
         * Define if DarkMode is enabled. Default is `true`
         */
        darkMode?: boolean
    
        /**
        * The title of window. Default is HTML title
        */
        title?: string
    
        /**
         * The icon of window. Default is HTML favicon
         */
        icon?: HTMLImageElement | string
    
        /**
         * The colors of frame components
         */
        colors?: frameColors
        /**
         * On close options
         */
        onClose?: {
            /**
             * Callback called before the window is closed and if it returns false the window will not be closed
             */
            beforeCallback?: () => true | false
        }
    }

    /**
     * Insert frame in the window
     * @param options Options for build the frame
     */
    function insertFrame(options?: insertFrameOptions): void

    /**
     * Remore frame from window
     */
    function removeFrame(): void

    class electronFrame {

        /**
         * Set the frame title.
         * @param title new title from frame
         */
        setTitle(title: string): void

        /**
         * Set the frame icon.
         * @param icon The new icon for frame
         */
        setIcon(icon: HTMLImageElement | string): void

        /**
         * Insert the frame.
         */
        async insert(): Promise<void>

        /**
        * Remove the frame
        */
        remove(): void

        /**
         * Rebuild the frame 
         */
        update(): void
        
        /**
         * 
         * @param colors colors to update in frame
         */
        setColors(colors: frameColors): void
    }
} 




declare module "electron-frame/renderer" {
    export = renderer
}

declare module "electron-frame/main";