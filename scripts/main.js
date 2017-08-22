'use strict';
window.addEventListener('DOMContentLoaded', function() {
  var canvas = document.getElementById('canvas');
  var c = canvas.getContext('2d');
  var qbert;
  document.getElementById('loader').style.display = 'block';
  setTimeout(function() {
    helpers.loadAssets(ASSETS, function() {
      document.getElementById('loader').style.display = 'none';
      qbert = helpers.createGame(canvas, c, LEVELS);
    });
  }, 2000);
}, false);
