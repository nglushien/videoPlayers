$(document).ready(function(){

	$( '.image' ).attr({
	  src: 'images/French_Header.jpg',
	  title: 'Image 1',
	  alt: 'Image 1'
	});

	$(window).on('resize',function(){


		if($(window).width() > 1280){
			$( '.image' ).attr({
			  src: 'images/French_Header.jpg',
			  title: 'Image 1',
			  alt: 'Image 1'
			});
		} else if($(window).width() < 1280 && $(window).width() > 960){
			$( '.image' ).attr({
			  src: 'images/German_Header.jpg',
			  title: 'Image 2',
			  alt: 'Image 2'
			});
		} else if($(window).width() < 960 && $(window).width() > 640){
			$( '.image' ).attr({
			  src: 'images/header.jpg',
			  title: 'Image 3',
			  alt: 'Image 3'
			});
		} else if($(window).width() < 640 && $(window).width() > 320){
			$( '.image' ).attr({
			  src: 'images/insightBanner.jpg',
			  title: 'Image 4',
			  alt: 'Image 4'
			});
		}



	});




});