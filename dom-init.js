// ------------------------------------------------------------
// dom-init.js
// Initialisiert globale DOM-Elemente, Flags und Hilfsfunktionen
// ------------------------------------------------------------

// Buttons & Inputs
window.btnLoad = document.getElementById("btnLoad");
window.btnToggleNumbers = document.getElementById("btnToggleNumbers");
window.btnToggleAllUrls = document.getElementById("btnToggleAllUrls");
window.btnShowDuplicates = document.getElementById("btnShowDuplicates");
window.btnToggleLocations = document.getElementById("btnToggleLocations");
window.btnToggleCheckboxes = document.getElementById("btnToggleCheckboxes");
window.btnHideSelected = document.getElementById("btnHideSelected");
window.btnShowHidden = document.getElementById("btnShowHidden");
window.btnSelectEmptyFolders = document.getElementById("btnSelectEmptyFolders");
window.btnSelectVisible = document.getElementById("btnSelectVisible");
window.btnMoveVisibleChecked = document.getElementById("btnMoveVisibleChecked");
window.btnExport = document.getElementById("btnExport");
window.btnExportHtml = document.getElementById("btnExportHtml");

window.fileInput = document.getElementById("fileInput");
window.searchInput = document.getElementById("searchInput");

// Debug-Elemente
window.debugOverlay = document.getElementById("debugOverlay");
window.debugHeader = document.getElementById("debugHeader");
window.debugContent = document.getElementById("debugContent");

// Anzeige-Bereiche
window.messageArea = document.getElementById("messageArea");
window.treeContainer = document.getElementById("treeContainer");

// ------------------------------------------------------------
// Globale Flags (Standardwerte)
// ------------------------------------------------------------

window.showNumbers = true;
window.showAllUrls = false;
window.showDuplicatesOnly = false;
window.showDuplicateLocations = true;
window.showUrlCheckboxes = false;
window.showFolderCheckboxes = false;

window.currentSearchTerm = "";

// Datenstrukturen
window.bookmarkData = { folders: [] };
window.bookmarkIndex = null;
window.duplicates = null;

// ------------------------------------------------------------
// Hilfsfunktion: Nachricht anzeigen
// ------------------------------------------------------------
window.setMessage = function (text) {
    messageArea.textContent = text;
};
