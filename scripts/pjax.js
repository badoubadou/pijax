(function() {
  window.module = window.module || {};

}).call(this);

(function() {
  var pjax;

  pjax = (function() {
    function pjax(elements, selectors) {
      this.selectors = selectors;
      this.elements = elements;
      this.bindEvents('', selectors);
    }

    pjax.prototype.bindEvents = function() {
      var _elements, _selectors, fetchUrl, update;
      _selectors = this.selectors;
      _elements = this.elements;
      $(window).on('popstate', function(e) {
        return fetchUrl(location.href, true);
      });
      update = function(data, href, nopush) {
        var _selectorsLenght, doc, docClass, i, parser;
        console.log('update ( data : ' + data);
        parser = new DOMParser;
        doc = parser.parseFromString(data, 'text/html');
        docClass = doc.body.getAttribute('class');
        parser = doc = null;
        i = 0;
        _selectorsLenght = _selectors.length;
        while (i < _selectorsLenght) {
          $(_selectors[i]).html($(data).filter(_selectors[i]).html());
          i++;
        }
        $('body').removeClass().addClass(docClass).addClass('pjax-done');
        $('body').trigger('pjax-done');
        $('.pjax-bar').removeClass('show-progress');
        $('html, body').animate({
          scrollTop: '0px'
        });
        if ($('meta[property="device_type"]').attr('content') === 'mobile') {
          $('html, body').removeClass('navigation-active');
        }
        if (!nopush) {
          return history.pushState($(data).find('body').attr('title'), $(data).find('body').attr('title'), href);
        }
      };
      fetchUrl = function(href, nopush) {
        $('.pjax-bar').addClass('show-progress');
        return $.ajax({
          xhr: function() {
            var xhr;
            xhr = new window.XMLHttpRequest;
            xhr.addEventListener('progress', (function(evt) {
              var percentComplete;
              percentComplete = evt.loaded / evt.total;
              if (evt.lengthComputable) {
                percentComplete = evt.loaded / evt.total;
                $('.progress').css({
                  width: percentComplete * 100 + '%'
                });
              }
            }), false);
            return xhr;
          },
          type: 'POST',
          url: href,
          success: function(data) {
            update($.parseHTML(data), href, nopush);
          },
          error: function() {
            $('#notification-bar').text('An error occurred');
          }
        });
      };
      return $(_elements).click(function(event) {
        console.log(location.hostname + ' == ' + this.hostname);
        if (location.hostname === this.hostname || !this.hostname.length) {
          event.preventDefault();
          return fetchUrl($(this).attr('href'));
        }
      });
    };

    return pjax;

  })();

  module.pjax = pjax;

}).call(this);
