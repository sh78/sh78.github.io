/*jshint esversion: 6 */

(function () {

  // set theme per local storage
  const theme = {
    dayTheme: 'Materialized Light',
    nightTheme: 'Materialized Dark',
    get: function() {
      // order of attribute values matters, for now
      const themeElement = document.querySelector('.theme-variant[rel^=stylesheet]');
      const themeCurrent = themeElement.title;
      return themeCurrent;
    },
    set: function(themeName) {
      console.log(themeName);
      const allThemes = document.querySelectorAll('.theme-variant');
      const themeCurrent = document.querySelector(`.theme-variant[title="${ theme.get() }"]`);
      const themeNext = document.querySelector(`.theme-variant[title="${ themeName }"]`);
      console.log(themeNext);

      if (themeCurrent != themeNext) {
        // unset loaded state, in case the css takes a long time
        const page = document.querySelector('html');
        page.style.opacity = 0;
        // TODO: fix FOUC due to the order in whichh `disabled` in set/unset
        // the opacity effect works on debugger pause, but not on a normal load

        // hot swap the links' `rel` and `disabled` vals
        // `disabled` being toggled is what triggers repaint in the browser
        allThemes.forEach(function(e) {
          e.setAttribute('rel', 'alternate stylesheet');
          e.removeAttribute('disabled');
          e.setAttribute('disabled', 'true');
        });
        themeNext.setAttribute('rel', 'stylesheet');
        themeNext.removeAttribute('disabled');
        themeCurrent.removeAttribute('disabled');
        themeCurrent.setAttribute('disabled', 'true');
        // TODO: this should not be needed, but materialize-dark.css creeps in
        // while other theme is active
        // why doesn't the browser update styles if setTimeout is removed?
        // Array.forEach() is not async
        // setTimeout(function() {
        //   themeCurrent.removeAttribute('disabled');
        //   themeCurrent.setAttribute('disabled', 'true');
        // }, 250);
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
      sessionStorage.removeItem('theme');
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
      const local = localStorage.getItem('theme');
      if (!local || local === 'Auto') {
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
      }
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
      const themePickers = document.querySelectorAll('.theme-select');
      themePickers.forEach(function(picker) {
        picker.addEventListener('click', function(e) {
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
        let active = false;

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

    // live typing with typed.js
    // well this got bigger than anticpiated. should be made into a class-like object
    // and scope functionality only to pages that have to elements to work on
    const typedElement = document.getElementById('home-title');
    let typedTitle, typedIntro;
    const sawTyped = sessionStorage.getItem('sawTypedHome');

    const typedFinish = () => {
      document.getElementById('home-title').innerText = "Hello There, Friend!";
      document.getElementById('home-intro').innerText = "I’m Sean. I like to arrange bits of text on screens. I'm a full-stack web developer\, currently working at Electro Creative Workshop in Oakland\, California.";
    };

    if (typedElement && !sawTyped) {
      $('.typed-await').hide();
      typedTitle = new Typed("#home-title", {
        strings: [
          "Hello Human^2000",
          "Hello There^500\, ^1000 Friend^1500\!",
        ],
        startDelay: 1000,
        typeSpeed: 30,
        backSpeed: 40,
        backDelay: 200,
        onComplete: (self) => {
          setTimeout(() => {
            self.cursor.style.display = 'none';
          }, 1000);
        },
        onDestroy: (self) => {
          $(`[data-id="${self.el.id}"]`).text("Hello There, Friend!");
        }
      });
      typedIntro = new Typed("#home-intro", {
        strings: [
          "I’m Sean.^1000 I like to arrange bits of text in my mind^250",
          "I’m Sean. I like to arrange bits of text on screens.^1000 I'm a front^200-^200end^250",
          "I’m Sean. I like to arrange bits of text on screens. I'm a medium^200-^200end^250",
          "I’m Sean. I like to arrange bits of text on screens. I'm an imposter^200",
          "I’m Sean. I like to arrange bits of text on screens. I'm a full^200-^200end^250",
          "I’m Sean. I like to arrange bits of text on screens. I'm a full-stack^500 web developer^250\,^500",
          // "I’m Sean. I like to arrange bits of text on screens. I'm a medium-end developer\, of sorts. I'm not hyper^250-^250specialized in any one area of software development^250\,^500 because I have severe AD",
          "I’m Sean. I like to arrange bits of text on screens. I'm a full-stack web developer\, currently working at LiveNation^200",
          "I’m Sean. I like to arrange bits of text on screens. I'm a full-stack web developer\, currently working at Ticketma",
          "I’m Sean. I like to arrange bits of text on screens. I'm a full-stack web developer\, currently working at a startup in Nepal^500",
          "I’m Sean. I like to arrange bits of text on screens. I'm a full-stack web developer\, currently working for myself^250",
          "I’m Sean. I like to arrange bits of text on screens. I'm a full-stack web developer\, currently working at Clorox Digital L",
          "I’m Sean. I like to arrange bits of text on screens. I'm a full-stack web developer\, currently working at Electro Creative Workshop^500 in Oakland^250\,^250 California^250.",
        ],
        startDelay: 9000,
        typeSpeed: 30,
        backSpeed: 40,
        backDelay: 200,
        onComplete: (self) => {
          setTimeout(() => {
            self.cursor.style.display = 'none';
            $('.typed-skip').hide();
            $('.typed-await').fadeIn();
            sessionStorage.setItem('sawTypedHome', true);
          }, 1000);
        },
        onDestroy: (self) => {
          $(`[data-id="${self.el.id}"]`).text("I’m Sean. I like to arrange bits of text on screens. I'm a full-stack web developer\, currently working at Electro Creative Workshop in Oakland\, California.");
        }
      });
    } else if(typedElement) {
      $('.typed-skip').hide();
      typedFinish();
    }

    const skippers = document.getElementsByClassName('typed-skip');
    if (skippers) {
      Array.from(skippers).forEach(function(element) {
        element.addEventListener('click', function(e) {
          e.preventDefault();
          typedTitle.destroy();
          typedIntro.destroy();
          $('.typed-skip').hide();
          $('.typed-await').fadeIn();
          sessionStorage.setItem('sawTypedHome', true);
        });
      });
    }

    // / live typing

		// random post
    const randomPost = allPosts[Math.floor(Math.random() * Math.floor(allPosts.length))];
    const luckies = document.querySelectorAll('.lucky');
    luckies.forEach(function(e) {
      e.addEventListener('click', function(event) {
        event.preventDefault();
        window.location.href = randomPost;
      });
		});
		// / random post

  });
})();
