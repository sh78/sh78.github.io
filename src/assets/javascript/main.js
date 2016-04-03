// http://materializecss.com/navbar.html
$(".button-collapse").sideNav();

// link entire card to post in posts index
$('.post-list li').on('click', function() {
  var the_link = $('.post-link', this).attr('href');
  window.location = the_link;
}).css('cursor', 'pointer')