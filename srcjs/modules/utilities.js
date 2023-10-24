import htmlGenerators from "./html-generation";
import styles from "./checkbox.css"

/* global jQuery */

const utilities = {
}

/**
 * Create a tree structure within a parent element based on provided data and options. This is the main function
 * that should be called to create a tree. It will create the main container, button container, node container and
 * add the nodes to the tree.
 *
 * @param {jQuery} $parent - The parent element where the tree will be created.
 * @param {Object} data - The hierarchical data structure for the tree.
 * @param {object} options - Configuration options for the tree.
 */
utilities.createTree = function ($parent, data, options) {
    // Create the main container for the tree
    let $mainContainer = htmlGenerators.createTreeCheckboxContainer(options);
    $parent.append($mainContainer);

    // Flatten the hierarchical data structure, for easier processing
    let flattenedData = this.flattenJSON(data, options);

    // Store the flattened data in the main container
    $mainContainer.data("treeData", flattenedData);

    // Store the options in the main container
    $mainContainer.data("options", options);

    // Create the button container for tree operations
    let $buttonContainer = htmlGenerators.createTreeButtonContainer($mainContainer, options);

    // Check if the button container is empty and hide it if so
    $mainContainer.append($buttonContainer);
    if ($buttonContainer.find(".btn-group").children().length === 0) {
        $buttonContainer.hide();
    }

    // Create a container for the nodes
    let $nodeContainer = $("<div>", { "class": `${styles.treeCheckboxNodeContainer} overflow-auto w-100 flex-grow-1` });
    $mainContainer.append($nodeContainer);

    // Add element nodes to the tree
    this.addElementNodes($mainContainer, $nodeContainer, options);

    // Expand all nodes if the startCollapsed option is false
    if (!options.startCollapsed) {
        this.expandAll($mainContainer);
    }
};


/**
 * Flatten a hierarchical JSON structure into a map for easy access.
 *
 * @param {Object} data - The hierarchical data structure to be flattened.
 * @param {object} options - Configuration options.
 * @returns {Object} A flattened map of the data.
 */
utilities.flattenJSON = function (data, options) {
    let map = {};

    /**
     * Recursively flatten a hierarchical structure.
     *
     * @param {Object|Array} node - The current node or array of nodes to flatten.
     * @param {string|null} parent - The parent node's ID.
     * @param {boolean} isRendered - Indicates if the node has been rendered.
     */
    function flatten(node, parent = null, isRendered = false) {
        if (Array.isArray(node)) {
            node.forEach((item) => {
                // Check for the existence and validity of the nodeIdProperty
                if (!item.hasOwnProperty(options.nodeIdProperty)) {
                    throw new Error(`Item (${item.label}) does not have the '${options.nodeIdProperty}' property, 
                    which was set using the options.idProperty parameter. 
                    The property must be unique for each item. 
                    If the default value is used, then the property must be called 'nodeId', 
                    which will generate unique IDs for each item. If the value property is not supplied.`);
                } else {
                    if (typeof item[options.nodeIdProperty] !== "string" && typeof item[options.nodeIdProperty] !== "number") {
                        throw new Error(`Item (${item.label}) does not have a valid value for the '${options.nodeIdProperty}' property. 
                        The value must be a string or number.`);
                    }
                    if (item[options.nodeIdProperty] === "") {
                        throw new Error(`Item (${item.label}) does not have a valid value for the '${options.nodeIdProperty}' property. 
                        The value must not be empty.`);
                    }
                }

                // Check for duplicates in nodeIdProperty
                if (map[item[options.nodeIdProperty]]) {
                    throw new Error(`Received a duplicate value/ID '${item.value}'. All values/IDs must be unique`);
                }

                // If the item has the parent property, use that as the parent
                if (item.parent) {
                    parent = item.parent;
                }

                // Check for the existence of the returnValue property
                if (!item.hasOwnProperty(options.returnValue)) {
                    let errorMessage = `Item (${item.label}) does not have the '${options.returnValue}' property, which was set using the options.returnValue parameter. 
                    Available properties: ${Object.keys(item)}`;
                    throw new Error(errorMessage);
                }

                // Create a new object with the desired properties, including parent ID
                const flattenedItem = {
                    ...item,
                    parent, // Add the parent ID
                    isRendered
                };

                map[item[options.nodeIdProperty]] = flattenedItem;

                // If it doesn't have the children property, then add it
                if (!item.hasOwnProperty("children")) {
                    flattenedItem.children = [];
                }

                if (item.children) {
                    // Map the children to their values and add them to the flattenedItem
                    flattenedItem.children = item.children.map(child => child[options.nodeIdProperty]);
                }

                flatten(item.children, item[options.nodeIdProperty]); // Pass the current item's value as the parent for child nodes
            });
        }
    }

    // If the nodeIdProperty is "nodeId" and not present in data, add it
    if (options.nodeIdProperty === "nodeId" && !data.hasOwnProperty("nodeId")) {
        iterativeID(data, options);
    }

    flatten(data);
    return map;
};


