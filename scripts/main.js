window.addEventListener('DOMContentLoaded', function() {
  var canvas = document.getElementById('canvas');
  var c = canvas.getContext('2d');
  var level = {
    player: {
      firstTile: {
        x: 0,
        y: 0
      }
    },
    monster: {
      firstTile: {
        x: 0,
        y: 3
      }
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
        left: '#888',
        right: '#777',
        base: '#666',
        target: '#444'
      }
    }
  };

  var levelOne = createGame(canvas, c, level);

});
