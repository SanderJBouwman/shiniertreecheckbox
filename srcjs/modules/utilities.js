import htmlGenerators from "./html-generation";
import styles from "./checkbox.css"
import {TreeCheckbox} from "./core";
const utilities = {
}
console.log("Styles")
console.log(styles)

utilities.createTree = function ($parent, data, options) {
    let $mainContainer = htmlGenerators.createTreeCheckboxContainer(options)
    $parent.append($mainContainer)
    let $buttonContainer = htmlGenerators.createTreeButtonContainer($mainContainer, options)

    // If the $buttonContainer.find("btn-group) is empty, then we hide it
    $mainContainer.append($buttonContainer)
    if ($buttonContainer.find(".btn-group").children().length === 0) {
        $buttonContainer.hide()
    }

    let flattenedData = this.flattenJSON(data)

    // The whole module is based on the data object, so we store it in the main container
    $mainContainer.data("treeData", flattenedData)

    // We also add the options to the main container
    $mainContainer.data("options", options)

    // Create a container for the nodes $nodeContainer which has class styles.tree_checkbox_node_container
    let $nodeContainer = $("<div>", {"class": `${styles.treeCheckboxNodeContainer} overflow-auto w-100`})
    $nodeContainer.css("height", options.height)

    // Set the max height of the container and make it scrollable
    $nodeContainer.css("max-height", options.height)


    $mainContainer.append($nodeContainer)

    this.addElementNodes($mainContainer, $nodeContainer, options)

    // $parent.data("getData", () => {
    // return TreeCheckbox.values($parent.attr("id"))
    // })
}

utilities.flattenJSON = function (data) {
    let map;
    map = {};
    function flatten(node, parent = null, isRendered = false) {
        if (node && Array.isArray(node)) {
            node.forEach((item) => {
                // Check if the item has already been added to the map
                if (map[item.value]) {
                    throw new Error(`Duplicate value/ID '${item.value}'`);
                }

                // If the item has the parent property, then we use that as the parent
                if (item.parent) {
                    parent = item.parent
                }

                // Create a new object with the desired properties, including parent ID
                const flattenedItem = {
                    ...item,
                    parent, // Add the parent ID
                    isRendered
                };

                map[item.value] = flattenedItem;

                if (item.children) {
                    // Map the children to their values and add them to the flattenedItem
                    flattenedItem.children = item.children.map(child => child.value);
                }

                flatten(item.children, item.value); // Pass the current item's value as the parent for child nodes
            });
        }
    }

    flatten(data);
    return map;
}

utilities.addNode = function(treeData, parentID, value, label, children) {
    // Validate parentID
    if (!Object.keys(treeData).includes(parentID)) {
        throw new Error("Invalid parentID")
    }

    // Validate value
    if (typeof value !== "string") {
        throw new Error("value must be a string")
    }

    // Validate label
    if (typeof label !== "string") {
        throw new Error("label must be a string")
    }

    // Validate children must be array or null
    if (typeof children !== "object" && children !== null) {
        throw new Error("children must be an array or null")
    }

}

utilities.addElementNodes = function($mainContainer, $nodeContainer) {
    let data = $mainContainer.data("treeData")
    const options = $mainContainer.data("options")
    let queue = Array.from(Object.values(data)).filter(item => item.parent === null && !item.isRendered)
    queue.forEach(function(item){
        let $node = htmlGenerators.createElementNode($mainContainer, item.value, item.label, item.children.length > 0)
        $nodeContainer.append($node)
        data[item.value].isRendered = true
    })
}

utilities.setCheckBoxState = function($checkbox, state){

    $checkbox.html($("<span>", {"class": state.textColour, html: state.symbol}))

    // Add the cursor pointer to the checkbox
    $checkbox.css("cursor", "pointer")

    return state
}

utilities.setChildState = function ($mainContainer, value, $node) {
    // We have to set the state of the children as well
    let children = $mainContainer.data("treeData")[value].children.map(child => $mainContainer.data("treeData")[child]);
    children.forEach(function (child) {
        let $childNode = $mainContainer.find("#checkbox-node-" + child.value)
        $childNode.data("state", $node.data("state"))
        utilities.setCheckBoxState($childNode.find(`.${styles.treeCheckboxNodeCheckbox}`), $node.data("state"))
    })
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
        let siblingsStates = siblings.map(sibling => $mainContainer.find("#checkbox-node-" + sibling.value).data("state"))

        // Now we can check if all the siblings are the same state
        let allSiblingsSameState = siblingsStates.every(siblingState => siblingState === siblingsStates[0])

        if (!allSiblingsSameState) {
            // We have to change the state of the parent to indeterminate
            let $parentNode = $mainContainer.find("#checkbox-node-" + parentID)
            $parentNode.data("state", options.states.indeterminate)
            utilities.setCheckBoxState($parentNode.find(`.${styles.treeCheckboxNodeCheckbox}`).first(), options.states.indeterminate)
        } else {
            // As they all have the same state we can set the parent to that state
            let $parentNode = $mainContainer.find("#checkbox-node-" + parentID)
            $parentNode.data("state", $node.data("state"))
            utilities.setCheckBoxState($parentNode.find(`.${styles.treeCheckboxNodeCheckbox}`).first(), $node.data("state"))
        }
    }
}