utilities.addNode = function(treeData, parentID, value, label, children) {
    // Validate parentID
    if (!Object.keys(treeData).includes(parentID)) {
        throw new Error("Invalid parentID")
    }

    // Validate value
    if (typeof value !== "string") {
        throw new Error(`${label} -> The property 'value' must be a string`)
    }

    // Validate label
    if (typeof label !== "string") {
        throw new Error(`${label} -> The property 'label' must be a string`)
    }

    // Validate children must be array or null
    if (typeof children !== "object" && children !== null) {
        throw new Error(`${label} -> The property 'children' must be an array or null`)
    }

}

utilities.validateData = function(data) {
    // If the data is an Array we convert it to an object
    if (Array.isArray(data)) {
        // If the data is an array and it  contains strings, then we convert it to an object
        if (data.every(item => typeof item === "string")) {
            let newData = []
            data.forEach(function(item){
                newData.push({"label": item})
            })
            return newData
        } else if (data.every(item => typeof item === "object")) {
            return data
        }
    } else {
        throw new Error("Data must be an array containing strings or an object")
    }

}

utilities.addElementNodes = function($mainContainer, $nodeContainer) {
    let data = $mainContainer.data("treeData")
    let options = $mainContainer.data("options")
    let queue = Array.from(Object.values(data)).filter(item => item.parent === null && !item.isRendered)
    queue.forEach(function(item){
        let $node = htmlGenerators.createElementNode($mainContainer, item[options.nodeIdProperty], item.label, item.children.length > 0)
        $nodeContainer.append($node)
        data[item[options.nodeIdProperty]].isRendered = true
    })
}


utilities.setCheckBoxState = function($checkbox, state){
    $checkbox
        .html($("<span>", {"class": state.textColour, html: state.symbol}))
        .css("cursor", "pointer")
}

utilities.setChildState = function ($mainContainer, value, $node, options) {
    // Retrieve the tree data and the children
    const treeData = $mainContainer.data("treeData");
    const children = treeData[value].children.map(childId => treeData[childId]);

    // Update the state for each child node
    children.forEach(function (child) {
        const childNodeId = child[options.nodeIdProperty];
        const $childNode = $mainContainer.find("#checkbox-node-" + childNodeId);

        // Set the state and update the checkbox state
        const nodeState = $node.data("state");
        $childNode.data("state", nodeState);
        utilities.setCheckBoxState($childNode.find(`.${styles.treeCheckboxNodeCheckbox}`), nodeState);
    });
}


