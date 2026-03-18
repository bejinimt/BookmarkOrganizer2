// ------------------------------------------------------------
// search.js
// Suchfunktionen für Ordner und Bookmarks
// ------------------------------------------------------------

// Prüft, ob ein Ordner zur aktuellen Suche passt
window.matchesFolder = function (folder) {
    if (!window.currentSearchTerm) return true;

    const term = window.currentSearchTerm.toLowerCase();
    return (folder.title || "").toLowerCase().includes(term);
};

// Prüft, ob ein Bookmark zur aktuellen Suche passt
window.matchesSearch = function (bookmark) {
    if (!window.currentSearchTerm) return true;

    const term = window.currentSearchTerm.toLowerCase();

    return (
        (bookmark.title || "").toLowerCase().includes(term) ||
        (bookmark.url || "").toLowerCase().includes(term) ||
        (bookmark.tags || []).some(t => t.toLowerCase().includes(term))
    );
};