utilities.setCheckboxLogic = function($mainContainer, $checkbox, value, options, initialState=null) {
    function getNextState(currentState, states) {
        let statesArray = Object.values(states).filter(state => !state.skipCursor)
        if (currentState.skipCursor) {
            statesArray = statesArray.filter(state => !state.skipCursor)
        }

        let currentStateIndex = statesArray.indexOf(currentState)

        return statesArray[(currentStateIndex + 1) % statesArray.length]

    }

    function setNextState($node, $clickedCheckbox, states) {
        let currentState = $node.data("state")
        let nextState = getNextState(currentState, states)
        $node.data("state", nextState)
        utilities.setCheckBoxState($clickedCheckbox, nextState)
        return nextState
    }

    // Report the initial state
    // Initialise the checkbox
    let $node = $mainContainer.find("#checkbox-node-" + value)
    if (initialState === null) {
        // This is the default state assigned in the options
        $node.data("state", options.states[options.defaultState])
        utilities.setCheckBoxState($checkbox, options.states[options.defaultState])
    } else {
        // This is for when the state is not the default state (e.g. when the state of the parent is used)
        $node.data("state", options.states[initialState])
        utilities.setCheckBoxState($checkbox, options.states[initialState])
    }

    $checkbox.on("click", function(){
        // A click means that the state should change
        setNextState($node, $(this), options.states)

        // We have to set the state of the children as well
        utilities.setChildState($mainContainer, value, $node);

        // We have to set the state of the parents as well. If all the siblings are the same state,
        // then the parent should be that state as well otherwise it should be indeterminate
        utilities.handleIntermediate($mainContainer, value, options, $node);

        // We run the callback function
        let stateKey = Object.keys(options.states).find(key => options.states[key] === $node.data("state"))
        utilities.runUpdateCallback($mainContainer, "CheckboxChange", value, stateKey)
    })


}

utilities.getNodeChildren = function($mainContainer, value) {
    // We can get the node by using the value as the ID but first we have to check if it has been rendered yet
    if (!data[value].isRendered) {
        throw new Error("Node has not been rendered yet")
    }

    let childrenIDs = data[value].children

    // Check if the children have been rendered yet
    let $children = []
    childrenIDs.forEach(function(childID){
        if (!data[childID].isRendered) {
            throw new Error("Node has not been rendered yet")
        } else{
            $children.push($mainContainer.find("#checkbox-node-" + childID))
        }
    })
    return $children
}

utilities.findNode = function($mainContainer, value, checkExist=true, checkRendered=true) {
    let data = $mainContainer.data("treeData")
    // Check if the value exists in the data object
    if (!Object.keys(data).includes(value) && checkExist) {
        throw new Error("Value does not exist")
    }
    // We can get the node by using the value as the ID but first we have to check if it has been rendered yet
    if (!data[value].isRendered && checkRendered) {
        throw new Error("Node has not been rendered yet")
    }

    return $mainContainer.find("#checkbox-node-" + value)
}

utilities.attachChildElement = function ($mainContainer, value, $node) {
    // Find the parent "node-<value>" and append the child to it
    let $parent = $mainContainer.find("#checkbox-node-" + value)

    if ($parent.length === 0) {
        throw new Error("Parent node not found")
    }

    // Now we get the child <ul> element
    let $children = $parent.children(`.${styles.treeCheckboxNodeChildren}`)


    // Wrap the child in a li and append it to the children
    let $childLi = $("<li>", {"class": styles.treeCheckboxNodeChild, "style": "list-style-type: none;"})
    $childLi.append($node)
    $children.append($childLi)
}

utilities.updateChildrenElements = function ($mainContainer, value, $node, initialState) {
    // Behaviour for expanded
    // As the node is expanded, we check if the children have been rendered yet
    let children = $mainContainer.data("treeData")[value].children.map(child => $mainContainer.data("treeData")[child]);

    const options = $mainContainer.data("options")

    // We check if the children have been rendered yet. For this we use the isRendered property with filter
    children.filter(child => !child.isRendered).forEach(function (child) {
        let parentState = $node.data("state")
        // The parentState variable holds the value instead of the key, we need to get the key
        let parentStateKey = Object.keys(options.states).find(key => options.states[key] === parentState)

        // It is not possible for the children to be indeterminate, so we set it to none
        if (parentStateKey === "indeterminate") {
            parentStateKey = "none"
        }

        let $childNode = htmlGenerators.createElementNode($mainContainer, child.value, child.label, child.children.length > 0, parentStateKey)
        // We have to attach the child to the parent
        utilities.attachChildElement($mainContainer, value, $childNode, initialState)
        $mainContainer.data("treeData")[child.value].isRendered = true
    })
}

