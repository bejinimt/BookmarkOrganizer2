// ------------------------------------------------------------
// message.js
// Zeigt Status- und Hinweis-Meldungen im UI an
// ------------------------------------------------------------

window.setMessage = function (msg, timeout = 3000) {

    const box = document.getElementById("messageBox");
    if (!box) {
        console.warn("messageBox nicht gefunden:", msg);
        return;
    }

    box.textContent = msg;
    box.style.opacity = "1";

    // Falls vorher ein Timer lief → abbrechen
    if (window._messageTimer) {
        clearTimeout(window._messageTimer);
    }

    // Meldung automatisch ausblenden
    window._messageTimer = setTimeout(() => {
        box.style.opacity = "0";
    }, timeout);
};

