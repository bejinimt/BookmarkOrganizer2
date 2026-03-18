// ------------------------------------------------------------
// duplicates.js
// Findet doppelte URLs und speichert alle Fundstellen
// ------------------------------------------------------------

window.findDuplicates = function () {

    const map = new Map();

    function walk(folder) {
        for (const child of folder.children) {

            // Bookmark
            if (child.type === "bookmark") {
                const url = (child.url || "").trim();

                if (!map.has(url)) {
                    map.set(url, []);
                }

                if (child.absoluteNumber) {
                    map.get(url).push(child.absoluteNumber);
                }
            }

            // Unterordner
            if (child.type === "folder") {
                const sub = window.bookmarkData.folders.find(f => f.id === child.ref);
                if (sub) walk(sub);
            }
        }
    }

    if (window.bookmarkData.folders.length > 0) {
        walk(window.bookmarkData.folders[0]);
    }

    // Nur URLs behalten, die mehrfach vorkommen
    const duplicates = new Map();
    for (const [url, nums] of map.entries()) {
        if (nums.length > 1) {
            duplicates.set(url, nums);
        }
    }

    window.duplicates = duplicates;
    return duplicates;
};

