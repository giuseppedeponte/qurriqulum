window.addEventListener('DOMContentLoaded', function() {
  var joystick = document.getElementById('joystick');
  var ctx = joystick.getContext('2d');
  var touchable = 'createTouch' in document;
  if (!touchable) {
    return;
  }
  var triggerEvent = function(name, key, element) {
    console.log(key);
     var e = new Event(name);
      e.key=key;
      e.keyCode=e.key.charCodeAt(0);
      e.which=e.keyCode;
      e.altKey=false;
      e.ctrlKey=true;
      e.shiftKey=false;
      e.metaKey=false;
      e.bubbles=true;
      element.dispatchEvent(e);
  };
  var drawCircle = function(x, y) {
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.arc(x, y, 50, 0, Math.PI*2);
    ctx.fillStyle = 'crimson';
    ctx.globalAlpha = 0.5;
    ctx.fill();
    ctx.closePath();
    ctx.restore();
  };
  var currentKey;
  var onTouchStart = function(e) {
    ctx.fillRect(0, 0, joystick.width, joystick.height);
    currentKey = undefined;
  };
  var onTouchMove = function(e) {
    e.preventDefault();
    ctx.clearRect(0, 0, joystick.width, joystick.height);
    ctx.fillRect(0, 0, joystick.width, joystick.height);
    var h = e.changedTouches[0].clientX - joystick.offsetLeft < joystick.width / 2 ? 'Left' : 'Right';
    var v = e.changedTouches[0].clientY - joystick.offsetTop < joystick.height / 2 ? 'Up' : 'Down';
    var direction = h + ', ' + v;
    var x;
    var y;
    switch (direction) {
      case 'Left, Up': {
        // left arrow
        currentKey = 'ArrowLeft';
        x = 0;
        y = 0;
        break;
      }
      case 'Right, Up': {
        // up arrow
        currentKey = 'ArrowUp';
        x = joystick.width / 2;
        y = 0;
        break;
      }
      case 'Left, Down': {
        // down arrow
        currentKey = 'ArrowDown';
        x = 0;
        y = joystick.height / 2;
        break;
      }
      case 'Right, Down': {
        // right arrow
        currentKey = 'ArrowRight';
        x = joystick.width / 2;
        y = joystick.height / 2;
        break;
      }
    }
    ctx.save();
    ctx.fillStyle = 'purple';
    ctx.fillRect(x, y, joystick.width/2, joystick.height/2);
    ctx.restore();
    drawCircle(e.changedTouches[0].clientX - joystick.offsetLeft,
               e.changedTouches[0].clientY - joystick.offsetTop);
    triggerEvent('keydown', currentKey, joystick);
  };
  var onTouchEnd = function(e) {
    ctx.clearRect(0, 0, joystick.width, joystick.height);
    triggerEvent('keyup', currentKey, joystick);
  };
  joystick.addEventListener('touchstart', onTouchStart, false);
  joystick.addEventListener('touchmove', onTouchMove, false);
  joystick.addEventListener('touchend', onTouchEnd, false);
  document.getElementById('spacebar').addEventListener('click', function() {
    triggerEvent('keydown', ' ', window);
  });
});
