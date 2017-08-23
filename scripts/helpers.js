// RequestAnimationFrame polyfill
(function() {
    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    var i;
    for (i = 0; i < vendors.length && !window.requestAnimationFrame; i += 1) {
        window.requestAnimationFrame = window[vendors[i]+'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[i]+'CancelAnimationFrame']
                                   || window[vendors[i]+'CancelRequestAnimationFrame'];
    }

    if (!window.requestAnimationFrame) {
      window.requestAnimationFrame = function(callback, element) {
          var currTime = new Date().getTime();
          var timeToCall = Math.max(0, 16 - (currTime - lastTime));
          var id = window.setTimeout(function() {
            callback(currTime + timeToCall);
          }, timeToCall);
          lastTime = currTime + timeToCall;
          return id;
      };
    }

    if (!window.cancelAnimationFrame) {
      window.cancelAnimationFrame = function(id) {
          clearTimeout(id);
      };
    }
}());
/* Common methods */
var HELPERS = {
  loadAssets : function(filenames, callback) {
    var i;
    var name;
    var result = {};
    var count = filenames.length;
    var onload = function(e) {
      count -= 1;
      if (count === 0) {
        callback(result);
      }
    };
    for (i = 0; i < filenames.length; i += 1) {
      name = filenames[i];
      result[name] = new Image();
      result[name].addEventListener('load', onload, false);
      result[name].src = './img/' + name;
    }
  },
  loadSounds: function(filenames, callback) {
    var i;
    var name;
    var result = {};
    var count = filenames.length;
    var canPlay = function() {
      if ((count -= 1) === 0) {
        callback(result);
      }
    };
    for (i = 0; i < filenames.length; i += 1) {
      name = filenames[i];
      result[name] = document.createElement('audio');
      result[name].addEventListener('canplay', canPlay, false);
      result[name].src = './sfx/' + name + '.mp3';
      result[name].volume = 0.2;
    }
  },
  drawCube: function(c, x, y, wx, wy, h, color, leftColor, rightColor) {
    // left side
    c.save();
    c.beginPath();
    c.moveTo(x, y);
    c.lineTo(x - wx, y - wx * 0.5);
    c.lineTo(x - wx, y - h - wx * 0.5);
    c.lineTo(x, y - h * 1);
    c.closePath();
    c.fillStyle = leftColor;
    c.fill();
    // right side
    c.beginPath();
    c.moveTo(x, y);
    c.lineTo(x + wy, y - wy * 0.5);
    c.lineTo(x + wy, y - h - wy * 0.5);
    c.lineTo(x, y - h * 1);
    c.closePath();
    c.fillStyle = rightColor;
    c.fill();
    // top side
    c.beginPath();
    c.moveTo(x, y - h);
    c.lineTo(x - wx, y - h - wx * 0.5);
    c.lineTo(x - wx + wy, y - h - (wx * 0.5 + wy * 0.5));
    c.lineTo(x + wy, y - h - wy * 0.5);
    c.closePath();
    c.fillStyle = color;
    c.fill();
    c.restore();
  },
  drawBubble: function(x, y, object) {
    var oX = x + object.w;
    var oY = y;
    var r = 20;
    object.context.save();
    object.context.beginPath();
    object.context.moveTo(oX - r/2, oY + r/2);
    object.context.lineTo(oX - r/2, oY + 1.5 * r);
    object.context.lineTo(oX, oY + r);
    object.context.fillStyle = 'white';
    object.context.fill();
    object.context.closePath();
    object.context.beginPath();
    object.context.arc(oX, oY, r, Math.PI/2, Math.PI * 1.5);
    object.context.arc(oX + 3*r, oY, r, Math.PI * 1.5, Math.PI/2);
    object.context.fillStyle = 'white';
    object.context.fill();
    object.context.closePath();
    object.context.fillStyle = 'black';
    object.context.font = r + 'px Arial';
    object.context.textAlign = 'center';
    object.context.textBaseline = 'middle';
    object.context.fillText('@!#?@!', oX + 3 * r/2, oY);
    object.context.restore();
  }
};
