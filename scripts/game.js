var createGame = (function() {
  var Game = function(canvas, context, levelConfig) {
    var that = this;
    var firstTile;
    this.canvas = canvas;
    this.context = context;
    this.map = createTilemap(that, context, levelConfig.map);
    firstTile = this.map.getTile(levelConfig.firstTile.y + ',' + levelConfig.firstTile.x);
    this.player = createPlayer(that, context, firstTile);
    // this.monster ...
  };
  // PUB/SUB MECHANISM
  Game.prototype.events = {
    loading: [],
    playing: [],
    menu: [],
    paused: [],
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
      looping: false,
      loop: function(looping, game) {
        var that = this;
        this.looping = looping;
        var start;
        var fps = 25/1000;
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
          this.animationFrame = window.requestAnimationFrame(step, game.canvas);
        } else {
          window.cancelAnimationFrame(this.animationFrame);
        }
      },
      update: function(game) {
        if (game.map.isCompleted()) {
        }
        game.publish('update');
      },
      displayScore: function(game) {
        var lives = '';
        for (var i = game.player.lives; i > 0; i -= 1) {
          lives += '❤';
        }
        game.context.save();
        game.context.fillStyle = 'white';
        game.context.font = '24px Consolas';
        game.context.textBaseline = 'middle';
        game.context.fillText('score: 1000', 24, 48);
        game.context.fillText('target \u21E8 ', 24, 48 * 2);
        helpers.drawCube(game.context, 170, 48*2 + 20, 20, 20, 20, game.map.colors.target, game.map.colors.left, game.map.colors.right);
        game.context.fillText('lives:', 24, 48*3);
        game.context.fillStyle = 'crimson';
        game.context.fillText(lives, 24, 48*3.7);
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
        game.player.on('dying', function(event, info) {
          game.publish(event, info);
          // next state is over or paused
        });
        console.log(game, game.player);
        // start the game loop
        this.loop(true, game);
      },
      stop: function(from, to, game) {
        // stop the game loop
        var that = this;
        this.loop('false', game);
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
    paused: {
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
