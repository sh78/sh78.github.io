"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

/*!
 * Infinite Ajax Scroll v2.3.1
 * A jQuery plugin for infinite scrolling
 * https://infiniteajaxscroll.com
 *
 * Commercial use requires one-time purchase of a commercial license
 * https://infiniteajaxscroll.com/docs/license.html
 *
 * Non-commercial use is licensed under the MIT License
 *
 * Copyright (c) 2018 Webcreate (Jeroen Fiege)
 */
var IASCallbacks = function IASCallbacks(a) {
  return this.list = [], this.fireStack = [], this.isFiring = !1, this.isDisabled = !1, this.Deferred = a.Deferred, this.fire = function (a) {
    var b = a[0],
        c = a[1],
        d = a[2];this.isFiring = !0;for (var e = 0, f = this.list.length; f > e; e++) {
      if (void 0 != this.list[e] && !1 === this.list[e].fn.apply(b, d)) {
        c.reject();break;
      }
    }this.isFiring = !1, c.resolve(), this.fireStack.length && this.fire(this.fireStack.shift());
  }, this.inList = function (a, b) {
    b = b || 0;for (var c = b, d = this.list.length; d > c; c++) {
      if (this.list[c].fn === a || a.guid && this.list[c].fn.guid && a.guid === this.list[c].fn.guid) return c;
    }return -1;
  }, this;
};IASCallbacks.prototype = { add: function add(a, b) {
    var c = { fn: a, priority: b };b = b || 0;for (var d = 0, e = this.list.length; e > d; d++) {
      if (b > this.list[d].priority) return this.list.splice(d, 0, c), this;
    }return this.list.push(c), this;
  }, remove: function remove(a) {
    for (var b = 0; (b = this.inList(a, b)) > -1;) {
      this.list.splice(b, 1);
    }return this;
  }, has: function has(a) {
    return this.inList(a) > -1;
  }, fireWith: function fireWith(a, b) {
    var c = this.Deferred();return this.isDisabled ? c.reject() : (b = b || [], b = [a, c, b.slice ? b.slice() : b], this.isFiring ? this.fireStack.push(b) : this.fire(b), c);
  }, disable: function disable() {
    this.isDisabled = !0;
  }, enable: function enable() {
    this.isDisabled = !1;
  } }, function (a) {
  "use strict";
  var b = -1,
      c = function c(_c, d) {
    return this.itemsContainerSelector = d.container, this.itemSelector = d.item, this.nextSelector = d.next, this.paginationSelector = d.pagination, this.$scrollContainer = _c, this.$container = window === _c.get(0) ? a(document) : _c, this.defaultDelay = d.delay, this.negativeMargin = d.negativeMargin, this.nextUrl = null, this.isBound = !1, this.isPaused = !1, this.isInitialized = !1, this.jsXhr = !1, this.listeners = { next: new IASCallbacks(a), load: new IASCallbacks(a), loaded: new IASCallbacks(a), render: new IASCallbacks(a), rendered: new IASCallbacks(a), scroll: new IASCallbacks(a), noneLeft: new IASCallbacks(a), ready: new IASCallbacks(a) }, this.extensions = [], this.scrollHandler = function () {
      if (this.isBound && !this.isPaused) {
        var a = this.getCurrentScrollOffset(this.$scrollContainer),
            c = this.getScrollThreshold();b != c && (this.fire("scroll", [a, c]), a >= c && this.next());
      }
    }, this.getItemsContainer = function () {
      return a(this.itemsContainerSelector, this.$container);
    }, this.getLastItem = function () {
      return a(this.itemSelector, this.getItemsContainer().get(0)).last();
    }, this.getFirstItem = function () {
      return a(this.itemSelector, this.getItemsContainer().get(0)).first();
    }, this.getScrollThreshold = function (a) {
      var c;return a = a || this.negativeMargin, a = a >= 0 ? -1 * a : a, c = this.getLastItem(), 0 === c.length ? b : c.offset().top + c.height() + a;
    }, this.getCurrentScrollOffset = function (a) {
      var b = 0,
          c = a.height();return b = window === a.get(0) ? a.scrollTop() : a.offset().top, (-1 != navigator.platform.indexOf("iPhone") || -1 != navigator.platform.indexOf("iPod")) && (c += 80), b + c;
    }, this.getNextUrl = function (b) {
      return b = b || this.$container, a(this.nextSelector, b).last().attr("href");
    }, this.load = function (b, c, d) {
      function e(b) {
        f = a(this.itemsContainerSelector, b).eq(0), 0 === f.length && (f = a(b).filter(this.itemsContainerSelector).eq(0)), f && f.find(this.itemSelector).each(function () {
          i.push(this);
        }), h.fire("loaded", [b, i]), c && (g = +new Date() - j, d > g ? setTimeout(function () {
          c.call(h, b, i);
        }, d - g) : c.call(h, b, i));
      }var f,
          g,
          h = this,
          i = [],
          j = +new Date();d = d || this.defaultDelay;var k = { url: b, ajaxOptions: { dataType: "html" } };return h.fire("load", [k]), this.jsXhr = a.ajax(k.url, k.ajaxOptions).done(a.proxy(e, h)), this.jsXhr;
    }, this.render = function (b, c) {
      var d = this,
          e = this.getLastItem(),
          f = 0,
          g = this.fire("render", [b]);g.done(function () {
        a(b).hide(), e.after(b), a(b).fadeIn(400, function () {
          ++f < b.length || (d.fire("rendered", [b]), c && c());
        });
      }), g.fail(function () {
        c && c();
      });
    }, this.hidePagination = function () {
      this.paginationSelector && a(this.paginationSelector, this.$container).hide();
    }, this.restorePagination = function () {
      this.paginationSelector && a(this.paginationSelector, this.$container).show();
    }, this.throttle = function (b, c) {
      var d,
          e,
          f = 0;return d = function d() {
        function a() {
          f = +new Date(), b.apply(d, g);
        }var d = this,
            g = arguments,
            h = +new Date() - f;e ? clearTimeout(e) : a(), h > c ? a() : e = setTimeout(a, c);
      }, a.guid && (d.guid = b.guid = b.guid || a.guid++), d;
    }, this.fire = function (a, b) {
      return this.listeners[a].fireWith(this, b);
    }, this.pause = function () {
      this.isPaused = !0;
    }, this.resume = function () {
      this.isPaused = !1;
    }, this;
  };c.prototype.initialize = function () {
    if (this.isInitialized) return !1;var a = !!("onscroll" in this.$scrollContainer.get(0)),
        b = this.getCurrentScrollOffset(this.$scrollContainer),
        c = this.getScrollThreshold();return a ? (this.hidePagination(), this.bind(), this.nextUrl = this.getNextUrl(), this.nextUrl || this.fire("noneLeft", [this.getLastItem()]), this.nextUrl && b >= c ? (this.next(), this.one("rendered", function () {
      this.isInitialized = !0, this.fire("ready");
    })) : (this.isInitialized = !0, this.fire("ready")), this) : !1;
  }, c.prototype.reinitialize = function () {
    this.isInitialized = !1, this.unbind(), this.initialize();
  }, c.prototype.bind = function () {
    if (!this.isBound) {
      this.$scrollContainer.on("scroll", a.proxy(this.throttle(this.scrollHandler, 150), this));for (var b = 0, c = this.extensions.length; c > b; b++) {
        this.extensions[b].bind(this);
      }this.isBound = !0, this.resume();
    }
  }, c.prototype.unbind = function () {
    if (this.isBound) {
      this.$scrollContainer.off("scroll", this.scrollHandler);for (var a = 0, b = this.extensions.length; b > a; a++) {
        "undefined" != typeof this.extensions[a].unbind && this.extensions[a].unbind(this);
      }this.isBound = !1;
    }
  }, c.prototype.destroy = function () {
    try {
      this.jsXhr.abort();
    } catch (a) {}this.unbind(), this.$scrollContainer.data("ias", null);
  }, c.prototype.on = function (b, c, d) {
    if ("undefined" == typeof this.listeners[b]) throw new Error('There is no event called "' + b + '"');return d = d || 0, this.listeners[b].add(a.proxy(c, this), d), this.isInitialized && ("ready" === b ? a.proxy(c, this)() : "noneLeft" !== b || this.nextUrl || a.proxy(c, this)()), this;
  }, c.prototype.one = function (a, b) {
    var c = this,
        d = function d() {
      c.off(a, b), c.off(a, d);
    };return this.on(a, b), this.on(a, d), this;
  }, c.prototype.off = function (a, b) {
    if ("undefined" == typeof this.listeners[a]) throw new Error('There is no event called "' + a + '"');return this.listeners[a].remove(b), this;
  }, c.prototype.next = function () {
    var a = this.nextUrl,
        b = this;if (!a) return !1;this.pause();var c = this.fire("next", [a]);return c.done(function () {
      b.load(a, function (a, c) {
        b.render(c, function () {
          b.nextUrl = b.getNextUrl(a), b.nextUrl || b.fire("noneLeft", [b.getLastItem()]), b.resume();
        });
      });
    }), c.fail(function () {
      b.resume();
    }), !0;
  }, c.prototype.extension = function (a) {
    if ("undefined" == typeof a.bind) throw new Error('Extension doesn\'t have required method "bind"');return "undefined" != typeof a.initialize && a.initialize(this), this.extensions.push(a), this.isBound && this.reinitialize(), this;
  }, a.ias = function (b) {
    var c = a(window);return c.ias.apply(c, arguments);
  }, a.fn.ias = function (b) {
    var d = Array.prototype.slice.call(arguments),
        e = this;return this.each(function () {
      var f = a(this),
          g = f.data("ias"),
          h = a.extend({}, a.fn.ias.defaults, f.data(), "object" == (typeof b === "undefined" ? "undefined" : _typeof(b)) && b);if (g || (f.data("ias", g = new c(f, h)), h.initialize && a(document).ready(a.proxy(g.initialize, g))), "string" == typeof b) {
        if ("function" != typeof g[b]) throw new Error('There is no method called "' + b + '"');d.shift(), g[b].apply(g, d);
      }e = g;
    }), e;
  }, a.fn.ias.defaults = { item: ".item", container: ".listing", next: ".next", pagination: !1, delay: 600, negativeMargin: 10, initialize: !0 };
}(jQuery);var IASHistoryExtension = function IASHistoryExtension(a) {
  return a = jQuery.extend({}, this.defaults, a), this.ias = null, this.prevSelector = a.prev, this.prevUrl = null, this.listeners = { prev: new IASCallbacks(jQuery) }, this.onPageChange = function (a, b, c) {
    if (window.history && window.history.replaceState) {
      var d = history.state;history.replaceState(d, document.title, c);
    }
  }, this.onScroll = function (a, b) {
    var c = this.getScrollThresholdFirstItem();this.prevUrl && (a -= this.ias.$scrollContainer.height(), c >= a && this.prev());
  }, this.onReady = function () {
    var a = this.ias.getCurrentScrollOffset(this.ias.$scrollContainer),
        b = this.getScrollThresholdFirstItem();a -= this.ias.$scrollContainer.height(), b >= a && this.prev();
  }, this.getPrevUrl = function (a) {
    return a || (a = this.ias.$container), jQuery(this.prevSelector, a).last().attr("href");
  }, this.getScrollThresholdFirstItem = function () {
    var a;return a = this.ias.getFirstItem(), 0 === a.length ? -1 : a.offset().top;
  }, this.renderBefore = function (a, b) {
    var c = this.ias,
        d = c.getFirstItem(),
        e = 0;c.fire("render", [a]), jQuery(a).hide(), d.before(a), jQuery(a).fadeIn(400, function () {
      ++e < a.length || (c.fire("rendered", [a]), b && b());
    });
  }, this;
};IASHistoryExtension.prototype.initialize = function (a) {
  var b = this;this.ias = a, jQuery.extend(a.listeners, this.listeners), a.prev = function () {
    return b.prev();
  }, this.prevUrl = this.getPrevUrl();
}, IASHistoryExtension.prototype.bind = function (a) {
  a.on("pageChange", jQuery.proxy(this.onPageChange, this)), a.on("scroll", jQuery.proxy(this.onScroll, this)), a.on("ready", jQuery.proxy(this.onReady, this));
}, IASHistoryExtension.prototype.unbind = function (a) {
  a.off("pageChange", this.onPageChange), a.off("scroll", this.onScroll), a.off("ready", this.onReady);
}, IASHistoryExtension.prototype.prev = function () {
  var a = this.prevUrl,
      b = this,
      c = this.ias;if (!a) return !1;c.pause();var d = c.fire("prev", [a]);return d.done(function () {
    c.load(a, function (a, d) {
      b.renderBefore(d, function () {
        b.prevUrl = b.getPrevUrl(a), c.resume(), b.prevUrl && b.prev();
      });
    });
  }), d.fail(function () {
    c.resume();
  }), !0;
}, IASHistoryExtension.prototype.defaults = { prev: ".prev" };var IASNoneLeftExtension = function IASNoneLeftExtension(a) {
  return a = jQuery.extend({}, this.defaults, a), this.ias = null, this.uid = new Date().getTime(), this.html = a.html.replace("{text}", a.text), this.showNoneLeft = function () {
    var a = jQuery(this.html).attr("id", "ias_noneleft_" + this.uid),
        b = this.ias.getLastItem();b.after(a), a.fadeIn();
  }, this;
};IASNoneLeftExtension.prototype.bind = function (a) {
  this.ias = a, a.on("noneLeft", jQuery.proxy(this.showNoneLeft, this));
}, IASNoneLeftExtension.prototype.unbind = function (a) {
  a.off("noneLeft", this.showNoneLeft);
}, IASNoneLeftExtension.prototype.defaults = { text: "You reached the end.", html: '<div class="ias-noneleft" style="text-align: center;">{text}</div>' };var IASPagingExtension = function IASPagingExtension() {
  return this.ias = null, this.pagebreaks = [[0, document.location.toString()]], this.lastPageNum = 1, this.enabled = !0, this.listeners = { pageChange: new IASCallbacks(jQuery) }, this.onScroll = function (a, b) {
    if (this.enabled) {
      var c,
          d = this.ias,
          e = this.getCurrentPageNum(a),
          f = this.getCurrentPagebreak(a);this.lastPageNum !== e && (c = f[1], d.fire("pageChange", [e, a, c])), this.lastPageNum = e;
    }
  }, this.onNext = function (a) {
    var b = this.ias.getCurrentScrollOffset(this.ias.$scrollContainer);this.pagebreaks.push([b, a]);var c = this.getCurrentPageNum(b) + 1;this.ias.fire("pageChange", [c, b, a]), this.lastPageNum = c;
  }, this.onPrev = function (a) {
    var b = this,
        c = b.ias,
        d = c.getCurrentScrollOffset(c.$scrollContainer),
        e = d - c.$scrollContainer.height(),
        f = c.getFirstItem();this.enabled = !1, this.pagebreaks.unshift([0, a]), c.one("rendered", function () {
      for (var d = 1, g = b.pagebreaks.length; g > d; d++) {
        b.pagebreaks[d][0] = b.pagebreaks[d][0] + f.offset().top;
      }var h = b.getCurrentPageNum(e) + 1;c.fire("pageChange", [h, e, a]), b.lastPageNum = h, b.enabled = !0;
    });
  }, this;
};IASPagingExtension.prototype.initialize = function (a) {
  this.ias = a, jQuery.extend(a.listeners, this.listeners);
}, IASPagingExtension.prototype.bind = function (a) {
  try {
    a.on("prev", jQuery.proxy(this.onPrev, this), this.priority);
  } catch (b) {}a.on("next", jQuery.proxy(this.onNext, this), this.priority), a.on("scroll", jQuery.proxy(this.onScroll, this), this.priority);
}, IASPagingExtension.prototype.unbind = function (a) {
  try {
    a.off("prev", this.onPrev);
  } catch (b) {}a.off("next", this.onNext), a.off("scroll", this.onScroll);
}, IASPagingExtension.prototype.getCurrentPageNum = function (a) {
  for (var b = this.pagebreaks.length - 1; b > 0; b--) {
    if (a > this.pagebreaks[b][0]) return b + 1;
  }return 1;
}, IASPagingExtension.prototype.getCurrentPagebreak = function (a) {
  for (var b = this.pagebreaks.length - 1; b >= 0; b--) {
    if (a > this.pagebreaks[b][0]) return this.pagebreaks[b];
  }return null;
}, IASPagingExtension.prototype.priority = 500;var IASSpinnerExtension = function IASSpinnerExtension(a) {
  return a = jQuery.extend({}, this.defaults, a), this.ias = null, this.uid = new Date().getTime(), this.src = a.src, this.html = a.html.replace("{src}", this.src), this.showSpinner = function () {
    var a = this.getSpinner() || this.createSpinner(),
        b = this.ias.getLastItem();b.after(a), a.fadeIn();
  }, this.showSpinnerBefore = function () {
    var a = this.getSpinner() || this.createSpinner(),
        b = this.ias.getFirstItem();b.before(a), a.fadeIn();
  }, this.removeSpinner = function () {
    this.hasSpinner() && this.getSpinner().remove();
  }, this.getSpinner = function () {
    var a = jQuery("#ias_spinner_" + this.uid);return a.length > 0 ? a : !1;
  }, this.hasSpinner = function () {
    var a = jQuery("#ias_spinner_" + this.uid);return a.length > 0;
  }, this.createSpinner = function () {
    var a = jQuery(this.html).attr("id", "ias_spinner_" + this.uid);return a.hide(), a;
  }, this;
};IASSpinnerExtension.prototype.bind = function (a) {
  this.ias = a, a.on("next", jQuery.proxy(this.showSpinner, this)), a.on("render", jQuery.proxy(this.removeSpinner, this));try {
    a.on("prev", jQuery.proxy(this.showSpinnerBefore, this));
  } catch (b) {}
}, IASSpinnerExtension.prototype.unbind = function (a) {
  a.off("next", this.showSpinner), a.off("render", this.removeSpinner);try {
    a.off("prev", this.showSpinnerBefore);
  } catch (b) {}
}, IASSpinnerExtension.prototype.defaults = { src: "data:image/gif;base64,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", html: '<div class="ias-spinner" style="text-align: center;"><img src="{src}"/></div>' };var IASTriggerExtension = function IASTriggerExtension(a) {
  return a = jQuery.extend({}, this.defaults, a), this.ias = null, this.html = a.html.replace("{text}", a.text), this.htmlPrev = a.htmlPrev.replace("{text}", a.textPrev), this.enabled = !0, this.count = 0, this.offset = a.offset, this.$triggerNext = null, this.$triggerPrev = null, this.showTriggerNext = function () {
    if (!this.enabled) return !0;if (!1 === this.offset || ++this.count < this.offset) return !0;var a = this.$triggerNext || (this.$triggerNext = this.createTrigger(this.next, this.html)),
        b = this.ias.getLastItem();return b.after(a), a.fadeIn(), !1;
  }, this.showTriggerPrev = function () {
    if (!this.enabled) return !0;var a = this.$triggerPrev || (this.$triggerPrev = this.createTrigger(this.prev, this.htmlPrev)),
        b = this.ias.getFirstItem();return b.before(a), a.fadeIn(), !1;
  }, this.onRendered = function () {
    this.enabled = !0;
  }, this.createTrigger = function (a, b) {
    var c,
        d = new Date().getTime();return b = b || this.html, c = jQuery(b).attr("id", "ias_trigger_" + d), c.hide(), c.on("click", jQuery.proxy(a, this)), c;
  }, this;
};IASTriggerExtension.prototype.bind = function (a) {
  this.ias = a, a.on("next", jQuery.proxy(this.showTriggerNext, this), this.priority), a.on("rendered", jQuery.proxy(this.onRendered, this), this.priority);try {
    a.on("prev", jQuery.proxy(this.showTriggerPrev, this), this.priority);
  } catch (b) {}
}, IASTriggerExtension.prototype.unbind = function (a) {
  a.off("next", this.showTriggerNext), a.off("rendered", this.onRendered);try {
    a.off("prev", this.showTriggerPrev);
  } catch (b) {}
}, IASTriggerExtension.prototype.next = function () {
  this.enabled = !1, this.ias.pause(), this.$triggerNext && (this.$triggerNext.remove(), this.$triggerNext = null), this.ias.next();
}, IASTriggerExtension.prototype.prev = function () {
  this.enabled = !1, this.ias.pause(), this.$triggerPrev && (this.$triggerPrev.remove(), this.$triggerPrev = null), this.ias.prev();
}, IASTriggerExtension.prototype.defaults = { text: "Load more items", html: '<div class="ias-trigger ias-trigger-next" style="text-align: center; cursor: pointer;"><a>{text}</a></div>', textPrev: "Load previous items", htmlPrev: '<div class="ias-trigger ias-trigger-prev" style="text-align: center; cursor: pointer;"><a>{text}</a></div>', offset: 0 }, IASTriggerExtension.prototype.priority = 1e3;
'use strict';

