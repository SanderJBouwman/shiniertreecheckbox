# ShinierTreeCheckbox
[![R](https://github.com/SanderJBouwman/shiniertreecheckbox/actions/workflows/r.yml/badge.svg)](https://github.com/SanderJBouwman/shiniertreecheckbox/actions/workflows/r.yml)
![GitHub release (with filter)](https://img.shields.io/github/v/release/SanderJBouwman/shiniertreecheckbox?label=latest)
![GitHub](https://img.shields.io/github/license/sanderJBouwman/shiniertreecheckbox)
![GitHub last commit (by committer)](https://img.shields.io/github/last-commit/sanderJbouwman/shiniertreecheckbox)

<img alt = "Overview image that shows the ShinierTreecheckbox" src="https://github.com/SanderJBouwman/shiniertreecheckbox/assets/45181109/6b697f76-a0ae-4497-af72-34dbf3a5df5d" width=50% height=50%>

## Description
This package allows for the rendering of hierarchical checkboxes in Shiny. It uses bootstrap 5 for the styling. 
It has various options to customize the behavior and appearance of the checkboxes. 
Allowing for the addition of custom states and callbacks. 
____
## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Documentation](#documentation)
____

## Features
- Able to process large amounts of items in the ShinierTreeCheckbox > 50.000 items
- Only renders the visible checkboxes using Lazy Loading
- Fast searching
- (customisable) Callback functions to Shiny
- Let users change the search logic toggling between "OR" & "AND"
- Update checkbox state server-side

____

### Multiple modes 
<details>
  <summary>Checkbox</summary>
<img alt="shows the Checkbox mode" src="https://github.com/SanderJBouwman/shiniertreecheckbox/assets/45181109/6f0d3384-722b-44c7-8c56-c941ac9bef4b" width=50% height=50%>
</details>

<details>
  <summary>Include/exclude</summary>
<img alt="shows the include mode" src="https://github.com/SanderJBouwman/shiniertreecheckbox/assets/45181109/829d455c-2b24-4f63-8ee1-81b9dfd0ab93" width=50% height=50%>
</details>

<details>
  <summary>Remove checkboxes</summary>  
  
Combine this with the clickableLabels [callback](#callbacks) to use the treecheckbox as a navigation tool.
<img alt="shows the clickable labels" src="https://github.com/SanderJBouwman/shiniertreecheckbox/assets/45181109/1e29dc3e-e2d9-485b-8938-2900564491b2" width=50% height=50%>
</details>

<details>
  <summary>Allow search of items</summary>
Searching is very fast. A ShinierTreeCheckbox with 27.000 items takes less than 8ms to search. 
<img alt="shows the search mode"  src="https://github.com/SanderJBouwman/shiniertreecheckbox/assets/45181109/fa223d6e-f902-4b60-aa7b-5d64254af957" width=50% height=50%>
</details>

____

## Installation
```R
# Install the development version from GitHub:
# install.packages("devtools")
devtools::install_github("SanderJBouwman/shiniertreecheckbox")
```
____

### Requirements
This package needs the Bootstrap library. You can load this using [bslib](https://CRAN.R-project.org/package=bslib) or load it using a CDN.   
## Usage

```R
 shiniertreecheckbox(
        "mytestID",  # Widget ID
        data = '[{"label":"eukaryotes","children":[{"label":"vertebrates","children":[{"label":"mammals","children":[{"label":"primates","children":[{"label":"humans","children":[]},{"label":"apes","children":[{"label":"chimpanzees","children":[]},{"label":"gorillas","children":[]},{"label":"orangutans","children":[]}]}]},{"label":"cats","children":[{"label":"lions","children":[]},{"label":"tigers","children":[]}]}]},{"label":"birds","children":[{"label":"owls","children":[]},{"label":"eagles","children":[{"label":"bald eagle","children":[]},{"label":"common eagle","children":[]}]}]}]},{"label":"invertebrates","children":[{"label":"insects","children":[{"label":"bees","children":[]},{"label":"ants","children":[]}]},{"label":"mollusks","children":[{"label":"snails","children":[]},{"label":"octopuses","children":[]}]}]}]},{"label":"prokaryotes","children":[]},{"label":"archaea","children":[]}]',
      )
```

<details>
  <summary>Full example script</summary>
  
We use `bslib` in the example: 

```R
# Load the necessary packages
library(shiniertreecheckbox)
library(bslib)

# Define a custom Bootstrap theme
custom_theme <- bs_theme(
  version = "5"
)

# Define the Shiny app UI
ui <- fluidPage(
  theme = custom_theme,  # Apply the custom theme to the UI
  
  # Create a sidebar layout
  sidebarLayout(
    sidebarPanel(
      # Add the ShinyTreeCheckbox widget to the sidebar
      shiniertreecheckbox(
        "mytestID",  # Widget ID
        data = '[{"label":"eukaryotes","children":[{"label":"vertebrates","children":[{"label":"mammals","children":[{"label":"primates","children":[{"label":"humans","children":[]},{"label":"apes","children":[{"label":"chimpanzees","children":[]},{"label":"gorillas","children":[]},{"label":"orangutans","children":[]}]}]},{"label":"cats","children":[{"label":"lions","children":[]},{"label":"tigers","children":[]}]}]},{"label":"birds","children":[{"label":"owls","children":[]},{"label":"eagles","children":[{"label":"bald eagle","children":[]},{"label":"common eagle","children":[]}]}]}]},{"label":"invertebrates","children":[{"label":"insects","children":[{"label":"bees","children":[]},{"label":"ants","children":[]}]},{"label":"mollusks","children":[{"label":"snails","children":[]},{"label":"octopuses","children":[]}]}]}]},{"label":"prokaryotes","children":[]},{"label":"archaea","children":[]}]',
      )
    ),
    mainPanel()
  )
)

# Define the Shiny app server logic
server <- function(input, output) {
  # Server code goes here
  
  # Define an observer for the ShinyTreeCheckbox widget
  observeEvent(input$mytestID, {
    # When the widget is interacted with, print the selected JSON data
    print(jsonlite::fromJSON(input$mytestID))
  })
}

# Create and run the Shiny app
shinyApp(ui, server)
```
</details>

____


## Documentation
### Data Parameter
The data parameter is a JSON string that contains the data to be displayed in the tree. There are two methods for supplying data to the TreeCheckbox component:
#### Method 1: JSON String that is list containing only strings (does not allow for hierarchical data)
The most simple way of creating non-hierarchical checkboxes. Only an array of strings is needed. Each string represents a node in the tree.

#### Method 2: JSON String that is list containing objects (allows for hierarchical data)
The first data structure is an array which contains one or more objects. Each object represents a node in the tree. Each object must contain the following properties:

| Property   | Description                                                                             |
|------------|-----------------------------------------------------------------------------------------|
| `label`    | The label to display for the node.                                                      |
| `children` | An array of child nodes. Not required, but needed to create hierarchical relationships. |

> Note: You can supply a unique string value for the `nodeId` property to make every item unique. If you don't supply a `nodeId` property, Shinier Treecheckbox will generate one for you. You can also set a different property to be used as the unique ID by setting the options.nodeIdProperty option. So for example if you have a json consisting of the property `value` that is unique, you can set the nodeIdProperty to `value`
> ```R
> options = list(nodeIdProperty = 'value')
> # Now the Shinier Treecheckbox will use the `value` property as the unique ID. 
> ```

#### Examples
<details>
  <summary>Simplest form (method 1)</summary>
This is the simplest form of creating a ShinierTreeCheckbox (method 1)

```r
shiniertreecheckbox("mytestID",
                  data = '["Panthera leo","Canis lupus","Felis catus", "Equus ferus caballus", "Puma concolor"]'
)
```

Results in:   
<img src="https://github.com/SanderJBouwman/shiniertreecheckbox/assets/45181109/7eebe177-093e-4959-8196-f66b25af3939" width=50% height=50%>
</details>

<details>
  <summary>Simplest form (method 2)</summary>
This is the simplest form of creating a ShinierTreeCheckbox using method 2
    
```r
shiniertreecheckbox("mytestID",
                  data = '[{"label":"Panthera leo"},{"label":"Canis lupus"},{"label":"Felis catus"},{"label":"Equus ferus caballus"},{"label":"Puma concolor"}]'
)
```

Results are the same as method 1:   
<img src="https://github.com/SanderJBouwman/shiniertreecheckbox/assets/45181109/7eebe177-093e-4959-8196-f66b25af3939" width=50% height=50%>
</details>

<details>
  <summary>Hierarchy</summary>
A simple hierarchical data structure.
    
```R
shiniertreecheckbox("mytestID",
                     data = '[{"label":"eukaryotes","children":[{"label":"vertebrates","children":[{"label":"mammals","children":[{"label":"primates","children":[{"label":"humans","children":[]},{"label":"apes","children":[{"label":"chimpanzees","children":[]},{"label":"gorillas","children":[]},{"label":"orangutans","children":[]}]}]},{"label":"cats","children":[{"label":"lions","children":[]},{"label":"tigers","children":[]}]}]},{"label":"birds","children":[{"label":"owls","children":[]},{"label":"eagles","children":[{"label":"bald eagle","children":[]},{"label":"common eagle","children":[]}]}]}]},{"label":"invertebrates","children":[{"label":"insects","children":[{"label":"bees","children":[]},{"label":"ants","children":[]}]},{"label":"mollusks","children":[{"label":"snails","children":[]},{"label":"octopuses","children":[]}]}]}]},{"label":"prokaryotes","children":[]},{"label":"archaea","children":[]}]'
)
```

Results in:   

<img alt="Shows the ShinierTreecheckbox when rendered" src="https://github.com/SanderJBouwman/shiniertreecheckbox/assets/45181109/319cdc6d-69fd-4c30-a7a9-d34c16bdc962" width=50% height=50%>
</details>

____


### Options Parameter
The options parameter is an object that contains a large number of options to customize the behaviour of the checkboxes. The following table lists all available options.
You can customize the behavior and appearance of the TreeCheckbox component by providing values for these options when creating the widget. 
Example:
```r
shiniertreecheckbox("mytestID",
                  data = '[{"label":"Panthera leo"},{"label":"Canis lupus"},{"label":"Felis catus"},{"label":"Equus ferus caballus"},{"label":"Puma concolor"}]',
                  options=list(clickableLabels = TRUE,
                  hideCheckboxes = TRUE)
)
```

| Option                      | Data Type | Default Value   | Description                                                                                                                                                                                                                                   |
|-----------------------------|-----------|-----------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| startCollapsed              | boolean   | `true`          | Whether the tree should start in a collapsed state.                                                                                                                                                                                           |
| width                       | string    | `"450px"`       | The width of the TreeCheckbox component, e.g., "450px".                                                                                                                                                                                       |
| height                      | string    | `"300px"`       | The height of the TreeCheckbox component, e.g., "300px".                                                                                                                                                                                      |
| maxWidth                    | string    | `"100%"`        | The maximum width of the TreeCheckbox component, e.g., "100%".                                                                                                                                                                                |
| maxHeight                   | string    | `"100%"`        | The maximum height of the TreeCheckbox component, e.g., "100%".                                                                                                                                                                               |
| showSelectAll               | boolean   | `true`          | Whether to show the "Select All" option.                                                                                                                                                                                                      |
| showCollapseAll             | boolean   | `true`          | Whether to show the "Collapse All" option.                                                                                                                                                                                                    |
| showSearchBar               | boolean   | `true`          | Whether to show the search bar.                                                                                                                                                                                                               |
| advancedSearch              | boolean   | `false`         | Whether to enable advanced search features. To be added in the feature (e.g. database search)                                                                                                                                                 |
| clickableLabels             | boolean   | `false`         | Whether labels are clickable.                                                                                                                                                                                                                 |
| clickableLabelsCallback     | function  | custom function | See [callbacks](#Callbacks)                                                                                                                                                                                                                   | Callback function when clickable labels are clicked.                                                |
| clickableLabelsCallbackArgs | Array     | null            | See [callbacks](#Callbacks)                                                                                                                                                                                                                   | Additional arguments for the clickable labels callback.                                             |
| minSearchChars              | number    | `1`             | Minimum number of characters required to trigger a search.                                                                                                                                                                                    |
| maxSearchResults            | number    | `100`           | Maximum number of search results to display.                                                                                                                                                                                                  |
| hideCheckboxes              | boolean   | `false`         | Whether to hide checkboxes in the component.                                                                                                                                                                                                  |
| updateCallback              | function  | custom function | If using default callback you can access the clicked label by accessing the input 'input$<id>_click'. See [callbacks](#Callbacks) for more information.                                                                                       | Callback function when the tree is updated.                                                         |
| updateCallbackArgs          | Array     | null            | See [callbacks](#Callbacks)                                                                                                                                                                                                                   | Additional arguments for the update callback.                                                       |
| states                      | string    | `"include"`     | Multiple states are available see the [states](#States) for more information.                                                                                                                                                                 |
| defaultState                | string    | `null`          | The default state for the checkboxes. If not supplied it will use the default state. See [states](#States) for more information.                                                                                                              |
| returnValue                 | string    | `"label"`       | The value that will be returned on a event. It is also possible to add a custom value. You can do this by adding a new property to the input data and than setting that property as the returnValue. See [returnValue](#Custom return values) |
| returnNonLeafNodes          | boolean   | `false`         | Whether to return non-leaf nodes in tree operations. Meaning that all (active e.g. included/excluded) values in the tree not just the leaf nodes will be parsed to Shiny.                                                                     |
| nodeIdProperty              | string    | `nodeId`        | If not supplied Shinier Treecheckbox will create its own internal IDS. It is also possible to set the unique ID property using the options.nodeIdProperty, all the id's should be unique and a string.                                        |
| showToggle                  | boolean   | `false`         | Whether to show the logic switch button. This allows the user to change the search query from AND to OR. (Note: the logic for this has to be implemented in the Shiny app. Accessible by the ([id]_logic) variable.                           |
| toggleDefaultState          | string    | `OR`            | The default value for the toggle button. Can be OR and AND.                                                                                                                                                                                   |


____

### States
You can customize the behaviour of the checkboxes by setting the `options.states` parameter. This parameter accepts a string that specifies the mode of the checkboxes. 
All states have default values. These can be changed by setting the `options.defaultState` parameter. This parameter accepts a string that specifies the default state of the checkboxes.
Currently, adding more states in R is not supported, but can be added by editing the package and installing it (view How to add custom states).

<details>
  <summary>How to add custom states</summary>  

>Note: Adding custom states requires [packer](https://packer.john-coene.com/#/guide/installation), [npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm) and [devtools](https://cran.r-project.org/package=devtools), as you will re-build the shiniertreecheckbox package.

1. Clone the repository and navigate into the package root
	```bash
	git clone https://github.com/SanderJBouwman/shiniertreecheckbox.git
	cd shiniertreecheckbox 
	```
2. Install dependencies
	```bash 
	npm install
	```
3. Add new state(s).
	- Open the `shiniertreecheckbox/srcjs/modules/core.js` module.  
	- Find the `TreeCheckbox.defaultStates` object and add your new state.
	>Note: This step should be self-explanatory when viewing the `TreeCheckbox.defaultStates`object.

4. Rebuild the module. Navigate back to the root of the package and start R interactive terminal.
	```R
	# Bundle the JS files using Packer.
	packer::bundle(mode="production")
	# Install the package
	devtools::install()
	```
5. We should now be able to use the newly added states. 
 >Note: Please reload your R session if your changes do not seem to have any effect.
   
</details>

The available states are:

| Mode     | States                 | Default Value | Description                                                                                                                     |
|----------|------------------------|---------------|---------------------------------------------------------------------------------------------------------------------------------|
| `include`  | `none`, `include`, `exclude` | `none`        | This mode allows you to select or deselect a checkbox. Clicking the checkbox will cycle through the three states.                             |
| `exclude`  | `none`, `exclude`            | `none`        | This mode allows you to deselect a checkbox. Clicking the checkbox will toggle between the None and Exclude states.                           |
| `checkbox` | `none`, `include`            | `none`        | This mode allows you to select a checkbox (default checkbox behaviour). Clicking the checkbox will toggle between the None and Include states.|
| `toggle`   | `include`, `exclude`         | `include`     | This mode allows you to toggle between the Include and Exclude states. Clicking the checkbox will switch to the opposite state.               |


____
### Callbacks
Callbacks are an important part of the TreeCheckbox component. They allow you to respond to events that occur in the component, such as when the tree is updated or when a label is clicked.

#### Callback - Update Callback
The default updateCallback will send the current state of the tree to the server side.
This data can be accessed by using the `input$mytestID` variable. This variable will contain a JSON string with the current state of the tree.
Use the _[jsonlite::fromJSON](https://rdrr.io/cran/jsonlite/man/fromJSON.html)_ function to convert the JSON string to dataframe.

```R
observeEvent(input$mytestID, {
    json_data <- input$mytestID
    df <- jsonlite::fromJSON(json_data)
    print(df)
})
```

##### Adjusting the _update_ Callback  
The default callback provided should suffice for most use cases. However, in situations where additional functionality is required, you have the option to create a custom callback. This can be achieved by assigning a custom JavaScript function to the `options.updateCallback` variable. The custom callback function should, at a minimum, accept one argument, which will always be the event variable passed to the callback.

Additionally, if you need to provide extra arguments to your custom callback, you can do so by assigning them to the `options.updateCallbackArgs` variable, which should be a list.

For reference, the preset callback function is provided below:

<details>
  <summary>Default callback</summary>  
  
```R
    options$updateCallback <- JS(
        sprintf(
            "
            function(event){
                const elementId = '%s';
                const data = $('#' + elementId).data('getValues')(); // Retrieve the input data from the widget.
                const convertedData = {};
                data.forEach(item => {
                    convertedData[item.value] = item.state; // A transformation step is done
                });
                const jsonData = JSON.stringify(data); 
                Shiny.setInputValue(elementId, jsonData, {priority: 'event'}); // Push the value to Shiny
            }
            "
            , elementId
        )
    )
```   
</details> 

____  

#### Callback - Clickable Labels  

The clickableLabelsCallback option allows you to specify a callback function that will be called when a label is clicked. There is also a default callback which will return the `returnValue` of the item to a Shiny variable. View the _Default callback_ section for more information. The labels are not clickable by default, but this can be changed by setting the options.clickableLabels to `TRUE`. Just as the updateCallback the clickableLabelsCallback also has a default function that would suffice in most situations. The default behaviour is that when a label is clicked it gets reported back to Shiny. The clicked label value can be accessed by `input$mytestID_click` (<inputID> + "_click"). 

```R
  # Gets triggered whenever a label got clicked. 
  observeEvent(input$mytestID_click, {
    print(input$mytestID_click)
  })
```

##### Adjusting the _clickableLabelsCallback_
The callback will always receive the `returnValue` (of the label clicked). Thus, the callback should always have one parameter. Just as the _update_ callback it is here also possible to add extra arguments. This can be done by parsing the arguments to the `options.clickableLabelsCallbackArgs` variable (list). 

<details>
  <summary>Default callback</summary>  
  
```R
  options$clickableLabelsCallback <- JS(
        sprintf(
            "
            function(returnValue){
                Shiny.setInputValue('%s' + '_click', returnValue, {priority: 'event'});
            }
            "
            , elementId
        )
    )
```   
</details> 

<details>
  <summary>Creating a simple callback</summary>  
  
```R
options = list(
    clickableLabels = TRUE, 
    clickableLabelsCallback = htmlwidgets::JS("function(returnValue, elementID){console.log(`clicked label with id ${returnValue} for widget ${elementID}`)}"),
    clickableLabelsCallbackArgs = list("mytestID")
)
```
Output on console:
```text
clicked label with id 0 for widget mytestID
```
</details> 

____  

### Custom return values
It is possible to return custom return values. This can be done by setting the `options.returnValue` parameter. The default value is `label`, but you can set this to any property in the data. 

It is also possible to add your own custom data to the items, where after it is possible to return them by setting the `options.returnValue`. For this you must add it to the input data, which can be seen below. 
We want to add a new return value called `labeled_value`.  
<details>
  <summary>Altered JSON with new property</summary>

```json
[
  {
    "label": "eukaryotes",
    "labeled_value": "eukaryotes_0",
    "children": [
      {
        "label": "vertebrates",
        "labeled_value": "vertebrates_1",
        "children": [
          {
            "label": "mammals",
            "labeled_value": "mammals_2",
            "children": [
              {
                "label": "primates",
                "labeled_value": "primates_3",
                "children": [
                  {
                    "label": "humans",
                    "labeled_value": "humans_4",
                    "children": []
                  },
                  {
                    "label": "apes",
                    "labeled_value": "apes_5",
                    "children": [
                      {
                        "label": "chimpanzees",
                        "labeled_value": "chimpanzees_6",
                        "children": []
                      },
                      {
                        "label": "gorillas",
                        "labeled_value": "gorillas_7",
                        "children": []
                      },
                      {
                        "label": "orangutans",
                        "labeled_value": "orangutans_8",
                        "children": []
                      }
                    ]
                  }
                ]
              },
              {
                "label": "cats",
                "labeled_value": "cats_9",
                "children": [
                  {
                    "label": "lions",
                    "labeled_value": "lions_10",
                    "children": []
                  },
                  {
                    "label": "tigers",
                    "labeled_value": "tigers_11",
                    "children": []
                  }
                ]
              }
            ]
          },
          {
            "label": "birds",
            "labeled_value": "birds_12",
            "children": [
              {
                "label": "owls",
                "labeled_value": "owls_13",
                "children": []
              },
              {
                "label": "eagles",
                "labeled_value": "eagles_14",
                "children": [
                  {
                    "label": "bald eagle",
                    "labeled_value": "bald eagle_15",
                    "children": []
                  },
                  {
                    "label": "common eagle",
                    "labeled_value": "common eagle_16",
                    "children": []
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        "label": "invertebrates",
        "labeled_value": "invertebrates_17",
        "children": [
          {
            "label": "insects",
            "labeled_value": "insects_18",
            "children": [
              {
                "label": "bees",
                "labeled_value": "bees_19",
                "children": []
              },
              {
                "label": "ants",
                "labeled_value": "ants_20",
                "children": []
              }
            ]
          },
          {
            "label": "mollusks",
            "labeled_value": "mollusks_21",
            "children": [
              {
                "label": "snails",
                "labeled_value": "snails_22",
                "children": []
              },
              {
                "label": "octopuses",
                "labeled_value": "octopuses_23",
                "children": []
              }
            ]
          }
        ]
      }
    ]
  },
  {
    "label": "prokaryotes",
    "labeled_value": "prokaryotes_24",
    "children": []
  },
  {
    "label": "archaea",
    "labeled_value": "archaea_25",
    "children": []
  }
]
```
</details>

After adding the new property we can set the `options.returnValue` parameter to `labeled_value`. This will return the `labeled_value` property instead of the `label` property. 

```R
options = list(
    returnValue = "labeled_value" # We now receive the 'labeled_value' property instead of the default nodeIdProperty
)
```
____
### updating checkboxes server-side
Currently only updating all values is supported server-side. This can be done by using the `update_shiniertreecheckbox` function. This functions accepts three parameters:
- `elementId`: The id of the widget that needs to be updated. For example: `mytestID`
- `newState`: The new state of all the items. This should be a valid state. For example: `include` or `none`
- `session`: The current Shiny session.


```R
# Switch all items to the `include` state
update_shiniertreecheckbox("mytestID", "include", session)
```

<details>
  <summary>Result</summary>  
  
![server_side](https://github.com/SanderJBouwman/shiniertreecheckbox/assets/45181109/209f0046-6c25-494a-910f-61bc6ed1f691)
  
</details>
  
____

## Maintainer
- [Sander J. Bouwman](https://github.com/SanderJBouwman)
