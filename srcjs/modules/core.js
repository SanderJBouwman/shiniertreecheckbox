/**
 * @file This file contains the core functions for the TreeCheckbox component.
 * @version 1.0.0
 * @namespace TreeCheckbox
 * @access public
 */

import utilities from "./utilities.js";
import styles from './checkbox.css';

let TreeCheckbox = {
    defaultStates:{},
    options: {},
}



/**
 * This function is used to create states for the checkboxes. The states are used to determine the appearance of the
 * checkboxes. The default states can be found here {@link TreeCheckbox.options.defaultStates}. It is possible to add
 * custom states. For this you have to create an object with the following properties: {<statename>: {@link TreeCheckbox.createState}}.
 * The states "none" and "indeterminate" are required.
 * @function createState
 * @namespace TreeCheckbox
 * @access public
 * @example 1
 * // Create a custom state
 * const customState = TreeCheckbox.createState(
 *    "text-primary",
 *    "bg-primary text-white",
 *    '<svg...></svg> // The svg code for the symbol',
 *     true // Whether the cursor should be skipped when clicked. Default is false, we set it true for states like indeterminate
 *     )
 *
 * @example 2
 * // Create a fully custom states which can be used in the TreeCheckbox
 * // We will create a custom state for the checkbox. There will be four states: none, include, exclude and indeterminate. The default state is none.
 * const states = {
 *    none: TreeCheckbox.createState( // The none state is required and should be named none
 *    "text-secondary",
 *    "bg-secondary text-white",
 *    '<svg...></svg>'
 *    ),
 *    include: TreeCheckbox.createState(
 *    "text-success",
 *    "bg-success text-white",
 *    '<svg...></svg>'
 *    ),
 *    exclude: TreeCheckbox.createState(
 *    "text-danger",
 *    "bg-danger text-white",
 *    '<svg...></svg>'
 *    ),
 *    indeterminate: TreeCheckbox.createState( // The indeterminate state is required and should be named indeterminate
 *    "text-warning",
 *    "bg-warning text-white",
 *    '<svg...></svg>',
 *    true // We set skipCursor to true, because we don't want to pass over the indeterminate state when clicking
 *    )
 *
 * @param {string} textColour - The text colour of the checkbox. This should be a bootstrap text colour, e.g., "text-primary".
 * @param {string} spanClasses - The classes for the span element. This should be bootstrap bg and text colours, e.g., "bg-primary text-white".
 * @param {string} symbol - The symbol to be used for the checkbox. This should be svg code.
 * @param {boolean} skipCursor - Whether the cursor should be skipped when clicked. Default is false, we set it true for states like indeterminate
 * @returns {{symbol, textColour, spanClasses, skipCursor: boolean}}
 */
TreeCheckbox.createState = function (textColour, spanClasses, symbol, skipCursor=false) {
    let defaultStates = {
        "textColour": "text-secondary",
        "spanClasses": "bg-secondary text-white",
        "symbol": '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-square" viewBox="0 0 16 16">\n' +
            '  <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z"/>\n' +
            '</svg>'
    }
    return {
        ...defaultStates,
        textColour: textColour,
        spanClasses: spanClasses,
        symbol: symbol,
        skipCursor: skipCursor
    }
}


/**
 * The default states can be found here. The default states are:
 * - checkbox {@link TreeCheckbox.options.defaultStates.checkbox}
 * - include {@link TreeCheckbox.options.defaultStates.include}
 *
 * It is possible to add custom states. look at {@link TreeCheckbox.createState} for more information.
 * @access public
 * @type {{include: {include: {symbol, textColour, spanClasses, skipCursor: boolean}, indeterminate: {symbol, textColour, spanClasses, skipCursor: boolean}, exclude: {symbol, textColour, spanClasses, skipCursor: boolean}, none: {symbol, textColour, spanClasses, skipCursor: boolean}}, checkbox: {include: {symbol, textColour, spanClasses, skipCursor: boolean}, indeterminate: {symbol, textColour, spanClasses, skipCursor: boolean}, none: {symbol, textColour, spanClasses, skipCursor: boolean}}}}
 */
