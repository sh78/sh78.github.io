/*jshint esversion: 6 */

M.AutoInit();

(function () {
  // document.addEventListener('DOMContentLoaded', function() {
    // add class confirming dom is loaded
    document.querySelector('html.js').classList.add('loaded');

    const theme = {
      get: function() {
        const themeElement = document.querySelector('.theme-variant');
        const themeCurrent = themeElement.href.split('/').pop().split('.')[0];
        return themeCurrent;
      },
      set: function(themeName) {
        // unset loaded state, in case the css takes a long time
        const page = document.querySelector('html.loaded');
        page.classList.toggle('loaded');

        // switch the link's href
        const themeElement = document.querySelector('.theme-variant');
        const themeCurrent = themeElement.href.split('/').pop();
        const themePath = themeElement.href.split('/').slice(0, -1).join('/') + '/';
        themeElement.href = themePath + themeName + ".css";
        console.info('Theme set to \'' + themeName + '\'');

        // restore loaded state
        page.classList.toggle('loaded');
      },
      toggleSolarized: function() {
        const currently = theme.get();
        if (currently === 'materialized-dark') {
          theme.set('materialized-light');
        } else {
          theme.set('materialized-dark');
        }
      },
      init: function() {
        // bind event for day/night mode
        const themeSwitcher = document.querySelector('.solarized-mode');
        themeSwitcher.addEventListener('click', function(e) {
          e.preventDefault();
          theme.toggleSolarized();
        });

        // bind any other theme pickers
        const themePickers = document.querySelector('.theme-select');
        themePickers.addEventListener('click', function(e) {
          e.preventDefault();
          const desiredTheme = e.target.dataset.theme;
          if(theme.get === theme) {
            return;
          } else {
            theme.set(desiredTheme);
          }
        });
      }
    };
    theme.init();



    // infinite scrolling on blog index
    const blogScrolling = jQuery.ias({
      container:  '.post-listing',
      item:       '.row',
      pagination: '.pagination',
      next:       '.next'
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
      let lazyImageObserver = new IntersectionObserver(function(entries, observer) {
        entries.forEach(function(entry) {
          if (entry.isIntersecting) {
            let lazyImage = entry.target;
            // try to use data, or fallback to original src
            lazyImage.src = lazyImage.dataset.src || lazyImage.src;
            // same here, meaning srcset is not strictly required
            lazyImage.srcset = lazyImage.dataset.srcset || lazyImage.srcset;
            lazyImage.classList.remove("lazy");
            lazyImageObserver.unobserve(lazyImage);
          }
        });
      });

      lazyImages.forEach(function(lazyImage) {
        lazyImageObserver.observe(lazyImage);
      });
    } else {
      const lazyLoad = function() {
        if (active === false) {
          active = true;

          setTimeout(function() {
            lazyImages.forEach(function(lazyImage) {
              if ((lazyImage.getBoundingClientRect().top <= window.innerHeight && lazyImage.getBoundingClientRect().bottom >= 0) && getComputedStyle(lazyImage).display !== "none") {
                lazyImage.src = lazyImage.dataset.src;
                lazyImage.srcset = lazyImage.dataset.srcset;
                lazyImage.classList.remove("lazy");

                lazyImages = lazyImages.filter(function(image) {
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