/*jshint esversion: 6 */

M.AutoInit();

(function () {
  // document.addEventListener('DOMContentLoaded', function() {
  // add class confirming dom is loaded
  document.querySelector('html.js').classList.add('loaded');

  var theme = {
    get: function get() {
      var themeElement = document.querySelector('.theme-variant');
      var themeCurrent = themeElement.href.split('/').pop().split('.')[0];
      return themeCurrent;
    },
    set: function set(themeName) {
      // unset loaded state, in case the css takes a long time
      var page = document.querySelector('html.loaded');
      page.classList.toggle('loaded');

      // switch the link's href
      var themeElement = document.querySelector('.theme-variant');
      var themeCurrent = themeElement.href.split('/').pop();
      var themePath = themeElement.href.split('/').slice(0, -1).join('/') + '/';
      themeElement.href = themePath + themeName + ".css";
      console.info('Theme set to \'' + themeName + '\'');

      // restore loaded state
      page.classList.toggle('loaded');
    },
    toggleSolarized: function toggleSolarized() {
      var currently = theme.get();
      if (currently === 'materialized-dark') {
        theme.set('materialized-light');
      } else {
        theme.set('materialized-dark');
      }
    },
    init: function init() {
      // bind event for day/night mode
      var themeSwitcher = document.querySelector('.solarized-mode');
      themeSwitcher.addEventListener('click', function (e) {
        e.preventDefault();
        theme.toggleSolarized();
      });

      // bind any other theme pickers
      var themePickers = document.querySelector('.theme-select');
      themePickers.addEventListener('click', function (e) {
        e.preventDefault();
        var desiredTheme = e.target.dataset.theme;
        if (theme.get === theme) {
          return;
        } else {
          theme.set(desiredTheme);
        }
      });
    }
  };
  theme.init();

  // infinite scrolling on blog index
  var blogScrolling = jQuery.ias({
    container: '.post-listing',
    item: '.row',
    pagination: '.pagination',
    next: '.next'
  });

  blogScrolling.extension(new IASSpinnerExtension({
    html: '<div class="loading-ring blog"><div></div><div></div><div></div><div></div></div>'
  }));

  // fires on home page as well :/
  // blogScrolling.on('noneLeft', function() {
  //   M.toast({html: 'You\'ve reached the end, weary traveller'});
  // });

  // /infinite scrolling

  // lazy loading per
  // https://developers.google.com/web/fundamentals/performance/lazy-loading-guidance/
  var lazyImages = [].slice.call(document.querySelectorAll("img"));

  if ("IntersectionObserver" in window) {
    var lazyImageObserver = new IntersectionObserver(function (entries, observer) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var lazyImage = entry.target;
          // try to use data, or fallback to original src
          lazyImage.src = lazyImage.dataset.src || lazyImage.src;
          // same here, meaning srcset is not strictly required
          lazyImage.srcset = lazyImage.dataset.srcset || lazyImage.srcset;
          lazyImage.classList.remove("lazy");
          lazyImageObserver.unobserve(lazyImage);
        }
      });
    });

    lazyImages.forEach(function (lazyImage) {
      lazyImageObserver.observe(lazyImage);
    });
  } else {
    var lazyLoad = function lazyLoad() {
      if (active === false) {
        active = true;

        setTimeout(function () {
          lazyImages.forEach(function (lazyImage) {
            if (lazyImage.getBoundingClientRect().top <= window.innerHeight && lazyImage.getBoundingClientRect().bottom >= 0 && getComputedStyle(lazyImage).display !== "none") {
              lazyImage.src = lazyImage.dataset.src;
              lazyImage.srcset = lazyImage.dataset.srcset;
              lazyImage.classList.remove("lazy");

              lazyImages = lazyImages.filter(function (image) {
                return image !== lazyImage;
              });

              if (lazyImages.length === 0) {
                document.removeEventListener("scroll", lazyLoad);
                window.removeEventListener("resize", lazyLoad);
                window.removeEventListener("orientationchange", lazyLoad);
              }
            }
          });

          active = false;
        }, 200);
      }
    };
    document.addEventListener("scroll", lazyLoad);
    window.addEventListener("resize", lazyLoad);
    window.addEventListener("orientationchange", lazyLoad);
  }

  // });
})();

//# sourceMappingURL=app.es5.js.map