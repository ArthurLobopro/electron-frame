import type { FrameApi as FrameApiType } from "../preload"

//@ts-expect-error
if (!window.FrameApi) {
    throw new Error("Frame API is not injected on window")
}

//@ts-expect-error
export const FrameApi = window.FrameApi as FrameApiType