utilities.handleIntermediate = function ($mainContainer, value, options, $node) {
    // We have to set the state of the parents as well. If all the siblings are the same state, then the parent should be that state as well otherwise it should be indeterminate
    let parentID = $mainContainer.data("treeData")[value].parent

    if (parentID !== null) {
        // We can get the siblings by getting the children from the parent
        let siblings = $mainContainer.data("treeData")[parentID].children.map(child => $mainContainer.data("treeData")[child]);


        // Check if all the siblings are rendered
        if (!siblings.every(sibling => sibling.isRendered)) {
            throw new Error("Not all siblings have been rendered")
        }


        // We can get the state of the siblings by getting the state of the nodes, thus we have to get the nodes first
        let siblingsStates = siblings.map(sibling => $mainContainer.find("#checkbox-node-" + sibling[options.nodeIdProperty]).data("state"))

        // Now we can check if all the siblings are the same state
        let allSiblingsSameState = siblingsStates.every(siblingState => siblingState === siblingsStates[0])

        if (!allSiblingsSameState) {
            // We have to change the state of the parent to indeterminate
            let $parentNode = $mainContainer.find("#checkbox-node-" + parentID)
            $parentNode.data("state", options.states.indeterminate)
            utilities.setCheckBoxState($parentNode.find(`.${styles.treeCheckboxNodeCheckbox}`).first(), options.states.indeterminate)
            utilities.handleIntermediate($mainContainer, parentID, options, $parentNode)

        } else {
            // As they all have the same state we can set the parent to that state
            let $parentNode = $mainContainer.find("#checkbox-node-" + parentID)
            $parentNode.data("state", $node.data("state"))
            utilities.setCheckBoxState($parentNode.find(`.${styles.treeCheckboxNodeCheckbox}`).first(), $node.data("state"))
            utilities.handleIntermediate($mainContainer, parentID, options, $parentNode)
        }


    }
}

/**
 * Sets the logic for a checkbox and its associated node in the tree structure.
 *
 * @param {jQuery} $mainContainer - The main container element.
 * @param {jQuery} $checkbox - The checkbox element.
 * @param {string} value - The value associated with the checkbox node.
 * @param {object} options - Configuration options.
 * @param {string} [initialState=null] - The initial state for the checkbox (optional).
 */
utilities.setCheckboxLogic = function ($mainContainer, $checkbox, value, options, initialState = null) {
    /**
     * Gets the next state based on the current state and available states.
     *
     * @param {object} currentState - The current state.
     * @param {object} states - Available states.
     * @returns {object} The next state.
     */
    function getNextState(currentState, states) {
        let nonSkippedStates = Object.values(states).filter(state => !state.skipCursor);
        if (currentState.skipCursor) {
            nonSkippedStates = nonSkippedStates.filter(state => !state.skipCursor);
        }

        const currentStateIndex = nonSkippedStates.indexOf(currentState);
        return nonSkippedStates[(currentStateIndex + 1) % nonSkippedStates.length];
    }

    /**
     * Sets the next state for a node and its associated checkbox.
     *
     * @param {jQuery} $node - The node element.
     * @param {jQuery} $clickedCheckbox - The clicked checkbox element.
     * @param {object} states - Available states.
     * @returns {object} The next state.
     */
    function setNextState($node, $clickedCheckbox, states) {
        const currentState = $node.data("state");
        const nextState = getNextState(currentState, states);
        $node.data("state", nextState);
        utilities.setCheckBoxState($clickedCheckbox, nextState);
        return nextState;
    }

    // Report the initial state and initialize the checkbox
    const $node = $mainContainer.find("#checkbox-node-" + value);

    if (initialState === null) {
        // Use the default state from the options
        const defaultState = options.states[options.defaultState];
        $node.data("state", defaultState);
        utilities.setCheckBoxState($checkbox, defaultState);
    } else {
        // Use the provided initial state
        const initialStateValue = options.states[initialState];
        $node.data("state", initialStateValue);
        utilities.setCheckBoxState($checkbox, initialStateValue);
    }

    $checkbox.on("click", function () {
        // A click means that the state should change
        const nextState = setNextState($node, $(this), options.states);

        // Update the state of children
        utilities.setChildState($mainContainer, value, $node, options);

        // Update the state of parents
        utilities.handleIntermediate($mainContainer, value, options, $node);

        // Run the callback function
        const stateKey = Object.keys(options.states).find(key => options.states[key] === $node.data("state"));
        const returnValue = $mainContainer.data("treeData")[value][options.returnValue];
        utilities.runUpdateCallback($mainContainer, "CheckboxChange", returnValue, stateKey);
    });
}

