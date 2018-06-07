M.AutoInit();

(function () {
  document.addEventListener('DOMContentLoaded', function() {
    // add class confirming dom is loaded
    document.querySelector('html.js').classList.add('loaded');
  });
})();
