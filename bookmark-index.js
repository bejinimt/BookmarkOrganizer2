// ------------------------------------------------------------
// bookmark-index.js
// Baut einen schnellen Lookup-Index: absoluteNumber → Objekt
// und kann alle Nummern neu berechnen
// ------------------------------------------------------------

// ------------------------------------------------------------
// Index neu aufbauen
// ------------------------------------------------------------
window.buildBookmarkIndex = function () {
    window.bookmarkIndex = {};

    let bookmarkCount = 0;
    let folderCount = 0;

    function walk(folder) {

        // Root-Ordner ohne Nummer bekommt "0"
        if (folder.absoluteNumber == null) {
            folder.absoluteNumber = "0";
        }

        window.bookmarkIndex[folder.absoluteNumber] = folder;
        folderCount++;

        for (const child of folder.children) {

            if (child.type === "bookmark") {
                if (child.absoluteNumber != null) {
                    window.bookmarkIndex[child.absoluteNumber] = child;
                }
                bookmarkCount++;
            }

            if (child.type === "folder") {
                const sub = window.bookmarkData.folders.find(f => f.id === child.ref);
                if (sub) walk(sub);
            }
        }
    }

    if (window.bookmarkData.folders.length > 0) {
        walk(window.bookmarkData.folders[0]);
    }

    window.setMessage(
        "Index aufgebaut: " +
        bookmarkCount + " Lesezeichen, " +
        folderCount + " Ordner."
    );
};


// ------------------------------------------------------------
// absoluteNumber neu berechnen
// ------------------------------------------------------------
window.rebuildAbsoluteNumbers = function () {

    function walk(folder, prefix) {

        let itemCount = 0;

        for (const child of folder.children) {

            itemCount++;

            if (child.type === "folder") {
                const sub = window.bookmarkData.folders.find(f => f.id === child.ref);
                if (!sub) continue;

                const num = prefix + "." + itemCount;
                sub.absoluteNumber = num;

                walk(sub, num);
            }

            if (child.type === "bookmark") {
                child.absoluteNumber = prefix + "." + itemCount;
            }
        }
    }

    if (window.bookmarkData.folders.length > 0) {
        const root = window.bookmarkData.folders[0];

        if (!root.absoluteNumber) {
            root.absoluteNumber = "0";
        }

        walk(root, root.absoluteNumber);
    }

    window.buildBookmarkIndex();
};

