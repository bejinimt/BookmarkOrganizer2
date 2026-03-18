// ------------------------------------------------------------
// duplicates-apply.js
// Markiert Duplikate, blendet aber NICHTS aus
// ------------------------------------------------------------

window.applyDuplicateVisibility = function () {

    if (!window.duplicates) return;

    for (const [url, absNumbers] of window.duplicates.entries()) {

        // Erstes Vorkommen bleibt unselektiert
        const [first, ...rest] = absNumbers;

        // Erstes Vorkommen: Checkbox anzeigen, aber NICHT anhaken
        const firstObj = window.bookmarkIndex[first];
        if (firstObj) {
            firstObj.showCheckbox = true;
            firstObj.selected = false;
        }

        // Alle weiteren: Checkbox anzeigen UND anhaken
        for (const num of rest) {
            const obj = window.bookmarkIndex[num];
            if (!obj) continue;

            obj.showCheckbox = true;
            obj.selected = true;
        }
    }
};
