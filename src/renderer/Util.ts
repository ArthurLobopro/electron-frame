import fs from 'fs'
import path from 'path'

export function loadSVG(...PathSegments: string[]) {
    return fs.readFileSync(path.resolve(...PathSegments), { encoding: "utf-8" })
}

export function getIcon() {
    const links = Array.from(document.querySelectorAll("link"))
    const iconLink = links.find(link => link.rel.includes('icon'))

    if (iconLink) {
        const image = new Image()
        image.src = iconLink.href
        return image
    }

    return ""
}

export const formatCSS = (str: string) => str.replaceAll(/([A-Z])/g, s => `-${s.toLowerCase()}`)