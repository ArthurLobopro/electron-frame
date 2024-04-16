import { PopUpFrame } from "../frames/PopUpFrame"
import { FrameActions } from "./FrameActions"

export class PopUpFrameActions extends FrameActions {
    constructor(frame: PopUpFrame, private hide: () => void) {
        super(frame)
    }

    minimize() {
        super.minimize()
        this.hide()
    }

    expand() {
        super.expand()
        this.hide()
    }

    async close() {
        await super.close()
        this.hide()
    }
}