TreeCheckbox.defaultStates = {
    /**
     * The default checkbox state. There are three states: none, include and indeterminate. The default state is none.
     * The other states can be found here {@link TreeCheckbox.options.defaultStates}
     * @access public
     * @example
     * // We can recreate the checkbox state with the following code:
     * const states = {
     *    none: TreeCheckbox.createState(
     *    "text-secondary",
     *    "bg-secondary text-white",
     *    '<svg...></svg>'
     *    ),
     *    include: TreeCheckbox.createState(
     *    "text-success",
     *    "bg-success text-white",
     *    '<svg...></svg>'
     *    ),
     *    indeterminate: TreeCheckbox.createState(
     *    "text-warning",
     *    "bg-warning text-white",
     *    '<svg...></svg>',
     *    true // We set skipCursor to true, because we don't want to pass over the indeterminate state when clicking
     *    )
     */
    checkbox: {
        none: TreeCheckbox.createState(
            "text-dark",
            "bg-dark text-white",
            '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-square" viewBox="0 0 16 16">\n' +
            '  <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z"/>\n' +
            '</svg>'),
        include: TreeCheckbox.createState(
            "text-success",
            "bg-success text-white",
            '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-check-square" viewBox="0 0 16 16">\n' +
            '  <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z"/>\n' +
            '  <path d="M10.97 4.97a.75.75 0 0 1 1.071 1.05l-3.992 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.235.235 0 0 1 .02-.022z"/>\n' +
            '</svg>'),
        indeterminate: TreeCheckbox.createState(
            "text-warning",
            "bg-warning text-white",
            '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-dash-square" viewBox="0 0 16 16">\n' +
            '  <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z"/>\n' +
            '  <path d="M4 8a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7A.5.5 0 0 1 4 8z"/>\n' +
            '</svg>', true)
    },
    /**
     * The default include state. There are four states: none, include, exclude and indeterminate. The default state is none.
     The other states can be found here {@link TreeCheckbox.options.defaultStates}
     * @access public
     */
    include: {
        none: TreeCheckbox.createState(
            "text-dark",
            "bg-dark text-white",
            '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-square" viewBox="0 0 16 16">\n' +
            '  <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z"/>\n' +
            '</svg>'),
        include: TreeCheckbox.createState(
            "text-success",
            "bg-success text-white",
            '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-check-square" viewBox="0 0 16 16">\n' +
            '  <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z"/>\n' +
            '  <path d="M10.97 4.97a.75.75 0 0 1 1.071 1.05l-3.992 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.235.235 0 0 1 .02-.022z"/>\n' +
            '</svg>'),
        indeterminate: TreeCheckbox.createState(
            "text-warning",
            "bg-warning text-white",
            '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-dash-square" viewBox="0 0 16 16">\n' +
            '  <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z"/>\n' +
            '  <path d="M4 8a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7A.5.5 0 0 1 4 8z"/>\n' +
            '</svg>', true),
        exclude: TreeCheckbox.createState(
            "text-danger",
            "bg-danger text-white",
            '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x-square" viewBox="0 0 16 16">\n' +
            '  <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z"/>\n' +
            '  <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>\n' +
            '</svg>')
    }
}

