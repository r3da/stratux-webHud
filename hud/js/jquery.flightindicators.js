(function($) {
	function AttitudeIndicator( placeholder, type, options ) {
		var settings = $.extend({
			size : 600,	
			roll : 0,
			pitch : 0,
			showBox : true,
			img_directory : 'img/'
		}, options );

		var constants = {
			pitch_bound:30,
		}

		placeholder.each(function(){
			$(this).html('<div class="instrument attitude"><div class="roll box"><img src="' + settings.img_directory + 'horizon_back.svg" class="box" alt="" /><div class="pitch box"><img src="' + settings.img_directory + 'horizon_ball.svg" class="box" alt="" /></div><img src="' + settings.img_directory + 'horizon_circle.svg" class="box" alt="" /></div><div class="mechanics box"><img src="' + settings.img_directory + 'horizon_mechanics.svg" class="box" alt="" /><img src="' + settings.img_directory + 'fi_circle.svg" class="box" alt="" /></div></div>');
			    _setRoll(settings.roll);
		            _setPitch(settings.pitch);
			}
			$(this).find('div.instrument').css({height : 500, width : 500}); 
			$(this).find('div.instrument img.box.background').toggle(settings.showBox);
		});

		function _setRoll(roll){
			placeholder.each(function(){
				$(this).find('div.instrument.attitude div.roll').css('transform', 'rotate('+roll+'deg)');
			});
		}

		function _setPitch(pitch){
			if(pitch>constants.pitch_bound){pitch = constants.pitch_bound;}
			else if(pitch<-constants.pitch_bound){pitch = -constants.pitch_bound;}
			placeholder.each(function(){
				$(this).find('div.instrument.attitude div.roll div.pitch').css('top', pitch*0.7 + '%');
			});
		}

		function _resize(size){
			placeholder.each(function(){
				$(this).find('div.instrument').css({height : size, width : size});
			});
		}

		function _showBox(){
			placeholder.each(function(){//moves up
				$(this).find('img.box.background').show();
			});
		}

		function _hideBox(){
			placeholder.each(function(){
				$(this).find('img.box.background').hide();
			});
		}

		this.setRoll = function(roll){_setRoll(roll);}
		this.setPitch = function(pitch){_setPitch(pitch);}
		this.resize = function(size){_resize(size);}
		this.showBox = function(){_showBox();}
		this.hideBox = function(){_hideBox();}

		return attitude;
	};

	$.attitudeIndicator = function(placeholder, type, options){
		var attitudeIndicator = new AttitudeIndicator($(placeholder), type, options)
		return attitudeIndicator;
	}

	$.fn.attitudeIndicator = function(data, type, options){
		return this.each(function(){
			$.attitudeIndicator(this, type, options);
		});
	}
}( jQuery ));
