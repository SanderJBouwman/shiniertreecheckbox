import styles from "./checkbox.css";

/**
 * Performs a search logic operation within a specified main container.
 *
 * @param {jQuery} $mainContainer - The jQuery object representing the main container containing tree nodes.
 * @param {object} options - An object containing configuration options.
 */
function searchLogic($mainContainer, options) {
    // If we have less than the minimum search chars, we won't do a search
    if (!checkMinSearchChars($mainContainer, options)) {
        return
    }
    if (options.advancedSearch) {
        doAdvancedSearch($mainContainer, options)
    } else {
        doSimpleSearch($mainContainer, options)
    }
}

/**
 * Checks the minimum search characters required and hides nodes if the search criteria are not met.
 *
 * @param {jQuery} $mainContainer - The jQuery object representing the main container containing tree nodes.
 * @param {object} options - An object containing configuration options.
 */
function checkMinSearchChars($mainContainer, options) {
    let searchTermLength = $mainContainer.find(".tree-checkbox-search-bar").val().length
    let minSearchChars = options.minSearchChars

    if (minSearchChars > searchTermLength || searchTermLength === 0) {
        $mainContainer.find(`.${styles.treeCheckboxSearchResultsContainer}`).hide()
        $mainContainer.find(`.${styles.treeCheckboxNodeContainer}`).show()
        return false
    }
    return true
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
    // If the search term is empty, we show all nodes again.
    if (searchTerm.length === 0) {
        $mainContainer.find(`.${styles.treeCheckboxNodeContainer}`).show()
        $mainContainer.find(`.${styles.treeCheckboxSearchResultsContainer}`).hide()
        return
    }
    let searchItems = $mainContainer.data("treeData")

    let searchResults = Object.values(searchItems).filter(item => item.label.toLowerCase().includes(searchTerm))

    // We only want to show the first options.maxSearchResults results
    searchResults = searchResults.slice(0, options.maxSearchResults)

    showSearchResultsSimpleSearch($mainContainer, searchResults, searchTerm)
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

    const searchTerm = $mainContainer.find(".tree-checkbox-search-bar").val().toLowerCase()
    // If the search term is empty, we show all nodes again.
    if (searchTerm.length === 0) {
        $mainContainer.find(`.${styles.treeCheckboxNodeContainer}`).show()
        $mainContainer.find(`.${styles.treeCheckboxSearchResultsContainer}`).hide()
        return
    }
    // For now we use a pseudo database search
    let searchResults = pseudoDatabaseSearch($mainContainer, searchTerm)

    // We want to limit the number of results by using the maxSearchResults option
    searchResults = searchResults.slice(0, options.maxSearchResults)
    showSearchResultsAdvancedSearch($mainContainer, searchResults, searchTerm)
}

/**
 * Simulates a database search based on the search term and returns search results.
 *
 * @param {jQuery} $mainContainer - The jQuery object representing the main container containing tree nodes.
 * @param {string} searchTerm - The search term to be used for searching.
 * @returns {array} An array of search results.
 */
function pseudoDatabaseSearch($mainContainer, searchTerm) {
    let data = $mainContainer.data("treeData")
    let searchResults = []
    // We want to search in the label of each node
    Object.keys(data).forEach(function (key) {
        const columnTypes = ["name", "description", "type"]
        let node = data[key]
        if (node.label.toLowerCase().includes(searchTerm.toLowerCase())) {
            // The column type will be an array which is has a random length of 1 to 3
            let columnType = []
            for (let i = 0; i < Math.floor(Math.random() * 3) + 1; i++) {
                // Grab a random column type and remove it from the array
                let randomColumnType = columnTypes.splice(Math.floor(Math.random() * columnTypes.length), 1)[0]
                columnType.push(randomColumnType)
            }

            searchResults.push({value: key, column: columnType})
        }
    })
    return searchResults

}

/**
 * Navigates to a specific node in the tree structure and highlights the search term.
 *
 * @param {object} items - The tree data structure.
 * @param {object} result - The search result to navigate to.
 * @param {jQuery} $mainContainer - The jQuery object representing the main container containing tree nodes.
 */
function goToNode(items, result, $mainContainer) {
    // We want to clear the search bar and show all nodes again when the user clicks on the message
    let queue = nodeToRoot(items, result.value, [])
    // Do forEach except for the last item in the array as that is the node we want to go to
    queue.forEach(function (item) {
        // .tree-checkbox-caret.collapsed should be changed to use sty
        let $node = $mainContainer.find("#checkbox-node-" + item)
        $node.find(`.${styles.treeCheckboxCaret}.${styles.collapsed}`).first().click()
    })
    // We want to colorize the search term in the label by adding the highlight class
    // First we remove the highlight class from all labels
    $mainContainer.find(`.${styles.treeCheckboxNodeLabel}`).removeClass(styles.highlight)
    let $targetNode = $mainContainer.find("#checkbox-node-" + result.value)
    $targetNode.find(`.${styles.treeCheckboxNodeLabel}`).first().addClass(styles.highlight)

    // We want to hide the search results and show the node container again
    $mainContainer.find(`.${styles.treeCheckboxSearchResultsContainer}`).hide()
    $mainContainer.find(`.${styles.treeCheckboxNodeContainer}`).show()

    // We want to clear the search bar
    $mainContainer.find(".tree-checkbox-search-bar").val("")

    // We want to scroll to the node
    $mainContainer.find(`.${styles.treeCheckboxNodeContainer}`).animate({
        scrollTop: $targetNode.offset().top - $mainContainer.find(`.${styles.treeCheckboxNodeContainer}`).offset().top + $mainContainer.find(`.${styles.treeCheckboxNodeContainer}`).scrollTop()
    }, 500)
    // Also scroll horizontally if the node is not visible
    $mainContainer.find(`.${styles.treeCheckboxNodeContainer}`).animate({
        scrollLeft: $targetNode.offset().left - $mainContainer.find(`.${styles.treeCheckboxNodeContainer}`).offset().left + $mainContainer.find(`.${styles.treeCheckboxNodeContainer}`).scrollLeft()
    }, 500)
}

