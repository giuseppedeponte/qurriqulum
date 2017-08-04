'use strict';
// RequestAnimationFrame polyfill
(function() {
    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame']
                                   || window[vendors[x]+'CancelRequestAnimationFrame'];
    }

    if (!window.requestAnimationFrame)
        window.requestAnimationFrame = function(callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function() { callback(currTime + timeToCall); },
              timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };

    if (!window.cancelAnimationFrame)
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
}());

window.addEventListener('DOMContentLoaded', function() {
  var canvas = document.getElementById('canvas');
  var c = canvas.getContext('2d');
  var QBERT = createGame(canvas, c, LEVELS);

  // var level = {
  //   player: {
  //     firstTile: {
  //       x: 0,
  //       y: 0
  //     }
  //   },
  //   monster: {
  //     firstTile: {
  //       x: 0,
  //       y: 3
  //     }
  //   },
  //   map: {
  //     oX: canvas.width / 2,
  //     oY: 200,
  //     tileSize: 40,
  //     map: [
  //       [0, 0, 0, 0, 0, 0],
  //       [0, 0, 0, 0, 0],
  //       [0, 0, 0, 0],
  //       [0, 0, 0],
  //       [0, 0],
  //       [0]
  //     ],
  //     /* GRAY
  //     colors: {
  //       left: '#888',
  //       right: '#777',
  //       base: '#666',
  //       target: '#444'
  //     }
  //     */
  //     /* GREEN
  //     colors: {
  //       left: 'seagreen',
  //       right: 'darkgreen',
  //       base: 'lightgreen',
  //       target: 'khaki'
  //     }
  //     */
  //     /* RED
  //     colors: {
  //       left: 'indianred',
  //       right: 'maroon',
  //       base: 'salmon',
  //       target: 'deeppink'
  //     }
  //     */
  //     /* BLUE
  //     colors: {
  //       left: 'lightsteelblue',
  //       right: 'midnightblue',
  //       base: 'royalblue',
  //       target: 'darkslategrey'
  //     }
  //     */
  //     /* HIPSTER
  //     colors: {
  //       left: '#4C6A8D',
  //       right: '#0C9DA9',
  //       base: '#FBC38D',
  //       target: '#F8555E'
  //     }
  //     */
  //     // TYCHO-AWAKE
  //
  //     colors: {
  //       left: '#513C43',
  //       right: '#874455',
  //       base: '#C34E54',
  //       // middle: '#FFFCE0',
  //       target: '#E67359'
  //     }
  //     /* BLACK
  //     colors: {
  //       left: '#000',
  //       right: '#111',
  //       base: '#333',
  //       target: '#222'
  //     }
  //     */
  //     /* WHITE
  //     colors: {
  //       left: '#ccc',
  //       right: '#eee',
  //       base: '#ddd',
  //       target: '#fff'
  //     }
  //     */
  //   }
  // };


});
