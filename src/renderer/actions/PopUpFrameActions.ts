import { PopUpFrame } from "../frames/PopUpFrame"
import { FrameActions } from "./FrameActions"

export class PopUpFrameActions extends FrameActions {
    constructor(protected frame: PopUpFrame) {
        super(frame)
    }

    minimize() {
        super.minimize()
        this.frame.hide()
    }

    expand() {
        super.expand()
        this.frame.hide()
    }

    async close() {
        await super.close()
        this.frame.hide()
    }
}