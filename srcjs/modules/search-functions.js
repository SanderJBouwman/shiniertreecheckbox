import styles from "./checkbox.css";
import utilities from "./utilities";
import DOMPurify from "dompurify";

/**
 * Performs a search logic operation within a specified main container.
 *
 * @param {jQuery} $mainContainer - The jQuery object representing the main container containing tree nodes.
 * @param {object} options - An object containing configuration options.
 */
function searchLogic($mainContainer, options) {
    if (options.advancedSearch) {
        doAdvancedSearch($mainContainer, options)
    } else {
        doSimpleSearch($mainContainer, options)
    }
}
/**
 * Performs a simple search operation by searching for the search term in the label of each node.
 * It does not use the labels, but uses the tree data map instead. This is much faster and need because
 * we don't need to render the nodes first.
 *
 * @param {jQuery} $mainContainer - The jQuery object representing the main container containing tree nodes.
 * @param {object} options - An object containing configuration options.
 */
function doSimpleSearch($mainContainer, options) {
    let searchTerm = $mainContainer.find(".tree-checkbox-search-bar").val().toLowerCase()
    const cleanSearchTerm = DOMPurify.sanitize(searchTerm)

    let searchItems = $mainContainer.data("treeData")

    let searchResults = Object.values(searchItems).filter(item => item.label.toLowerCase().includes(cleanSearchTerm))

    // We only want to show the first options.maxSearchResults results
    searchResults = searchResults.slice(0, options.maxSearchResults)

    showSearchResultsSimpleSearch($mainContainer, searchResults, cleanSearchTerm)
}
/**
 * Performs an advanced search operation within the main container. This will work with a database search.
 * The goal is that
 *
 * @param {jQuery} $mainContainer - The jQuery object representing the main container containing tree nodes.
 * @param {object} options - An object containing configuration options.
 */
function doAdvancedSearch($mainContainer, options) {
    // Raise an not implemented error
    throw new Error("Advanced search is not implemented yet")
}


/**
 * Navigates to a specific node in the tree structure and highlights the search term.
 *
 * @param {object} items - The tree data structure.
 * @param {object} result - The search result to navigate to.
 * @param {jQuery} $mainContainer - The jQuery object representing the main container containing tree nodes.
 */
function goToNode(items, result, $mainContainer) {
    // Clear the search bar and show all nodes again when the user clicks on the message.
    const options = $mainContainer.data('options');

    // Create a queue of node IDs from 'items' to the root node with 'result.value'.
    const queue = nodeToRoot(items, result[options.nodeIdProperty], []);

    // Iterate through the queue, excluding the last item as it's the target node.
    queue.forEach((item, index) => {
        // Find the node element by its ID.
        const $node = $mainContainer.find(`#checkbox-node-${item}`).first();

        // Get the caret element, which is a child of the node.
        // Avoid using find to prevent selecting children's carets.
        const $caret = $node.children(`.${styles.treeCheckboxNodeSpan}`).children(`.${styles.treeCheckboxCaret}`).first();

        // If the caret is collapsed, expand it by clicking on it.
        if ($caret.hasClass(styles.collapsed)) {
            $caret.click();
        }
    });

    // Cache the treeCheckboxNodeContainer for later use.
    const $treeCheckboxNodeContainer = $mainContainer.find(`.${styles.treeCheckboxNodeContainer}`);

    // Colorize the search term in the label by adding the highlight class.
    // First, remove the highlight class from all labels.
    $mainContainer.find(`.${styles.treeCheckboxNodeLabel}`).removeClass(styles.highlight);

    const $targetNode = $mainContainer.find(`#checkbox-node-${result[options.nodeIdProperty]}`);
    $targetNode.find(`.${styles.treeCheckboxNodeLabel}`).first().addClass(styles.highlight);

    // Hide the search results and show the node container again.
    $mainContainer.find(`.${styles.treeCheckboxSearchResultsContainer}`).hide();
    $treeCheckboxNodeContainer.show();

    // Clear the search bar.
    $mainContainer.find('.tree-checkbox-search-bar').val('');

    // Calculate the scroll offsets for both vertical and horizontal scrolling.
    const scrollTopOffset = $targetNode.offset().top - $treeCheckboxNodeContainer.offset().top + $treeCheckboxNodeContainer.scrollTop();
    const scrollLeftOffset = $targetNode.offset().left - $treeCheckboxNodeContainer.offset().left + $treeCheckboxNodeContainer.scrollLeft();

    // Scroll to the node with animations.
    $treeCheckboxNodeContainer.animate({
        scrollTop: scrollTopOffset,
        scrollLeft: scrollLeftOffset,
    }, 500);

    // Trigger a click on the label of the node if the search triggers label click option is enabled and the labels are clickable.
    if (options.searchTriggersLabelClick && options.clickableLabels) {
        $targetNode.find(`.${styles.treeCheckboxNodeLabel}`).first().click();
    }
}


