window.markEmptyFolders = function () {
    if (!window.bookmarkData?.folders) {
        console.warn("markEmptyFolders(): Keine bookmarkData.folders gefunden.");
        return;
    }

    console.log("=== markEmptyFolders() START ===");

    for (const folder of window.bookmarkData.folders) {

        const childCount = folder.children.length;
        const isEmpty = childCount === 0;

        // Markieren
        folder.selected = isEmpty;

        // Debug-Ausgabe
        console.log(
            (isEmpty ? "✔ LEER" : "✘ NICHT LEER") +
            " | id=" + folder.id +
            " | title=\"" + folder.title + "\"" +
            " | children=" + childCount
        );
    }

    console.log("=== markEmptyFolders() ENDE ===");
};
