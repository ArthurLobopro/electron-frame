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

As opções são:

```ts
darkMode?: boolean
/**
 * Define se o modo escuro está ativado. Por padrão é `true`
 */
title?: string
/**
 * Define o título da janela. Por padrão é o título da página carregada
 */
icon?: HTMLImageElement | string
/**
 * Define o ícone da janela. Por padrão é o ícone da página carregada
 */
colors?: {
    background?: string
    /**
     * A cor de fundo do frame.
     */
    color?: string
    /**
     * A cor da fonte do frame.
     */
    svgIconsColor?: string
    /**
     * A cor dos ícones dos controles de janela
     */
    svgIconsColorHover?: string
    /**
     * A cor dos ícones dos controles de janela ao ser sobrepostos pelo mouse
     */
    lastSvgIconHover?: string
    /**
     * A cor do ícone de fechar o ser sobreposto pelo mouse
     */
}
onClose?: {
    beforeCallback?: () => true | false
    /**
     * Função chamada antes da janela ser fechada, se a função retornar `false` a janela não irá ser fechada
     */
}
```