/**
 * This function displays the search results for a simple search. It will build a list of DOM elements and
 * replace the search results container content with the generated list.
 *
 * @param {jQuery} $mainContainer - The main container element.
 * @param {Array} searchResults - An array of search results.
 * @param {string} searchTerm - The search term.
 */
function showSearchResultsSimpleSearch($mainContainer, searchResults, searchTerm) {
    // Hide the tree node container and display the search results container
    $mainContainer.find(`.${styles.treeCheckboxNodeContainer}`).hide();
    $mainContainer.find(`.${styles.treeCheckboxSearchResultsContainer}`).show();
    $mainContainer.find(`.${styles.treeCheckboxButtonContainer}`).css("height", "100%");

    const options = $mainContainer.data("options");
    const items = $mainContainer.data("treeData");

    // Create a list for displaying search results
    let $searchResultsList = $("<div>", {"class": "list-group"});

    searchResults.forEach(function (result) {
        let $searchResult = $("<a>", {"class": "list-group-item list-group-item-action", value: result.value});
        let parentLabel = items[result.parent] ? items[result.parent].label : "null";
        let label = colorizeLabel(result.label, searchTerm);

        if (options.advancedSearch) {
            label = label + ` <small>(${result.column})</small>`;
            $searchResult.html(label);
        } else {
            let $labelContainer = $("<span>");
            let $label = $("<span>").html(label);
            $labelContainer.append($label);
            $searchResult.html($labelContainer);

            if (result.parent !== null) {
                // Add a badge with the parent label
                let $badge = $("<span>", {"class": "badge bg-secondary rounded-pill float-right"})
                    .html(parentLabel)
                ;
                $labelContainer.append($badge);
            }
        }

        // Handle click event to close the search bar and navigate to the selected node
        $searchResult.on("click", function () {
            utilities.searchBarCloseLogic($mainContainer);
            goToNode(items, result, $mainContainer);
        });

        $searchResultsList.append($searchResult);
    });

    // If there are no search results and a search term is provided, display a message
    if (searchResults.length === 0 && searchTerm.length > 0) {
        let $searchResult = $("<a>", {"class": "list-group-item list-group-item-action"});
        // Clean the searchTerm to prevent XSS
        let cleanSearchTerm = DOMPurify.sanitize(searchTerm);
        $searchResult.html(`No results found for <strong>${cleanSearchTerm}</strong>`);
        $searchResultsList.append($searchResult);
    }

    // Replace the search results container content with the generated list
    $mainContainer.find(`.${styles.treeCheckboxSearchResultsContainer}`).html($searchResultsList);
}

/**
 * NodeToRoot returns a list of nodes from the node to the root node.
 * The goal is to find the first rendered parent of the node. So we start with the parent and check if it has
 * been rendered if not we add it to the queue and repeat until we reach a node that has been rendered. This is
 * used for the search logic to expand the nodes to the node that has been searched for.
 * @param {Object} data The tree data
 * @param {int} value The value of the node
 * @param {Array} queue The queue to add the nodes to
 * @returns {*}
 */
function nodeToRoot(data, value, queue) {
    let parentID = data[value].parent
    while (parentID !== null) {
        queue.unshift(parentID)
        parentID = data[parentID].parent
    }
    return queue
}

//colorize search term occurrences in the label
function colorizeLabel (label, searchTerm) {
    let labelLowerCase = label.toLowerCase()
    let searchTermLowerCase = searchTerm.toLowerCase()

    // We should use the capitalization of the label and not the search term
    return labelLowerCase.replace(new RegExp(searchTermLowerCase, "g"), "<span class='text-fw fw-bold text-decoration-underline'>" + searchTerm + "</span>")
}


export default searchLogic;