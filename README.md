# Electron Frame

Electron Frame is a simple and customizable window frame build on HTML for you application.

## ScreenShots

### Windows Frame

![Frame Windows Dark](./.github/screenshots/windows-dark.png)

![Frame Windows Dark](./.github/screenshots/windows-light.png)

### Macos Frame

![Frame Macos Dark](./.github/screenshots/macos-dark.png)

![Frame Macos Dark](./.github/screenshots/macos-light.png)

Screenshots taken on [dicionario.js](https://github.com/arthurlobopro/dicionario.js) projetct.

## How to use

* Install electron-frame in your project with `yarn add electron-frame` or `npm install electron-frame`
* On main process, add:

```js
require("electron-frame/main")
```

* On preload script, add:

```js
const { ElectronFrame } = require("electron-frame/renderer")
window.addEventListener('DOMContentLoaded', () => {
    const frame = new ElectronFrame()
    frame.insert()
})
```

* You can customize your frame passing some options in instance or using the special class methods.
