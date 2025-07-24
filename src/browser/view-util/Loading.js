// LICENSE : MIT
import Spinner from "spin.js";
let _spinner;
let _overlay;
function createOverlay() {
    var overlay = document.createElement("div");
    overlay.setAttribute(
        "style",
        `
        position: absolute;
        width:100%;
        height:100%;
        left: 0;
        top: 0;
        bottom: 0;
        right: 0;
        background: #000;
        opacity: 0.8;
        z-index: ${2e9};
        filter: alpha(opacity=80);
    `
    );
    return overlay;
}
function appendOverlay(overlay, opts) {
    document.body.appendChild(overlay);
    _spinner = new Spinner(opts).spin(overlay);
    _overlay = overlay;
}
function removeOverlay() {
    if (_overlay) {
        _overlay.parentNode.removeChild(_overlay);
        _overlay = null;
        _spinner.stop();
        _spinner = null;
    }
}
export function show(spinOptions) {
    dismiss();
    var opts = spinOptions || {
        lines: 13, // The number of lines to draw
        length: 28, // The length of each line
        width: 14, // The line thickness
        radius: 42, // The radius of the inner circle
        scale: 1, // Scales overall size of the spinner
        corners: 1, // Corner roundness (0..1)
        color: "#fff", // #rgb or #rrggbb or array of colors
        opacity: 0.25, // Opacity of the lines
        rotate: 0, // The rotation offset
        direction: 1, // 1: clockwise, -1: counterclockwise
        speed: 1, // Rounds per second
        trail: 60, // Afterglow percentage
        fps: 20, // Frames per second when using setTimeout() as a fallback for CSS
        zIndex: 2e9, // The z-index (defaults to 2000000000)
        className: "spinner", // The CSS class to assign to the spinner
        top: "50%", // Top position relative to parent
        left: "50%", // Left position relative to parent
        shadow: true, // Whether to render a shadow
        hwaccel: false, // Whether to use hardware acceleration
        position: "relative" // Element positioning
    };
    var overlay = createOverlay();
    appendOverlay(overlay, opts);
}

/**
 * @param {number} delayMS
 */
export function dismiss(delayMS = 0) {
    if (_spinner) {
        if (delayMS > 0) {
            setTimeout(() => {
                removeOverlay();
            }, delayMS);
        } else {
            removeOverlay();
        }
    }
}
