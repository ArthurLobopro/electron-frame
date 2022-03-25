Install the package using

`npm install electron-frame`

or

`yarn add electron-frame` 

In the main process require the main process module:

```js
require('electron-frame/main')
```

In the renderer process require and call `insertFrame` function:

```js
const { insertFrame } = require('electron-frame/renderer')

document.addEventListener("DOMContentLoaded", ()=> {
    insertFrame(options)
})
```

The supported options are: 

```ts
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
```