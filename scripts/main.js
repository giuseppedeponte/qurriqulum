window.addEventListener('DOMContentLoaded', function() {
  var canvas = document.getElementById('canvas');
  var c = canvas.getContext('2d');
  tm = tilemap(c, canvas.width / 2, 160, 40, [
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0],
    [0, 0],
    [0]
  ], {left: 'orange', right: 'gold', base: 'orangered', target: 'purple'}, 1);
  var qbert = player(c, tm);
  tm.update(0,0);
});