/**
 * Retrieves the child nodes of a parent node based on its value.
 *
 * @param {jQuery} $mainContainer - The main container element.
 * @param {string} value - The value associated with the parent node.
 * @returns {jQuery[]} An array of child node elements.
 * @throws {Error} Throws an error if the parent or any of its children have not been rendered.
 */
utilities.getNodeChildren = function ($mainContainer, value) {
    // Get the tree data
    const treeData = $mainContainer.data("treeData");

    // Check if the parent node has been rendered
    if (!treeData[value].isRendered) {
        throw new Error("Node has not been rendered yet");
    }

    // Retrieve the IDs of child nodes
    const childrenIDs = treeData[value].children;

    // Check if each child has been rendered, and if so, add them to the $children array
    return childrenIDs.map(childID => {
        if (!treeData[childID].isRendered) {
            throw new Error("Node has not been rendered yet");
        }
        return $mainContainer.find("#checkbox-node-" + childID);
    });
};

/**
 * Attach a child node element to a parent node in the main container.
 *
 * @param {jQuery} $mainContainer - The main container element.
 * @param {string} value - The value associated with the parent node.
 * @param {jQuery} $node - The child node element to attach.
 * @throws {Error} Throws an error if the parent node is not found.
 */
utilities.attachChildElement = function ($mainContainer, value, $node) {
    // Find the parent node element
    const $parent = $mainContainer.find("#checkbox-node-" + value);

    if ($parent.length === 0) {
        throw new Error("Parent node not found");
    }

    // Get the child <ul> element
    const $children = $parent.children(`.${styles.treeCheckboxNodeChildren}`);

    // Wrap the child in an <li> element and append it to the children
    const $childLi = $("<li>", { class: styles.treeCheckboxNodeChild, style: "list-style-type: none;" });
    $childLi.append($node);
    $children.append($childLi);
};


/**
 * Update child elements of a parent node with their rendering and state based on parent's expansion.
 *
 * @param {jQuery} $mainContainer - The main container element.
 * @param {string} value - The value associated with the parent node.
 * @param {jQuery} $node - The parent node element.
 */
utilities.updateChildrenElements = function ($mainContainer, value, $node) {
    const options = $mainContainer.data("options");

    // Get the children of the parent node
    const children = $mainContainer.data("treeData")[value].children.map(child => $mainContainer.data("treeData")[child]);

    // Filter out children that haven't been rendered yet
    children.filter(child => !child.isRendered).forEach(function (child) {
        const parentState = $node.data("state");

        // Convert parent state to its corresponding key
        let parentStateKey = Object.keys(options.states).find(key => options.states[key] === parentState);

        // Ensure children can't be indeterminate; set them to 'none'
        if (parentStateKey === "indeterminate") {
            parentStateKey = "none";
        }

        // Create a child node element
        const $childNode = htmlGenerators.createElementNode(
            $mainContainer,
            child[options.nodeIdProperty],
            child.label,
            child.children.length > 0,
            parentStateKey
        );

        // Attach the child to the parent
        utilities.attachChildElement($mainContainer, value, $childNode);

        // Mark the child as rendered
        $mainContainer.data("treeData")[child[options.nodeIdProperty]].isRendered = true;
    });
};


/**
 * Handle the logic for caret (expand/collapse) clicks on a node.
 *
 * @param {jQuery} $node - The node element.
 * @param {jQuery} $mainContainer - The main container element.
 * @param {string} value - The value associated with the node.
 * @param {object} options - Configuration options.
 * @param {string} initialState - The initial state for child nodes.
 */
