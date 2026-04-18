// ------------------------------------------------------------
// export-html.js
// Exportiert die aktuelle Bookmark-Struktur als HTML-Datei
// ------------------------------------------------------------

window.exportAsHTML = function () {

    if (!window.bookmarkData || !window.bookmarkData.folders.length) {
        window.setMessage("Keine Daten zum Exportieren.");
        return;
    }

    const root = window.bookmarkData.folders[0];

    // ------------------------------------------------------------
    // HTML-Header
    // ------------------------------------------------------------
    let html = "";
    html += "<!DOCTYPE NETSCAPE-Bookmark-file-1>\n";
    html += "<META HTTP-EQUIV=\"Content-Type\" CONTENT=\"text/html; charset=UTF-8\">\n";
    html += "<TITLE>Bookmarks</TITLE>\n";
    html += "<H1>Bookmarks</H1>\n";
    html += "<DL><p>\n";

    // ------------------------------------------------------------
    // Rekursiver Export
    // ------------------------------------------------------------
    function exportFolder(folder, indent) {

        const pad = " ".repeat(indent);

        html += pad + "<DT><H3>" + escapeHTML(folder.title) + "</H3>\n";
        html += pad + "<DL><p>\n";

        for (const child of folder.children) {

            // Bookmark
            if (child.type === "bookmark") {

                if (child.visible === false || child.to_delete === true) continue;

                let title = child.title || child.url || "(Ohne Titel)";

                if (child.tags && child.tags.length > 0) {
                    title += " [[TAGS: " + child.tags.join(", ") + "]]";
                }

                html += pad + "  <DT><A HREF=\"" + escapeHTML(child.url) + "\">" +
                        escapeHTML(title) + "</A>\n";
            }

            // Unterordner
            if (child.type === "folder") {

                if (child.visible === false || child.to_delete === true) continue;

                const sub = window.bookmarkData.folders.find(f => f.id === child.ref);
                if (sub && sub.visible !== false) {
                    exportFolder(sub, indent + 2);
                }
            }
        }

        html += pad + "</DL><p>\n";
    }

    exportFolder(root, 0);

    html += "</DL><p>\n";

    // ------------------------------------------------------------
    // Datei herunterladen
    // ------------------------------------------------------------
    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "bookmarks_export.html";
    a.click();

    URL.revokeObjectURL(url);

    window.setMessage("HTML-Export abgeschlossen.");
};


// ------------------------------------------------------------
// HTML escapen
// ------------------------------------------------------------
function escapeHTML(str) {
    return (str || "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");
}

