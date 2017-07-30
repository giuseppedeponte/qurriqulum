var createGame = (function() {
  var Game = function(canvas, context, levelConfig) {
    var that = this;
    var firstTile;
    this.canvas = canvas;
    this.context = context;
    this.map = createTilemap(that, context, levelConfig.map);
    firstTile = this.map.tiles[levelConfig.firstTile.y][levelConfig.firstTile.x];
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
    if (!this.events[event]) {
      return;
    }
    info = info != undefined ? info : {};
    this.events[event][i](event, info);
  };
  // STATE MACHINE MECHANISM
  Game.prototype.currentState = '';
  Game.prototype.nextState = 'playing';
  Game.prototype.transition = function() {
    var that = this;
    if (this.nextState !== this.currentState) {
      if (this.states[this.currentState].exit) {
        this.states[this.currentState].stop(that.currentState, that.nextState, that);
      }
      var from = this.currentState;
      this.currentState = this.nextState;
      if (this.states[this.currentState].init) {
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
      loop: function(game) {
        var that = this;
        var start;
        var delta;
        var lerp = 0;
        var step = function(timestamp) {
          if (!start) { start = timestamp; }
          delta = Math.min(1000, timestamp - start);
          while (delta >= fps) {
            game.update(game);
            delta -= fps;
          }
          lerp = delta / fps;
          game.render(game, lerp);
          that.animationFrame = window.requestAnimationFrame(step);
          start = timestamp;
        }
        this.animationFrame = window.requestAnimationFrame(step);
      },
      update: function(game) {
        game.publish('update');
      },
      render: function(game, lerp) {
        that.context.clearRect(0, 0, game.canvas.width, game.canvas.height);
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
        // start the game loop
        this.loop(game);
      },
      stop: function(from, to, game) {
        // stop the game loop
        var that = this;
        window.cancelAnimationFrame(that.animationFrame);
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
