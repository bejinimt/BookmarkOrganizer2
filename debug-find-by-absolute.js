// ------------------------------------------------------------
// debug-find-by-absolute.js
// Findet ein Bookmark oder einen Ordner anhand seiner absoluteNumber
// ------------------------------------------------------------

window.debugFindByAbsolute = function (absNum) {

    if (!absNum || typeof absNum !== "string") {
        return "Ungültige absoluteNumber.";
    }

    if (!window.bookmarkIndex) {
        return "Index nicht aufgebaut.";
    }

    const item = window.bookmarkIndex[absNum];

    if (!item) {
        return "Kein Eintrag mit absoluteNumber " + absNum + " gefunden.";
    }

    // Ordner
    if (item.children) {
        return (
            "[Folder]\n" +
            "Titel: " + item.title + "\n" +
            "absoluteNumber: " + item.absoluteNumber + "\n" +
            "Kinder: " + item.children.length + "\n"
        );
    }

    // Bookmark
    return (
        "[Bookmark]\n" +
        "Titel: " + (item.title || "(Ohne Titel)") + "\n" +
        "URL: " + item.url + "\n" +
        "absoluteNumber: " + item.absoluteNumber + "\n" +
        "Tags: " + (item.tags ? item.tags.join(", ") : "") + "\n"
    );
};

