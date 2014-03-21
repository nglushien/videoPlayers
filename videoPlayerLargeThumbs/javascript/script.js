$(document).ready(function(){

  $(window).resize(function() {
    clearTimeout(this.id);
    this.id = setTimeout(doneResizing, 500);
  });

  function doneResizing(){

    if($(window).width() <= 960){

      $('#player').addClass('resizer');

    }

  }

	if($(window).width() > 960){
		$('#BCL_playlist').css('height','337px');
	} else if($(window).width() <= 960){
		$('#player').addClass('resizer');
	}

});