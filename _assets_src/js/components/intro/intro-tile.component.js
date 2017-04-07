"use strict";

// -------------------------------------
//   Dependencies
// -------------------------------------
/**
  * @plugins
  * require("jquery");
**/

// base
require("../../base/query");
require("../../base/event");

// config
var CONFIG = require("../../config");

// -------------------------------------
//   Directive - Intro Tile
// -------------------------------------
/**
  * @name intro-tile.component
  * @desc he intro tile component for the app.
**/

(function($){
  console.log("components/intro/intro-tile.component.js loaded.");

  /**
    * @name IntroTile
    * @desc the main class for the component
    * @param {Object} options - options for the component
    * @return {Object} - the instance of the component class
  **/
  function IntroTile(options) {
    // ---------------------------------------------
    //   Private members
    // ---------------------------------------------
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

    // ---------------------------------------------
    //   Public members
    // ---------------------------------------------
    /* empy block */

    // ---------------------------------------------
    //   Private methods
    // ---------------------------------------------
    /* empy block */

    // ---------------------------------------------
    //   Public methods
    // ---------------------------------------------
    /* empy block */

    // ---------------------------------------------
    //   Constructor block
    // ---------------------------------------------
    // check if the promo video has valid options
    // element - should be a valid DOM element
    if(!options
       || !options.element || !options.element.nodeName || !options.element.nodeType
       || !options.group || !options.group.nodeName || !options.group.nodeType) {
      console.log("intro-tile.component.js: Cannot create intro-tile with invalid options.");
      return null;  // return null if invalid
    }

    // get elements
    _el.images.group     = options.element.querySelector("[data-link-image=group]");
    _el.images.sydney    = options.element.querySelector("[data-link-image=sydney]");
    _el.images.melbourne = options.element.querySelector("[data-link-image=melbourne]");

    _el.anchors.group     = options.element.querySelector("[data-link-anchor=group]");
    _el.anchors.sydney    = options.element.querySelector("[data-link-anchor=sydney]");
    _el.anchors.melbourne = options.element.querySelector("[data-link-anchor=melbourne]");


    // @name _onAnchorHover
    // @desc function to set up anchor mouseover hooks
    // @param {DOM} image - the image that needs to be set on hover
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

    // add event listeners ofr on anchor hover / mouseover
    _el.anchors.group.addEventListener("mouseover",     function() { _onAnchorHover(_el.images.group)     });
    _el.anchors.sydney.addEventListener("mouseover",    function() { _onAnchorHover(_el.images.sydney)    });
    _el.anchors.melbourne.addEventListener("mouseover", function() { _onAnchorHover(_el.images.melbourne) });

    // create a default mouseover event on load
    var eventMouseOver = new CustomEvent("mouseover");

    // dispatch athedefault mouseover event on load
    requestAnimationFrame(function() {
      _el.anchors.sydney.dispatchEvent(eventMouseOver);
    });

    // filthy jquery scrolling to #group section
    $(options.group).hide(0);
    _el.anchors.group.addEventListener("click", function(e) {
      e.preventDefault();
      $(options.group).show(0);
      $('html, body').animate({
        scrollTop: $(options.group).offset().top
      }, 400);
    });

    // ---------------------------------------------
    //   Instance block
    // ---------------------------------------------
    return { };
  }

  // ---------------------------------------------
  //   Export block
  // ---------------------------------------------
  module.exports = IntroTile;

})(jQuery);