/**
 * Options for configuring the behavior and appearance of the TreeCheckbox component.
 * @access private
 * @typedef {Object} TreeCheckboxOptions
 * @namespace TreeCheckbox
 * @property {boolean} startCollapsed - Whether the tree should start in a collapsed state.
 * @property {string} width - The width of the TreeCheckbox component, e.g., "450px".
 * @property {string} height - The height of the TreeCheckbox component, e.g., "300px".
 * @property {string} maxWidth - The maximum width of the TreeCheckbox component, e.g., "100%".
 * @property {string} maxHeight - The maximum height of the TreeCheckbox component, e.g., "100%".
 * @property {boolean} showSelectAll - Whether to show the "Select All" option.
 * @property {boolean} showCollapseAll - Whether to show the "Collapse All" option.
 * @property {boolean} showSearchBar - Whether to show the search bar.
 * @property {boolean} advancedSearch - Whether to enable advanced search features.
 * @property {boolean} clickableLabels - Whether labels are clickable.
 * @property {function|null} clickableLabelsCallback - Callback function when clickable labels are clicked.
 * @property {Array|null} clickableLabelsCallbackArgs - Additional arguments for the clickable labels callback.
 * @property {boolean} returnNonLeafNodes - Whether to return non-leaf nodes in tree operations. Meaning that all (active e.g. included/excluded) values in the tree not just the leaf nodes.
 * @property {number} minSearchChars - Minimum number of characters required to trigger a search.
 * @property {number} maxSearchResults - Maximum number of search results to display.
 * @property {boolean} hideCheckboxes - Whether to hide checkboxes in the component.
 * @property {function|null} updateCallback - Callback function when the tree is updated.
 * @property {Array|null} updateCallbackArgs - Additional arguments for the update callback.
 * @property {Object} states - The states to use for the checkboxes. See {@link TreeCheckbox.options.defaultStates}
 * @property {string} defaultState - The default state for the checkboxes. The default state is "none".
 * @property {string} returnValue - The value to return from the tree. The default value is "value". The other option is "label" or a custom value.
 * for more default states. It is possible to add custom states. For this you have to create an object with
 * the following properties: {<statename>: {@link TreeCheckbox.createState}}. The states "none"
 * and "indeterminate" are required.
 * @property {string} defaultState - The default state for the checkboxes. The default state is "none".
 * @property {string} returnValue - The value to return from the tree. The default value is "value". The other option is "label" or a custom value.
 * @property {string} nodeIdProperty - The property to use as the id for the nodes. This should be unique for each node. If it is not supplied, a ID will be generated.
 */

/**
 * Configuration options for the TreeCheckbox component.
 * @type {TreeCheckboxOptions}
 */
TreeCheckbox.options = {
    startCollapsed: true,
    width: null,
    height: "450px",
    maxWidth: "100%",
    maxHeight: "100%",
    showSelectAll: true,
    showCollapseAll: true,
    showSearchBar: true,
    advancedSearch: false,
    clickableLabels: false,
    clickableLabelsCallback: null,
    clickableLabelsCallbackArgs: null,
    returnNonLeafNodes: false, // To be implemented would return all (active e.g. included/excluded) values in the tree not just the leaf nodes
    minSearchChars: 1,
    maxSearchResults: 100,
    hideCheckboxes: false,
    updateCallback: null,
    updateCallbackArgs: null,
    states: TreeCheckbox.defaultStates.include,
    defaultState: "none",
    returnValue: "value",
    nodeIdProperty: "value", // The property to use as the id for the nodes. This should be unique for each node. If it is not supplied, a ID will be generated.
}
/**
 * This is the main function to create the TreeCheckbox. It will create the tree and add it to the containerID.
 * @function createTreeCheckbox
 * @namespace TreeCheckbox
 * @access public
 * @example
 * // Create the TreeCheckbox
 * const data = [{"label":"eukaryotes","value":0,"children":[{"label":"vertebrates","value":1,"children":[{"label":"mammals","value":2,"children":[{"label":"primates","value":3,"children":[{"label":"humans","value":4,"children":[]},{"label":"apes","value":5,"children":[{"label":"chimpanzees","value":6,"children":[]},{"label":"gorillas","value":7,"children":[]},{"label":"orangutans","value":8,"children":[]}]}]},{"label":"cats","value":9,"children":[{"label":"lions","value":10,"children":[]},{"label":"tigers","value":11,"children":[]}]}]},{"label":"birds","value":12,"children":[{"label":"owls","value":13,"children":[]},{"label":"eagles","value":14,"children":[{"label":"bald eagle","value":15,"children":[]},{"label":"common eagle","value":16,"children":[]}]}]}]},{"label":"invertebrates","value":17,"children":[{"label":"insects","value":18,"children":[{"label":"bees","value":19,"children":[]},{"label":"ants","value":20,"children":[]}]},{"label":"mollusks","value":21,"children":[{"label":"snails","value":22,"children":[]},{"label":"octopuses","value":23,"children":[]}]}]}]},{"label":"prokaryotes","value":24,"children":[]},{"label":"archaea","value":25,"children":[]}]
 * const options = {states: TreeCheckbox.options.defaultStates.include} // We want to change the default states to include
 * TreeCheckbox.createTreeCheckbox("#tree-checkbox-container", data, options)
 *
 * @param {string} containerID - The ID of the container where the TreeCheckbox should be added.
 * @param {Object} data - The data to be added to the TreeCheckbox.
 * @param {object} options - The options to configure the TreeCheckbox. See {@link TreeCheckboxOptions} for more information.
 */
