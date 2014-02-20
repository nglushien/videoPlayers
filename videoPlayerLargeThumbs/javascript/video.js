 /******** Any scripts specific to page samples should go here *********/
      /**** Brightcove Learning Services Module ****/
      var BCLS = (function() {
        var player,
            APIModules,
            videoPlayer,
            contentModule,
            obj = {},
            arrayIndex,
            // array of playlist IDs
            playlists = playlistIDs,
            numberPlayerlists = playlists.length,
            // Handlebars templates for the playlist selector and playlist
            selectorTemplate = "{{#playlistsData}}<li class=\"playlist-btn\" data-index=\"{{returnArrayIndex}}\"><p>{{displayName}}</p></li>{{/playlistsData}}",
            playlistTemplate = "{{#videos}}<div class=\"playlist-item\" data-id=\"{{id}}\"><p class=\"duration\">{{length}}</p><img height=\"40\" width=\"72\" src=\"{{thumbnailURL}}\"/><h6>{{displayName}}</h6></div>{{/videos}}",
              template,
              data,
              results,
              experienceModule;
        // initialize playlist data array
        obj.playlistsData = [];
        /* private functions */
        // helper functions to reference array index in handlebars loop
        helpers = function() {
          arrayIndex = -1;
          Handlebars.registerHelper('returnArrayIndex', function() {
            arrayIndex++;
            return arrayIndex;
          });
          Handlebars.registerHelper('reset_index', function() {
            arrayIndex = -1;
          });
        }();

        /**** retrieves the playlists from the Video Cloud service
        * because the calls are asynchronous,
        * this function needs to keep calling itself
        * until it has looped over the entire playlist ids array ****/
        buildPlaylistsData = function (counter) {
          
          // master array to hold retrieved playlist data
          contentModule.getPlaylistByID(playlists[counter] , function(jsonData) {
            obj.playlistsData.push(jsonData);
            
            //Loop through the video data array
            jQuery.each( jsonData.videos, function( i, val ) {
              //Convert video length from milliseconds to minutes and seconds readable format
              var secs = Math.floor(val.length / 1000);
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
                jsonData.videos[i].length = hrs + ':' + mins + ":" + secs;
              } else {
                jsonData.videos[i].length = mins + ":" + secs;
              }

              
              // End video length conversion
            });

            if (counter < numberPlayerlists - 1) {
              // not done yet, function increments the counter and recalls itself
              counter++;
              buildPlaylistsData(counter);
            }
            else {
              // now we're done, buid the selector
              buildPlaylistSelector();

              if(window.location.hash === ''){
                window.location.hash = $('.playlist-item').data().id;
                videoPlayer.cueVideoByID(window.location.hash.substring(1));
                $('.playlist-item:first-child').css('display','none');
              } else {
                videoPlayer.cueVideoByID(window.location.hash.substring(1));
              }
            }
          });
        };

        /**** function that builds the playlist selector ****/
        buildPlaylistSelector = function() {
          // populate the template with data
          template = Handlebars.compile(selectorTemplate);
          data = obj;
          results = template(data);
          $("#BCL_playlistSelectorDropDown").html(results);

          /****
          * listener for playlist selection - builds the playlist
          * using jquery here as it simplifies highlighting the selected tab
          ****/
          $("#BCL_playlistSelectorDropDown li").on("click", function(evt) {
            $this = $(this);

            // highlight the current tab
            $this.siblings().removeClass("playlist-btn-selected").addClass("playlist-btn");
            $this.removeClass("playlist-btn").addClass("playlist-btn-selected");
            $('#BCL_playlistSelector>li p').text($('.playlist-btn-selected').text());

            if($('#BCL_playlistSelector>li p').text() === $('.playlist-btn-selected').text()){
              $('.playlist-btn-selected').css('display','none');
              $('.playlist-btn').css('display','block');
            } else {
              $('.playlist-btn').css('display','block');
            }

            var componentHeight = $('.section').outerHeight(true);
            var playlistMenuHeight = $('#BCL_playlistSelector').outerHeight(true);
            var playlistHeight = componentHeight - playlistMenuHeight - 2;

            $('#BCL_playlist').outerHeight(playlistHeight);

            // build the new playlist
            buildPlaylist($this.attr("data-index"));
          });

          if(obj.playlistsData.length === 1 || window.location.hash === ''){
            $("#BCL_playlistSelectorDropDown li").filter(":first").trigger("click");
          } else {

            var urlHash = window.location.hash.substring(1);

            jQuery.each(obj.playlistsData,function(i, val){
              var temp = this.videos;
              jQuery.each(temp,function(){
                var stringID = this.id + "";
                if(urlHash === stringID){
                  $("#BCL_playlistSelectorDropDown li").filter(function(index){return index === i;}).trigger("click");
                }
              });
            });

          }

          $('#BCL_playlistSelector li').on('click', function(){
            $('#BCL_playlistSelectorDropDown').slideToggle(250);
          });


          $('#BCL_playlistSelector>li p').text($('.playlist-btn-selected').text());

          if($('#BCL_playlistSelector>li p').text() === $('.playlist-btn-selected').text()){
            $('.playlist-btn-selected').css('display','none');
          } else {
            $('.playlist-btn-selected').css('display','block');
          }

        };

        /**** function to build the playlist ****/
        buildPlaylist = function (index) {
          template = Handlebars.compile(playlistTemplate);
          data = obj.playlistsData[index];
          results = template(data);
          
          // populate the playlist with HTML
          $("#BCL_playlist").html(results);

          // add event listener for playlist items
          $(".playlist-item").on("click", function (evt) {
            $this = $(this);
            // highlight selected item
            $this.siblings().removeClass("playlist-item-selected");
            $this.addClass("playlist-item-selected");

            // play the video
            videoPlayer.loadVideoByID($this.attr("data-id"));

            // swap the hash value for the current video id
            window.location.hash = $this.attr("data-id");

            if($this.attr("data-id") == window.location.hash.substring(1)){
              $this.css('display','none', 'important');
              $this.siblings().css('display','block');
            }

          });

          $('.playlist-item').each(function(){
            var listIds = $(this).data().id + "";
            var hashId = window.location.hash.substring(1);

            if(listIds === hashId){
              $(this).css('display','none');
            }
          });

        };

        resizePlayer = function(ex){
          

            $(window).on('resize', function (){
              if($(window).width() <= 940){
                ex.setSize($('.resizer').width(), $('.resizer').height());
              } else if($(window).width() >= 940){
                ex.setSize($('#playlist_player').width(), $('#playlist_player').height());
              }

            });

          };
            


        // public functions
        return {
          /**** template loaded event handler ****/
          onTemplateLoad : function (experienceID) {
            // get a reference to the player and API Modules and Events
            player = brightcove.api.getExperience(experienceID);
            APIModules = brightcove.api.modules.APIModules;
            ex = player.getModule(brightcove.api.modules.APIModules.EXPERIENCE);

            ex.addEventListener(brightcove.api.events.ExperienceEvent.TEMPLATE_READY, function (evt)
            {
              brightcovePlayerReady(ex);
            });

          },
          /**** template ready event handler ****/
          onTemplateReady : function (evt) {
            // get references to modules
            videoPlayer = player.getModule(APIModules.VIDEO_PLAYER);
            contentModule = player.getModule(APIModules.CONTENT);

            // fetch the playlists
            buildPlaylistsData(0);

            resizePlayer(ex);

          }
        };
      }());