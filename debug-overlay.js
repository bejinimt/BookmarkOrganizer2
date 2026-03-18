// ------------------------------------------------------------
// debug-overlay.js
// Vollständiges Debug-Fenster für Bookmark-Objekte
// ------------------------------------------------------------

(function () {

    const overlay = document.getElementById("debugOverlay");
    const content = document.getElementById("debugContent");
    const closeBtn = document.getElementById("debugOverlayClose");

    if (!overlay || !content || !closeBtn) return;

    // Overlay schließen
    closeBtn.addEventListener("click", () => {
        overlay.style.display = "none";
    });

    // ------------------------------------------------------------
    // Öffnet das Overlay und zeigt ein Objekt vollständig an
    // ------------------------------------------------------------
    window.debugShowObject = function (obj) {

        if (!obj) {
            content.textContent = "Kein Objekt gefunden.";
        } else {
            content.textContent = pretty(obj);
        }

        overlay.style.display = "block";
    };

    // ------------------------------------------------------------
    // Schönes Format für ALLE Eigenschaften
    // ------------------------------------------------------------
    function pretty(obj) {
        return Object.entries(obj)
            .map(([key, value]) => {
                return key + ": " + format(value);
            })
            .join("\n");
    }

    function format(v) {
        if (typeof v === "object" && v !== null) {
            return JSON.stringify(v, null, 4);
        }
        return String(v);
    }

})();
