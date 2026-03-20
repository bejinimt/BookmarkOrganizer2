// ------------------------------------------------------------
// debug-search.js
// Sucht per absoluteNumber und zeigt das Objekt im Overlay
// ------------------------------------------------------------

(function () {

    const btn = document.getElementById("debugSearchAbsoluteBtn");
    const input = document.getElementById("debugAbsoluteInput");

    if (!btn || !input) return;

    // Klick auf Button → Suche
    btn.addEventListener("click", () => {

        const num = input.value.trim();
        if (!num) return;

        if (!window.bookmarkIndex) {
            alert("Index nicht aufgebaut.");
            return;
        }

        const obj = window.bookmarkIndex[num];
        window.debugShowObject(obj);
    });

    // ------------------------------------------------------------
    // ENTER / SHIFT+ENTER im Eingabefeld
    // ------------------------------------------------------------
    input.addEventListener("keydown", (ev) => {

        // SHIFT + ENTER → Tag zuweisen
        if (ev.key === "Enter" && ev.shiftKey) {
            ev.preventDefault();

            const tag = input.value.trim();
            if (!tag) return;

            window.addTagToCheckedBookmarks(tag);
            return; // verhindert Ausführung des normalen ENTER-Blocks
        }

        // Nur ENTER → Suche
        if (ev.key === "Enter") {
            ev.preventDefault();
            btn.click();
        }
    });

})();
