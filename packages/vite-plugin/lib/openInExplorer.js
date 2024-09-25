"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.openInExplorer = void 0;
const child_process_1 = require("child_process");
const os_1 = require("os");
function openInExplorer(file) {
    let explorer = null;
    const os = (0, os_1.platform)();
    switch (os) {
        case 'win32':
            explorer = 'explorer';
            break;
        case 'linux':
            explorer = 'xdg-open';
            break;
        case 'darwin':
            explorer = 'open';
            break;
    }
    if (explorer) {
        (0, child_process_1.spawn)(explorer, [file], { detached: true }).unref();
    }
    else {
        console.warn(`Unsupported OS: ${os}`);
    }
}
exports.openInExplorer = openInExplorer;
