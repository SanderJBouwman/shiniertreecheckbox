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
                console.log(event)
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
                Shiny.setInputValue('%s' + '_click', JSON.stringify(returnValue), {priority: 'event'});
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

#' Shiny bindings for shiniertreecheckbox
#'
#' Output and render functions for using shiniertreecheckbox within Shiny
#' applications and interactive Rmd documents.
#'
#' @param outputId output variable to read from
#' @param width,height Must be a valid CSS unit (like \code{'100\%'},
#'   \code{'400px'}, \code{'auto'}) or a number, which will be coerced to a
#'   string and have \code{'px'} appended.
#' @param expr An expression that generates a shiniertreecheckbox
#' @param env The environment in which to evaluate \code{expr}.
#' @param quoted Is \code{expr} a quoted expression (with \code{quote()})? This
#'   is useful if you want to save an expression in a variable.
#'
#' @name shiniertreecheckbox-shiny
#'
#' @export
shiniertreecheckboxOutput <- function(outputId, width = '100%', height = '400px'){
  htmlwidgets::shinyWidgetOutput(outputId, 'shiniertreecheckbox', width, height, package = 'shiniertreecheckbox')
}

#' @rdname shiniertreecheckbox-shiny
#' @export
renderShiniertreecheckbox <- function(expr, env = parent.frame(), quoted = FALSE) {
  if (!quoted) { expr <- substitute(expr) } # force quoted
  htmlwidgets::shinyRenderWidget(expr, shiniertreecheckboxOutput, env, quoted = TRUE)
}