utilities.caretClickLogic = function ($node, $mainContainer, value, options, initialState) {
    // Toggle the caret
    let $clickedCaret = $(this)
    //  We also toggle the caret, for visual purposes
    $clickedCaret.toggleClass(styles.collapsed)
    $clickedCaret.toggleClass(styles.expanded)

    // We set the $node class to collapsed and expanded
    $node.toggleClass(styles.collapsed)
    $node.toggleClass(styles.expanded)

    if ($node.hasClass(styles.expanded)) {
        // We have to update the children elements as well if needed
        utilities.updateChildrenElements($mainContainer, value, $node, initialState);
        $clickedCaret.parent().siblings(`.${styles.treeCheckboxNodeChildren}`).slideDown()
    } else if ($node.hasClass(styles.collapsed)) {
        $clickedCaret.parent().siblings(`.${styles.treeCheckboxNodeChildren}`).slideUp()
    }
}

utilities.searchBarClickLogic = function ($mainContainer, options) {
    // Find the element with the class btn-group
    let $btnGroup = $mainContainer.find(".btn-group").hide()

    // Find the search bar with class tree-checkbox-search-bar
    let $searchBarContainer = $mainContainer.find(`.${styles.treeCheckboxSearchBarContainer}`)
    $searchBarContainer.show()

    // Set the focus to the search bar
    let $searchBar = $searchBarContainer.find(".tree-checkbox-search-bar")
    $searchBar.focus()
}

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

        options.updateCallback({value: value, state: stateKey, event: event}, ...callbackArgs)
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

/**
 * T
 * @param  $mainContainer
 * @param options
 */
utilities.searchBarCloseLogic = function ($mainContainer, options) {
    $mainContainer.find(`.${styles.treeCheckboxSearchBarContainer}`).hide()
    $mainContainer.find(`.${styles.treeCheckboxSearchResultsContainer}`).hide()

    // We want to show the node container and button container
    let $nodeContainer = $mainContainer.find(`.${styles.treeCheckboxNodeContainer}`)
    $nodeContainer.show()

    // We want to show the btn container
    let $btnContainer = $mainContainer.find(".btn-group")
    $btnContainer.show()


}

utilities.labelClickLogic = function ($mainContainer, value, options) {
    // We have to check if the clickableLabelsCallback is a function if it is not null
    const clickableLabelsCallback = options.clickableLabelsCallback
    if (options.clickableLabelsCallbackArgs === null) {
        clickableLabelsCallback(value)
    } else {
        clickableLabelsCallback(value, ...options.clickableLabelsCallbackArgs)
    }
}

// Create a function that will receive node data in the form of a object with three properties: value, label and children
// Replace the value with a unique ID and then go through the children and replace the value with a unique ID
let idCounter = 0
function iterativeID(data) {
    // If the data is an array then we have to itterate through it and call the function again
    if (Array.isArray(data)) {
        data.forEach(function (item) {
            iterativeID(item)
        })
    } else {
        // If the data is an object then we have to check if it has a value property
        if (data.hasOwnProperty("value")) {
            // We have to replace the value with a unique ID
            data.value = idCounter
            idCounter++

            // We also have to check if the children property exists
            if (data.hasOwnProperty("children")) {
                // We have to call the function again with the children property
                iterativeID(data.children)
            }
        }
    }
}



utilities.validateOptions = function(options){
    if (!options.startCollapsed) {
        throw new Error("startCollapsed must be a boolean")
    }

    // // Height and width must be a string or null. The string must be a valid CSS value or
    // if (typeof options.width !== "string") {
    //     if (options.width !== null) {
    //         throw new Error("width must be a string or null")
    //     }
    // }
    //
    // }
    //
    if (typeof options.height !== "string") {
        throw new Error("height must be a string")
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
        throw new Error("showSelectAll must be a boolean")
    }

    if (typeof options.showCollapseAll !== "boolean") {
        throw new Error("showCollapseAll must be a boolean")
    }

    if (typeof options.showSearchBar !== "boolean") {
        throw new Error("showSearchBar must be a boolean")
    }

    if (typeof options.advancedSearch !== "boolean") {
        throw new Error("advancedSearch must be a boolean")
    }

    if (typeof options.clickableLabels !== "boolean") {
        throw new Error("clickableLabels must be a boolean")
    }

    if (options.clickableLabels === true && options.clickableLabelsCallback === null) {
        throw new Error("clickableLabelsCallback must be a function, when clickableLabels is true")
    }

    // We have to check if the clickableLabelsCallback is a function if it is not null
    if (options.clickableLabelsCallback !== null && typeof options.clickableLabelsCallback !== "function") {
        throw new Error("clickableLabelsCallback must be a function")
    }

    // the clickableLabelsCallbackArgs must be an array or null
    if (options.clickableLabelsCallbackArgs !== null && !Array.isArray(options.clickableLabelsCallbackArgs)) {
        throw new Error("clickableLabelsCallbackArgs must be an array or null")
    }

    // Add more validation here
}

export default utilities