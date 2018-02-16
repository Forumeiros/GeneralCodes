/*globals jQuery*/

/**
 * Atualizar o widget de últimos assuntos via AJAX.
 *
 * @author   Luiz Felipe {@link https://lffg.github.io/}
 * @version  2.0.0
 * @license  MIT
 */
 
(function($) {
  'use strict';

  $(function() {
    var $update = $('<a>', {
      'href': '#',
      'html': [
        $('<img />', { 'src': 'https://i.imgur.com/aTCsNba.png' }).prop('outerHTML')
      ].join('')
    })
      .on('click', function(event) {
        event.preventDefault();
        
        var $this = $(this);
        
        $this.css('visibility', 'hidden');
        
        $.get(location.pathname, function(res) {
          $this.css('visibility', 'visible');

          $('#comments_scroll_div').html($('#comments_scroll_div', res).html());
        });
      })
    ;

    $('#comments_scroll_div')
      .parents('.module')
      .find('.h3')
      .append($update)
    ;
  });
})(jQuery);
