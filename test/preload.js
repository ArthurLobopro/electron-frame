const { insertFrame } = require('../npm/renderer')

window.addEventListener('DOMContentLoaded', () => {
    const icon = new Image()
    icon.src = "https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/160/microsoft/209/waving-hand-sign_1f44b.png"
    insertFrame({ icon })
})