/*!
 * Zeplin
 * A bare-bones JavaScript framework
 * http://www.zeplinframework.com
 * https://github.com/tkiddle/zeplin
 * @version 1.0.0
 * @author Thomas Kiddle
 */
window.zeplin = (function() {
  'use strict';

  /**
   * Zeplin library constructor
   * @param Function elements array of DOM elements
   */
  function Zeplin(els) {
    for(var i = 0, len = els.length; i < len; i++) {
      this[i] = els[i];
    }
    this.length = els.length;
  }

  Zeplin.prototype.map = function(cb) {
    var results = [];

    for(var i = 0; i < this.length; i++) {
      results.push(cb.call(this, this[i], i));
    }
    return results;
  };

  Zeplin.prototype.forEach = function(cb) {
    this.map(cb);
    return this;
  };

  Zeplin.prototype.mapOne = function(cb) {
    var m = this.map(cb);
    return m.length > 1 ? m : m[0];
  };

  Zeplin.prototype.text = function(text) {
    if(typeof text !== 'undefined' && typeof text == 'string') {
      return this.forEach(function(el) {
        el.innerText = text;
      });
    }
    else {
      return this.mapOne(function(el) {
        return el.innerText;
      });
    }
  };

  Zeplin.prototype.html = function(html) {
    if(typeof html !== 'undefined') {
      this.forEach(function(el) {
        el.innerHTML = html;
      });
    }
    else {
      return this.mapOne(function(el) {
        return el.innerHTML;
      });
    }
  };

  /**
   * Adds a class(es) to a DOM element - currently doesn't
   * Cater for classes that Already exist on an element
   * @param {String | Array} classes String/Array of classes
   */
  Zeplin.prototype.addClass = function(classes) {
    var classList = '';

    if(typeof classes !== 'string' && classes.length) {
      for(var i = 0, len = classes.length; i < len; i++) {
        classList += ' ' + classes[i];
      }
    }
    else {
      classList += ' ' + classes;
    }
    return this.forEach(function(el) {
      el.className += (el.className.length === 0 ? '' : ' ') + classes;
    });
  };

  /**
   * Removes a single classes from a DOM element
   * REQUIRED: Polyfill for Array.prototype.indexOf
   * @param  {String} classes the class to be removed
   */
  Zeplin.prototype.removeClass = function(classes) {
    return this.forEach(function(el) {
      var classList = el.className.split(' '),
          i;

      while((i = classList.indexOf(classes)) > -1) {
        classList = classList.slice(0, i).concat(classList.slice(++i));
      }
      el.className = classList.join(' ');
    });
  };

  /**
   * Get or Set attributes for DOM elements
   * @param  {String} attr  name of the attribute
   * @param  {String} value value of the arrtibute
   * @return {String}       attribute value
   */
  Zeplin.prototype.attr = function(attr, value) {
    if(typeof value !== 'undefined') {
      return this.forEach(function(el) {
        el.setAttribute(attr, value);
      });
    }
    else {
      return this.mapOne(function(el) {
        return el.getAttribute(attr);
      });
    }
  };

  Zeplin.prototype.append = function(els) {
    return this.forEach(function(parent, i) {
      els.forEach(function(child) {
        if(i > 0) {
          child = child.cloneNode(true);
        }
        parent.appendChild(child);
      });
    });
  };

  Zeplin.prototype.prepend = function(els) {
    return this.forEach(function(parent) {
      for(var i = els.length - 1; i > -1; --i) {
        var child;
        if(i > 0) {
          child = els[i].cloneNode(true);
        }
        else {
          child = els[i];
        }
        parent.insertBefore(child, parent.firstChild);
      }
    });
  };

  /**
   * Remove one or more DOM elements
   */
  Zeplin.prototype.remove = function() {
    this.forEach(function(el) {
      el.parentNode.removeChild(el);
    });
  };

  /**
   * Attach events to DOM elements. Supports ie6 and beyond.
   * @return {Function}   returns the appropriate event handler.
   */
  Zeplin.prototype.on = (function() {
    if(document.addEventListener) {
      /**
       * Supports all browsers from ie9 up
       * @param  {String}   evt the type of event to attach
       * @param  {Function} cb  the event callback function
       * @return {Object}       the element on which the event is attached
       */
      return function(evt, cb) {
        return this.forEach(function(el) {
          el.addEventListener(evt, cb, false);
        });
      };
    }
    else {
      /**
       * Supports Microsoft ie6, ie7, ie8
       * @param  {String}   evt the type of event to attach
       * @param  {Function} cb  the event callback function
       * @return {Object}       the element on which the event is attached
       */
      return function(evt, cb) {
        return this.forEach(function(el) {
          el.attachEvent('on' + evt, cb);
        });
      };
    }
  })();

  /**
   * Public Zeplin API
   * @type Function
   */
  var zeplin = {
    find: function(selector) {
      var els;
      if(typeof selector === 'string') {
        els = document.querySelectorAll(selector);
      }
      else if(selector.length) {
        els = selector;
      }
      else {
        els = [selector];
      }
      return new Zeplin(els);
    },

    create: function(tagName, attrs) {
      var el = new Zeplin([ document.createElement(tagName) ]);

      if(attrs) {
        if(attrs.class) {
          el.addClass(attrs.class);
          delete attrs.class;
        }
        else if(attrs.text) {
          el.text(attrs.text);
          delete attrs.text;
        }

        for(var prop in attrs) {
          if(attrs.hasOwnProperty(prop)) {
            el.attr(prop, attrs[prop]);
          }
        }
      }
      return el;
    },

    ajax: (function() {

      var _xhrCreate, _xhrComplete;

      _xhrCreate = function(opts) {
        var xhr, method, body;

        if(!opts || !opts.url) {
          throw new Error('Please supply a URL to the ajax method.');
        }

        xhr = new XMLHttpRequest();
        method = opts.body ? 'POST' : opts.method ? opts.method.toUpperCase() : 'GET';

        if(opts.body && typeof opts.body === 'string') {
          body = opts.body;
        }

        _xhrComplete.call(xhr, opts);

        xhr.open(method, opts.url, (opts.async === undefined ? true : false));

        // We set this header allowing frameworks/applications to detect that
        // This is an AJAX Request allowing them to serve up data accordingly.
        // i.e. JSON data for AJAX requests and HTML for non-AJAX request.
        xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');

        // Setting this header tells the server that we are going to send over
        // Encoded URL containing our body parameters in the content... i think.
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

        if(opts.headers) {
          for(var prop in opts.headers) {
            xhr.setRequestHeader(prop, opts.headers[prop]);
          }
        }

        xhr.send(body || null);
      };

      _xhrComplete = function(opts) {
        var data;
        this.onreadystatechange = function() {
          if(this.readyState == 4) {
            if(this.status == 200 && typeof opts.success === 'function') {
              data = (this.responseXML || this.responseText);
              opts.success.call(opts, data, this.status);
            }
            else {
              if(typeof opts.error === 'function') {
                data = (this.responseXML || this.responseText);
                opts.error.call(opts, data, this.statusText, this.status);
              }
            }
          }
        };
      };
      return _xhrCreate;
    })(),
  };
  return zeplin;
})();
