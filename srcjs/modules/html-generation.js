import utilities from "./utilities";

import styles from "./checkbox.css"
import searchLogic from "./search-functions";

/* global jQuery */

const htmlGenerators = {}

htmlGenerators.createUniqueID = (() => {
    let i = 0;
    return () => {
        return i++;
    }
})();


htmlGenerators.createTreeCheckboxContainer = function (options) {
    let $container = $("<div>", {
        "class": `${styles.treeCheckboxContainer} border border-fg rounded d-flex flex-column`,
        "id": `tree-checkbox-container-${htmlGenerators.createUniqueID()}`
    })

    // Set the max width of the container
    if (options.maxWidth !== null) {
        $container.css("max-width", options.maxWidth)
    }

    // Set the height of the container
    if (options.height !== null) {
        $container.css("height", options.height)
    }

    $container.css("list-style-type", "none")

    return $container
}


htmlGenerators.createElementNode = function ($mainContainer, value, label, hasChildren, initialState = null) {
    // We create a span which hold the caret, checkbox and label. And then we create a div which holds the children
    let $node = $("<div>", {"class": `${styles.treeCheckboxNode} ${styles.collapsed}`, "id": "checkbox-node-" + value})
    let $checkBoxSpan = $("<span>", {"class": styles.treeCheckboxNodeSpan})
    let $children = $("<ul>", {"class": styles.treeCheckboxNodeChildren}).hide()
    const options = $mainContainer.data("options")

    // Create the caret
    let $caret = htmlGenerators.createCaret(hasChildren)
    $checkBoxSpan.append($caret)

    $caret.on("click", function () {
        utilities.caretClickLogic.call(this, $node, $mainContainer, value);
    })

    // We convert to case
    if (!options.hideCheckboxes) {
        let $checkbox = htmlGenerators.attachCheckbox($mainContainer, $node, value, options, initialState)
        $checkBoxSpan.append($checkbox)
    }

    // Create the label, and add the click event if clickableLabels is true
    // use tree-checkbox-node-label when clickableLabels is false else use tree_checkbox_node_label_clickable
    let $label = $("<span>", {"class": styles.treeCheckboxNodeLabel})
    $label.html(label)
    if (options.clickableLabels) {
        $label.addClass(styles.clickable)
        $label.on("click", function () {
            const returnValue = $mainContainer.data("treeData")[value][options.returnValue]
            utilities.labelClickLogic($mainContainer, returnValue, options)
        })
    }

    // Add the caret, checkbox and label to the span
    $checkBoxSpan.append($label)

    // Add the span and children to the node
    $node.append($checkBoxSpan)

    // Add the children to the node
    if (hasChildren) {
        $node.append($children)
    }

    return $node
}

htmlGenerators.attachCheckbox = function ($mainContainer, $node, value, options, initialState = null) {
    let $checkbox = $("<span>", {"class": styles.treeCheckboxNodeCheckbox, "value": value})

    // Add events to button
    $(document).ready(function () {
        utilities.setCheckboxLogic($mainContainer, $checkbox, value, options, initialState)
    })

    return $checkbox
}

htmlGenerators.createCaret = function (hasChildren, startCollapsed = true) {
    if (hasChildren) {
        let $caret = $("<span>", {"class": styles.treeCheckboxCaret})
        if (!startCollapsed) {
            $caret.addClass(styles.expanded)
        } else {
            $caret.addClass(styles.collapsed)
        }
        $caret.html('<svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 256 512"><path d="M246.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-128-128c-9.2-9.2-22.9-11.9-34.9-6.9s-19.8 16.6-19.8 29.6l0 256c0 12.9 7.8 24.6 19.8 29.6s25.7 2.2 34.9-6.9l128-128z"/></svg>')
        return $caret
    } else {
        return $("<span>", {"class": styles.treeCheckboxCaretEmpty})
    }
}


