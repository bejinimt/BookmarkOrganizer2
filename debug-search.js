// ------------------------------------------------------------
// debug-search.js
// Sucht per absoluteNumber und zeigt das Objekt im Overlay
// ------------------------------------------------------------

(function () {

    const btn = document.getElementById("debugSearchAbsoluteBtn");
    const input = document.getElementById("debugAbsoluteInput");

    if (!btn || !input) return;

    btn.addEventListener("click", () => {

        const num = input.value.trim();
        if (!num) return;

        if (!window.bookmarkIndex) {
            alert("Index nicht aufgebaut.");
            return;
        }

        const obj = window.bookmarkIndex[num];

        // WICHTIG:
        // KEIN renderTree()
        // KEIN setMessage()
        // KEIN console.log()
        // → Nur Overlay anzeigen
        window.debugShowObject(obj);
    });

})();