TreeCheckbox.createTreeCheckbox = function (containerID, data, options=this.options) {
    // Validate options
    if (typeof options !== "object") {
        throw new Error("options must be an object")
    } else {
        // Add default options
        options = {...this.options, ...options, ...{containerID: containerID}}
    }


    // Validate options
    utilities.validateOptions(options)

    if (typeof containerID !== "string") {
        throw new Error("containerID must be a string")
    }
    // If the container does not begin wih a #, then add it
    if (!containerID.startsWith("#")) {
        containerID = "#" + containerID
    }

    let $container = $(containerID)
    if($container.length === 0){
        throw new Error("Container does not exist")
    }

    // Validate data
    if (typeof data !== "object") {
        throw new Error("data must be an object")
    }


    // If the options.states is a string we have to evaluate it to get the correct states.
    if (typeof options.states === "string") {
        // get all the keys from the default states
        let defaultStatesKeys = Object.keys(TreeCheckbox.defaultStates)
        // We have to check if the options.states is a default state or a custom state
        if (defaultStatesKeys.includes(options.states)) {
            options.states = TreeCheckbox.defaultStates[options.states]
        } else {
            // Report that the state is not available and report the available states
            throw new Error(`The state ${options.states} is not available. The available states are: ${defaultStatesKeys}`)
        }
    }


    // There should always be an indeterminate and none state
    if (!Object.keys(options.states).includes("indeterminate") || !Object.keys(options.states).includes("none")) {
        throw new Error("options.states must have an indeterminate state")
    }

    utilities.createTree($container, data, options)
    // We also attach a getValues function to the container
    $container.data("getValues", function () {
        return TreeCheckbox.values(containerID)
    })
}

/**
 * This function is used to add more nodes to the tree. The nodes will be added to the containerID.
 * @function addNodes
 * @namespace TreeCheckbox
 * @access public
 * @example
 * // Add some nodes to the tree
 * const data = [{"label":"amphibia","value":26,"parent":1,"children":[{"label":"frogs","value":27,"parent":26,"children":[]},{"label":"salamanders","value":28,"parent":26,"children":[]}]}]
 * TreeCheckbox.addNodes("#tree-checkbox-container", data)
 *
 * @param {string} containerID - The ID of the container where the TreeCheckbox should be added.
 * @param {Object} data - The data to be added to the TreeCheckbox. The data should be an array of objects with
 * the following format: [{"label":str, "value":int, "parent":int, "children":[...]}]
 */
