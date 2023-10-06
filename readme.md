# ShinierTreeCheckbox
![GitHub release (with filter)](https://img.shields.io/github/v/release/SanderJBouwman/shiniertreecheckbox?label=latest)
![GitHub](https://img.shields.io/github/license/sanderJBouwman/shiniertreecheckbox)
![GitHub last commit (by committer)](https://img.shields.io/github/last-commit/sanderJbouwman/shiniertreecheckbox)


## Description
This package allows for the rendering of hierarchical checkboxes in Shiny. It uses bootstrap 5 for the styling. 
It has various options to customize the behavior and appearance of the checkboxes. 
Allowing for the addition of custom states and callbacks. 

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Documentation](#documentation)
  
## Features
- Able to process large amounts of items in the treecheckbox > 50.000 items
- Only renders the visible checkboxes using Lazy Loading
- Fast searching
- (customisable) Callback functions to Shiny

### Multiple modes 
Checkbox:    
![overview](https://github.com/SanderJBouwman/shiniertreecheckbox/assets/45181109/6f0d3384-722b-44c7-8c56-c941ac9bef4b)

Include/exclude:   
![include](https://github.com/SanderJBouwman/shiniertreecheckbox/assets/45181109/829d455c-2b24-4f63-8ee1-81b9dfd0ab93)

Remove checkboxes:  
Combine this with the clickableLabels [callback](#callbacks) to use the treecheckbox as a navigation tool.
![no_checkbox](https://github.com/SanderJBouwman/shiniertreecheckbox/assets/45181109/1e29dc3e-e2d9-485b-8938-2900564491b2)

### Searching 
Searching is very fast. A ShinierTreeCheckbox with 27.000 items takes less than 8ms to search. 
![search](https://github.com/SanderJBouwman/shiniertreecheckbox/assets/45181109/322af518-072f-4a00-9c7f-c271373bea0c)

## Installation
Provide instructions on how to install and use your R Shiny widget. Include code snippets if necessary. For example:

```R
# Install the development version from GitHub:
# install.packages("devtools")
devtools::install_github("SanderJBouwman/shiniertreecheckbox")
```
### Requirements
This package needs the Bootstrap library. You can load this using [bslib](https://CRAN.R-project.org/package=bslib) or load it using a CDN.   
## Usage
```R
# Load the package
library(shiniertreecheckbox)

# Add the widget to the UI
# Basic example
shinyApp(
    ui <- fluidPage(
      shiniertreecheckbox("mytestID", 
                              data = '[{"label":"eukaryotes","children":[{"label":"vertebrates","children":[{"label":"mammals","children":[{"label":"primates","children":[{"label":"humans","children":[]},{"label":"apes","children":[{"label":"chimpanzees","children":[]},{"label":"gorillas","children":[]},{"label":"orangutans","children":[]}]}]},{"label":"cats","children":[{"label":"lions","children":[]},{"label":"tigers","children":[]}]}]},{"label":"birds","children":[{"label":"owls","children":[]},{"label":"eagles","children":[{"label":"bald eagle","children":[]},{"label":"common eagle","children":[]}]}]}]},{"label":"invertebrates","children":[{"label":"insects","children":[{"label":"bees","children":[]},{"label":"ants","children":[]}]},{"label":"mollusks","children":[{"label":"snails","children":[]},{"label":"octopuses","children":[]}]}]}]},{"label":"prokaryotes","children":[]},{"label":"archaea","children":[]}]',
    ),
    server <- function(input, output) {
    # Server code goes here
    }
)
```

## Documentation
### Data Parameter
The data parameter is a JSON string that contains the data to be displayed in the tree. There is only one way this should be applied.
The first data structure is an array which contains one or more objects. Each object represents a node in the tree. Each object must contain the following properties:

| Property                   | Description                                                                                   |
|----------------------------|-----------------------------------------------------------------------------------------------|
| `label`                    | The label to display for the node.                                                            |
| `children`                 | An array of child nodes. Not required, but needed to create hierarchical relationsships.

> Note: You can supply a unique string value for the `nodeId` property to make every item unique. If you don't supply a `nodeId` propery, Shinier Treecheckbox will generate one for you. You can also set a different property to be used as the unique ID by setting the options.nodeIdProperty option. So for example if you have a json consisting of the property `value` that is unique, you can set the nodeIdProperty to `value`
> ```R
> options = list(nodeIdProperty = 'value')
> # Now the Shinier Treecheckbox will use the `value` property as the unique ID. 
> ```
#### Example 
<details>
  <summary>Raw JSON</summary>

```json
[
  {
    "label": "eukaryotes",
    "children": [
      {
        "label": "vertebrates",
        "children": [
          {
            "label": "mammals",
            "children": [
              {
                "label": "primates",
                "children": [
                  {
                    "label": "humans",
                    "children": []
                  },
                  {
                    "label": "apes",
                    "children": [
                      {
                        "label": "chimpanzees",
                        "children": []
                      },
                      {
                        "label": "gorillas",
                        "children": []
                      },
                      {
                        "label": "orangutans",
                        "children": []
                      }
                    ]
                  }
                ]
              },
              {
                "label": "cats",
                "children": [
                  {
                    "label": "lions",
                    "children": []
                  },
                  {
                    "label": "tigers",
                    "children": []
                  }
                ]
              }
            ]
          },
          {
            "label": "birds",
            "children": [
              {
                "label": "owls",
                "children": []
              },
              {
                "label": "eagles",
                "children": [
                  {
                    "label": "bald eagle",
                    "children": []
                  },
                  {
                    "label": "common eagle",
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
        "children": [
          {
            "label": "insects",
            "children": [
              {
                "label": "bees",
                "children": []
              },
              {
                "label": "ants",
                "children": []
              }
            ]
          },
          {
            "label": "mollusks",
            "children": [
              {
                "label": "snails",
                "children": []
              },
              {
                "label": "octopuses",
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
    "children": []
  },
  {
    "label": "archaea",
    "children": []
  }
]
```
</details>

This should be converted to a string and then passed to the data parameter. For example:
```R
data = '[{"label":"eukaryotes","value":0,"children":[{"label":"vertebrates","value":1,"children":[{"label":"mammals","value":2,"children":[{"label":"primates","value":3,"children":[{"label":"humans","value":4,"children":[]},{"label":"apes","value":5,"children":[{"label":"chimpanzees","value":6,"children":[]},{"label":"gorillas","value":7,"children":[]},{"label":"orangutans","value":8,"children":[]}]}]},{"label":"cats","value":9,"children":[{"label":"lions","value":10,"children":[]},{"label":"tigers","value":11,"children":[]}]}]},{"label":"birds","value":12,"children":[{"label":"owls","value":13,"children":[]},{"label":"eagles","value":14,"children":[{"label":"bald eagle","value":15,"children":[]},{"label":"common eagle","value":16,"children":[]}]}]}]},{"label":"invertebrates","value":17,"children":[{"label":"insects","value":18,"children":[{"label":"bees","value":19,"children":[]},{"label":"ants","value":20,"children":[]}]},{"label":"mollusks","value":21,"children":[{"label":"snails","value":22,"children":[]},{"label":"octopuses","value":23,"children":[]}]}]}]},{"label":"prokaryotes","value":24,"children":[]},{"label":"archaea","value":25,"children":[]}]',
```

### Options Parameter
The options parameter is an object that contains a large number of options to customize the behaviour of the checkboxes. The following table lists all available options.
You can customize the behavior and appearance of the TreeCheckbox component by providing values for these options when creating the widget.

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
| states                      | string    | `"include"`     | Custom states are currently not supported to add via R. Visit the JS module (TreeCheckbox.defaultStates) and add more states there.                                                                                                           |
| defaultState                | string    | `"none"`        | The default state for the checkboxes.                                                                                                                                                                                                         |
| returnValue                 | string    | `"label"`       | The value that will be returned on a event. It is also possible to add a custom value. You can do this by adding a new property to the input data and than setting that property as the returnValue. See [returnValue](#Custom return values) |
| returnNonLeafNodes          | boolean   | `false`         | Whether to return non-leaf nodes in tree operations. Meaning that all (active e.g. included/excluded) values in the tree not just the leaf nodes.                                                                                             |
| nodeIdProperty              | string    | `nodeId`        | If not supplied Shinier Treecheckbox will create its own internal IDS. It is also possible to set the unique ID property using the options.nodeIdProperty, all the id's should be unique and a string.                                        |
| searchTriggersLabelClick    | boolean   | `true`          | Whether to trigger a label click when a search result is clicked                                                                                                                                                                              |


### States
Currently ... adding more states in R is not supported. However, you can add more states by editing the JS module (TreeCheckbox.defaultStates). 
The default available states are: "include" and "checkbox".

### Callbacks
Callbacks are an important part of the TreeCheckbox component. They allow you to respond to events that occur in the component, such as when the tree is updated or when a label is clicked.

#### Update Callback
As the component is written in JS but we use R Shiny we made a custom callback function to report the changes to the server side. For this we use the updateCallback option. It is possible to overwrite this parameter. The default code is:
```R
options$updateCallback <- JS(
        sprintf(
            "
            function(event){ // The event parameter is required. And returns the event that triggered the callback.
                const elementId = '%s';
                const data = $('#' + elementId).data('getValues')(); // The getValues function is defined in the JS module. It will return the current state of the tree.
                const convertedData = {};
                data.forEach(item => {
                    convertedData[item.value] = item.state;
                });
                const jsonData = JSON.stringify(data);
                Shiny.setInputValue(elementId, jsonData, {priority: 'event'});
            }
            "
            , elementId
        )
    )
```
This callback will run on every select event. The default updateCallback will send the current state of the tree to the server side.
We can access this data by using the input$mytestID variable. This variable will contain a JSON string with the current state of the tree.
Use the _[jsonlite::fromJSON](https://rdrr.io/cran/jsonlite/man/fromJSON.html)_ function to convert the JSON string to dataframe.

```R
observeEvent(input$mytestID, {
    json_data <- input$mytestID
    df <- jsonlite::fromJSON(json_data)
    print(df)
})
```
#### Clickable Labels
The clickableLabelsCallback option allows you to specify a callback function that will be called when a label is clicked. There is also a default callback which will return the `returnValue` of the item to to a Shiny variable. View the _Default callback_ section for more information. 

##### Required Arguments
The callback function will **always** receive the _returnValue_ (can be changed by setting the `returnValue` option parameter) of the clicked label as the first argument. Thus the callback function should have at least one argument.
The callback function can also receive additional arguments. These can be specified using the _clickableLabelsCallbackArgs_ option.
The _clickableLabelsCallbackArgs_ option should be a list.

##### Basic Example
```R
options = list(
    clickableLabels = TRUE, 
    clickableLabelsCallback = htmlwidgets::JS("function(id, elementID){console.log(`clicked label with id ${id} for widget ${elementID}`)}"),
    clickableLabelsCallbackArgs = list("mytestID")
)
```
Output on console:
```text
clicked label with id 0 for widget mytestID
```

##### Default callback
The default callback returns the returnValue of the latest clicked label. The callback is a custom JavaScript function.
```R
 options$clickableLabelsCallback <- htmlwidgets::JS(
        sprintf(
            "
            function(returnValue){
                Shiny.setInputValue('%s' + '_click', JSON.stringify(returnValue), {priority: 'event'});
            }
            "
            , elementId
        )
    )
```
We can than retrieve the value using the `input$<id>_click` variable. We can do this in by accessing the variable (`input$mytestID_click`) or by using a _[observeEvent](https://shiny.posit.co/r/reference/shiny/0.11/observeevent)_:

```R
# Our id is 'mytestID'. We have to add '_click' to it in order to access it.
  observeEvent(input$mytestID_click, {
    print(input$mytestID_click)
  })
```

### Custom return values
It is possible to return custom return values. This can be done by setting the `options.returnValue` parameter. The default value is `label`, but you can set this to any property in the data, such as `value` (in this case). 

It is also possible to your own custom return values. For this you must add it to the input data, which can be seen below. 
We want to add a new return value called `labeled_value`. We can do this by adding a new property to the input data. 

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


## Maintainer
- [Sander J. Bouwman](https://github.com/SanderJBouwman)
