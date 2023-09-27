import 'widgets';
import {TreeCheckbox} from '../modules/core.js';
HTMLWidgets.widget({

  name: 'shiniertreecheckbox',

  type: 'output',

  factory: function(el, width, height) {

    // TODO: define shared variables for this instance


    return {

      renderValue: function(args) {
        TreeCheckbox.createTreeCheckbox(args.elementId, JSON.parse(args.data), args.options);
        // TODO: code to render the widget, e.g.
        // Set the width and height to 100% to fill the
        // space of the containing element
        el.style.width = "100%";
        el.style.height = "100%";
        // $("#" + el.id).css("height", "auto").css("width", "auto")
      },

      resize: function(width, height) {

        // TODO: code to re-render the widget with a new size

      }

    };
  }
});