TreeCheckbox.addNodes = function(containerID, data){
    if (typeof containerID !== "string") {
        throw new Error("containerID must be a string")
    }

    // We need to check if the container exists
    let $container = $(containerID)
    if($container.length === 0){
        throw new Error("Container does not exist, first create the tree with TreeCheckbox.createTreeCheckbox()")
    }

    // all the objects should have the following format:
    //[{"label":"amphibia","value":26,"parent":1,"children":[{"label":"frogs","value":27,"parent":26,"children":[]},{"label":"salamanders","value":28,"parent":26,"children":[]}]}]
    // Validate data
    if (typeof data !== "object") {
        throw new Error("data must be an object")
    }

    // Check if the data is in the correct format
    if (!Array.isArray(data)) {
        throw new Error("data must be an array")
    }

    // Check if the data has at least one element
    if (data.length === 0) {
        throw new Error("data must have at least one element")
    }

    // Check if the data has the correct format
    if (!("label" in data[0]) || !("value" in data[0]) || !("parent" in data[0]) || !("children" in data[0])) {
        throw new Error("data must be in the format: [{'label':str, 'value':int, 'parent':int, 'children':[...]}]")
    }

    // We have to flatten the data
    let flatData = utilities.flattenJSON(data)

    // Now we can add the flatData to the $mainContainer.data("treedata")
    let $mainContainer = $container.find(`.${styles.treeCheckboxContainer}`)
    let treeData = $mainContainer.data("treeData")
    const options = $mainContainer.data("options")
    // We have to make sure the values are unique and not already in the tree
    Object.keys(flatData).forEach(function (key) {
        let node = flatData[key]
        if (node[options.nodeIdProperty] in treeData) {
            throw new Error(`The value ${node[options.nodeIdProperty]} is already in the tree`)
        }
    })
    treeData = {...treeData, ...flatData}
    $mainContainer.data("treeData", treeData)

    // iterate over the flatData and add the children to the correct parent
    Object.keys(flatData).forEach(function (key) {
        let node = flatData[key]
        if (node.parent !== null) {
            let parentNode = $mainContainer.data("treeData")[node.parent]
            parentNode.children.push(node[options.nodeIdProperty])

            // If the parent is rendered we have to call TreeCheckbox.utilities.updateChildrenElements
            if (parentNode.isRendered) {
                let parentValue = parentNode[options.nodeIdProperty]
                let $parentNode = $mainContainer.find("#checkbox-node-" + parentValue)
                let parentState = $parentNode.data("state")

                // We have to check if the parent is indeterminate, as this is not a valid state for the children
                let parentStateKey = Object.keys(options.states).find(key => options.states[key] === parentState)
                if (parentStateKey === "indeterminate") {
                    parentStateKey = "none"
                }

                $(document).ready(function () {
                    utilities.updateChildrenElements($mainContainer, parentValue, $parentNode, parentStateKey)
                })
            }
        }
    })
}

/**
 * This function is used to retrieve the values from the tree. The values will be returned as an array of objects
 * with the following format: [{"value":int, "state":str}]. The states are dependent on the options.states. {@link TreeCheckbox.options.defaultStates}
 * @function values
 * @namespace TreeCheckbox
 * @access public
 * @example
 * // Get the values from the tree
 * const values = TreeCheckbox.values("#tree-checkbox-container")
 * console.log(values)
 * // [{"value":0,"state":"none"},{"value":1,"state":"none"},{"value":2,"state":"none"},...]
 * @param containerID
 * @returns {*[]}
 */
TreeCheckbox.values = function (containerID) {
    if (typeof containerID !== "string") {
        throw new Error("containerID must be a string");
    }

    // Check if the container exists
    const $container = $(containerID);
    if ($container.length === 0) {
        throw new Error("Container does not exist, first create the tree with TreeCheckbox.createTreeCheckbox()");
    }

    const $mainContainer = $container.find(`.${styles.treeCheckboxContainer}`);
    const treeData = $mainContainer.data("treeData");

    const options = $mainContainer.data("options");

    if (options.hideCheckboxes){
        return []
    }

    // Helper function to determine if a node should be included in values
    function shouldIncludeNode(node, stateKey) {
        if (stateKey === "indeterminate" || stateKey === "none") {
            return false;
        }

        if (options.returnNonLeafNodes) {
            return true;
        }

        // Include the node if it's a leaf node or if none of its children are rendered
        return node.children.length === 0 || node.children.every(child => !treeData[child].isRendered);
    }

    const values = [];

    // Iterate through treeData and process nodes
    Object.keys(treeData).forEach(function (key) {
        const node = treeData[key];
        if (node.isRendered) {
            const state = $mainContainer.find("#checkbox-node-" + node.value).data("state");
            const stateKey = Object.keys(options.states).find(key => options.states[key] === state);

            if (shouldIncludeNode(node, stateKey)) {
                values.push({
                    "returnValue": node[options.returnValue],
                    "state": stateKey
                });
            }
        }
    });
    return values;
};

// We add a option to add to the TreeCheckbox options data

TreeCheckbox.editOptions = function (containerID, options) {
    let containerOptions = $(containerID).find(`.${styles.treeCheckboxContainer}`).data("options")
    // We are are going to merge the new options with the old options. The new options will overwrite the old options
    let newOptions = {...containerOptions, ...options}
    // We have to validate the new options
    utilities.validateOptions(newOptions)
    $(containerID).find(`.${styles.treeCheckboxContainer}`).data("options", newOptions)
}

export {TreeCheckbox}