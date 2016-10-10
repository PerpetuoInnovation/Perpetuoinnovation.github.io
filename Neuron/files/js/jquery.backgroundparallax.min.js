/* =================================
* jQuery parallax v2.0 / Copyright © 2015 Spab Rice
* All rights reserved.
================================= */
var isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);
function moveParallax() {
	jQuery(".parallax-content")
	.filter(function(i, d) {
		return  jQuery(d).visible(true);
	})
	.each(function(i) {
		var f = parseInt(jQuery(this).offset().top);
        var l = jQuery(window).scrollTop() - f;
        var c = l * 0.3;
		if (isChrome && typeof TweenLite !== 'undefined') {
			TweenLite.to(jQuery(this).find(".parallax-image"), 0.2, { y:c });
		} else {
			jQuery(this).find(".parallax-image").css({'transform':'translateY('+c+'px)','moz-transform':'translateY('+c+'px)','webkit-transform':'translateY('+c+'px)'});
		}
	});
}

if (jQuery(window).width() > 1024) { jQuery(window).scroll(function() { moveParallax(); }); }

(function(e) {
    e.fn.extend({
        parallax: function(e) {
            return this.each(function() {
                
				var e = jQuery(this);
				
				var t = new Image;
				t.onload = function() {
					imgH = this.height;
					imgW = this.width;
										
					if (jQuery(window).width() > 1024) {
						
						var elH = jQuery(window).height();
						var centerOffset = -((jQuery(window).height() - e.height()) / 2);
						if (jQuery(window).height() < e.height()) { elH = e.height(); }
												
				   		if(e.css("position") !== 'absolute') { e.css({"position":"relative"}) }
				   		e.append('<div class="parallax-content" style="position:absolute;top:0;left:0;width:100%;height:100%;z-index:-1;overflow:hidden;"><div class="parallax-image" style="background: url(' + e.data("parallax-image") + ') center center;background-size:cover; width:100%;height:'+elH+'px;position:absolute;top:'+centerOffset+'px;"></div></div>');
						
						moveParallax();
																	   
					} else {
						e.css({
							background: "url(" + e.data("parallax-image") + ") center center",
							"background-attachment": "inherit",
							"background-size": "cover"
						});
					}
					
					
				};
				t.src = e.data("parallax-image");
									
            })
        }
    })
})(jQuery)