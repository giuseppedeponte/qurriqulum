'use strict';
var createGame = (function() {
  var Game = function(canvas, context, levelConfig) {
    var that = this;
    var firstTile;
    this.canvas = canvas;
    this.context = context;
    this.config = levelConfig;
    this.currentLevel = null;
    this.events = [];
  };
  // PUB/SUB MECHANISM
  Game.prototype.on = function(event, listener) {
    var i;
    var that = this;
    if (!this.events[event]) {
      this.events[event] = [];
    }
    i = this.events[event].push(listener) - 1;
    return {
      remove: function() {
        delete that.events[event][i];
      }
    };
  };
  Game.prototype.publish = function(event, info) {
    var i;
    if (!this.events[event]) {
      return;
    }
    info = info != undefined ? info : {};

    for(i = 0; this.events[event][i]; i += 1) {
      this.events[event][i](event, info);
    }
  };
  Game.prototype.subscriptions = [];
  Game.prototype.unsubscribe = function(){
    var i;
    for (i=0; this.subscriptions[i]; i += 1) {
      this.subscriptions[i].remove();
    }
  };
  // STATE MACHINE MECHANISM
  Game.prototype.currentState = '';
  Game.prototype.nextState = 'menu';
  Game.prototype.transition = function() {
    var that = this;
    if (this.nextState !== this.currentState) {
      if (this.states[this.currentState] && this.states[this.currentState].stop) {
        this.states[this.currentState].stop(that.currentState, that.nextState, that);
      }
      var from = this.currentState;
      this.currentState = this.nextState;
      if (this.states[this.currentState].start) {
        this.states[this.currentState].start(from, that.currentState, that);
      }
    }
    this.publish(that.currentState, that);
    return this;
  };
  Game.prototype.states = {
    menu: {
      start: function(from, to, game) {
        var that = this;
        // show the menu
        document.getElementById('menu').style.display = "block";
        this.play = function(e) {
          e.preventDefault();
          game.nextState = 'loading';
          game.transition();
        };
        document.getElementById('play').addEventListener('click', that.play);
      },
      stop: function(from, to, game) {
        var that = this;
        // hide the menu
        document.getElementById('play').removeEventListener('click', that.play);
        document.getElementById('menu').style.display = "none";
      }
    },
    loading: {
      reset: function(game) {
        game.context.clearRect(0, 0, game.canvas.width, game.canvas.height);
        game.unsubscribe();
        game.map.unsubscribe();
        game.player.unsubscribe();
        game.monster.unsubscribe();
        delete game.player;
        delete game.monster;
        delete game.map;
        game.events = [];
      },
      start: function(from, to, game) {
        var that = this;
        console.log(from);

        // update the level
        switch (from) {
          case 'menu': {
            this.level = 3;
            break;
          }
          case 'over': {
            this.reset(game);
            this.level = this.level;
            break;
          }
          case 'win': {
            this.reset(game);
            if (this.level < game.config.length - 1) {
              this.level += 1;
            } else {
              game.nextState = 'menu';
              game.transition();
              return;
            }
          }
        }
        game.currentLevel = game.config[this.level];

        // show the level dialog
        document.getElementById('levelTitle').textContent = game.currentLevel.title;
        document.getElementById('levelSubtitle').textContent = game.currentLevel.subtitle;
        document.getElementById('intro').style.display = 'block';

        // create level objects
        game.map = createTilemap(game, game.context, game.currentLevel.tMap);
        console.log(game.map);
        var firstTile = game.map.getTile(game.currentLevel.player.firstTile.y + ',' + game.currentLevel.player.firstTile.x);
        game.player = createPlayer(game, game.context, game.currentLevel.player, firstTile);

        firstTile = game.map.getRandomTile();
        game.monster = createMonster(game, game.context, game.currentLevel.monster, firstTile);
        // listen to spacebar input to start the game
        this.play = function(e) {
          if (e.keyCode === 32) {
            game.nextState = 'playing';
            game.transition();
          }
        };
        window.addEventListener('keydown', that.play);
      },
      stop: function(from, to, game) {
        var that = this;
        // hide the loading element
        document.getElementById('intro').style.display = "none";
        // remove keydown listener
        window.removeEventListener('keydown', that.play);
      }
    },
    dialog: {
      start: function(from, to, game) {
        // pause the game
      },
      stop: function(from, to, game) {
        // restart the game or exit
      }
    },
    playing: {
      start: function(from, to, game) {
        game.subscriptions = [];
        game.subscriptions.push(
          game.player.on('standing', function(event, info) {
            game.publish(event, info);
          }));
        game.subscriptions.push(
          game.player.on('hit', function(event, info) {
            game.publish(event, info);
          }));
        game.subscriptions.push(
          game.player.on('dying', function(event, info) {
            game.publish(event, info);
            game.nextState = 'over';
            game.transition();
          }));
        game.subscriptions.push(
          game.monster.on('standing', function(event, info) {
            game.publish(event, info);
          }));
        // start the game loop
        this.loop(game);
        // show the canvas
        document.getElementById('canvas').style.display = "block";
      },
      looping: true,
      loop: function(game) {
        var that = this;
        var start;
        var fps = 24/1000;
        var delta;
        var lerp = 0;
        var step = function(timestamp) {
          if (that.looping) {
            if (!start) { start = timestamp; }
            delta = Math.min(1000, timestamp - start);
            while (delta >= fps) {
              that.update(game);
              delta -= fps;
            }
            lerp = delta / fps;
            that.render(game, lerp);
            that.animationFrame = window.requestAnimationFrame(step, game.canvas);
            start = timestamp;
          } else {
            window.cancelAnimationFrame(that.animationFrame);
          }
        };
        this.animationFrame = window.requestAnimationFrame(step, game.canvas);
        this.looping = true;
      },
      update: function(game) {
        if (game.map.isCompleted()) {
          if (!this.counter) {
            this.counter = 0;
          } else if (this.counter > 1000) {
            game.nextState = 'win';
            game.transition();
          }
          this.counter += 0.01;
        }
        game.publish('update');
      },
      displayScore: function(game) {
        var fz = 16;
        var lh = fz * 2;
        var lives = '';
        for (var i = game.player.lives; i > 0; i -= 1) {
          lives += '❤';
        }
        game.context.save();
        game.context.fillStyle = 'violet';
        game.context.font = fz + 'px "Press Start 2P"';
        game.context.textBaseline = 'middle';
        game.context.fillText('Score ' + game.player.score, fz, lh);
        game.context.fillStyle = 'white';
        game.context.fillText('Target \u21D2 ', fz, lh * 2);
        helpers.drawCube(game.context, fz * 10.7, lh * 2 + fz, fz, fz, fz, game.currentLevel.tMap.colors.target, game.currentLevel.tMap.colors.left, game.currentLevel.tMap.colors.right);
        game.context.fillStyle = 'pink';
        game.context.fillText('Lives', fz, lh * 3);
        game.context.fillStyle = 'orangered';
        game.context.fillText(lives, fz, lh * 3.75);
        game.context.restore();
      },
      render: function(game, lerp) {
        game.context.clearRect(0, 0, game.canvas.width, game.canvas.height);
        this.displayScore(game);
        game.publish('render', { lerp: lerp });
      },
      stop: function(from, to, game) {
        // stop the game loop
        this.looping = false;
        // hide the canvas
        document.getElementById('canvas').style.display = "none";
      }
    },
    over: {
      start: function(from, to, game) {
        var that = this;
        // end the game
        document.getElementById('dialogMessage').className = "over";
        document.getElementById('dialogMessage').textContent = "GAME OVER";
        document.getElementById('dialog').style.display = "block";

        // listen to spacebar input to start the game
        this.play = function(e) {
          if (e.keyCode === 32) {
            game.nextState = 'loading';
            game.transition();
          }
        };
        window.addEventListener('keydown', that.play);
      },
      stop: function(from, to, game) {
        var that = this;
        // go to next level or restart
        document.getElementById('dialogMessage').className = "";
        document.getElementById('dialogMessage').textContent = "";
        document.getElementById('dialog').style.display = "none";
        // remove keydown listener
        window.removeEventListener('keydown', that.play);
      }
    },
    win: {
      start: function(from, to, game) {
        var that = this;
        // end the game
        document.getElementById('dialogMessage').className = 'win';
        document.getElementById('dialogMessage').textContent = 'YOU WIN';
        document.getElementById('dialogP').textContent = 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.';
        document.getElementById('dialog').style.display = "block";

        // listen to spacebar input to start the game
        this.play = function(e) {
          if (e.keyCode === 32) {
            game.nextState = 'loading';
            game.transition();
          }
        };
        window.addEventListener('keydown', that.play);
      },
      stop: function(from, to, game) {
        var that = this;
        // go to next level or restart
        document.getElementById('dialogMessage').className = '';
        document.getElementById('dialogMessage').textContent = '';
        document.getElementById('dialogP').textContent = '';
        document.getElementById('dialog').style.display = 'none';
        // remove keydown listener
        window.removeEventListener('keydown', that.play);
      }
    }
  }

  return function(canvas, context, levelConfig) {
    return new Game(canvas, context, levelConfig).transition();
  };
}());