/**
 * Displays search results for an advanced search in a table format. The table will have two columns: label and column type.
 * If the node label is found in the column type, it will be highlighted.
 *
 * @param {jQuery} $mainContainer - The jQuery object representing the main container containing tree nodes.
 * @param {array} searchResults - An array of search results.
 * @param {string} searchTerm - The search term used for the search.
 */
function showSearchResultsAdvancedSearch($mainContainer, searchResults, searchTerm) {
    $mainContainer.find(`.${styles.treeCheckboxNodeContainer}`).hide()
    $mainContainer.find(`.${styles.treeCheckboxSearchResultsContainer}`).show()
    const options = $mainContainer.data("options")
    const items = $mainContainer.data("treeData")
    // Instead of showing the search results in a list, we want to show them in a table
    // The table should have the following columns: label, search term found in
    let $searchResultsTable = $("<table>", {"class": "table table-hover table-sm"})
    let $thead = $("<thead>")
    let $tbody = $("<tbody>")
    let $tr = $("<tr>")
    let $thLabel = $("<th>", {scope: "col"}).html("Name")
    let $thColumn = $("<th>", {scope: "col"}).html("Search term found in")
    $tr.append($thLabel)
    $tr.append($thColumn)
    $thead.append($tr)
    $searchResultsTable.append($thead)
    searchResults.forEach(function (result) {
        let $tr = $("<tr>")
        let $tdLabel = $("<td>")
        let $tdColumn = $("<td>")
        let nodeLabel = items[result.value].label

        // We get the columnType. We will first sort the array so that the order is always the same and then join the array to a string seperated by a comma
        let columnType = result.column.sort().join(", ")
        // We can now add these to the table
        // If the "label" is in the columnType, we receive an array
        if (columnType.includes("name")) {
            nodeLabel = colorizeLabel(nodeLabel, searchTerm)
        }
        $tdLabel.html(nodeLabel)
        $tdColumn.html(columnType)
        $tr.append($tdLabel)
        $tr.append($tdColumn)
        $tbody.append($tr)
        $searchResultsTable.append($tbody)

        $tr.on("click", function () {
            goToNode(items, result, $mainContainer);
        })
    })

    $mainContainer.find(`.${styles.treeCheckboxSearchResultsContainer}`).html($searchResultsTable)

}

function showSearchResultsSimpleSearch($mainContainer, searchResults, searchTerm) {
    $mainContainer.find(`.${styles.treeCheckboxNodeContainer}`).hide()
    $mainContainer.find(`.${styles.treeCheckboxSearchResultsContainer}`).show()
    const options = $mainContainer.data("options")
    const items = $mainContainer.data("treeData")
    let $searchResultsList = $("<div> ", {"class": "list-group"})
    searchResults.forEach(function (result) {
        // We dont want it rounded
        let $searchResult = $("<a>", {"class": "list-group-item list-group-item-action", value: result.value})
        let parentLabel = items[result.parent] ? items[result.parent].label : "null"
        let label = colorizeLabel(result.label, searchTerm)

        if (options.advancedSearch) {
            label = label + " <small>(" + result.column + ")</small>"
            $searchResult.html(label)

        } else {
            let $labelContainer = $("<span>")
            let $label = $("<span>").html(label)
            $labelContainer.append($label)
            $searchResult.html($labelContainer)

            if (result.parent !== null) {
                // We want to add a badge with the parent label
                let $badge = $("<span>", {"class": "badge bg-secondary rounded-pill float-right"}).html(parentLabel)
                $labelContainer.append($badge)
            }
        }

        $searchResultsList.append($searchResult)

        $searchResult.on("click", function () {
            goToNode(items, result, $mainContainer);
        })
    })
    // If there are no search results, we show a message to the user. But only if there is a search term.
    if (searchResults.length === 0 && searchTerm.length > 0) {
        let $searchResult = $("<a>", {"class": "list-group-item list-group-item-action"})
        $searchResult.html("No results found for <strong>" + searchTerm + "</strong>")
        $searchResultsList.append($searchResult)
    }
    $mainContainer.find(`.${styles.treeCheckboxSearchResultsContainer}`).html($searchResultsList)
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
    // We want to find the first rendered parent of the node. So we start with the parent and check if it has been rendered if not we add it to the queue and repeat
    // We want to find the parent of the node and expand it. If the parent is also not rendered, then we expand that as well and so on
    // So the first queue item is the highest parent
    let parentID = data[value].parent
    // We want to get a list from the node to the root node. The root node has parentID null
    while (parentID !== null) {
        // We check if the parent is rendered
        // If the parent is not rendered we add it to the queue
        queue.unshift(parentID)
        // We set the parentID to the parent of the parent
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