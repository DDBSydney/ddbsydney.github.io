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

// -------------------------------------
//   Directive - Clickable Tile
// -------------------------------------
/** 
  * @name clickable-tile.directive
  * @desc The clickable-tile directive for the app.
**/

(function($){
  console.log("directives/clickable-tile.directive.js loaded.");

  /** 
    * @name ClickableTile
    * @desc the main class for the directive
    * @param {Object} options - options for the directive
    * @return {Object} - the instance of the directive class
  **/
  function ClickableTile(options) {
    // ---------------------------------------------
    //   Private members
    // ---------------------------------------------
    var _el = { // reference to the DOM element
      main: null, // the main parent DOM element
      link: null  // the link child DOM element
    };

    var _href = "#"; // the href value to go to when the tile is clicked 
    var _title = ""; // the title value displayed when the tile is hovered
    var _target = "_self"; // the target to be used when the tile is clicked

    // ---------------------------------------------
    //   Public members
    // ---------------------------------------------
    /* empy block */

    // ---------------------------------------------
    //   Private methods
    // ---------------------------------------------
    // @name _addClickEventListener
    // @desc function to add the click event listener to the main element
    function _addClickEventListener() {
      _el.main.addEventListener("click", _clickEventListener);
    }

    // @name _removeClickEventListener
    // @desc function to remove the click event listener from the main element
    function _removeClickEventListener() {
      _el.main.removeEventListener("click", _clickEventListener);
    }

    // @name _clickEventListener
    // @desc the event listener function added to the main element
    // @param {Event} - the click event that triggers the function call
    function _clickEventListener(event) {
      // prevent event default
      // and event propagation
      if(event) { 
        event.preventDefault(); 
        event.stopPropagation(); 
      }

      // get the window protocol and host
      var protocol = window.location.protocol;
      var host = window.location.host;

      // get the url to navigate to, either
      // in the same window or a new window
      var url = protocol + "//" + host + _href;

      // check if the href contains an external link or or not
      if(_href.indexOf("http") != -1) { window.open(_href, _target); } 
      else { window.open(url, _target); }
    }

    // ---------------------------------------------
    //   Public methods
    // ---------------------------------------------
    /* empy block */

    // ---------------------------------------------
    //   Constructor block
    // ---------------------------------------------
    // check if the clickable-tile has valid options
    // element - should be a valid DOM element
    if(!options || !options.element 
      || !options.element.nodeName || !options.element.nodeType) {
      console.log("clickable-tile.directive.js: Cannot create clickable-tile with invalid options.");
      return null;  // return null if invalid
    }

    // get the main parent element
    _el.main = options.element;

    // get the first child link element
    _el.link = query("a[href]", _el.main)[0];

    // check if a valid link exists wikthin the tile
    if(_el.link && _el.link.nodeName && _el.link.nodeType) {
      _href = _el.link.getAttribute("href");
      _title = _el.link.getAttribute("title");
      _target = _el.link.getAttribute("target");

      // check for a valid href and target
      if(_href.length <= 1) { _href = "#"; }
      if(_target != "_self" && _target != "_blank") { 
        _target = "_self"; // default value is _self
      }

      // set the title for the main element
      // if the link has a title set on it
      if(_title != null && _title.length > 1) { 
        _el.main.setAttribute("title", _title); 
      }

      // override any click event atttached 
      // to the main tile and it's clildren
      _addClickEventListener();
    }

    // ---------------------------------------------
    //   Instance block
    // ---------------------------------------------
    return { };
  }

  // ---------------------------------------------
  //   Export block
  // ---------------------------------------------
  module.exports = ClickableTile;

})(jQuery);

