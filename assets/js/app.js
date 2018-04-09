(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
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
      _introTile = new IntroTile({
        element: query(".intro-tile")[0],
        group: query(".intro-group-tile")[0]
      });

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

},{"./base/debounce":2,"./base/event":3,"./base/print":4,"./base/promise":5,"./base/query":6,"./base/raf":7,"./base/template":8,"./components/common/promo-video.component":9,"./components/header.component":10,"./components/intro/intro-tile.component":11,"./config":12,"./directives/clickable-tile.directive":13}],2:[function(require,module,exports){
"use strict";

// -------------------------------------
//   Dependencies
// -------------------------------------
/** 
  * @plugins
**/

// -------------------------------------
//   Base - Debounce
// -------------------------------------
/** 
  * @name debounce
  * @desc A base module for an event that as long as it continues to be 
          invoked, will not be triggered. The function will be called after it 
          stops being called for N milliseconds. If `immediate` is passed, 
          trigger the function on the leading edge, instead of the trailing.
**/

(function() {
  console.log("base/debounce.js loaded.");

  // @name debounce
  // @desc the main function for the base
  // @param {Function} func - the function to be executed
  // @param {Boolean} wait - flag to indicate wait and call
  // @param {Boolean} immediate - flag to indicate immediate call
  function debounce(func, wait, immediate) {
    var timeout;
    return function() {
      var context = this, args = arguments;
      var later = function() {
        timeout = null;
        if (!immediate) func.apply(context, args);
      };
      var callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      if (callNow) func.apply(context, args);
    };
  }

  // ---------------------------------------------
  //   Export block
  // ---------------------------------------------
  window.debounce = debounce;

})();

},{}],3:[function(require,module,exports){
"use strict";

// -------------------------------------
//   Dependencies
// -------------------------------------
/** 
  * @plugins
**/

// -------------------------------------
//   Base - Event
// -------------------------------------
/** 
  * @name event
  * @desc A base module that is used to create an event 
          interface that represents events initialized 
          by an app for any purpose.
**/

(function() {
  console.log("base/event.js loaded.");

  // @name CustomEvent
  // @desc the main function for the base
  // @param {String} event - the name of the event
  // @param {Object} params - the options for the event
  // @param {Event} - the created custom event object
  function CustomEvent ( event, params ) {
    params = params || { bubbles: false, cancelable: false, detail: undefined };
    var evt = document.createEvent("CustomEvent");
    evt.initCustomEvent( event, params.bubbles, params.cancelable, params.detail );
    return evt;
  }

  // ---------------------------------------------
  //   Export block
  // ---------------------------------------------
  if (typeof window.CustomEvent != "function") {
    CustomEvent.prototype = window.Event.prototype; 
    window.CustomEvent = CustomEvent;
  }

})();

},{}],4:[function(require,module,exports){
"use strict";

// -------------------------------------
//   Dependencies
// -------------------------------------
/** 
  * @plugins
**/

// -------------------------------------
//   Base - Print
// -------------------------------------
/** 
  * @name print
  * @desc A base module to abstract console.log done
          to ensure that gulp tasks cannot strip 
          them out on compile. print is attached 
          to the window object.
**/
(function() {
  console.log("base/print.js loaded.");

  // @name print
  // @desc the main function for the base
  // @param {String} selector
  // @param {String} value
  // @return {Boolean}
  function print(value) {
    // assign to local var 
    var print = console;

    // find the key log
    for(var key in print) {
      if(key == "log"){
         // log the value and return true
        print[key](value); return true;
      }
    }

    // default return 
    // value is false
    return false;
  }

  // ---------------------------------------------
  //   Export block
  // ---------------------------------------------
  window.print = print;
    
})();
},{}],5:[function(require,module,exports){
"use strict";

// -------------------------------------
//   Dependencies
// -------------------------------------
/** 
  * @plugins
**/

// -------------------------------------
//   Base - Promise
// -------------------------------------
/** 
  * @name promise
  * @desc A base module to enable waiting for asynchronous 
          code to exceute. Simulates the behaviour of 
          ES6 Promises.
**/
(function() {
  console.log("base/promise.js loaded.");

  // store setTimeout reference so promise-base will be unaffected by
  // other code modifying setTimeout (like sinon.useFakeTimers())
  var setTimeoutFunc = setTimeout;

  // @name noop
  function noop() { }

  // use base for setImmediate for performance gains
  var asap = (typeof setImmediate === "function" && setImmediate) ||
    function (fn) {
      setTimeoutFunc(fn, 1);
    };
  
  // @name onUnhandledRejection
  var onUnhandledRejection = function onUnhandledRejection(err) {
    if (typeof console !== "undefined" && console) {
       console.warn("Possible Unhandled Promise Rejection:", err); // eslint-disable-line no-console
    }
  };

  // @name bind
  // @desc base for Function.prototype.bind
  function bind(fn, thisArg) {
    return function () {
      fn.apply(thisArg, arguments);
    };
  }

  // @name Promise
  function Promise(fn) {
    if (typeof this !== "object") throw new TypeError("Promises must be constructed via new");
    if (typeof fn !== "function") throw new TypeError("not a function");
    this._state = 0;
    this._handled = false;
    this._value = undefined;
    this._deferreds = [];

    doResolve(fn, this);
  }

  // @name handle
  function handle(self, deferred) {
    while (self._state === 3) {
      self = self._value;
    }
    if (self._state === 0) {
      self._deferreds.push(deferred);
      return;
    }
    self._handled = true;
    asap(function () {
      var cb = self._state === 1 ? deferred.onFulfilled : deferred.onRejected;
      if (cb === null) {
        (self._state === 1 ? resolve : reject)(deferred.promise, self._value);
        return;
      }
      var ret;
      try {
        ret = cb(self._value);
      } catch (e) {
        reject(deferred.promise, e);
        return;
      }
      resolve(deferred.promise, ret);
    });
  }

  // @name resolve
  function resolve(self, newValue) {
      try {
        // Promise Resolution Procedure: https://github.com/promises-aplus/promises-spec#the-promise-resolution-procedure
        if (newValue === self) throw new TypeError("A promise cannot be resolved with itself.");
        if (newValue && (typeof newValue === "object" || typeof newValue === "function")) {
          var then = newValue.then;
          if (newValue instanceof Promise) {
            self._state = 3;
            self._value = newValue;
            finale(self);
            return;
          } else if (typeof then === "function") {
            doResolve(bind(then, newValue), self);
            return;
          }
        }
        self._state = 1;
        self._value = newValue;
        finale(self);
      } catch (e) {
        reject(self, e);
      }
  }

  // @name reject
  function reject(self, newValue) {
    self._state = 2;
    self._value = newValue;
    finale(self);
  }

  // @name finale
  function finale(self) {
    if (self._state === 2 && self._deferreds.length === 0) {
      asap(function() {
        if (!self._handled) {
          onUnhandledRejection(self._value);
        }
      }, 1);
    }
  
    for (var i = 0, len = self._deferreds.length; i < len; i++) {
      handle(self, self._deferreds[i]);
    }
    self._deferreds = null;
  }

  // @name Handler
  function Handler(onFulfilled, onRejected, promise) {
    this.onFulfilled = typeof onFulfilled === "function" ? onFulfilled : null;
    this.onRejected = typeof onRejected === "function" ? onRejected : null;
    this.promise = promise;
  }

  // @name doResolve
  // @desc Take a potentially misbehaving resolver function and 
  //       make sure onFulfilled and onRejected are only called 
  //       once. Makes no guarantees about asynchrony.
  function doResolve(fn, self) {
    var done = false;
    try {
      fn(function (value) {
        if (done) return;
        done = true;
        resolve(self, value);
      }, function (reason) {
        if (done) return;
        done = true;
        reject(self, reason);
      });
    } catch (ex) {
      if (done) return;
      done = true;
      reject(self, ex);
    }
  }

  // @name catch
  Promise.prototype["catch"] = function (onRejected) {
    return this.then(null, onRejected);
  };

  // @name then
  Promise.prototype.then = function (onFulfilled, onRejected) {
    var prom = new Promise(noop);
    handle(this, new Handler(onFulfilled, onRejected, prom));
    return prom;
  };

  // @name all
  Promise.all = function (arr) {
    var args = Array.prototype.slice.call(arr);

    return new Promise(function (resolve, reject) {
      if (args.length === 0) return resolve([]);
      var remaining = args.length;

      function res(i, val) {
        try {
          if (val && (typeof val === "object" || typeof val === "function")) {
            var then = val.then;
            if (typeof then === "function") {
                then.call(val, function (val) {
                    res(i, val);
                }, reject);
                return;
            }
          }
          args[i] = val;
          if (--remaining === 0) {
            resolve(args);
          }
        } catch (ex) {
          reject(ex);
        }
      }

      for (var i = 0; i < args.length; i++) {
        res(i, args[i]);
      }
    });
  };

  // @name resolve
  Promise.resolve = function (value) {
    if (value && typeof value === "object" && value.constructor === Promise) {
      return value;
    }

    return new Promise(function (resolve) {
      resolve(value);
    });
  };

  // @name reject
  Promise.reject = function (value) {
    return new Promise(function (resolve, reject) {
      reject(value);
    });
  };

  // @name race
  Promise.race = function (values) {
    return new Promise(function (resolve, reject) {
      for (var i = 0, len = values.length; i < len; i++) {
        values[i].then(resolve, reject);
      }
    });
  };

  // @name _setImmediateFn
  // @desc set the immediate function to execute callbacks
  // @param {function} fn - function to execute
  Promise._setImmediateFn = function _setImmediateFn(fn) {
    asap = fn;
  };
  
  // @name _setUnhandledRejectionFn
  // @desc set the unhandled rejection function
  // @param {function} fn - function to execute
  Promise._setUnhandledRejectionFn = function _setUnhandledRejectionFn(fn) {
    onUnhandledRejection = fn;
  };

  // ---------------------------------------------
  //   Export block
  // ---------------------------------------------
  if (typeof window.Promise != "function") {
    window.Promise = Promise;
  }

})();
},{}],6:[function(require,module,exports){
"use strict";

// -------------------------------------
//   Dependencies
// -------------------------------------
/** 
  * @plugins
**/

// -------------------------------------
//   Base - Query
// -------------------------------------
/** 
  * @name query
  * @desc A base module to abstract document.querySelectorAll
          for increased performance and greater usability. 
          query is attached to the window object.
**/
(function() {
  console.log("base/query.js loaded.");

  var doc = window.document, 
  simpleRe = /^(#?[\w-]+|\.[\w-.]+)$/, 
  periodRe = /\./g, 
  slice = [].slice,
  classes;

  // @name query
  // @desc the main function for the base
  // @param {String} selector
  // @param {Element} context (optional)
  // @return {Array}
  function query (selector, context) {
    context = context || doc;
    // Redirect simple selectors to the more performant function
    if(simpleRe.test(selector)){
      switch(selector.charAt(0)){
        case "#":
          // Handle ID-based selectors
          return [context.getElementById(selector.substr(1))];
        case ".":
          // Handle class-based selectors
          // Query by multiple classes by converting the selector 
          // string into single spaced class names
          classes = selector.substr(1).replace(periodRe, " ");
          return slice.call(context.getElementsByClassName(classes));
        default:
          // Handle tag-based selectors
          return slice.call(context.getElementsByTagName(selector));
      }
    }
    // Default to `querySelectorAll`
    return slice.call(context.querySelectorAll(selector));
  }

  // ---------------------------------------------
  //   Export block
  // ---------------------------------------------
  window.query = query;
    
})();
},{}],7:[function(require,module,exports){
"use strict";

// -------------------------------------
//   Dependencies
// -------------------------------------
/** 
  * @plugins
**/

// -------------------------------------
//   Base - Request Animation Frame
// -------------------------------------
/** 
  * @name requestAnimationFrame
  * @desc A base module to window.requestAnimationFrame
          for creating a single cross browser version. 
          requestAnimationFrame is attached to the 
          window object.
**/
(function() {
  console.log("base/raf.js loaded.");

  var lastTime = 0;
  var vendors = ["ms", "moz", "webkit", "o"];

  // assign the correct vendor prefix to the window.requestAnimationFrame
  for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
    window.requestAnimationFrame = window[vendors[x]+"RequestAnimationFrame"];
    window.cancelAnimationFrame = window[vendors[x]+"CancelAnimationFrame"] 
                                 || window[vendors[x]+"CancelRequestAnimationFrame"];
  }

  // @name requestAnimationFrame
  // @desc the main function for the base
  // @param {Function} callback - The callback function
  // @return {Integer} requestID - the id passed to cancelAnimationFrame
  function requestAnimationFrame(callback, element) {
    var currTime = new Date().getTime();
    var timeToCall = Math.max(0, 16 - (currTime - lastTime));
    var id = window.setTimeout(function() { callback(currTime + timeToCall); }, 
      timeToCall);
    lastTime = currTime + timeToCall;
    return id;
  }

  // @name cancelAnimationFrame
  // @desc the sub function for the base
  // @param {String} id - The requestID to cancel
  function cancelAnimationFrame(id) {
    clearTimeout(id);
  }

  // ---------------------------------------------
  //   Export block
  // ---------------------------------------------
  if (!window.requestAnimationFrame) {
    window.requestAnimationFrame = requestAnimationFrame;
  }

  if (!window.cancelAnimationFrame) {
    window.cancelAnimationFrame = cancelAnimationFrame;
  }
    
})();
},{}],8:[function(require,module,exports){
"use strict";

// -------------------------------------
//   Dependencies
// -------------------------------------
/** 
  * @plugins
**/

// -------------------------------------
//   Base - Template
// -------------------------------------
/** 
  * @name template
  * @desc A base module that is used to create template 
          tag elements that represents templates used
          by an app for any purpose.
**/

(function() {
  console.log("base/template.js loaded.");

  // @name createTemplateTags
  // @desc the main function for the base
  function createTemplateTags() {
    if ("content" in document.createElement("template")) {
        return false;
    }

    var templates = document.getElementsByTagName("template");
    var plateLen = templates.length;

    for (var x = 0; x < plateLen; ++x) { try {
      var template = templates[x];
      var content  = template.childNodes;
      var fragment = document.createDocumentFragment();

      while (content[0]) {
          fragment.appendChild(content[0]);
      }

      template.content = fragment;}
      catch(error){ console.log(error); }
    }
  }

  // ---------------------------------------------
  //   Export block
  // ---------------------------------------------
  window.createTemplateTags = createTemplateTags;
  createTemplateTags();

})();

},{}],9:[function(require,module,exports){
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
require("../../base/promise");

// config
var CONFIG = require("../../config");

// -------------------------------------
//   Component - Promo Video
// -------------------------------------
/**
  * @name promo-video.component
  * @desc The promo video component for the app.
**/

(function($){
  console.log("components/common/promo-video.component.js loaded.");

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

        // remove the data-src attribute
        video.removeAttribute("data-src");
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


},{"../../base/promise":5,"../../base/query":6,"../../config":12}],10:[function(require,module,exports){
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
//   Component - Header
// -------------------------------------
/**
  * @name header.component
  * @desc The header component for the app.
**/

(function($){
  console.log("components/header.component.js loaded.");

  /**
    * @name Header
    * @desc the main class for the component
    * @param {Object} options - options for the component
    * @return {Object} - the instance of the component class
  **/
  function Header(options) {
    // ---------------------------------------------
    //   Private members
    // ---------------------------------------------
    var _el = { // reference to the DOM elements for
      main: null, // the main parent DOM element
      nav:  null, // the header nav  DOM element
      back: null, // the header back DOM element
      menu: null  // the header menu DOM element
    };

    var _class = { // the classes that are contained in
      main: "header", // the main parent DOM element
      nav:  "header__nav", // the header nav DOM element
      back: "header__back", // the header back DOM element
      menu: "header__menu--mobile", // the header menu DOM element

      modifier: { // applied modifier classes
        open: "header--open", // on header when the menu is open
        closed: "header--closed", // on header when the menu is closed
        fallback: "header--fallback", // on header to fix old browser issues

        sticky: "section--header-sticky", // on section when the header is sticky
        hidden: "section--header-hidden", // on section when the header is hidden

        active: "link--active" // on menu when the link is active
      }
    };

    var _elHtml = null; // reference to the html DOM element
    var _elBody = null; // reference to the body DOM element

    var _hierarchy = []; // array of paths representing the hierarchy
    var _parentPath = "/"; // string representation of the parent path

    var _menuTimer = null; // timer used when opening (or) closing the menu
    var _isMenuOpen = false; // flag to indicate if the header menu is open

    var _section = null; // the parent section wrapping the header component
    var _prevScroll = 0; // the previous position offset of the page scroll bar

    // ---------------------------------------------
    //   Public members
    // ---------------------------------------------
    /* empy block */

    // ---------------------------------------------
    //   Private methods
    // ---------------------------------------------
    // @name _addOpenClickListener
    // @desc function to add click event listener for the menu open
    function _addOpenClickListener() {
       query("a:first-child", _el.menu)[0].addEventListener("click", open);
    }

    // @name _addCloseClickListener
    // @desc function to add click event listener for the menu close
    function _addCloseClickListener() {
      query("a:last-child", _el.menu)[0].addEventListener("click", close);
    }

    // @name _removeOpenClickListener
    // @desc function to remove click event listener for the menu open
    function _removeOpenClickListener() {
      query("a:first-child", _el.menu)[0].removeEventListener("click", open);
    }

    // @name _removeCloseClickListener
    // @desc function to remove click event listener for the menu close
    function _removeCloseClickListener() {
      query("a:last-child", _el.menu)[0].removeEventListener("click", close);
    }

    // @name _addWindowResizeListener
    // @desc function to add the window resize event listener
    function _addWindowResizeListener() {
      window.addEventListener("resize", _windowResizeListener);
    }

    // @name _removeWindowResizeListener
    // @desc function to remove the window resize event listener
    function _removeWindowResizeListener() {
      window.removeEventListener("resize", _windowResizeListener);
    }

    // @name __windowResizeListener
    // @desc the listener function for the window resize event
    function _windowResizeListener(event) {
      // check if the viewport has been resized beyond the mobile breakpoint
      if(_isMenuOpen && !(CONFIG.breakpoint.isMobile || CONFIG.breakpoint.isMobileSmall)) {
        close(); // close the header menu if it is not longer relevant
      }
    }


    // @name _isPageChild
    // @desc function to check if the given page is a child
    // @return {Boolean} - the boolean result of the page hierarchy check
    function _isPageChild() {
      // get all the possible paths that leads to the current page
      var paths = window.location.pathname.split("/");
      _hierarchy = []; // empty the hierarchy array

      // loop through each of the paths and
      // populate the page hierarchy array
      paths.forEach(function(path, index) {
        if(path.length > 1) { _hierarchy.push(path); }
      });

      // create string representation of the parent path
      _parentPath = "/"; // reset the hierarchy name
      _hierarchy.forEach(function(name, index) {
        if(index < (_hierarchy.length - 1)
           && name != "careers") {
            _parentPath += (name + "/");
        }
      });

      // return if this is a child page or not
      return (_hierarchy.length > 2);
    }

    // @name _isPageParent
    // @desc function to check if the given page is a parent
    // @return {Boolean} - the boolean result of the page hierarchy check
    function _isPageParent() { return !_isPageChild(); }

    // @name _getPageParent
    // @desc function to get the parent of the current child page
    // @return {String} - the link href value to point to the parent
    function _getPageParent() {
      if(_isPageParent()) { return ""; }
      else { return _parentPath; }
    }

    // @name _isLinkActive
    // @desc function to check if the given link is active
    // @param {DOM} link - the link DOM object to be checked for active
    // @return {Boolean} - the boolean result of the active status check
    function _isLinkActive(link) { try {
      var path = window.location.pathname;
      var href = link.getAttribute("href");

      if(href && href.length > 1) {
        if(_isPageParent()) { return path.endsWith(href); }
        else { return _parentPath.endsWith(href); }
      }

      else { return false; }}
      catch(error) { return false; }
    }

    // @name __setLinkAsActive
    // @desc function to set the given link as active
    function _setLinkAsActive(link) {
      link.classList.add(_class.modifier.active);
    }

    // @name __setLinkAsInActive
    // @desc function to set the given link as inactive
    function _setLinkAsInactive(link) {
      link.classList.remove(_class.modifier.active);
    }

    // @name _disablePageScroll
    // @desc function to disable page scroll
    function _disablePageScroll() {
      // disable scroll on the html and body
      _elHtml.setAttribute("data-scroll", "disabled");
      _elBody.setAttribute("data-scroll", "disabled");

      // disable scrolling on touch devices
      if(CONFIG.device.isMobile) {
        document.ontouchmove = function(e){ e.preventDefault(); }
      }
    }

    // @name _enablePageScroll
    // @desc function to enable page scroll
    function _enablePageScroll() {
      // enable scroll on the html and body
      _elHtml.removeAttribute("data-scroll");
      _elBody.removeAttribute("data-scroll");

      // enable scrolling on touch devices
      if(CONFIG.device.isMobile) {
        document.ontouchmove = function(e){ return true; }
      }
    }

    // @name _sticky
    // @desc function to manage sticky header styling on scroll
    // @param {Event} - the event that triggerred the function
    function _sticky(event) {
      // calculte the new scroll position and the difference from previous
      var newScroll  = (document.documentElement.scrollTop || document.body.scrollTop);
      var diffScroll = _prevScroll - newScroll;
      _prevScroll = newScroll;

      // if the new scroll is less than 0
      // remove both the modifier classes
      if (newScroll <= 0) {
        _section.classList.remove(_class.modifier.sticky);
        _section.classList.remove(_class.modifier.hidden);
      }

      // if the new scroll is greater than 0
      else {
        // add the sticky modifer class
         _section.classList.add(_class.modifier.sticky);

        // check if the scroll difference is less than 0
        if (diffScroll <= 0) {
          // add the hidden modifier class if is
          _section.classList.add(_class.modifier.hidden);
        }

        else {
          // remove the hidden modifier class if is not
          _section.classList.remove(_class.modifier.hidden);
        }
      }
    }

    // @name _addWindowScrollListener
    // @desc function to add the window scroll event listener
    function _addWindowScrollListener() {
      window.addEventListener("scroll", _sticky);
    }

    // @name _removeWindowResizeListener
    // @desc function to remove the window scroll event listener
    function _removeWindowScrollListener() {
      window.removeEventListener("scroll", _sticky);
    }

    // ---------------------------------------------
    //   Public methods
    // ---------------------------------------------
    // @name open
    // @desc function to open the header menu
    // @param {Event} - the event that triggerred the function
    function open(event) {
      if(_isMenuOpen) {
        console.log("header.component.js: The header menu is already open.");
        return false;
      }

      // prevent default events
      if(event) {
        event.preventDefault();
        event.stopPropagation();
      }

      // remove the window scroll listener
      _removeWindowScrollListener();

      // set the menu open flag
      // and disable page scroll
      _isMenuOpen = true;
      _disablePageScroll();

      // make sure the nav is hidden
      // add add, remove the modifiers
      _el.nav.style.opacity = 0;
      _el.main.classList.add(_class.modifier.open);
      _el.main.classList.remove(_class.modifier.closed);

      requestAnimationFrame(function() {
        // finish any animations currently
        // being performed on header nav
        $(_el.nav).velocity("finish");

        // perform the new animation
        $(_el.nav).velocity("transition.slideUpIn", {
          easing: "easeInOutQuad",
          delay: CONFIG.animation.delay,
          duration: CONFIG.animation.durationFast
        });
      });

      // add the window resize listener
      _addWindowResizeListener();
    }

    // @name close
    // @desc function to close the header menu
    // @param {Event} - the event that triggerred the function
    function close(event) {
      if(!_isMenuOpen) {
        console.log("header.component.js: The header menu is already closed.");
        return false;
      }

      // prevent default events
      if(event) {
        event.preventDefault();
        event.stopPropagation();
      }

      // reset the menu open flag
      // and enable page scroll
      _isMenuOpen = false;
      _enablePageScroll();

      // clear any previously set timers
      if(_menuTimer != null) {
        clearTimeout(_menuTimer);
        _menuTimer = null;
      }

      // make sure the nav is visible
      // add add, remove the modifiers
      _el.nav.style.opacity = 1;
      requestAnimationFrame(function() {
        // change the modifer classes after a set timeout
        _menuTimer = setTimeout(function() {
          _el.main.classList.add(_class.modifier.closed);
          _el.main.classList.remove(_class.modifier.open);
        }, CONFIG.animation.delay);
      });

      requestAnimationFrame(function() {
        // finish any animations currently
        // being performed on header nav
        $(_el.nav).velocity("finish");

        // perform the new animation
        $(_el.nav).velocity("transition.slideDownOut", {
          easing: "easeInOutQuad", delay: 0,
          duration: CONFIG.animation.durationFast,

          // add the window scroll listener on complete
          complete: function() { _addWindowScrollListener(); }
        });
      });

      // remove the window resize listener
      _removeWindowResizeListener();
    }

    // ---------------------------------------------
    //   Constructor block
    // ---------------------------------------------
    // check if the header has valid options
    // element - should be a valid DOM element
    if(!options || !options.element
      || !options.element.nodeName || !options.element.nodeType) {
      console.log("header.component.js: Cannot create header with invalid options.");
      return null;  // return null if invalid
    }

    // get the main parent element
    _el.main = options.element;

    // get all the child elements
    _el.nav  = query("." + _class.nav, _el.main)[0];
    _el.back = query("." + _class.back, _el.main)[0];
    _el.menu = query("." + _class.menu, _el.main)[0];

    // get the html and body DOM elements
    _elHtml = query("html")[0];
    _elBody = query("body")[0];

    // add browser specific class for older browsers
    if(CONFIG.browser.isIE && CONFIG.browser.isIEOld) {
      _el.main.classList.add(_class.modifier.fallback);
    }

    // loop through all the nav links and check if any of them are active
    query(".link", _el.nav).forEach(function(link, index) {
      if(_isLinkActive(link)) { _setLinkAsActive(link); }
      else { _setLinkAsInactive(link); }
    });

    // add click event listeners for
    // the menu open and close links
    _addOpenClickListener();
    _addCloseClickListener();

    // get the wrapping header section
    // and the current page scroll offset
    _section = query(".section--header")[0];
    _prevScroll = document.body.scrollTop;

     // trigger stricky header once on load
     // and add the window scroll listener
    _sticky(); _addWindowScrollListener();

    // check if this is a parent page
    if(_isPageParent()) {
      // hide the back link if it is a parent
      _el.back.style.visibility = "hidden";
    }

    else {
      // show the back link if it is a child
      // and set the href atttribute of the
      // back link to point to the page page
      _el.back.style.visibility = "visible";
      query("a", _el.back)[0].setAttribute("href", _getPageParent());
    }

    // ---------------------------------------------
    //   Instance block
    // ---------------------------------------------
    return {
      open: open,   // function to open the header menu
      close: close  // function to close the header menu
    };
  }

  // ---------------------------------------------
  //   Export block
  // ---------------------------------------------
  module.exports = Header;

})(jQuery);

},{"../base/promise":5,"../base/query":6,"../config":12}],11:[function(require,module,exports){
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
    // _el.images.melbourne = options.element.querySelector("[data-link-image=melbourne]");

    _el.anchors.group     = options.element.querySelector("[data-link-anchor=group]");
    _el.anchors.sydney    = options.element.querySelector("[data-link-anchor=sydney]");
    // _el.anchors.melbourne = options.element.querySelector("[data-link-anchor=melbourne]");


    // @name _onAnchorHover
    // @desc function to set up anchor mouseover hooks
    // @param {DOM} image - the image that needs to be set on hover
    function _onAnchorHover(image) {
      var clName = "intro-tile__image-section--visible";

      if (_el.images.sydney.classList.contains(clName)) {
        _el.images.sydney.classList.remove(clName)
      }

      // if (_el.images.melbourne.classList.contains(clName)) {
      //   _el.images.melbourne.classList.remove(clName)
      // }

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
    // _el.anchors.melbourne.addEventListener("mouseover", function() { _onAnchorHover(_el.images.melbourne) });

    // create a default mouseover event on load
    var eventMouseOver = new CustomEvent("mouseover");

    // dispatch the default mouseover event on load
    requestAnimationFrame(function() {
      _el.anchors.sydney.dispatchEvent(eventMouseOver);
    });

    // filthy jquery scrolling to #group section
    // $(options.group).hide(0);
    _el.anchors.group.addEventListener("click", function(e) {
      e.preventDefault();
      // $(options.group).show(0);
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


},{"../../base/event":3,"../../base/query":6,"../../config":12}],12:[function(require,module,exports){
"use strict";

// -------------------------------------
//   Dependencies
// -------------------------------------
/**
  * @plugins
**/

// base
/* empty block */

// -------------------------------------
//   Config
// -------------------------------------
/**
  * @name config
  * @desc The main js file that contains the
          config options and functions for the app.
**/
(function($) {
  console.log("config.js loaded.");

  /**
    * @name BuildDetect
    * @desc Class to detect the current build.
    * @param {String} host - the window location host
    * @return {Object} - the instance of the build class
  **/
  function BuildDetect(host) {
    // ---------------------------------------------
    //   Private members
    // ---------------------------------------------
    /* empty block */

    // ---------------------------------------------
    //   Public members
    // ---------------------------------------------
    var bd = this; // to capture the content of this
    bd.isProd = false; // flag turn dev mode on/off ( will be modified by gulp )
    bd.isDeploy = true; // flag turn live mode on/off ( will be modified by gulp )

    // ---------------------------------------------
    //   Private methods
    // ---------------------------------------------
    /* empty block */

    // ---------------------------------------------
    //   Public methods
    // ---------------------------------------------
    // @name isMobile
    // @desc to detect mobile build
    // @return {Boolean} - true or false
    function isMobile() { return host.indexOf(":m.") != -1; }

    // @name isDesktop
    // @desc to detect desktop build
    // @return {Boolean} - true or false
    function isDesktop() { return !isMobile(); }

    // ---------------------------------------------
    //   Constructor block
    // ---------------------------------------------
    // check if the given host is valid
    if(host == null || typeof host == "undefined") {
      host = window.location.host;
    }

    // ---------------------------------------------
    //   Instance block
    // ---------------------------------------------
    bd.isMobile = isMobile(); // to detect mobile build
    bd.isDesktop = isDesktop(); // to detect desktop build
  }

  /**
    * @name BreakpointDetect
    * @desc Class to detect the current breakpoint.
    * @return {Object} - the instance of the breakpoint class
  **/
  function BreakpointDetect() {
    // ---------------------------------------------
    //   Private members
    // ---------------------------------------------
    /* empty block */

    // ---------------------------------------------
    //   Public members
    // ---------------------------------------------
    var br = this; // to capture the content of this
    br.value = null; // the current breakpoint value

    // flags to indicate various browser breakpoints
    br.isDesktopLarge = false; br.isDesktop = false; // desktop
    br.isTablet = false; br.isTabletSmall = false;   // tablet
    br.isMobile = false; br.isMobileSmall = false;   // mobile

    // ---------------------------------------------
    //   Private methods
    // ---------------------------------------------
    // @name _isMobileSmall, _isMobilem _isTabletSmall,
    // @name _isTablet, _isDesktop, _isDesktopLarge
    // @desc to detect various browser breakpoints
    // @return {Boolean} - true or false
    function _isDesktopLarge() { return  br.value == "desktop-lg-up"; }
    function _isDesktop()      { return  _isDesktopLarge() || br.value == "desktop"; }

    function _isTablet()       { return  _isTabletSmall() || br.value == "tablet"; }
    function _isTabletSmall()  { return  br.value == "tablet-sm"; }

    function _isMobile()       { return  _isMobileSmall() || br.value == "mobile"; }
    function _isMobileSmall()  { return  br.value == "mobile-sm"; }

    // @name _updateValues
    // @desc function to update breakpoint value and flags
    function _updateValues() {
      // update the breakpoint value
      br.value = window.getComputedStyle(document.querySelector('body'), ':before')
                     .getPropertyValue('content').replace(/\"/g, '');

      // update all the breakpoint flags
      if(_isDesktopLarge()) { br.isDesktopLarge = true; } else { br.isDesktopLarge = false; }
      if(_isDesktop()) { br.isDesktop = true; } else { br.isDesktop = false; }

      if(_isTablet()) { br.isTablet = true; } else { br.isTablet = false; }
      if(_isTabletSmall()) { br.isTabletSmall = true; } else { br.isTabletSmall = false; }

      if(_isMobile()) { br.isMobile = true; } else { br.isMobile = false; }
      if(_isMobileSmall()) { br.isMobileSmall = true; } else { br.isMobileSmall = false; }
    }

    // ---------------------------------------------
    //   Public methods
    // ---------------------------------------------
    /* empty block */

    // ---------------------------------------------
    //   Constructor block
    // ---------------------------------------------
    // add window resize event listener
    // to update the breakpoint value and fals
    window.addEventListener("resize", function(event) {
      _updateValues();
    });

    // update the breakpoint value and flags
    // at least once after initialization
    _updateValues();

    // ---------------------------------------------
    //   Instance block
    // ---------------------------------------------
    /* empty block */
  }

  /**
    * @name CONFIG
    * @desc Constant that contains the config options and values for the app
    * @return {Object} - all the possible config options and values for the app
  **/
  function CONFIG() {
    // ---------------------------------------------
    //   Private members
    // ---------------------------------------------
    var _md = new MobileDetect(navigator.userAgent); // detect mobile
    var _bd = new BuildDetect(window.location.host); // detect build
    var _os = _md.os(); // detect mobile OS

    var _src = "/";   // src path
    var _dist = "/"; // dist path
    var _deploy = "/";     // deploy path

    // ---------------------------------------------
    //   Public members
    // ---------------------------------------------
    var breakpoint = new BreakpointDetect(); // detect breakpoint

    // ---------------------------------------------
    //   Private methods
    // ---------------------------------------------
    /* empty block */

    // ---------------------------------------------
    //   Public methods
    // ---------------------------------------------
    // @name isPhone, isTablet, isMobile, isIOS, isAndroid
    // @desc functions to detect mobile device and os
    // @return {Boolean} - returns true or false
    function isPhone()  { return _md.phone()  != null; } // only phones
    function isTablet() { return _md.tablet() != null || _bd.isMobile; } // only tablets
    function isMobile() { return _md.mobile() != null || _bd.isMobile; } // phones and tablets

    function isIOS() { return _os ? (_os.toLowerCase().indexOf("ios") != -1) : false; } // ios
    function isAndroid() { return _os ? (_os.toLowerCase().indexOf("android") != -1) : false; } // android

    function isIOSOld() { return _os ? (isIOS() && parseFloat(_md.version("iOS")) < 9) : false; } // ios old
    function isAndroidOld() { return _os ? (isAndroid() && parseFloat(_md.version("Android")) < 6) : false; } // android old

    // @name isFirefox, isSafari, isChrome
    // @desc function to detect firefox, safari and chrome
    // @return {Boolean} - returns true or false base on the check
    function isFirefox() { return !isNaN(_md.version("Firefox")); }
    function isSafari()  { return !isNaN(_md.version("Safari"));  }
    function isChrome()  { return !isNaN(_md.version("Chrome"));  }

    // @name getIEVersion
    // @desc function to get internet explorer version
    // @return {Boolean|Number} - returns version number or false
    function getIEVersion() {
      var ua = navigator.userAgent;

      var msie = ua.indexOf("MSIE ");
      if (msie > 0) {
          // IE 10 or older - return version number
          return parseInt(ua.substring(msie + 5, ua.indexOf(".", msie)), 10);
      }

      var trident = ua.indexOf("Trident/");
      if (trident > 0) {
        // IE 11 - return version number
        var rv = ua.indexOf("rv:");
        return parseInt(ua.substring(rv + 3, ua.indexOf(".", rv)), 10);
      }

      var edge = ua.indexOf("Edge/");
      if (edge > 0) {
        // IE 12 - return version number
        return parseInt(ua.substring(edge + 5, ua.indexOf(".", edge)), 10);
      }

      // other browsers
      return false;
    }

    // @name isIE
    // @desc function to detect internet explorer
    // @return {Boolean} - returns true or false
    function isIE() {
      try { return parseInt(getIEVersion()) > 0; }
      catch(error) { /*console.log(error);*/ return false; }
    }

    // @name isIEOld
    // @desc function to detect old internet explorer
    // @return {Boolean} - returns true or false
    function isIEOld() {
      try { return parseInt(getIEVersion()) <= 10; }
      catch(error) { /*console.log(error);*/ return false; }
    }

    // @name isLocalHost
    // @desc functions to check for the server host environment
    // @return {Boolean} - returns true or false based on environment
    function isLocalHost() {
      return (window.location.host).indexOf(":8000") != -1
          || (window.location.host).indexOf(":4000") != -1;
    }

    // @name isAmazonHost
    // @desc functions to check for the server host environment
    // @return {Boolean} - returns true or false based on environment
    function isAmazonHost() {
      return (window.location.host).indexOf("amazonaws") != -1;
    }

    // @name getViewsPath
    // function to get the path for views
    // @return {String} - returns the path
    function getViewsPath() {
      var viewsPath = "static/views/";
      return !_bd.isProd ? _src + viewsPath : _dist + viewsPath;
    }

    // @name getTemplatesPath
    // function to get the path for templates
    // @return {String} - returns the path
    function getTemplatesPath() {
      var templatesPath = "static/templates/";
      return !_bd.isProd ? _src + templatesPath : _dist + templatesPath;
    }

    // @name getDataPath
    // function to get the path for data
    // @return {String} - returns the path
    function getDataPath() {
      var dataPath = "data/";
      return !_bd.isProd ? _src + dataPath : _dist + dataPath;
    }

    // @name getImagesPath
    // function to get the path for images
    // @return {String} - returns the path
    function getImagesPath() {
      var imagesPath = "images/";
      return !_bd.isProd ? _src + imagesPath : _dist + imagesPath;
    }

    // @name getVideosPath
    // function to get the path for videos
    // @return {String} - returns the path
    function getVideosPath() {
      var videosPath = "videos/";
      return !_bd.isProd ? _src + videosPath : _dist + videosPath;
    }

    // ---------------------------------------------
    //   Constructor block
    // ---------------------------------------------
    // if app is in deployment mode
    if(_bd.isDeploy) {
        // all paths are the same
        _src = _dist = _deploy;
    }

    // ---------------------------------------------
    //   Instance block
    // ---------------------------------------------
    return {
      // device
      device: {
        isPhone:  isPhone(),  // functions to detect mobile device and os
        isTablet: isTablet(), // functions to detect mobile device and os
        isMobile: isMobile(), // functions to detect mobile device and os

        isIOS:     isIOS(),     // functions to detect mobile device and os
        isAndroid: isAndroid(), // functions to detect mobile device and os

        isIOSOld:     isIOSOld(),    // functions to detect mobile device and os
        isAndroidOld: isAndroidOld() // functions to detect mobile device and os
      },

      // browser
      browser: {
        isFirefox: isFirefox(), // function to detect firefox
        isSafari:  isSafari(),  // function to detect safari
        isChrome:  isChrome(),  // function to detect chrome

        isIE:    isIE(),   // function to detect ie
        isIEOld: isIEOld() // function to detect old ie
      },

      // breakpoint
      breakpoint: breakpoint, // functions to detect the current breakpoint

      // environment
      environment: {
        isProd: _bd.isProd,     // functions to check for the server host environment
        isDeploy: _bd.isDeploy, // functions to check for the server host environment

        isLocalHost: isLocalHost(),   // functions to check for the server host environment
        isAmazonHost: isAmazonHost(), // functions to check for the server host environment
      },

      // path
      path: {
        views: getViewsPath(),         // function to get the path for views
        templates: getTemplatesPath(), // function to get the path for templates

        data: getDataPath(),     // function to get the path for data
        images: getImagesPath(), // function to get the path for images
        videos: getVideosPath()  // function to get the path for videos
      },

      // animation
      animation: {
        // duration and delay
        // used in js animations
        delay: 250,   // delay in ms
        duration: 500, // duration in ms
        durationSlow: (500 * 1.3), // duration in ms
        durationFast: (500 * 0.6), // duration in ms
        durationInstant: (500 * 0.4) // duration in ms
      },

      // timeout
      timeout: {
        // timeouts used for
        // manual scope and
        // animation updates
        scope: 275,    // timeout scope in ms
        animation: 525 // timeout animation in ms
      }
    };
  }

  // ---------------------------------------------
  //   Module export block
  // ---------------------------------------------
  module.exports = new CONFIG();

})(jQuery);

},{}],13:[function(require,module,exports){
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


},{"../base/query":6}]},{},[1]);