utilities.caretClickLogic = function ($node, $mainContainer, value, options, initialState) {
    // Toggle the caret
    const $clickedCaret = $(this);

    // Toggle the caret and node classes for visual purposes
    $clickedCaret.toggleClass(styles.collapsed);
    $clickedCaret.toggleClass(styles.expanded);
    $node.toggleClass(styles.collapsed);
    $node.toggleClass(styles.expanded);

    if ($node.hasClass(styles.expanded)) {
        // Update the children elements and slide down if needed
        utilities.updateChildrenElements($mainContainer, value, $node);
        $clickedCaret.parent().siblings(`.${styles.treeCheckboxNodeChildren}`).slideDown();
    } else if ($node.hasClass(styles.collapsed)) {
        $clickedCaret.parent().siblings(`.${styles.treeCheckboxNodeChildren}`).slideUp();
    }
};


/**
 * Handle the click logic for showing the search bar in the main container.
 *
 * @param {jQuery} $mainContainer - The main container element.
 */
utilities.searchBarClickLogic = function ($mainContainer) {
    // Hide elements with the class "btn-group"
    $mainContainer.find(".btn-group").hide();

    // Find and show the search bar container
    let $searchBarContainer = $mainContainer.find(`.${styles.treeCheckboxSearchBarContainer}`);
    $searchBarContainer.show();

    // Set focus to the search bar input field
    let $searchBar = $searchBarContainer.find(".tree-checkbox-search-bar");
    $searchBar.focus();
};


/**
 * (De)selects all tree nodes within a specified main container based on a given state name.
 *
 * @param {jQuery} $mainContainer - The jQuery object representing the main container containing tree nodes.
 * @param {object} options - An object containing configuration options.
 * @param {string} stateName - The name of the state to set for deselection.
 */
utilities.deSelectAll = function ($mainContainer, options, stateName){
    $mainContainer.find(`.${styles.treeCheckboxNode}`).each(function(){
        let $node = $(this)
        $node.data("state", options.states[stateName])
        utilities.setCheckBoxState($node.find(`.${styles.treeCheckboxNodeCheckbox}`), options.states[stateName])
    })
}

/**
 * Will run the update callback function if it exists. The callback function will receive an object with
 * three properties: value, state and event. The value property will be the value of the node that was clicked.
 * The state property will be the state of the node that was clicked. The event property will be the event that
 * triggered the callback function.
 *
 * @param {jQuery} $mainContainer The main container of the tree
 * @param {string} event Type of event that triggered the callback function e.g. "CheckboxChange" or "deSelectAll"
 * @param {int || string} value The value of the node that was clicked or null if the event was "deSelectAll"
 * @param {string} stateKey The (new) state of the node that was clicked or null if the event was "deSelectAll"
 *
 */
utilities.runUpdateCallback = function ($mainContainer, event, value=null, stateKey=null) {
    const options = $mainContainer.data("options")
    if (options.updateCallback !== null) {
        // We have have the value but we have to get the state key
        let callbackArgs = options.updateCallbackArgs
        if (callbackArgs === null) {
            callbackArgs = []
        }

        options.updateCallback({returnValue: value, state: stateKey, event: event}, ...callbackArgs)
    }
}

/**
 * Collapses all expanded tree nodes within a specified main container.
 *
 * @param {jQuery} $mainContainer - The jQuery object representing the main container containing tree nodes.
 */
utilities.collapseAll = function ($mainContainer) {
    let $expandedNodes = $mainContainer.find(`.${styles.treeCheckboxNode}.${styles.expanded}`)
    // We get all the expanded nodes and then we click the caret

    $expandedNodes.each(function () {
        let $node = $(this)
        let $caret = $node.find(`.${styles.treeCheckboxCaret}`).first()


        // We also toggle the caret, for visual purposes
        $caret.toggleClass(styles.collapsed)
        $caret.toggleClass(styles.expanded)

        // We set the $node class to collapsed and expanded
        $node.toggleClass(styles.collapsed)
        $node.toggleClass(styles.expanded)

        // We hide the children, we dont use an animation as this is slow
        $caret.parent().siblings(`.${styles.treeCheckboxNodeChildren}`).hide()


    })
}

