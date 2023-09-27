# ShinierTreeCheckbox


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
- Able to large amount of items in the treecheckbox > 20.000 items
- Fast searching
- (custom) Callback functions to Shiny

### Multiple modes 
Checkbox:  
![overview](https://github.com/SanderJBouwman/shiniertreecheckbox/assets/45181109/a21e242f-2f06-4cdb-88d0-aa4638ecac8a)

Include/exclude:   
![include](https://github.com/SanderJBouwman/shiniertreecheckbox/assets/45181109/e5676100-ff2d-47b6-aca4-fecc4712ae5d)

Remove checkboxes:  
Combine this with the clickableLabels [callback](#callbacks) to use the treecheckbox as a navigation tool.
![no_checkbox](https://github.com/SanderJBouwman/shiniertreecheckbox/assets/45181109/141ca8fa-3c38-4576-800e-aa3b72147d42)

### Searching 
Searching is very fast. A ShinierTreeCheckbox with 18.000 items takes less than 50ms to search. 
![search](https://github.com/SanderJBouwman/shiniertreecheckbox/assets/45181109/7e95a41c-597a-4b4f-a556-c2a5924e5ca3)

## Installation
Provide instructions on how to install and use your R Shiny widget. Include code snippets if necessary. For example:

```R
# Install the development version from GitHub:
# install.packages("devtools")
devtools::install_github("SanderJBouwman/shiniertreecheckbox")
```

## Usage
```R
# Load the package
library(shiniertreecheckbox)

# Add the widget to the UI
# Basic example
shinyApp(
    ui <- fluidPage(
      shiniertreecheckbox("mytestID", 
                              data = '[{"label":"eukaryotes","value":0,"children":[{"label":"vertebrates","value":1,"children":[{"label":"mammals","value":2,"children":[{"label":"primates","value":3,"children":[{"label":"humans","value":4,"children":[]},{"label":"apes","value":5,"children":[{"label":"chimpanzees","value":6,"children":[]},{"label":"gorillas","value":7,"children":[]},{"label":"orangutans","value":8,"children":[]}]}]},{"label":"cats","value":9,"children":[{"label":"lions","value":10,"children":[]},{"label":"tigers","value":11,"children":[]}]}]},{"label":"birds","value":12,"children":[{"label":"owls","value":13,"children":[]},{"label":"eagles","value":14,"children":[{"label":"bald eagle","value":15,"children":[]},{"label":"common eagle","value":16,"children":[]}]}]}]},{"label":"invertebrates","value":17,"children":[{"label":"insects","value":18,"children":[{"label":"bees","value":19,"children":[]},{"label":"ants","value":20,"children":[]}]},{"label":"mollusks","value":21,"children":[{"label":"snails","value":22,"children":[]},{"label":"octopuses","value":23,"children":[]}]}]}]},{"label":"prokaryotes","value":24,"children":[]},{"label":"archaea","value":25,"children":[]}]'
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

| Property | Description                                                                                                |
|----------|------------------------------------------------------------------------------------------------------------|
| label    | The label to display for the node.                                                                         |
| value    | The value of the node. This value will be returned when the node is selected, and thus **MUST** be unique. |
| children | An array of child nodes. If the node has no children, this property should be an empty array.              |

#### Example 
<details>
  <summary>Raw JSON</summary>

```json
[
  {
    "label": "eukaryotes",
    "value": 0,
    "children": [
      {
        "label": "vertebrates",
        "value": 1,
        "children": [
          {
            "label": "mammals",
            "value": 2,
            "children": [
              {
                "label": "primates",
                "value": 3,
                "children": [
                  {
                    "label": "humans",
                    "value": 4,
                    "children": []
                  },
                  {
                    "label": "apes",
                    "value": 5,
                    "children": [
                      {
                        "label": "chimpanzees",
                        "value": 6,
                        "children": []
                      },
                      {
                        "label": "gorillas",
                        "value": 7,
                        "children": []
                      },
                      {
                        "label": "orangutans",
                        "value": 8,
                        "children": []
                      }
                    ]
                  }
                ]
              },
              {
                "label": "cats",
                "value": 9,
                "children": [
                  {
                    "label": "lions",
                    "value": 10,
                    "children": []
                  },
                  {
                    "label": "tigers",
                    "value": 11,
                    "children": []
                  }
                ]
              }
            ]
          },
          {
            "label": "birds",
            "value": 12,
            "children": [
              {
                "label": "owls",
                "value": 13,
                "children": []
              },
              {
                "label": "eagles",
                "value": 14,
                "children": [
                  {
                    "label": "bald eagle",
                    "value": 15,
                    "children": []
                  },
                  {
                    "label": "common eagle",
                    "value": 16,
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
        "value": 17,
        "children": [
          {
            "label": "insects",
            "value": 18,
            "children": [
              {
                "label": "bees",
                "value": 19,
                "children": []
              },
              {
                "label": "ants",
                "value": 20,
                "children": []
              }
            ]
          },
          {
            "label": "mollusks",
            "value": 21,
            "children": [
              {
                "label": "snails",
                "value": 22,
                "children": []
              },
              {
                "label": "octopuses",
                "value": 23,
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
    "value": 24,
    "children": []
  },
  {
    "label": "archaea",
    "value": 25,
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

| Option                      | Data Type | Default Value | Description                                                                                                                     |
|-----------------------------|-----------|---------------|---------------------------------------------------------------------------------------------------------------------------------|
| startCollapsed              | boolean   | `true`        | Whether the tree should start in a collapsed state.                                                                             |
| width                       | string    | `"450px"`     | The width of the TreeCheckbox component, e.g., "450px".                                                                         |
| height                      | string    | `"300px"`     | The height of the TreeCheckbox component, e.g., "300px".                                                                        |
| maxWidth                    | string    | `"100%"`      | The maximum width of the TreeCheckbox component, e.g., "100%".                                                                  |
| maxHeight                   | string    | `"100%"`      | The maximum height of the TreeCheckbox component, e.g., "100%".                                                                 |
| showSelectAll               | boolean   | `true`        | Whether to show the "Select All" option.                                                                                        |
| showCollapseAll             | boolean   | `true`        | Whether to show the "Collapse All" option.                                                                                      |
| showSearchBar               | boolean   | `true`        | Whether to show the search bar.                                                                                                 |
| advancedSearch              | boolean   | `false`       | Whether to enable advanced search features.                                                                                     |
| clickableLabels             | boolean   | `false`       | Whether labels are clickable.                                                                                                   |
| clickableLabelsCallback     | function  | null          | See [callbacks](#Callbacks)                                                                                                     | Callback function when clickable labels are clicked.                                                |
| clickableLabelsCallbackArgs | Array     | null          | See [callbacks](#Callbacks)                                                                                                     | Additional arguments for the clickable labels callback.                                             |
| minSearchChars              | number    | `1`           | Minimum number of characters required to trigger a search.                                                                      |
| maxSearchResults            | number    | `100`         | Maximum number of search results to display.                                                                                    |
| hideCheckboxes              | boolean   | `false`       | Whether to hide checkboxes in the component.                                                                                    |
| updateCallback              | function  | null          | See [callbacks](#Callbacks)                                                                                                     | Callback function when the tree is updated.                                                         |
| updateCallbackArgs          | Array     | null          | See [callbacks](#Callbacks)                                                                                                     | Additional arguments for the update callback.                                                       |
| states                      | string    | `"include"`   | Custom states are currently not supported to add via R. Visit the JS module (TreeCheckbox.defaultStates) and add more states there. |
| defaultState                | string    | `"none"`      | The default state for the checkboxes.                                                                                           |

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
This callback will run on every select event.

#### Clickable Labels Callback
The clickableLabelsCallback option allows you to specify a callback function that will be called when a label is clicked.

##### Required Arguments
The callback function will **always** receive the id of the clicked label as the first argument. Thus the callback function should have at least one argument.
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

##### Communication clicked labels with Shiny
The callback function can communicate with Shiny by using the _Shiny.setInputValue_ function. This function allows you to send data to Shiny.
The Shiny.setInputValue function has the following required parameters:
- _inputId_: The id of the input element to set the value for.
- _value_: The value to set.

For more information about the Shiny.setInputValue function, see the [Shiny documentation](https://shiny.posit.co/r/articles/build/communicating-with-js/).

###### Example
We could for example want to know which label was clicked and do something with it on the server side. We will do this for this example. 
We will not use the default id as this is already reserved for the _updateCallback_. We will use the id "mytestID_label" instead. 
Just as the _updateCallback_ the _clickableLabelsCallback_ will also **always** receive the _id/value_ of the clicked label.

```R
options = list(
    clickableLabels = TRUE, 
    clickableLabelsCallback = htmlwidgets::JS("function(id, elementID){Shiny.setInputValue(mytestID_labels, id, {priority: 'event'})}"),
    clickableLabelsCallbackArgs = list("mytestID_label") # We add the _label suffix so we can put the full id in a observeEvent. This allows us to do something with the clicked label.
)
```

We can than use the _mytestID_label_ id in a _[observeEvent](https://shiny.posit.co/r/reference/shiny/0.11/observeevent)_ to do something with the clicked label.
```R
observeEvent(input$mytestID_label, {
    print(input$mytestID_label)
})
```

## Maintainer
- [Sander J. Bouwman](https://github.com/SanderJBouwman)
