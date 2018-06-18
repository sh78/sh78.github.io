/*jshint esversion: 6 */

(function () {

  // set theme per local storage
  const theme = {
    availableThemes: {},
    dayTheme: 'Materialized Light',
    nightTheme: 'Materialized Dark',
    get: function() {
      // order of attribute values matters, for now
      const themeElement = document.querySelector('.theme-variant[rel^=stylesheet]');
      const themeCurrent = themeElement.title;
      return themeCurrent;
    },
    set: function(themeName) {
      const allThemes = document.querySelectorAll('.theme-variant');
      const themeCurrent = document.querySelector(`.theme-variant[title="${ theme.get() }"`);
      const themeNext = document.querySelector(`.theme-variant[title="${ themeName }"]`);

      if (themeCurrent != themeNext) {  
        // unset loaded state, in case the css takes a long time
        const page = document.querySelector('html');
        page.style.opacity = 0;

        // switch the links' `rel` vals
        allThemes.forEach(function(e) {
          e.setAttribute('rel', 'alternate stylesheet');
        });
        themeNext.setAttribute('rel', 'stylesheet');
        // build dom to reload the css
        allThemes.forEach(function(e) {
          console.log(e.title, e.rel);
          // TODO: reload only non-alt stylesheet
        });
        

        console.info('Theme set to \'' + themeName + '\'');

        // restore loaded state
        page.style.opacity = 1;
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
      } else if(savedTheme && savedTheme != 'Auto') {
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

  // init materialize css
  M.AutoInit();

  // auto hover anchors (permalinks)
  if (document.querySelectorAll('.anchorize').length > 0) {
    const headlineAnchors = new AnchorJS({
      placement: 'left',
      visible: 'touch',
      truncate: 32,
      ariaLabel: 'permalink to this section'
    });
    headlineAnchors.add('h1, h2, h3, h4, h5');
    const paragraphAnchors = new AnchorJS({
      placement: 'left',
      visible: 'touch',
      truncate: 32,
      icon: '¶',
      ariaLabel: 'permalink to this section'
    });
    paragraphAnchors.add('.page-content p');
    // build an array of all anchored elements
    const anchorElements = document.querySelectorAll('.anchorjs-link');
    anchorElements.forEach(function(element) {
      // prevent screen readers from reading an anchor at every paragraph/headline
      element.setAttribute('aria-hidden', 'true');
    });
  }
  // / auto hover anchors

  // ready
  document.addEventListener('DOMContentLoaded', function() {
    theme.load();
    // add class confirming dom is loaded
    document.querySelector('html').style.opacity = 1;
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
