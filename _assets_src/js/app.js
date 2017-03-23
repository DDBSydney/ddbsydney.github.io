"use strict";

// -------------------------------------
//   Dependencies
// -------------------------------------
/**
  * @plugins
  * require("jquery");
  * require("velocity");
  * require("fastclick");
**/

// base
require("./base/raf");
require("./base/print");
require("./base/event");
require("./base/query");
require("./base/promise");
require("./base/debounce");
require("./base/template");

// services
/* empty block */

// directives
var ClickableTile = require("./directives/clickable-tile.directive");

// components
var Header     = require("./components/header.component");
var IntroTile  = require("./components/intro/intro-tile.component");
var PromoVideo = require("./components/common/promo-video.component");

// controllers
/* empty block */

// config
var CONFIG = require("./config");
console.log("CONFIG options are:");
console.log(CONFIG);

// -------------------------------------
//   App
// -------------------------------------
/**
  * @name app
  * @desc The main js file that contains the
          run options and functions for the app.
**/

(function($) {
  console.log("app.js loaded.");

  /**
    * @name App
    * @desc the main class for the app
    * @return {Object} - the instance of the app class
  **/
  function App() {
    // ---------------------------------------------
    //   Private members
    // ---------------------------------------------
    var _elHtml = null; // reference to the html DOM element
    var _elBody = null; // reference to the body DOM element

    var _header = null; // object to hold a refernce for the header component
    var _introTile = null; // object to hold a refernce for the intro-tile component
    var _promoVideos = []; // array of objects to hold references for the the promo video components
    var _hasFastClickAttached = false; // flag to indicate if fast click was attached

    // ---------------------------------------------
    //   Public members
    // ---------------------------------------------
    /* empty block */

    // ---------------------------------------------
    //   Private methods
    // ---------------------------------------------
    // @name _attachFastClick
    // @desc function to attach fast click to the document
    // @param {Event} event - the event the function was dispatched from
    function _attachFastClick(event) {
      try { FastClick.attach(document.body); } // try to attach fast click
      catch(error) { console.log(error); } // catch attach fast click error
    }

    // ---------------------------------------------
    //   Public methods
    // ---------------------------------------------
    // @name init
    // @desc init function to initialize the app
    function init() {
      console.log("app.js: init() called.");

      // get the html and body DOM elements
      _elHtml = query("html")[0];
      _elBody = query("body")[0];

      // instantiate FastClick on the body for eliminating
      // the 300ms delay between a physical tap and the
      // firing of a click event on mobile browsers
      if (!_hasFastClickAttached && "addEventListener" in document) {
        document.addEventListener("DOMContentLoaded", _attachFastClick, false);
        _hasFastClickAttached = true; // set attached flag as true
      }

      // initialise the clickable tile directive
      query("[clickable-tile]").forEach(function(element, index) {
        new ClickableTile({ element: element });
      });

      // create and intialise the header component
      _header = new Header({ element: query(".header")[0] });

      // create and initialise the intro-tile component
      _introTile = new IntroTile({ element: query(".intro-tile")[0] });

      // create and intialise the promo video components
      query(".promo-video").forEach(function(element, index){
        _promoVideos.push(new PromoVideo({ element: element }));
      });

      // animate fade the current page into view
      requestAnimationFrame(function() {
        $(_elBody).velocity("transition.fadeIn", {
          easing: "easeInOutQuad",
          delay: CONFIG.animation.delay,
          duration: CONFIG.animation.durationSlow
        });
      });
    }

    // @name destory
    // @desc destory function to destroy the app
    function destroy() { /* empty block */ }

    // ---------------------------------------------
    //   Constructor block
    // ---------------------------------------------
    /* empty block */

    // ---------------------------------------------
    //   Instance block
    // ---------------------------------------------
    return {
      init: init, // init function for the controller
      destroy: destroy // destory function for the controller
    };
  }

  // ---------------------------------------------
  //   Export block
  // ---------------------------------------------
  var ddbWebsite = new App();

  // ---------------------------------------------
  //   Run block
  // ---------------------------------------------
  ddbWebsite.init(); // initiate the created app

})(jQuery);
