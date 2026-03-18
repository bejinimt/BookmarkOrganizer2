// ------------------------------------------------------------
// render-tree.js
// Rendert den kompletten Lesezeichenbaum
// ------------------------------------------------------------

window.renderTree = function () {
    treeContainer.innerHTML = "";

    if (!window.bookmarkData.folders.length) {
        treeContainer.textContent = "Noch keine Lesezeichen geladen.";
        return;
    }

    const rootFolder = window.bookmarkData.folders[0];

    const ul = document.createElement("ul");
    ul.className = "bookmark-tree";

    const rootLi = window.renderFolderNode(rootFolder);

    if (rootLi) {
        ul.appendChild(rootLi);
    } else {
        ul.textContent = "Keine Treffer.";
    }

    treeContainer.appendChild(ul);
};


// ------------------------------------------------------------
// Einzelnen Ordner rendern
// ------------------------------------------------------------
window.renderFolderNode = function (folder) {

    // to_delete → immer ausblenden
    if (folder.to_delete === true) return null;

    // normale Sichtbarkeit
    if (folder.visible === false) return null;

    const duplicates = window.duplicates || null;
    const folderMatches = window.matchesFolder(folder);

    let hasVisibleChildren = false;

    const li = document.createElement("li");

    // Ordnerlabel
    const label = document.createElement("span");
    label.className = "folder-label";

    if (window.showNumbers && folder.absoluteNumber != null) {
        const num = document.createElement("span");
        num.className = "entry-number";
        num.textContent = folder.absoluteNumber + " ";
        label.appendChild(num);
    }

    if (folderMatches && window.currentSearchTerm) {
        label.classList.add("highlight");
    }

    label.appendChild(document.createTextNode(folder.title || "(Ohne Titel)"));
    li.appendChild(label);

    // Ordner-Checkbox
    if (folder.showCheckbox) {
        const cb = document.createElement("input");
        cb.type = "checkbox";
        cb.className = "folder-checkbox";
        cb.checked = folder.selected;

        cb.addEventListener("change", () => {
            folder.selected = cb.checked;
        });

        li.appendChild(cb);
    }

    // Kinderliste
    const ul = document.createElement("ul");
    ul.className = "bookmark-tree";

    for (const child of folder.children) {

        // Unterordner
        if (child.type === "folder") {
            const sub = window.bookmarkData.folders.find(f => f.id === child.ref);
            if (!sub) continue;

            const subLi = window.renderFolderNode(sub);

            if (subLi) {
                ul.appendChild(subLi);
                hasVisibleChildren = true;
            }
        }

        // Bookmark
        else if (child.type === "bookmark") {

            // to_delete → immer ausblenden
            if (child.to_delete === true) continue;

            // normale Sichtbarkeit
            if (child.visible === false) continue;

            const dupNums = duplicates ? duplicates.get(child.url) : null;

            // Filter: Nur Duplikate
            if (window.showDuplicatesOnly && !dupNums) continue;

            // Filter: Suche
            if (window.currentSearchTerm && !window.matchesSearch(child)) continue;

            const liB = document.createElement("li");
            liB.className = "bookmark-item";

            const absNum = child.absoluteNumber || "";
            liB.id = "link-" + absNum.replace(/\./g, "-");
            liB.setAttribute("data-abs", absNum);

            hasVisibleChildren = true;

            if (dupNums) liB.classList.add("duplicate");

            // Nummer
            if (window.showNumbers && child.absoluteNumber) {
                const num = document.createElement("span");
                num.className = "entry-number";
                num.textContent = child.absoluteNumber + " ";
                liB.appendChild(num);
            }

            // Link
            const link = document.createElement("a");
            link.href = child.url;
            link.target = "_blank";
            link.textContent = child.title || child.url || "(Ohne Titel)";

            if (window.currentSearchTerm && window.matchesSearch(child)) {
                link.classList.add("highlight");
            }

            liB.appendChild(link);

            // Checkbox
            if (child.showCheckbox) {
                const cb = document.createElement("input");
                cb.type = "checkbox";
                cb.className = "bookmark-checkbox";
                cb.checked = child.selected;

                cb.addEventListener("change", () => {
                    child.selected = cb.checked;
                });

                liB.appendChild(cb);
            }

            // Duplikat-Fundstellen
            if (dupNums && window.showDuplicateLocations) {
                const info = document.createElement("span");
                info.style.color = "#b00";
                info.style.marginLeft = "8px";
                info.textContent = "(Fundstellen: ";

                dupNums.forEach((num, index) => {
                    const a = document.createElement("a");
                    const id = "link-" + num.replace(/\./g, "-");

                    a.href = "#" + id;
                    a.textContent = num;
                    a.style.color = "#b00";
                    a.style.textDecoration = "underline";

                    a.addEventListener("click", () => {
                        const target = document.getElementById(id);
                        if (target) {
                            target.classList.add("jump-highlight");
                            setTimeout(() => target.classList.remove("jump-highlight"), 1500);
                        }
                    });

                    info.appendChild(a);

                    if (index < dupNums.length - 1) {
                        info.appendChild(document.createTextNode(", "));
                    }
                });

                info.appendChild(document.createTextNode(")"));
                liB.appendChild(info);
            }

            // Tags
            if (child.tags && child.tags.length > 0) {
                const tagDiv = document.createElement("div");
                tagDiv.textContent = "Tags: " + child.tags.join(", ");
                tagDiv.style.marginLeft = "20px";
                tagDiv.style.fontSize = "0.9em";
                tagDiv.style.color = "#006";
                liB.appendChild(tagDiv);
            }

            // URL-Anzeige
            const urlDiv = document.createElement("div");
            urlDiv.textContent = child.url;
            urlDiv.style.marginLeft = "20px";
            urlDiv.style.fontSize = "0.9em";
            urlDiv.style.color = "#444";

            urlDiv.style.display =
                (window.showAllUrls && child.visible !== false)
                    ? "block"
                    : "none";

            liB.appendChild(urlDiv);

            ul.appendChild(liB);
        }
    }

    if (!hasVisibleChildren && !folderMatches) return null;

    li.appendChild(ul);
    return li;
};
