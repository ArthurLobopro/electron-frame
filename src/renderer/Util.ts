import path from 'path'
import fs from 'fs'

function loadSVG(...PathSegments: string[]) {
    return fs.readFileSync(path.resolve(...PathSegments), { encoding: "utf-8" })
}

function injectCSS(...pathSegments: string[]) {
    const cssPath = path.resolve(...pathSegments)

    const links = Array.from(document.querySelectorAll("link")) as HTMLLinkElement[]
    const css_exists = links.find(link => {
        return (
            path.normalize(link.getAttribute('href') as string).replace(/file:\\\\/g, "") ===
            path.normalize(cssPath)
        )
    })

    if (!css_exists) {
        const css = document.createElement('link')
        css.rel = "stylesheet"
        css.href = cssPath
        document.head.appendChild(css)
    }
}

function getIconString() {
    const links = Array.from(document.querySelectorAll("link"))
    const iconLink = links.find(link => link.rel.includes('icon'))

    if (iconLink) {
        const image = new Image()
        image.src = iconLink.href
        return `${image.outerHTML}`
    }

    return ''
}

export const format = (str: string) => str.replaceAll(/([A-Z])/g, s => `-${s.toLowerCase()}`)

export { loadSVG, getIconString, injectCSS }