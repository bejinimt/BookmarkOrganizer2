// ------------------------------------------------------------
// postProcessTags.js
// Fügt jedem Bookmark NUR den letzten Ordnernamen als Tag hinzu
// und merged Tags bei URL-Duplikaten
// ------------------------------------------------------------

// Diese Funktion wird NACH dem Parsen aufgerufen.
// Der Aufruf passiert in parse-html-with-tags.js direkt nach dem Einlesen:
//
//   window.postProcessTags?.();
//
// → GENAU DORT wird der erste Befehl dieser Datei ausgeführt.
// ------------------------------------------------------------

window.postProcessTags = function () {

    // Sicherheitscheck: existieren Ordnerdaten?
    if (!window.bookmarkData?.folders) return;

    console.log("=== postProcessTags() START ===");

    // ------------------------------------------------------------
    // 1. Alle Bookmarks einsammeln
    // ------------------------------------------------------------
    //
    // Wir sammeln alle Bookmarks in einem Array,
    // damit wir später die Duplikate nach URL gruppieren können.
    const bookmarks = [];

    for (const folder of window.bookmarkData.folders) {
        for (const child of folder.children) {
            if (child.type === "bookmark") {
                bookmarks.push(child);
            }
        }
    }

    // ------------------------------------------------------------
    // 2. Jedem Bookmark NUR den letzten Ordnernamen als Tag geben
    // ------------------------------------------------------------
    //
    // WICHTIG:
    // Anders als vorher wird NICHT der ganze Pfad verwendet.
    // Stattdessen bekommt jedes Bookmark GENAU EIN Tag:
    //   → den Titel des Ordners, in dem es direkt liegt.
    //
    // Beispiel:
    //   Root
    //     Einsatzlagen
    //       Ausländer
    //         Bookmark X
    //
    // Bookmark X bekommt NUR:
    //   ["Ausländer"]
    //
    // NICHT:
    //   ["Root", "Einsatzlagen", "Ausländer"]
    //
    for (const folder of window.bookmarkData.folders) {

        // Der letzte Ordnername ist einfach folder.title
        const lastFolderName = folder.title;

        for (const child of folder.children) {
            if (child.type === "bookmark") {

                // Sicherstellen, dass tags existieren
                if (!Array.isArray(child.tags)) {
                    child.tags = [];
                }

                // Nur den letzten Ordnernamen hinzufügen
                if (!child.tags.includes(lastFolderName)) {
                    child.tags.push(lastFolderName);
                }
            }
        }
    }

    // ------------------------------------------------------------
    // 3. Tags bei URL-Duplikaten mergen
    // ------------------------------------------------------------
    //
    // Wenn dieselbe URL mehrfach vorkommt, sollen ALLE Tags
    // aller Vorkommen zusammengeführt werden.
    //
    // Beispiel:
    //   Bookmark A (in "Ausländer") → ["Ausländer"]
    //   Bookmark B (in "Einsatzlagen") → ["Einsatzlagen"]
    //
    // Ergebnis:
    //   Beide → ["Ausländer", "Einsatzlagen"]
    //
    const urlMap = {};

    // Bookmarks nach URL gruppieren
    for (const bm of bookmarks) {
        if (!urlMap[bm.url]) {
            urlMap[bm.url] = [];
        }
        urlMap[bm.url].push(bm);
    }

    // Für jede URL-Gruppe Tags zusammenführen
    for (const url in urlMap) {
        const group = urlMap[url];

        if (group.length < 2) continue; // keine Duplikate

        // Alle Tags aller Bookmarks sammeln
        const merged = new Set();
        for (const bm of group) {
            (bm.tags || []).forEach(t => merged.add(t));
        }

        // Allen Bookmarks die vollständige Tag-Menge geben
        const mergedArray = Array.from(merged);
        for (const bm of group) {
            bm.tags = mergedArray;
        }
    }

    console.log("=== postProcessTags() ENDE ===");
};
