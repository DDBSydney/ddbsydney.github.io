"use strict";

require("../../base/query");
require("../../base/event");

var CONFIG = require("../../config");

(function($){
  console.log("components/intro/intro-tile.component.js loaded.");

  function IntroTile(options) {

    // create base variables
    var _el = {
      images: {
        sydney:    null,
        melbourne: null,
        group:     null
      },
      anchors: {
        sydney:    null,
        melbourne: null,
        group:     null
      }
    };

    // check if component exists
    if(!options || !options.element
      || !options.element.nodeName || !options.element.nodeType) {
      console.log("intro-tile.component.js: Cannot create intro-tile with invalid options.");
      return null;  // return null if invalid
    }

    // get elements
    _el.images.sydney    = options.element.querySelector("[data-link-image=sydney]");
    _el.images.melbourne = options.element.querySelector("[data-link-image=melbourne]");
    _el.images.group     = options.element.querySelector("[data-link-image=group]");

    _el.anchors.sydney    = options.element.querySelector("[data-link-anchor=sydney]");
    _el.anchors.melbourne = options.element.querySelector("[data-link-anchor=melbourne]");
    _el.anchors.group     = options.element.querySelector("[data-link-anchor=group]");

    // Set up anchor mouseover hooks
    function _onAnchorHover(image) {
      var clName = "intro-tile__image-section--visible";

      if (_el.images.sydney.classList.contains(clName)) {
        _el.images.sydney.classList.remove(clName)
      }

      if (_el.images.melbourne.classList.contains(clName)) {
        _el.images.melbourne.classList.remove(clName)
      }

      if (_el.images.group.classList.contains(clName)) {
        _el.images.group.classList.remove(clName)
      }

      if (!_el.images.group.classList.contains(clName)) {
        image.classList.add(clName);
      }
    }

    _el.anchors.sydney.addEventListener("mouseover",    function() { _onAnchorHover(_el.images.sydney)    });
    _el.anchors.melbourne.addEventListener("mouseover", function() { _onAnchorHover(_el.images.melbourne) });
    _el.anchors.group.addEventListener("mouseover",     function() { _onAnchorHover(_el.images.group)     });

    // create a default mouseover event on load
    var eventMouseOver = new CustomEvent("mouseover");

    // dispatch athedefault mouseover event on load
    requestAnimationFrame(function() {
      _el.anchors.sydney.dispatchEvent(eventMouseOver);
    });

    return { };
  }

  module.exports = IntroTile;

})(jQuery);

