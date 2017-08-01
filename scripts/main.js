window.addEventListener('DOMContentLoaded', function() {
  var canvas = document.getElementById('canvas');
  var c = canvas.getContext('2d');
  var level = {
    firstTile: {
      x: 0,
      y: 0
    },
    map: {
      oX: canvas.width / 2,
      oY: 200,
      tileSize: 40,
      map: [
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0],
        [0, 0],
        [0]
      ],
      colors: {
        left: 'orange',
        right: 'gold',
        base: 'orangered',
        target: 'purple'
      }
    }
  };

  var levelOne = createGame(canvas, c, level);

});
