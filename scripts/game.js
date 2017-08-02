var createGame = (function() {
  var Game = function(canvas, context, levelConfig) {
    var that = this;
    var firstTile;
    this.canvas = canvas;
    this.context = context;
    this.config = levelConfig;
    this.map = createTilemap(that, context, levelConfig.map);
    firstTile = this.map.getTile(levelConfig.player.firstTile.y + ',' + levelConfig.player.firstTile.x);
    this.player = createPlayer(that, context, firstTile);
    firstTile = this.map.getRandomTile();
    this.monster = createMonster(that, context, firstTile);
    // this.monster ...
  };
  // PUB/SUB MECHANISM
  Game.prototype.events = {
    loading: [],
    playing: [],
    menu: [],
    dialog: [],
    over: []
    // player.standing
    // player.dying
  };
  Game.prototype.on = function(event, listener) {
    var i;
    if (!this.events[event]) {
      this.events[event] = [];
    }
    i = this.events[event].push(listener) - 1;
    return {
      remove: function() {
        delete this.events[event][i];
      }
    };
  };
  Game.prototype.publish = function(event, info) {
    var i;
    if (!this.events[event]) {
      return;
    }
    info = info != undefined ? info : {};
    // console.log(event);
    for(i = 0; this.events[event][i]; i += 1) {
      this.events[event][i](event, info);
    }
  };
  // STATE MACHINE MECHANISM
  Game.prototype.currentState = '';
  Game.prototype.nextState = 'playing';
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
    loading: {
      start: function(from, to, game) {
        // show loading image ??
        game.nextState = 'playing';
      },
      stop: function(from, to, game) {
        // hide loading image ??
      }
    },
    playing: {
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
          }
        }
        if (this.looping) {
          that.animationFrame = window.requestAnimationFrame(step, game.canvas);
        } else {
          window.cancelAnimationFrame(that.animationFrame);
        }
      },
      update: function(game) {
        if (game.map.isCompleted()) {
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
        helpers.drawCube(game.context, fz * 10.7, lh * 2 + fz, fz, fz, fz, game.map.colors.target, game.map.colors.left, game.map.colors.right);
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
      start: function(from, to, game) {
        game.player.on('standing', function(event, info) {
          game.publish(event, info);
        });
        game.player.on('hit', function(event, info) {
          game.publish(event, info);
        });
        game.player.on('dying', function(event, info) {
          game.publish(event, info);
        });
        game.monster.on('standing', function(event, info) {
          game.publish(event, info);
        });
        // start the game loop
        this.loop(game);
      },
      stop: function(from, to, game) {
        // stop the game loop
        this.looping = false;
      }
    },
    menu: {
      start: function(from, to, game) {
        // show the menu
      },
      stop: function(from, to, game) {
        // hide the menu
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
    over: {
      start: function(from, to, game) {
        // end the game
      },
      stop: function(from, to, game) {
        // go to next level or restart
      }
    }
  }

  return function(canvas, context, levelConfig) {
    return new Game(canvas, context, levelConfig).transition();
  };
}());
