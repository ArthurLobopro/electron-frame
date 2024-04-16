export const enum FrameEvents {
    close = "electron-frame:close",
    toggleExpand = "electron-frame:expand",
    minimize = "electron-frame:minimize",
    getIsMazimized = "electron-frame:is-maximized",
    getWindowConfig = "electron-frame:request-window-config",
    listenToggleExpand = "electron-frame:listen-toggle-expand",
    onToggleExpand = "electron-frame:on-toggle-expand"
}