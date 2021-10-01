# Electron Frame

<details>

<summary>Como usar ?</summary>

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
    insertFrame(options)
})
```
</details>


<details>

<summary>How to use ?</summary>

Install the package using

`npm install electron-frame`

or

`yarn add electron-frame` 

In the main process add:

```js
const { mainWindowControlEvents } = require('electron-frame/main')
mainWindowControlEvents.init()
```

In the renderer process (preload.js) add:

```js
const { insertFrame } = require('electron-frame/renderer')

document.addEventListener("DOMContentLoaded", ()=> {
    insertFrame(options)
})
```

</details>