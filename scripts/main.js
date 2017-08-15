'use strict';
window.addEventListener('DOMContentLoaded', function() {
  var canvas = document.getElementById('canvas');
  var c = canvas.getContext('2d');
  var qbert = helpers.createGame(canvas, c, LEVELS);
});
