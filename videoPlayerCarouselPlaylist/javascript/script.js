$(document).ready(function(){

if(typeof playlistIDs === 'undefined'){
  $('#BCL_playlist').hide();
}

var i = 0;
var videosExists = false;
var y = setInterval(function() {checkVideos();},1000);
 
function checkVideos() {
    if (i > 10) {
        clearInterval(y);
    } else if ($(".bxslider li").length >= 1) {
        clearInterval(y);
        videosExists = true;
        //perform your actions here
        $('.bxslider').bxSlider({
          infiniteLoop: false,
          hideControlOnEnd: true,
          slideMargin: 11,
          pager: false,
          minSlides: 3,
          moveSlides: 1,
          slideWidth: 596
        });
    }
    i++;
}

checkVideos();

});