htmlGenerators.generateDeSelectAllButton = function ($mainContainer, $buttonGroup, options) {
    let deselectAllID = "tree-checkbox-deselect-all-button-" + htmlGenerators.createUniqueID()

    // The goal here to create a button which has a dropdown menu. The dropdown menu will have two buttons, one for
    // deselecting all and one for selecting all
    // We should use the bootstrap 5 classes for styling and use the deselectAllID for the id
    let $selectButton = $("<button>", {
        "class": "btn btn-outline-fg dropdown-toggle border-bottom",
        "type": "button",
        "id": deselectAllID,
        "data-bs-toggle": "dropdown",
        "aria-expanded": "false"
    })
    $selectButton.html("(De)select")
    $selectButton.css("border-radius", "0")
    $buttonGroup.append($selectButton)

    // Create the dropdown menu
    let $dropdownMenu = $("<ul>", {"class": "dropdown-menu", "aria-labelledby": deselectAllID})
    $dropdownMenu.css("border-radius", "0")
    $buttonGroup.append($dropdownMenu)

    // Create the deselect all button
    let $deselectAll = $("<li>")
    if (options.states.hasOwnProperty("none")) {
        let $deselectAllButton = $("<button>", {
            "class": "dropdown-item",
            "type": "button",
            "id": "tree-checkbox-deselect-all-button"
        })
        $deselectAllButton.html("Deselect All")
        $deselectAll.append($deselectAllButton)

        $deselectAllButton.on("click", function () {
            // If the "none" select state is available (it is in the options.states object), then we should use that
            // Else we use the defaultState
            const newState = options.states.hasOwnProperty("none") ? "none" : options.defaultState;
            utilities.deSelectAll($mainContainer, options, newState)
            utilities.runUpdateCallback($mainContainer, "deSelectAll", null, newState)
        })
    } else {
        // We can now only select and not deselect. Thus, we changed the text from $selectButton to Select
        $selectButton.html("Select")
    }

    $dropdownMenu.append($deselectAll)

    // Cycle over the states
    for (let state in options.states) {
        // If the state is none, then we do not need to add a button for it or if the state is skipCursor
        if (!options.states[state].skipCursor && state !== "none") {
            const stateName = state.toLowerCase();
            const $selectButtonButton = $("<button>", {
                "class": "dropdown-item",
                "type": "button",
                "id": "tree-checkbox-select-all-button"
            });
            $selectButtonButton.html(`${stateName} All`);
            $dropdownMenu.append($("<li>").append($selectButtonButton));

            $selectButtonButton.on("click", function () {
                utilities.deSelectAll($mainContainer, options, state)
                utilities.runUpdateCallback($mainContainer, "SelectAllChange", null, stateName)
            })
        }
    }
}

htmlGenerators.generateCollapseButton = function ($mainContainer, $buttonGroup) {
    // Add a Collapse All button
    let collapseExpandID = "tree-checkbox-collapse-expand-button-" + htmlGenerators.createUniqueID()

    // We only need a single button which collapses all nodes. This is not a dropdown button

    let $collapseButton = $("<button>", {
        "class": "btn btn-outline-fg border-bottom",
        "type": "button",
        "id": collapseExpandID
    })
    $collapseButton.html('Collapse All')
    $collapseButton.css("border-radius", "0")
    $buttonGroup.append($collapseButton)

    // Add the click event
    $collapseButton.on("click", function () {
        utilities.collapseAll($mainContainer)
    })
}

htmlGenerators.generateSearchBar = function ($buttonGroup, $buttonContainer, options, $mainContainer) {
    // Add a search button
    let $openSearchBar = $("<button>", {
        "class": "btn btn-outline-fg border-bottom",
        "type": "button",
        "id": "tree-checkbox-search-button"
    })
    $openSearchBar.html("<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"16\" height=\"16\" fill=\"currentColor\" class=\"bi bi-search\" viewBox=\"0 0 16 16\">\n" +
        "  <path d=\"M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z\"/>\n" +
        "</svg>Search")
    $openSearchBar.css("border-radius", "0")
    // Add the border-bottom class to the button
    $buttonGroup.append($openSearchBar)

    let $searchBarContainer = $("<div>", {"class": `input-group ${styles.treeCheckboxSearchBarContainer}`}).hide()
    $buttonContainer.append($searchBarContainer)

    let $searchBar = $("<input>", {"class": "form-control tree-checkbox-search-bar", "type": "text"})
    $searchBar.attr("placeholder", "Search")
    $searchBar.css("border-radius", "0")
    $searchBarContainer.append($searchBar)


    $searchBar.on("keyup", function () {
        const searchBarValue = $searchBar.val().trim();
        const characterWord = options.minSearchChars === 1 ? "character" : "characters";

        if (searchBarValue.length === 0) {
            // If the search bar is empty, display a message
            const $searchResult = $("<a>", {
                "class": "list-group-item list-group-item-action"
            }).html("Please enter at least " + options.minSearchChars + " " + characterWord + " to start searching");

            const $searchResultsList = $("<div>", {
                "class": "list-group"
            }).append($searchResult);

            $mainContainer.find(`.${styles.treeCheckboxSearchResultsContainer}`).empty().append($searchResultsList);
        } else {
            utilities.searchBarOpenLogic($mainContainer, options);
            searchLogic($mainContainer, options);
        }
    });

    $searchBar.on("keydown", function (event) {
        if (event.key === "Escape" || (event.key === "Backspace" && $searchBar.val() === "")) {
            utilities.searchBarCloseLogic($mainContainer, options);
        }
    });


    // Add a cancel button
    let $cancelButton = $("<button>", {
        "class": "btn btn-outline-fg border-bottom",
        "type": "button",
        "id": "tree-checkbox-cancel-button",
        'aria-label': 'Close-search-bar'
    })
    $cancelButton.html('<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-up" viewBox="0 0 16 16">\n' +
        '  <path fill-rule="evenodd" d="M8 15a.5.5 0 0 0 .5-.5V2.707l3.146 3.147a.5.5 0 0 0 .708-.708l-4-4a.5.5 0 0 0-.708 0l-4 4a.5.5 0 1 0 .708.708L7.5 2.707V14.5a.5.5 0 0 0 .5.5z"/>\n' +
        '</svg>')
    $cancelButton.css("border-radius", "0")

    $searchBarContainer.append($cancelButton)


    $cancelButton.on("click", function () {
        utilities.searchBarCloseLogic($mainContainer, options)
    })

    // Set the click event for the search button
    $openSearchBar.on("click", function () {
        utilities.searchBarClickLogic($mainContainer)
    })
}

