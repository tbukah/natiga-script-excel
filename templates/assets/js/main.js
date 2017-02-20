(function($) {
	skel.breakpoints({
		xlarge: '(max-width: 1680px)',
		large: '(max-width: 1280px)',
		medium: '(max-width: 980px)',
		small: '(max-width: 736px)',
		xsmall: '(max-width: 480px)'
	});
	$(function() {
		var	$window = $(window),
			$body = $('body');
        // Disable animations/transitions until the page has loaded.
			$body.addClass('is-loading');
			$window.on('load', function() {
				window.setTimeout(function() {
					$body.removeClass('is-loading');
				}, 0);
			});
        //Ajaxify forms
        $('body').on('submit','form',function(e){
           e.preventDefault();
           var form = this;
           var container_selector = ($(form).data('overlay-container')!==undefined)?$(form).data('overlay-container'):form;
           request_method = ($(form).attr('method') != '')?$(form).attr('method'):'GET';
           $.ajax({
                url:$(form).attr('action'),
                type:request_method,
                data: $(form).serialize(),
                beforeSend: function(xhr){
                    //hide any previous alerts
                    $(form).find('.alert').fadeOut('fast');
                    $(form).find('.overlay.form-loading').fadeOut('slow').remove();
                    //Show loading div
                    with(t = $('link[rel=stylesheet][href*="css/main"]').attr('href'))assets_base=t.substr(0,t.indexOf('css/main')); 
                    $(container_selector).prepend('<div class="overlay form-loading"><img src="'+assets_base+'/images/loading.gif"</div>');
                },
                success: window[$(form).data('success-callback')],
                error: function(e){
                    console.log(e);
                    $(form).prepend(get_alert('حدث خطأ أثناء محاولتنا لتنفيذ طلبك.. من فضلك حاول مرة أخرى'));
                },
                complete: function(){
                    $(container_selector).find('.overlay.form-loading').fadeOut('slow');
                    $(container_selector).find('.overlay.form-loading').remove();
                }
           });  
        });
		// Touch mode.
			if (skel.vars.mobile)
				$body.addClass('is-touch');
		// Fix: Placeholder polyfill.
			$('form').placeholder();
		// Prioritize "important" elements on medium.
			skel.on('+medium -medium', function() {
				$.prioritize(
					'.important\\28 medium\\29',
					skel.breakpoint('medium').active
				);
			});
		// Scrolly links.
			$('.scrolly').scrolly({
				speed: 1000
			});
		// Dropdowns.
		/*$('#nav > ul').dropotron({
				alignment: 'right',
				hideDelay: 350
			});*/
		// Off-Canvas Navigation.
			// Title Bar.
				$(
					'<div id="titleBar">' +
						'<a href="#navPanel" class="toggle"></a>' +
						'<span class="title">' + $('#logo').html() + '</span>' +
					'</div>'
				)
					.appendTo($body);
			// Navigation Panel.
				$(
					'<div id="navPanel">' +
						'<nav>' +
							$('#nav').navList() +
						'</nav>' +
					'</div>'
				)
					.appendTo($body)
					.panel({
						delay: 500,
						hideOnClick: true,
						hideOnSwipe: true,
						resetScroll: true,
						resetForms: true,
						side: 'left',
						target: $body,
						visibleClass: 'navPanel-visible'
					});
			// Fix: Remove navPanel transitions on WP<10 (poor/buggy performance).
				if (skel.vars.os == 'wp' && skel.vars.osVersion < 10)
					$('#titleBar, #navPanel, #page-wrapper')
						.css('transition', 'none');
		// Parallax.
		// Disabled on IE (choppy scrolling) and mobile platforms (poor performance).
			if (skel.vars.browser == 'ie'
			||	skel.vars.mobile) {
				$.fn._parallax = function() {
					return $(this);
				};
			}
			else {
				$.fn._parallax = function() {
					$(this).each(function() {
						var $this = $(this),
							on, off;
						on = function() {
							$this
								.css('background-position', 'center 0px');
							$window
								.on('scroll._parallax', function() {
									var pos = parseInt($window.scrollTop()) - parseInt($this.position().top);
									$this.css('background-position', 'center ' + (pos * -0.15) + 'px');
								});
						};
						off = function() {
							$this
								.css('background-position', '');
							$window
								.off('scroll._parallax');
						};
						skel.on('change', function() {
							if (skel.breakpoint('medium').active)
								(off)();
							else
								(on)();
						});
					});
					return $(this);
				};
				$window
					.on('load resize', function() {
						$window.trigger('scroll');
					});
			}
		// Spotlights.
			var $spotlights = $('.spotlight');
			$spotlights
				._parallax()
				.each(function() {
					var $this = $(this),
						on, off;
					on = function() {
						// Use main <img>'s src as this spotlight's background.
							$this.css('background-image', 'url("' + $this.find('.image.main > img').attr('src') + '")');
						// Enable transitions (if supported).
							if (skel.canUse('transition')) {
								var top, bottom, mode;
								// Side-specific scrollex tweaks.
									if ($this.hasClass('top')) {
										mode = 'top';
										top = '-20%';
										bottom = 0;
									}
									else if ($this.hasClass('bottom')) {
										mode = 'bottom-only';
										top = 0;
										bottom = '20%';
									}
									else {
										mode = 'middle';
										top = 0;
										bottom = 0;
									}
								// Add scrollex.
									$this.scrollex({
										mode:		mode,
										top:		top,
										bottom:		bottom,
										initialize:	function(t) { $this.addClass('inactive'); },
										terminate:	function(t) { $this.removeClass('inactive'); },
										enter:		function(t) { $this.removeClass('inactive'); },
										// Uncomment the line below to "rewind" when this spotlight scrolls out of view.
										//leave:	function(t) { $this.addClass('inactive'); },
									});
							}
					};
					off = function() {
						// Clear spotlight's background.
							$this.css('background-image', '');
						// Disable transitions (if supported).
							if (skel.canUse('transition')) {
								// Remove scrollex.
									$this.unscrollex();
							}
					};
					skel.on('change', function() {
						if (skel.breakpoint('medium').active)
							(off)();
						else
							(on)();
					});
				});
		// Wrappers.
			var $wrappers = $('.wrapper');
			$wrappers
				.each(function() {
					var $this = $(this),
						on, off;
					on = function() {
						if (skel.canUse('transition')) {
							$this.scrollex({
								top:		250,
								bottom:		0,
								initialize:	function(t) { $this.addClass('inactive'); },
								terminate:	function(t) { $this.removeClass('inactive'); },
								enter:		function(t) { $this.removeClass('inactive'); },
								// Uncomment the line below to "rewind" when this wrapper scrolls out of view.
								//leave:	function(t) { $this.addClass('inactive'); },
							});
						}
					};
					off = function() {
						if (skel.canUse('transition'))
							$this.unscrollex();
					};
					skel.on('change', function() {
						if (skel.breakpoint('medium').active)
							(off)();
						else
							(on)();
					});
				});
		// Banner.
			var $banner = $('#banner');
			$banner
				._parallax();
	});
})(jQuery);

/***************************
 * Natiga Script Functions *
 ***************************/

//function called when user looks up a student
function natiga_callback(response,status,xhr){
    $('#alert_zone').html('').fadeOut();
    var form_url = $('#result_form').attr('action') + '?' + $('#result_form').serialize();
    window.history.pushState({},'search result',form_url);
    try{
        result = (typeof(response)=='string')?JSON.parse(response):response;
    }catch(e){
        result = false;
    }
    if(result && result.status=='success'){
        status = 'success';
        var msg = 'تم العثور على بيانات الطالب. انقر على السهم لعرض النتيجة';
        $('#natiga a.goto-next').fadeIn('fast');
        $('#student_result').fadeIn('slow').html(result.data);
    }else{
        status = 'error';
        var msg = (result && result.message)?result.message:'حدث خطأ أثناء محاولة تنفيذ طلبك.. من فضلك حاولة مرّة أخرى';
    }
    $('#alert_zone').html(get_alert(msg,status)).fadeIn('slow');
}