# Electron Frame

Como usar?

Instale o pacote usando

`npm install electron-frame`

ou

`yarn add electron-frame` 

No processo principal adicione 

```js
const { mainWindowControlEvents } = require('electron-frame/main')
mainWindowControlEvents.init()
```

No processo renderizador (preload.js) adicione:

```js
const { insertFrame } = require('electron-frame/renderer')

document.addEventListener("DOMContentLoaded", ()=> {
    insertFrame()
})
```