$(function() {

  // http://materializecss.com/navbar.html
  $(".button-collapse").sideNav();

  // link entire card to post in posts index
  $('.post-list li').on('click', function() {
    var the_link = $('.post-link', this).attr('href');
    window.location = the_link;
  }).css('cursor', 'pointer')


  // override materialize.js at line 3563
  $(document).on('click.card', '.card', function (e) {
        if ($(this).find('> .card-reveal').length) {
          // check for .card-action instead of .card-reveal
          //// becuase the reveal toggle button is in the action div now
          if ($(e.target).is($('.card-action .card-title')) || $(e.target).is($('.card-action .card-title i'))) {
            // Make Reveal animate down and display none
            $(this).find('.card-reveal').velocity(
              {translateY: 0}, {
                duration: 225,
                queue: false,
                easing: 'easeInOutQuad',
                complete: function() { $(this).css({ display: 'none'}); }
              }
            );
          }
          else if ($(e.target).is($('.card .activator')) ||
                   $(e.target).is($('.card .activator i')) ) {
            $(e.target).closest('.card').css('overflow', 'hidden');
            $(this).find('.card-reveal').css({ display: 'block'}).velocity("stop", false).velocity({translateY: '-100%'}, {duration: 300, queue: false, easing: 'easeInOutQuad'});
          }
        }

        $('.card-reveal').closest('.card').css('overflow', 'hidden');

      });

  // also classes when reveal trigger is clicked
  //// materialize looks for .activator to open the reveal
  //// and .card-title to close the reveal
  $('.work-item .reveal-toggle').on('click', function() {
    $(this).toggleClass('activator');
    $(this).toggleClass('card-title');
  });

});