/*globals jQuery*/

/**
 * Criar tags BBCode.
 * 
 * @author   Luiz Felipe F. <> {@link https://lffg.github.io}
 * @version  {alpha-1.0.0}
 * @see      {@link http://ajuda.forumeiros.com}
 * @license  MIT
 */

(function($) {
  'use strict';

  var tags = [
    {
      tag: '[success]',
      replace: '<div class="fa-parsed-tag fa-tag-success"><h5>{{title}}</h5>{{content}}</div>'
    }, {
      tag: '[warning]',
      replace: '<div class="fa-parsed-tag fa-tag-warning"><h5>{{title}}</h5>{{content}}</div>'
    }, {
      tag: '[danger]',
      replace: '<div class="fa-parsed-tag fa-tag-danger"><h5>{{title}}</h5>{{content}}</div>'
    }, {
      tag: '[info]',
      replace: '<div class="fa-parsed-tag fa-tag-info"><h5>{{title}}</h5>{{content}}</div>'
    }, {
      tag: '[visitor]',
      replace: function() {
        if (! _userdata.session_logged_in) return 'Você deve conectar-se para visualizar.';
        return '{{content}}';
      }
    }
  ];

  window.FA = window.FA || {};
  window.FA.Post = window.FA.Post || {};
  
  var Tags;
  /**
   * Construtor da classe.
   * Seta a configuração do script e executa métodos auxiliares.
   * 
   * @constructor
   */
  window.FA.Post.Tags = Tags = function(userConfig) {
    var self = this;

    self.config = $.extend({}, {
      tag: null,
      close: true,
      replace: null
    }, userConfig || {});
  };

  /**
   * Inicializa o script.
   * 
   * @method  init
   * @return  {void}
   */
  Tags.prototype.init = function() {
    var self = this;

    self.checkKeys();
    self.replaceTags(self.getPost());
  };

  /**
   * Verifica se todas as chaves estão presentes e setadas corretamente.
   * Caso não, um erro será lançado.
   * 
   * @method  checkKeys
   * @return  {void}
   */
  Tags.prototype.checkKeys = function() {
    var self = this;

    $.each([
      'tag',
      'replace'
    ], function(index, key) {
      if (self.config[key] !== null) return;

      throw new Error('[Fatal Error] [BBCode Tags Script] The ' + key + ' property can\'t be blank.');
    });
  };

  /**
   * Troca as tags BBCode (texto) por HTML.
   * 
   * @method  replaceTags
   * @return  {null}
   */
  Tags.prototype.replaceTags = function($post) {
    var self = this;

    if (! $post) return;

    var tag = self.config.tag.replace(/(\[|\])/g, '');
    var regex = new RegExp([
      '\\[', '(?:=(?:"|\')(.*?)(?:"|\')|)\\]([\\s\\S]*?)\\[\\/', '\\]'
    ].join(tag), 'gim');

    $post.each(function() {
      var $this = $(this);

      if (! $this.length) return;
      if (! $this.html()) return;

      $this.html($this.html().replace(regex, function(text, title, content) {
        return self.config.replace
          .replace(/{{title}}/gi, title || '')
          .replace(/{{content}}/gi, content || '')
        ;
      }));
    });
  };

  /**
   * Através da versão do fórum, pega o seletor do post.
   * 
   * @method  getPost
   * @return  {object}
   */
  Tags.prototype.getPost = function() {
    var self = this;

    $.each({
      'phpbb2'        : 'table.bodylinewidth',
      'phpbb3'        : 'body#phpbb',
      'punbb'         : 'div.pun',
      'invision'      : 'div#ipbwrapper',
      'mobile'        : 'div#mpage-body',
      'mobile-modern' : 'body#mpage-body-modern',
    }, function(key, selector) {
      if (! $(selector).length) return;

      self.version = key;
      return false;
    });

    switch (self.version) {
      case 'phpbb2'        : return $('.postbody > div');
      case 'phpbb3'        : return $('.postbody > .content > div');
      case 'punbb'         : return $('.entry-content > div > div');
      case 'invision'      : return $('.post-entry > div');
      case 'mobile'        : return $('.postbody > .content > div');
      case 'mobile-modern' : return $('.post-content');
      default              : return $('.post .content > div');
    }
  };

  /**
   * Inicia a instância das classes.
   */
  $(function() {
    $.each(tags, function(index, tag) {
      (new window.FA.Post.Tags(tag)).init();
    });
  });
})(jQuery);
