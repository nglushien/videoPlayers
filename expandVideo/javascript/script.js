var player,
    APIModules,
    videoPlayer,
    mediaEvent;
 
resizePlayer = function(ex){
  $('.thumb').on('click', function (){
      if($('#playlist_player iframe').length >= 1){
        $('.thumb').fadeOut();
        ex.setSize(850, 495);
        $('.resizer').animate({
          width:'564px',
          height:'350px'
        },1000);
      }
  });
};

var h5small = function(ex){
  ex.setSize(282, 175);
};

var h5large = function(ex){
  ex.setSize(860, 495);
};

var onTemplateLoad = function(experienceID){
  player = brightcove.api.getExperience(experienceID);
  APIModules = brightcove.api.modules.APIModules;
  mediaEvent = brightcove.api.events.MediaEvent;
  ex = player.getModule(brightcove.api.modules.APIModules.EXPERIENCE);

  ex.addEventListener(brightcove.api.events.ExperienceEvent.TEMPLATE_READY, function (evt)
  {
    brightcovePlayerReady(ex);
  });
};

var onTemplateReady = function(evt){
  resizePlayer(ex);
  videoPlayer = player.getModule(APIModules.VIDEO_PLAYER);
  videoPlayer.addEventListener(mediaEvent.COMPLETE, onMediaComplete);

  videoPlayer.getCurrentVideo(function(videoDTO){
    $('.videoThumb').attr('src',videoDTO.videoStillURL);
    $('.videoTitle').text(videoDTO.displayName);
    //Convert video length from milliseconds to minutes and seconds readable format
    var secs = Math.floor(videoDTO.length / 1000);
    var mins = Math.floor(secs / 60);
    secs = secs % 60;
    if(secs < 10){
      secs = "0" + secs;
    }
    var hrs = Math.floor(mins / 60);
    mins = mins % 60;
    if(mins < 10){
      mins = "0" + mins;
    }
    hrs = hrs % 24;
    if(hrs < 10){
      hrs = "0" + hrs;
    }
    if(hrs >= 1){
      videoDTO.length = hrs + ':' + mins + ":" + secs;
    } else {
      videoDTO.length = mins + ":" + secs;
    }
    $('.videoDuration').text(videoDTO.length);
    // End video length conversion
  });
};

var onMediaComplete = function(evt){
  $('#close').css('display','block').animate({
      top:['0','swing']
    },500);
  setTimeout(function(){
    $('.resizer').animate({
        width:'282px',
        height:'175px'
      },1000);
    },500);
  setTimeout(function(){
    $('.BrightcoveExperience').width(282).height(175);
    h5small(ex);
    resizePlayer();
    $('.thumb').fadeIn();
  },1500);
};

var videoExpand = function(){
  if($('#expand').css('top') === '-22px'){
    $('.thumb').fadeOut();
    $('#expand').animate({
      top:['0','swing']
    },500);
    setTimeout(function(){
      $('.BrightcoveExperience').width(860).height(495);
      h5large(ex);
      resizePlayer();
      $('.resizer').css('overflow','visible');
      $('.resizer').animate({
          width:'860px',
          height:'495px'
        },1000);
      setTimeout(function(){
        $('#close').css('display','block').animate({
          top:['-22px','swing']
        },500);
        videoPlayer.play();
      },1500);
    },500);
  } else {
    $('.BrightcoveExperience').width(860).height(495);
    h5large(ex);
    resizePlayer();
    $('.resizer').css('overflow','visible');
    $('.resizer').animate({
        width:'860px',
        height:'495px'
      },1000);
    setTimeout(function(){
      $('#close').css('display','block').animate({
        top:['-22px','swing']
      },500);
    },1000);
    videoPlayer.play();
  }
};

var videoClose = function(){
  $('#close').animate({
      top:['0','swing']
    },500);
  setTimeout(function(){
    $('.resizer').animate({
      width:'282px',
      height:'175px'
    },1000);
  },500);
  setTimeout(function(){
    $('.BrightcoveExperience').width(282).height(175);
    h5small(ex);
    // $('.thumb').fadeIn();
    $('#expand').show().animate({
      top:['-22px','swing']
    },500);
  },1500);
  videoPlayer.pause();
};

$(document).ready(function(){

  $('.resizer').css({
    'width':'30%',
    'overflow':'hidden'
  });

  $('.thumb').on('click',function(){
    videoExpand();
    $(this).fadeOut();
  });

  $('#close').on('click',function(){
    videoClose();
  });

  $('#expand').on('click',function(){
    videoExpand();
  });

});