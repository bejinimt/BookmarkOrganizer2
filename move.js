// ------------------------------------------------------------
// move.js
// Verschiebt ausgewählte Bookmarks in einen Zielordner
// ------------------------------------------------------------
// ------------------------------------------------------------
// Ausgewählte Bookmarks in den ausgewählten Ordner verschieben
// ------------------------------------------------------------
window.moveSelectedToFirstVisibleFolder = function () {

    if (!window.bookmarkData || !window.bookmarkData.folders.length) {
        window.setMessage("Keine Daten geladen.");
        return;
    }

    const root = window.bookmarkData.folders[0];

    // ------------------------------------------------------------
    // 1. Zielordner finden (ausgewählter Ordner)
    // ------------------------------------------------------------
    const targetFolder = findSelectedFolder(root);

    if (!targetFolder) {
        window.setMessage("Bitte genau einen Zielordner auswählen.");
        return;
    }

    // ------------------------------------------------------------
    // 2. Alle ausgewählten Bookmarks einsammeln
    // ------------------------------------------------------------
    const selected = collectSelectedBookmarks(root);

    if (selected.length === 0) {
        window.setMessage("Keine ausgewählten Bookmarks zum Verschieben.");
        return;
    }

    // ------------------------------------------------------------
    // 3. Bookmarks aus alten Ordnern entfernen
    // ------------------------------------------------------------
    for (const item of selected) {
        const parent = window.bookmarkData.folders.find(f => f.id === item.parentId);
        if (!parent) continue;

        parent.children = parent.children.filter(c => !(c.type === "bookmark" && c.absoluteNumber === item.bookmark.absoluteNumber));
    }

    // ------------------------------------------------------------
    // 4. Bookmarks in Zielordner einfügen
    // ------------------------------------------------------------
    for (const item of selected) {
        targetFolder.children.push({
            type: "bookmark",
            title: item.bookmark.title,
            url: item.bookmark.url,
            tags: item.bookmark.tags,
            visible: item.bookmark.visible,
            selected: false,
            showCheckbox: item.bookmark.showCheckbox,
            absoluteNumber: null
        });
    }

    // ------------------------------------------------------------
    // 5. Nummerierung neu aufbauen
    // ------------------------------------------------------------
    window.rebuildAbsoluteNumbers();

    // ------------------------------------------------------------
    // 6. UI aktualisieren
    // ------------------------------------------------------------
    window.renderTree();
    window.setMessage(selected.length + " Bookmarks verschoben.");
};


// ------------------------------------------------------------
// Hilfsfunktion: ausgewählten Ordner finden
// ------------------------------------------------------------
function findSelectedFolder(folder) {

    if (folder.showCheckbox && folder.selected) {
        return folder;
    }

    for (const child of folder.children) {
        if (child.type === "folder") {
            const sub = window.bookmarkData.folders.find(f => f.id === child.ref);
            if (!sub) continue;

            const found = findSelectedFolder(sub);
            if (found) return found;
        }
    }

    return null;
}


// ------------------------------------------------------------
// Hilfsfunktion: ersten sichtbaren Ordner finden
// ------------------------------------------------------------
function findFirstVisibleFolder(folder) {

    if (folder.visible !== false) return folder;

    for (const child of folder.children) {
        if (child.type === "folder") {
            const sub = window.bookmarkData.folders.find(f => f.id === child.ref);
            if (!sub) continue;

            const found = findFirstVisibleFolder(sub);
            if (found) return found;
        }
    }

    return null;
}


// ------------------------------------------------------------
// Hilfsfunktion: alle ausgewählten Bookmarks einsammeln
// ------------------------------------------------------------
function collectSelectedBookmarks(folder) {

    const list = [];

    for (const child of folder.children) {

        if (child.type === "bookmark" && child.selected) {
            list.push({
                bookmark: child,
                parentId: folder.id
            });
        }

        if (child.type === "folder") {
            const sub = window.bookmarkData.folders.find(f => f.id === child.ref);
            if (sub) {
                list.push(...collectSelectedBookmarks(sub));
            }
        }
    }

    return list;
}

