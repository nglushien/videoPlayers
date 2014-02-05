/************************************
utility to extract h/m/s from seconds
************************************/
var BCLSsecondsToTime = function (secs) {
      var hours = Math.floor(secs / (60 * 60));
      if (hours < 10 ) {
        hours = "0" + hours.toString();
      } else {
        hours = hours.toString();
      };
      var divisor_for_minutes = secs % (60 * 60);
      var minutes = Math.floor(divisor_for_minutes / 60);
      if (minutes < 10 ) {
        minutes = "0" + minutes.toString();
      } else {
        minutes = minutes.toString();
      };
      var divisor_for_seconds = divisor_for_minutes % 60;
      var seconds = Math.ceil(divisor_for_seconds);
      if (seconds < 10) {
        seconds = "0" + seconds.toString();
      } else {
        seconds = seconds.toString();
      };
      var obj = {
        "h": hours,
        "m": minutes,
        "s": seconds
      };

      return obj;
    }