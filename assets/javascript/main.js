/*jshint esversion: 6 */

M.AutoInit();

(function () {
  document.addEventListener('DOMContentLoaded', function() {
    // add class confirming dom is loaded
    document.querySelector('html.js').classList.add('loaded');

    // lazy loading per
    // https://developers.google.com/web/fundamentals/performance/lazy-loading-guidance/
    var lazyImages = [].slice.call(document.querySelectorAll("img"));
    for(let i = 0; i < lazyImages.length; i++) {
      console.log(lazyImages[i]);
    }

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


  });
})();
