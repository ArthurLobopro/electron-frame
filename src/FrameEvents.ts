export const enum FrameEvents {
    onClose = "electron-frame:close",
    onExpand = "electron-frame:expand",
    onMinimize = "electron-frame:minimize",
    getIsMazimized = "electron-frame:is-maximized",
    getWindowConfig = "electron-frame:request-window-config"
}