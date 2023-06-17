export function getUrlParams () {
  var match;
  var pl = /\+/g;  // Regex for replacing addition symbol with a space
  var search = /([^&=]+)=?([^&]*)/g;
  var decode = function (s: string) { return decodeURIComponent(s.replace(pl, ' ')); };
  var query = window.location.search.substring(1);
  var urlParams: any = {};

  match = search.exec(query);
  while (match) {
    urlParams[decode(match[1])] = decode(match[2]);
    match = search.exec(query);
  }
  return urlParams;
}

var canPlayType = function (el: any, mimeType: string) {
  if (!el || !el.canPlayType || !mimeType) {
    return false;
  }

  var supported = el.canPlayType(mimeType);

  return supported === 'maybe' || supported === 'probably';
};

// Adapted from `Modernizr` source: https://github.com/Modernizr/Modernizr/blob/master/feature-detects/audio.js
var getAudioCapabilities = (function (el) {
  return function () {
    var support = {};

    try {
      //@ts-ignore
      if (!el.canPlayType) {
        return Boolean(false);
      }

      support = Boolean(true);

      //@ts-ignore
      support.ogg = canPlayType(el, 'audio/ogg; codecs="vorbis"');
      //@ts-ignore
      support.mp3 = canPlayType(el, 'audio/mpeg; codecs="mp3"');
      //@ts-ignore
      support.opus = canPlayType(el, 'audio/ogg; codecs="opus"') ||
                     canPlayType(el, 'audio/webm; codecs="opus"');

      // Supported mime-types:
      // - https://developer.mozilla.org/en-US/docs/Web/HTML/Supported_media_formats
      // - https://bit.ly/iphoneoscodecs
      //@ts-ignore
      support.wav = canPlayType(el, 'audio/wav; codecs="1"');
      //@ts-ignore
      support.m4a = canPlayType(el, 'audio/x-m4a;') ||
                    canPlayType(el, 'audio/aac;');
    } catch (e) {
    }

    return support;
  };
})(document.createElement('audio'));

// TODO: If need, adapt full functionality from `Modernizr` source: https://github.com/Modernizr/Modernizr/blob/master/feature-detects/video.js
var getVideoCapabilities = (function (el) {
  return function () {
    //@ts-ignore
    return Boolean(!!el.canPlayType);
  };
})(document.createElement('video'));

export const capabilities = {
  audio: getAudioCapabilities,
  video: getVideoCapabilities
};