htmlGenerators.createTreeButtonContainer = function ($mainContainer, options) {
    // Create the main container which will hold items such as buttons for selecting all, deselecting all, etc. Use
    // bootstrap 5 classes for styling
    let $buttonContainer = $("<div>", {"class": `${styles.treeCheckboxButtonContainer} container-fluid w-100 d-flex flex-column`})


    // Add a button group to the row
    let $buttonGroup = $("<div>", {"class": "btn-group w-100"})
    $buttonContainer.append($buttonGroup)

    if (options.showSelectAll && options.hideCheckboxes === false) {
        htmlGenerators.generateDeSelectAllButton($mainContainer, $buttonGroup, options)

    }

    // If collapseAll and expandAll are true, then we need to add dropdown buttons
    if (options.showCollapseAll) {
        // If the data has no children, then we do not need to add a collapse all button
        const treeData = $mainContainer.data("treeData");
        const hasChildren = Object.values(treeData).some(item => item.children.length > 0);

        if (hasChildren) {
            htmlGenerators.generateCollapseButton($mainContainer, $buttonGroup);
        }
    }

    // We also have to add a search bar which will be in another group. There will be an input and search button
    if (options.showSearchBar) {
        const $searchResultsContainer = $("<div>", {
            "class": `${styles.treeCheckboxSearchResultsContainer} overflow-auto flex-grow-1`,
            "height": options.height,
            "max-height": options.height
        }).hide();

        htmlGenerators.generateSearchBar($buttonGroup, $buttonContainer, options, $mainContainer);
        $buttonContainer.append($searchResultsContainer);
    }

    // We add a toggle button which switches from OR to AND and vice versa when clicked
    if (options.showToggle) {
        let $toggleButton = $("<select>", {
            "class": `form-select border-top-0 border-end-0 ${styles.treeCheckboxToggleButton}`,
            "data-bs-toggle": "tooltip",
            "data-bs-delay": "100",
            "data-bs-placement": "bottom",
            "title": "Toggle between requiring all selected checkboxes (AND) or just one of them (OR) to match the search criteria.", // Add the tooltip title
            "data-value": options.toggleDefaultState,
        });

        // Add the options to the select
        let $toggleButtonAND = $("<option>", {
            "value": "AND",
            "selected": options.toggleDefaultState === "AND",
            "html": "AND"
        });

        let $toggleButtonOR = $("<option>", {
            "value": "OR",
            "selected": options.toggleDefaultState === "OR",
            "html": "OR"
        });

        // Add the radio buttons to the toggleButton
        $toggleButton.append($toggleButtonAND);
        $toggleButton.append($toggleButtonOR);

        // Add the toggleButton to the buttonGroup
        $buttonGroup.append($toggleButton);


        // Create an event when the toggleButton state is changed
        $toggleButton.on("change", function () {
            utilities.toggleLogic($mainContainer, options);
        });

        // We set the toggleButton to the default state
        $(document).on("shiny:sessioninitialized", function () {
            Shiny.setInputValue(options.containerID + '_logic', options.toggleDefaultState, {
                priority: 'event'
            });
        });
    }


    return $buttonContainer
}

export default htmlGenerators;