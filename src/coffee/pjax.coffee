class pjax
	constructor: (elements, selectors) ->
		@selectors = selectors;
		@elements = elements;
		@bindEvents('',selectors)		

	bindEvents: ()->
		_selectors = @selectors
		_elements = @elements
		$(window).on 'popstate', (e) ->
			fetchUrl(location.href, true)

		update = (data, href, nopush) ->
			console.log 'update ( data : '+data
			parser = new DOMParser
			doc = parser.parseFromString(data, 'text/html')
			docClass = doc.body.getAttribute('class')
			parser = doc = null
			i = 0
			_selectorsLenght = _selectors.length
			while i < _selectorsLenght
				$(_selectors[i]).html $(data).filter(_selectors[i]).html()
				i++
			$('body').removeClass().addClass(docClass).addClass('pjax-done')
	
			$('body').trigger 'pjax-done'
			$('.pjax-bar').removeClass('show-progress')
			$('html, body').animate({ scrollTop: '0px' })
	
			if($('meta[property="device_type"]').attr('content')=='mobile')
				$('html, body').removeClass('navigation-active')
	
			if(!nopush)
				history.pushState( $(data).find('body').attr('title'), $(data).find('body').attr('title'), href)

		fetchUrl = (href, nopush) ->
			$('.pjax-bar').addClass('show-progress')
			$.ajax
				xhr: ->
					xhr = new (window.XMLHttpRequest)
					xhr.addEventListener 'progress', ((evt) ->
						percentComplete = evt.loaded / evt.total
						if evt.lengthComputable
							percentComplete = evt.loaded / evt.total
							$('.progress').css width: percentComplete * 100 + '%'
						return
					), false
					xhr
				type: 'POST'
				url: href
				success: (data) ->
					update($.parseHTML(data), href, nopush)
					return
				error: ->
					$('#notification-bar').text 'An error occurred'
					return
			
		$(_elements).click (event) ->
			console.log location.hostname+' == '+this.hostname
			if( location.hostname == this.hostname || !this.hostname.length )
				event.preventDefault()
				fetchUrl($(this).attr('href'))

module.pjax = pjax


	