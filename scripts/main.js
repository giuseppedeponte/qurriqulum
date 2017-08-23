'use strict';
window.addEventListener('DOMContentLoaded', function() {
  var canvas = document.getElementById('canvas');
  var c = canvas.getContext('2d');
  document.getElementById('loader').style.display = 'block';
  setTimeout(function() {
    HELPERS.loadAssets(CONFIG.assets, function() {
      document.getElementById('loader').style.display = 'none';
      HELPERS.createGame(canvas, c, CONFIG.levels);
    });
  }, 4000);
}, false);
