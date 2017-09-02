'use strict';
window.addEventListener('DOMContentLoaded', function() {
  // Older Opera versions detections
  if (navigator.userAgent.indexOf('Presto') !== -1) {
    document.getElementById('loader').style.display = 'none';
    document.getElementById('game').style.display = 'none';
    document.getElementById('mobileP').textContent = 'Désolé, le jeu Qurriqulum n\'est malheureusement pas compatible avec la version actuelle de votre navigateur';
    document.getElementById('mobile').className = 'container well text-center';
  } else {
    var canvas = document.getElementById('canvas');
    var c = canvas.getContext('2d');
    document.getElementById('loader').style.display = 'block';
    setTimeout(function() {
      HELPERS.loadAssets(CONFIG.assets, function() {
        document.getElementById('loader').style.display = 'none';
        HELPERS.createGame(canvas, c, CONFIG.levels);
      });
    }, 4000);
  }
}, false);
