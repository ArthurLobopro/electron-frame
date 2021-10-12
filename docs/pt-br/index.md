Instale o pacote usando

`npm install electron-frame`

ou

`yarn add electron-frame` 

No processo principal, importe

```js
require('electron-frame/main')
```

e ao construir a janela defina as seguintes propriedades

```js
{
    frame: false,
    webPreferences: {
        preload: "caminho/para/o/script/preload"
    }
}
```


No script de preload importe a função `insertFrame` e a chame após a janela ser carregada:

```js
const { insertFrame } = require('electron-frame/renderer')

document.addEventListener("DOMContentLoaded", ()=> {
    insertFrame(options)
})
```

Para ver todas as opções, [clique aqui](opcoes.md)