utilities.expandAll = function ($mainContainer) {
    let $collapsedNodes = $mainContainer.find(`.${styles.treeCheckboxNode}.${styles.collapsed}`)
    // We get all the expanded nodes and then we click the caret we only do this for the first level else it will be too slow for very large trees
    $collapsedNodes.each(function () {
        let $node = $(this)
        $node.find(`.${styles.treeCheckboxCaret}`).click()
    })}

/**
 * This function will be called when the search bar is closed. It will hide the search bar and the search results
 * @param  $mainContainer
 */
utilities.searchBarCloseLogic = function ($mainContainer){
    $mainContainer.find(`.${styles.treeCheckboxSearchBarContainer}`).hide()
    $mainContainer.find(`.${styles.treeCheckboxSearchResultsContainer}`).hide()
    $mainContainer.find(`.${styles.treeCheckboxButtonContainer}`).css("height", "")

    // We want to show the node container and button container
    let $nodeContainer = $mainContainer.find(`.${styles.treeCheckboxNodeContainer}`)
    $nodeContainer.show()

    // We want to show the btn container
    let $btnContainer = $mainContainer.find(".btn-group")
    $btnContainer.show()
}

utilities.searchBarOpenLogic = function ($mainContainer) {
    // We want to hide the node container and button container
    let $nodeContainer = $mainContainer.find(`.${styles.treeCheckboxNodeContainer}`)
    $nodeContainer.hide()

    // We want to hide the btn container
    let $btnContainer = $mainContainer.find(".btn-group")
    $btnContainer.hide()

    // We want to show the search results
    let $searchResultsContainer = $mainContainer.find(`.${styles.treeCheckboxSearchResultsContainer}`)
    $searchResultsContainer.show()

    // We want to set the height of the button container to 100%
    $mainContainer.find(`.${styles.treeCheckboxSearchBarContainer}`)
    $mainContainer.find(`.${styles.treeCheckboxButtonContainer}`).css("height", "100%")


}

utilities.labelClickLogic = function ($mainContainer, returnValue, options) {
    // We have to check if the clickableLabelsCallback is a function if it is not null
    const clickableLabelsCallback = options.clickableLabelsCallback
    if (options.clickableLabelsCallbackArgs === null) {
        clickableLabelsCallback(returnValue)
    } else {
        clickableLabelsCallback(returnValue, ...options.clickableLabelsCallbackArgs)
    }
}

/**
 * Iteratively assign unique IDs to nodes in a hierarchical data structure.
 *
 * @param {Object|Array} data - The hierarchical data structure to assign IDs to.
 * @param {Object} options - Configuration options.
 */
function iterativeID(data, options) {
    let idCounter = 0; // Initialize idCounter as a local variable.

    /**
     * Recursively assign IDs to nodes.
     *
     * @param {Object|Array} item - The data item to assign an ID to.
     */
    function assignIDsRecursively(item) {
        if (Array.isArray(item)) {
            item.forEach(function (childItem) {
                assignIDsRecursively(childItem);
            });
        } else if (typeof item === 'object') {
            // Assign an ID to the node
            item[options.nodeIdProperty] = idCounter;
            idCounter++;

            if (item.hasOwnProperty("children")) {
                // Recursively process child nodes
                assignIDsRecursively(item.children);
            }
        }
    }

    assignIDsRecursively(data);
}

/**
 * Toggle the logic (AND/OR) and update the button state in the main container.
 *
 * @param {jQuery} $mainContainer - The main container element.
 * @param {object} options - Configuration options.
 */
utilities.toggleLogic = function ($mainContainer, options) {
    // Find the toggle button element and get its current value
    const $toggleButton = $mainContainer.find(`.${styles.treeCheckboxToggleButton}`);
    const buttonValue = $toggleButton.data("value");

    // Toggle the button value between "OR" and "AND"
    if (buttonValue === "OR") {
        $toggleButton.data("value", "AND");
        $toggleButton.html("AND");
    } else if (buttonValue === "AND") {
        $toggleButton.data("value", "OR");
        $toggleButton.html("OR");
    }

    // Get the container ID from options
    const containerID = options.containerID;

    // Update the value in Shiny with the new button value
    Shiny.setInputValue(containerID + '_logic', $toggleButton.data("value"), { priority: 'event' });
};

