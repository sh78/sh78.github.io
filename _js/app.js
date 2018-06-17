/*jshint esversion: 6 */

(function () {

  // set theme per local storage
  const theme = {
    availableThemes: {},
    dayTheme: 'materialized-light',
    nightTheme: 'materialized-dark',
    get: function() {
      const themeElement = document.querySelector('.theme-variant');
      const themeCurrent = themeElement.href.split('/').pop().split('.')[0];
      return themeCurrent;
    },
    set: function(themeName) {
      // unset loaded state, in case the css takes a long time
      const page = document.querySelector('html.loaded');
      if(page) {
        page.classList.toggle('loaded');
      }

      // switch the link's href
      const themeElement = document.querySelector('.theme-variant');
      const themeCurrent = themeElement.href.split('/').pop();
      const themePath = themeElement.href.split('/').slice(0, -1).join('/') + '/';
      themeElement.href = themePath + themeName + ".css";
      console.info('Theme set to \'' + themeName + '\'');

      // restore loaded state
      if(page) {
        page.classList.toggle('loaded');
      }
    },
    saveTheme: function(themeName) {
      // you set it, we don't fagetit
      console.info(`Saved ${themeName} as your preferred theme.`);
      localStorage.setItem('theme', themeName);
      // clear any session theme
      sessionStorage.clear();
    },
    saveTimed: function(themeName) {
      // you set it, we don't fagetit
      console.info(`Set '${themeName}' as you theme, for now.`);
      sessionStorage.setItem('theme', themeName);
    },
    toggleTimedTheme: function() {
      const currently = theme.get();

      // decide theme to set and update UI state
      if (currently === theme.nightTheme) {
        theme.set(theme.dayTheme);
        theme.updateUI();
        theme.saveTimed(theme.dayTheme);
      } else {
        theme.set(theme.nightTheme);
        theme.updateUI();
        theme.saveTimed(theme.nightTheme);
      }
    },
    load: function() {
      const savedTheme = localStorage.getItem('theme');
      const sessionTheme = sessionStorage.getItem('theme');
      if(sessionTheme) {
        theme.set(sessionTheme);
      } else if(savedTheme && savedTheme != 'auto') {
        theme.set(savedTheme);
      } else {
        theme.autoLoad();
      }
    },
    updateUI: function() {
      const currently = theme.get();
      const uiText = document.querySelector('.theme-timed span');
      const uiIcon = document.querySelector('.theme-timed i');

      if (currently === theme.nightTheme) {
        uiText.innerText = "Day";
        uiIcon.classList.add("fa-sun");
        uiIcon.classList.remove("fa-moon");
      } else {
        uiText.innerText = "Night";
        uiIcon.classList.add("fa-moon");
        uiIcon.classList.remove("fa-sun");
      }
    },
    autoLoad: function() {
      const session = sessionStorage.getItem('theme');
      const hour = new Date().getHours();
      let result;
      if (session) {
        result = session;
        console.log(sessionStorage);
      } else {
        if(hour > 5 && hour < 19) {
          result = theme.dayTheme;
        } else {
          result = theme.nightTheme;
        }
      }
      theme.set(result);
    },
    init: function() {
      theme.updateUI();
      // set up day/night mode manual toggle
      const dayTripper = document.querySelector('.theme-timed');
      dayTripper.addEventListener('click', function(e) {
        e.preventDefault();
        theme.toggleTimedTheme();
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
          theme.saveTheme(desiredTheme);
          theme.updateUI();
        }
      });

      // handle auto mode
      const themeAuto = document.querySelector('.theme-auto');
      themeAuto.addEventListener('click', function(e) {
        e.preventDefault();
        const desiredTheme = e.target.dataset.theme;
        theme.saveTheme(desiredTheme);
        theme.autoLoad(desiredTheme);
        theme.updateUI();
      });
    }
  };
  // /theme settings

  // set theme per session storage
  theme.load();

  // init materialize css
  M.AutoInit();

  // ready, set
  document.addEventListener('DOMContentLoaded', function() {
    // add class confirming dom is loaded
    document.querySelector('html.js').classList.add('loaded');

    // initialize theme movers and shakers
    theme.init();

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


    // blog posts ToC / scrollspy
    const tocHeadlines = document.querySelectorAll('.post-main h2, .post-main h3');

    // materialize scrollspy ToC
    // doing this w/out jquery would be a pain...
    $(tocHeadlines).each(function(i, e) {
      const id = $(e).attr('id');
      // transplant the id from headline to section element
      $(e).removeAttr('id');
      $(e).nextUntil('h2, h3').wrapAll(`<section id="${id}" class="section scrollspy">`);
      // move headline into its section
      $(e).prependTo(`section#${id}`);
    });
    const scrollSpyElems = document.querySelectorAll('.scrollspy');
    const instances = M.ScrollSpy.init(scrollSpyElems, {
      scrollOffset: 40,
      throttle: 100
    });
    // scrollspy
    let tocItems = '';
    const tocSections = document.querySelectorAll('.scrollspy');
    for(let i = 0; i < tocHeadlines.length; i++) {
      const thisLevel = parseInt(tocHeadlines[i].tagName.slice(1)); // => int matching current heading level
      const nextLevel = i+1 < tocHeadlines.length ? parseInt(tocHeadlines[i+1].tagName.slice(1)) : undefined;
      const href = tocSections[i].id;
      const text = tocHeadlines[i].innerText;
      if(thisLevel < nextLevel) {
        tocItems += `<li><a class="internal" href="#${href}">${text}</a><ol>`;
      } else {
        tocItems += `<li><a class="internal" href="#${href}">${text}</a></li>`;
      }
      if(thisLevel > nextLevel) {
        tocItems += `</ol></li>`;
      }
    }
    // insert toc markup
    let tocTemplate = `
    <nav role='navigation' class='post-toc hide-on-medium-down'>
      <ol>
        <li>
        <h3 class="post-toc-title">Jump to:</h3>
          <ol>
            ${ tocItems }
          </ol>
        </li>
      </ol>
    </nav>
    `;
    if(tocItems.length > 0) {
      const tocContainer = document.querySelector('.toc-container');
      tocContainer.innerHTML = tocContainer.innerHTML + tocTemplate;
    }
    // / automatic ToC
  });
})();
