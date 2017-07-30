// FACTORY FUNCTION FOR THE GAME PLAYER
var createPlayer = (function() {
  var Player = function(game, context, config) {
    this.game = game;
    this.context = context;
    this.img = config.img;
    this.lives = 5;
  };
  // PUB/SUB MECHANISM
  Player.prototype.events = {
    loading: [],
    standing: [],
    jumping: [],
    falling: [],
    dying: []
  };
  Player.prototype.on = function(event, listener) {
    var i = this.events[event].push(listener) - 1;
    return {
      remove: function() {
        delete this.events[event][i];
      }
    };
  };
  Player.prototype.publish = function(event, info) {
    info = info != undefined ? info : {};
    for (var i = 0; this.events[event][i]; i += 1) {
      this.events[event][i]('player.' + event, info);
    }
  };
  // STATE MACHINE MECHANISM
  Player.prototype.currentState = "";
  Player.prototype.nextState = "loading";
  Player.prototype.transition = function() {
    var that = this;
    if (this.nextState !== this.currentState) {
      if (this.states[this.currentState].exit) {
        this.states[this.currentState].exit(
          that.currentState,
          that.nextState,
          that
        );
      }
      var from = this.currentState;
      this.currentState = this.nextState;
      if (this.states[this.currentState].init) {
        this.states[this.currentState].init(from, that.currentState, that);
      }
    }
    this.publish(that.currentState, that);
  };
  Player.prototype.update = function() {
    if (this.states[this.currentState].update) {
      var that = this;
      this.states[this.currentState].update(attr, that);
    }
    this.transition();
  };
  Player.prototype.render = function() {
    if (this.states[this.currentState].render) {
      var that = this;
      this.context.save();
      this.states[this.currentState].render(attr, that);
      this.context.restore();
    }
  };
  Player.prototype.states = {
    loading: {
      ready: false,
      done: function() {
        var that = this;
        this.ready = true;
      },
      init: function(from, to, player) {
        var that = this;
        // load player img
        player.img = new Image();
        player.img.addEventListener("load", that.done);
        player.img.src = player.frame.src;
      },
      update: function(attr, player) {
        var that = this;
        if (this.ready) {
          player.nextState = "standing";
          player.img.removeEventListener("load", that.done);
        } else {
          player.nextState = "loading";
        }
      }
      // render: function(attr, player) {},
      // exit: function(from, to, player) {}
    },
    standing: {
      keys: {
        k37: false, // left
        k38: false, // up
        k39: false, // right
        k40: false // down
      },
      toggleKey: function(e) {
        if (this.keys["k" + e.keyCode]) {
          e.preventDefault();
          this.keys["k" + e.keyCode] = e.type === "keydown";
        }
      },
      parseKeys: function() {
        var direction = { x: 0, y: 0 };
        switch (true) {
          case this.keys.k37: {
            direction.x = -1;
            break;
          }
          case this.keys.k38: {
            direction.y = -1;
            break;
          }
          case this.keys.k39: {
            direction.x = 1;
            break;
          }
          case this.keys.k40: {
            direction.y = -1;
            break;
          }
          default: {
            direction.x = 0;
            direction.y = 0;
            break;
          }
        }
        return direction;
      },
      init: function(from, to, player) {
        var that = this;
        window.addEventListener("keydown", that.toggleKey);
        window.addEventListener("keyup", that.toggleKey);
        // listen to monster events ???
        // listen to tilemap events ???
        // set image frame x and y
      },
      update: function(attr, player) {
        // check collisions with monsters
        if (player.currentTile.hasMonster()) {
          player.nextState = "dying";
          return;
        }
        // check input
        var dir = this.parseKeys();
        if (dir.x || dir.y) {
          // update direction
          player.position.dirX = dir.x;
          player.position.dirY = dir.y;
          // check if next position is a tile or not
          if (player.currentTile.next(dir.x, dir.y)) {
            player.nextState = "jumping";
          } else {
            player.nextState = "falling";
          }
        } else {
          player.nextState = "standing";
        }
      },
      render: function(attr, player) {
        player.context.drawImage(
          player.img,
          player.frame.x,
          player.frame.y,
          player.frame.w,
          player.frame.h,
          player.position.x - player.w / 2,
          player.position.y - player.h,
          player.w,
          player.h
        );
      },
      exit: function(from, to, player) {
        var that = this;
        window.removeEventListener("keydown", that.toggleKey);
        window.removeEventListener("keydown", that.toggleKey);
      }
    },
    jumping: {
      // animation counter
      counter: 0,
      init: function(from, to, player) {
        // get next tile reference
        // start the counter
      },
      update: function(attr, player) {
        // check if animation is over
        // if it is change state
        // if not update position
      },
      render: function(attr, player) {},
      exit: function(from, to, player) {}
    },
    falling: {
      // animation counter
      counter: 0,
      init: function(from, to, player) {},
      update: function(attr, player) {},
      render: function(attr, player) {},
      exit: function(from, to, player) {}
    },
    dying: {
      init: function(from, to, player) {},
      // update: function(attr, player) {},
      // render: function(attr, player) {},
      exit: function(from, to, player) {}
    }
  };
})();