utilities.validateOptions = function(options){
        // The options.startCollapsed must be a boolean
    if (typeof options.startCollapsed !== "boolean") {
        throw new Error("options.startCollapsed must be a boolean")
    }

    if (typeof options.height !== "string") {
        throw new Error("options.height must be a string")
    }

    // If the height string ends with a non numeric character, we append px
    if (!isNaN(options.height.slice(-1))) {
        if (options.height !== "0") {
            options.height += "px"
            console.warn("height must be a valid CSS value. Appending px")
        }
    }

    // If the height string ends with a non numeric character, we append px
    if (!isNaN(options.height.slice(-1))) {
        if (options.height !== "0") {
            options.height += "px"
            console.warn("height must be a valid CSS value. Appending px")
        }
    }

    if (typeof options.showSelectAll !== "boolean") {
        throw new Error("options.showSelectAll must be a boolean")
    }

    if (typeof options.showCollapseAll !== "boolean") {
        throw new Error("options.showCollapseAll must be a boolean")
    }

    if (typeof options.showSearchBar !== "boolean") {
        throw new Error("options.showSearchBar must be a boolean")
    }

    if (typeof options.advancedSearch !== "boolean") {
        throw new Error("options.advancedSearch must be a boolean")
    }

    if (typeof options.clickableLabels !== "boolean") {
        throw new Error("options.clickableLabels must be a boolean")
    }

    if (options.clickableLabels === true && options.clickableLabelsCallback === null) {
        throw new Error("options.clickableLabelsCallback must be a function, when clickableLabels is true")
    }

    // We have to check if the clickableLabelsCallback is a function if it is not null
    if (options.clickableLabelsCallback !== null && typeof options.clickableLabelsCallback !== "function") {
        throw new Error("options.clickableLabelsCallback must be a function")
    }

    // the clickableLabelsCallbackArgs must be an array or null
    if (options.clickableLabelsCallbackArgs !== null && !Array.isArray(options.clickableLabelsCallbackArgs)) {
        throw new Error("options.clickableLabelsCallbackArgs must be an array or null")
    }

    // returnValue must be a string
    if (typeof options.returnValue !== "string") {
        throw new Error("options.returnValue must be a string")
    }

    // Add more validation here
    // toggleDefaultState must be a string and can only be "OR" or "AND"
    if (typeof options.toggleDefaultState !== "string") {
        throw new Error("options.toggleDefaultState must be a string")
    } else if (options.toggleDefaultState !== "OR" && options.toggleDefaultState !== "AND") {
        throw new Error("options.toggleDefaultState must be 'OR' or 'AND'")
    }
}

utilities.validateContainer = function(containerId){
    if (typeof containerId !== "string") {
        throw new Error("containerID must be a string")
    }

    // If the container does not begin wih a #, then add it
    if (!containerId.startsWith("#")) {
        containerId = "#" + containerId
    }

    let $container = $(containerId)
    if($container.length === 0){
        throw new Error("Container does not exist")
    }

    return containerId
}

utilities.setAllNodes = function($mainContainer, state){
    const options = $mainContainer.data("options")
    const treeData = $mainContainer.data("treeData")

    Object.keys(treeData).forEach(function(key){
        let node = treeData[key]

        if (node.isRendered) {
            // Update the state for each child node
            let $node = $mainContainer.find("#checkbox-node-" + node[options.nodeIdProperty]);
            $node.data("state", state)

            // Update the checkbox state HTML
            utilities.setCheckBoxState($node.find(`.${styles.treeCheckboxNodeCheckbox}`), state);

            // Run the callback function
            const stateKey = Object.keys(options.states).find(key => options.states[key] === $node.data("state"));
            const returnValue = node[options.returnValue];
            utilities.runUpdateCallback($mainContainer, "CheckboxChange", returnValue, stateKey);

        }
    })
}

export default utilities