"use strict";

// -------------------------------------
//   Dependencies
// -------------------------------------
/** 
  * @plugins
  * require("jquery");
  * require("velocity");
**/

// base
require("../base/query");
require("../base/promise");

// config
var CONFIG = require("../config");

// -------------------------------------
//   Component - Promo Video
// -------------------------------------
/** 
  * @name promo-video.component
  * @desc The promo video component for the app.
**/

(function($){
  console.log("components/promo-video.component.js loaded.");

  /** 
    * @name PromoVideo
    * @desc the main class for the component
    * @param {Object} options - options for the component
    * @return {Object} - the instance of the component class
  **/
  function PromoVideo(options) {
    // ---------------------------------------------
    //   Private members
    // ---------------------------------------------
    var _el = { // reference to the DOM element
      main: null,    // the main parent DOM element
      content: null, // the content child DOM element
      headers: []    // reference to the content headers
    };

    var _class = { // the classes that need to be applied
      main: "promo-video",   // to the main parent DOM element
      content: "promo-video__content" // to the content child DOM element
    };

    var _index = 0; // reference to the current active index

    var _timeout = 1500; // reference to the header content animatimation timeout
    var _interval = 5000; // reference to the header content animatimation interval
    var _isContentAnimating = false; // flag to indicate if the header content is animating

    // ---------------------------------------------
    //   Public members
    // ---------------------------------------------
    /* empy block */

    // ---------------------------------------------
    //   Private methods
    // ---------------------------------------------
    // @name show
    // @desc function to animate and show the given header content
    // @param {DOM} content - the header content to be animated into view
    // @param {String} direction - the direction of the required animation
    // @return {Promise(Boolean)} - the promise with resolve as true or false
    function _show(content, direction) {
      return new Promise(function(resolve) { try {
        if(_isContentAnimating) {
          console.log("promo-video.component.js: Cannot show content while other contents are still animating.")
          return false;
        }

        // set the animating flag as true
        _isContentAnimating = true;

        // animate the given content into view
        requestAnimationFrame(function() {
          // finish any animations currently
          // being performed on the content
          $(content).velocity("finish");

          // perform the new animation
          $(content).velocity(
            direction == "left" ? 
            "transition.slideLeftIn" : 
            "transition.slideRightIn", {

              easing: "easeInOutQuad", 
              delay: CONFIG.animation.delay / 4,
              duration: CONFIG.animation.durationSlow,

              // reset the animation flag on complete and resolve the promise
              complete: function() { _isContentAnimating = false; return resolve(true); }
          });
        });

        // resolve promimse immediately on error
        } catch(error) { console.log(error); return resolve(true); }
      });
    }

    // @name show
    // @desc function to animate and hide the given header content
    // @param {DOM} content - the header content to be animated out of view
    // @param {String} direction - the direction of the required animation
    // @return {Promise(Boolean)} - the promise with resolve as true or false
    function _hide(content, direction) {
      return new Promise(function(resolve) { try {
        if(_isContentAnimating) {
          console.log("promo-video.component.js: Cannot hide content while other contents are still animating.")
          return false;
        }

        // set the animating flag as true
        _isContentAnimating = true;

        // animate the given content out of view
        requestAnimationFrame(function() {
          // finish any animations currently
          // being performed on the content
          $(content).velocity("finish");

          // perform the new animation
          $(content).velocity(
            direction == "right" ? 
            "transition.slideRightOut" : 
            "transition.slideLeftOut", {

              easing: "easeInOutQuad", delay: 0,
              duration: CONFIG.animation.durationSlow,

              // reset the animation flag on complete and resolve the promise
              complete: function() { _isContentAnimating = false; return resolve(true); }
          });
        });
        
        // resolve promimse immediately on error
        } catch(error) { console.log(error); return resolve(true); }
      });
    }

    // ---------------------------------------------
    //   Public methods
    // ---------------------------------------------
    // @name next
    // @desc function to show the next header content
    function next() {
      var currIndex = _index; // get the current active index
      var nextIndex = _index + 1; // get the next active index

      // check if this the last header content
      if(nextIndex >= _el.headers.length ) {
         // reset the active index
         // to the start of the list
          nextIndex = 0;
      } 

      // get the corresponding header contents
      var elCurrContent = _el.headers; // get all contents
      var elNextContent = _el.headers[nextIndex];

      // animate the current content out of view
      _hide(elCurrContent, "left").then(

        // animate the next content into view
        function(isSuccess) {_show( elNextContent, "right"); },
        function(isError)   { /* empty block */ }

      );

      _index = nextIndex;
    }

    // @name prev
    // @desc function to show the previous header content
    function prev() { /* empty block */ }

    // ---------------------------------------------
    //   Constructor block
    // ---------------------------------------------
    // check if the promo video has valid options
    // element - should be a valid DOM element
    if(!options || !options.element 
      || !options.element.nodeName || !options.element.nodeType) {
      console.log("promo-video.component.js: Cannot create promo video with invalid options.");
      return null;  // return null if invalid
    }

    // get the main parent element
    _el.main = options.element;

    // get all the child elements
    _el.content = query("." + _class.content, _el.main)[0];
    _el.headers = query("span", _el.content);

    // show the next header content 
    // once on initial component load 
    /* requestAnimationFrame(function() {
      setTimeout(function() {  
        next(); 

        // and create a loop 
        // with a set interval
        requestAnimationFrame(function() { 
          setInterval(next, _interval); 
        });
      }, _timeout);
    }); */

    // ---------------------------------------------
    //   Instance block
    // ---------------------------------------------
    return {
      next: next, // function to show the next header content
      prev: prev  // function to show the previous header content
    };
  }

  // ---------------------------------------------
  //   Export block
  // ---------------------------------------------
  module.exports = PromoVideo;

})(jQuery);

