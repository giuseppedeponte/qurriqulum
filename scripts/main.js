'use strict';
window.addEventListener('DOMContentLoaded', function() {
  var canvas = document.getElementById('canvas');
  var c = canvas.getContext('2d');
  var qbert;
  document.getElementById('loader').style.display = 'block';
  setTimeout(function() {
    HELPERS.loadAssets(ASSETS, function() {
      document.getElementById('loader').style.display = 'none';
      qbert = HELPERS.createGame(canvas, c, LEVELS);
    });
  }, 4000);
}, false);
