// ------------------------------------------------------------
// debug-overlay-drag.js – garantiert funktionierend
// ------------------------------------------------------------

window.addEventListener("DOMContentLoaded", () => {

    const overlay = document.getElementById("debugOverlay");
    const header = document.getElementById("debugHeader");

    if (!overlay || !header) {
        console.warn("Debug-Overlay oder Header nicht gefunden.");
        return;
    }

    let isDragging = false;
    let offsetX = 0;
    let offsetY = 0;

    header.addEventListener("mousedown", (e) => {
        isDragging = true;
        offsetX = e.clientX - overlay.offsetLeft;
        offsetY = e.clientY - overlay.offsetTop;
        overlay.style.userSelect = "none";
    });

    document.addEventListener("mousemove", (e) => {
        if (!isDragging) return;
        overlay.style.left = (e.clientX - offsetX) + "px";
        overlay.style.top = (e.clientY - offsetY) + "px";
    });

    document.addEventListener("mouseup", () => {
        isDragging = false;
        overlay.style.userSelect = "auto";
    });

});
