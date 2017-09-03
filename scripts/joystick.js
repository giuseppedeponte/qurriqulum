window.addEventListener('DOMContentLoaded', function() {
  var joystick = document.getElementById('joystick');
  var ctx = joystick.getContext('2d');
  var touchable = 'createTouch' in document;
  if (!touchable) {
    return;
  }
  var image = document.createElement('img');
  image.src = './img/joystick.png';
  image.addEventListener('load', function() {
    ctx.drawImage(image,
                  0, 0, 242, 242,
                  0, 0, joystick.width, joystick.height);
    var triggerEvent = function(name, key, element) {
      element = element || window;
       var e = new Event(name);
        e.keyCode=key;
        e.which=e.keyCode;
        e.altKey=false;
        e.ctrlKey=true;
        e.shiftKey=false;
        e.metaKey=false;
        e.bubbles=true;
        element.dispatchEvent(e);
    };
    var currentKey;
    var onTouchStart = function(e) {
      ctx.drawImage(image,
                    0, 0, 242, 242,
                    0, 0, joystick.width, joystick.height);
      currentKey = undefined;
    };
    var onTouchMove = function(e) {
      triggerEvent('keyup', 37);
      triggerEvent('keyup', 38);
      triggerEvent('keyup', 39);
      triggerEvent('keyup', 40);
      var tX = e.changedTouches[0].clientX - joystick.offsetLeft;
      var tY = e.changedTouches[0].clientY - joystick.offsetTop;
      ctx.clearRect(0, 0, joystick.width, joystick.height);
      ctx.drawImage(image,
                    0, 0, 242, 242,
                    0, 0, joystick.width, joystick.height);
      if ((tX > joystick.width / 3
          && tX < 2 * joystick.width / 3)
          || (tY > joystick.height / 3
          && tY < 2 * joystick.height / 3)) {
        return;
      }
      var h = tX < joystick.width / 2 ? 'Left' : 'Right';
      var v = tY < joystick.height / 2 ? 'Up' : 'Down';
      var direction = h + ', ' + v;
      var x;
      switch (direction) {
        case 'Left, Up': {
          // left arrow
          currentKey = 37;
          x = 242;
          break;
        }
        case 'Right, Up': {
          // up arrow
          currentKey = 38;
          x = 484;
          break;
        }
        case 'Left, Down': {
          // down arrow
          currentKey = 40;
          x = 726;
          break;
        }
        case 'Right, Down': {
          // right arrow
          currentKey = 39;
          x = 968;
          break;
        }
      }
      ctx.drawImage(image,
                x, 0, 242, 242,
                0, 0, joystick.width, joystick.height);
      triggerEvent('keydown', currentKey);
    };
    var onTouchEnd = function(e) {
      ctx.drawImage(image,
                    0, 0, 242, 242,
                    0, 0, joystick.width, joystick.height);
      triggerEvent('keyup', 37);
      triggerEvent('keyup', 38);
      triggerEvent('keyup', 39);
      triggerEvent('keyup', 40);
    };
    joystick.addEventListener('touchstart', onTouchStart, false);
    joystick.addEventListener('touchmove', onTouchMove, false);
    joystick.addEventListener('touchend', onTouchEnd, false);
    document.getElementById('spacebar').addEventListener('click', function() {
      triggerEvent('keydown', 32);
    });
    document.getElementById('escape').addEventListener('click', function() {
      triggerEvent('keydown', 27);
    });
  });
});
