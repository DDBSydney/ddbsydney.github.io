"use strict";

// -------------------------------------
//   Dependencies
// -------------------------------------
/** 
  * @plugins
  * require("jquery");
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
      main: null, // the main parent DOM element
      video: null // the video child DOM element
    };

    var _class = { // the classes that need to be applied
      main: "promo-video",  // to the main parent DOM element
      video: "video__cover" // to the video child DOM element
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
    if(!options || !options.element 
      || !options.element.nodeName || !options.element.nodeType) {
      console.log("promo-video.component.js: Cannot create promo video with invalid options.");
      return null;  // return null if invalid
    }

    // get the main parent element
    _el.main = options.element;

    // get all the child video elements
    _el.videos = query("." + _class.video, _el.main);

    // loop through each of the child video elements
    _el.videos.forEach(function(video, index) {
        // get the video's data-src attribute
        var src = video.getAttribute("data-src");

        // set the src attribute for the video 
        // only if this is not a mobile device
        if(!CONFIG.device.isMobile
          && src != null && src.length > 1) {
            video.setAttribute("src", src);
        }
    });

    // ---------------------------------------------
    //   Instance block
    // ---------------------------------------------
    return { };
  }

  // ---------------------------------------------
  //   Export block
  // ---------------------------------------------
  module.exports = PromoVideo;

})(jQuery);

