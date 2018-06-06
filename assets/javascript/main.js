M.AutoInit();

document.addEventListener('DOMContentLoaded', function() {
  var elems = document.querySelectorAll('.sidenav');
  var instances = M.Sidenav.init();
});

// activate M dropdowns
$(".dropdown-trigger").dropdown();
