#' ShinierTreeCheckbox
#'
#' See the Github page for more information: https://github.com/SanderJBouwman/shiniertreecheckbox
#'
#' @import htmlwidgets
#' @param elementId The ID of the HTML element used to hold the tree.
#' @param data A list of nodes to display in the tree.
#' @param options A list of options for the tree.
#' @export
shiniertreecheckbox <- function(elementId, data, options=NULL) {
  if (is.null(options)) {
    options <- list()
  }

  # We will use the updateCallback to send the data back to shiny. We use a default because users
  # can also use their own updateCallback
  if (is.null(options$updateCallback)){
    options$updateCallback <- JS(
        sprintf(
            "
            function(event){
                const elementId = '%s';
                const data = $('#' + elementId).data('getValues')();
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
  }

  # We also set a default label callback, which will be used to display the labels
  if (is.null(options$clickableLabelsCallback)){
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
  }

  # Parse the options list into a JSON string
  args = list(
    elementId = elementId,
    data = data,
    options = options
  )


  # create widget
  htmlwidgets::createWidget(
    name = 'shiniertreecheckbox',
    args,
    package = 'shiniertreecheckbox',
    elementId = elementId
  )
}

#' update_shiniertreecheckbox
#'
#' See the Github page for more information: https://github.com/SanderJBouwman/shiniertreecheckbox
#'
#' @import htmlwidgets
#' @param elementId The ID of the HTML element used to hold the tree.
#' @param data A list of nodes to display in the tree.
#' @export
update_shiniertreecheckbox <- function(elementId, data, session = getDefaultReactiveDomain()) {
  session$sendCustomMessage(
    'updateTreeCheckbox',
    list(
      elementId = elementId,
      data = data
    )
  )
}