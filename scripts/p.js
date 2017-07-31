// FACTORY FUNCTION FOR THE GAME PLAYER
var createPlayer = (function() {
  var Player = function(game, context, firstTile) {
    this.game = game;
    this.context = context;
    this.img = null;
    this.lives = 5;
    this.currentTile = firstTile;
  };
  // common props and methods
  Player.prototype.position = {
    x: 0,
    y: 0,
    dirX: 0,
    dirY: 0
  };
  Player.prototype.width = 50;
  Player.prototype.height = 75;
  Player.prototype.frame = {
    src: 'file:///C:/Users/drventisette/qbert/img/player.png',
    sourceWidth: 417,
    sourceHeight: 156,
    x: 0,
    y: 0,
    w: 104.25,
    h: 156
  };
  // PUB/SUB MECHANISM
  Player.prototype.events = {
    load: [],
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
  Player.prototype.currentState = '';
  Player.prototype.nextState = 'load';
  Player.prototype.transition = function() {
    var that = this;
    if (this.nextState !== this.currentState) {
      if (this.states[this.currentState] && this.states[this.currentState].exit) {
        this.states[this.currentState].exit(that.currentState, that.nextState, that);
      }
      var from = this.currentState;
      this.currentState = this.nextState;
      if (this.states[this.currentState].init) {
        this.states[this.currentState].init(from, that.currentState, that);
      }
    }
    this.publish(that.currentState, that);
    return this;
  };
  Player.prototype.update = function(event, info) {
    if (this.states[this.currentState].update) {
      var that = this;
      this.states[this.currentState].update(info, that);
    }
    this.transition();
  };
  Player.prototype.render = function(event, info) {
    if (this.states[this.currentState].render) {
      var that = this;
      this.context.save();
      this.states[this.currentState].render(info, that);
      this.context.restore();
    }
  };
  Player.prototype.states = {
    load: {
      init: function(from, to, player) {
        // load player initial position
        player.position.x = player.currentTile.landingPoint.x;
        player.position.y = player.currentTile.landingPoint.y;
        // load player img
        player.img = new Image();
        player.img.addEventListener("load", function() {
          player.nextState = 'standing';
          player.transition();
        });
        player.img.src = player.frame.src;
      },
      // update: function(attr, player) {},
      // render: function(attr, player) {},
      exit: function(from, to, player) {
        var that = this;
        player.subscriptions = [];
        player.subscriptions.push(player.game.on('update', function(e, info) {
          player.update(e, info);
        }));
        player.subscriptions.push(player.game.on('render', function(e, info) {
          player.render(e, info);
        }));
      }
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
          this.keys["k" + e.keyCode] = (e.type === "keydown");
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
        // set image frame x and y
      },
      update: function(attr, player) {
        // check collisions with monsters
        if (player.currentTile.hasMonster) {
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
        this.nextTile = player.currentTile.next(player.position.dirX, player.position.dirY);
        // start the counter
        this.counter = 0;
        // store initial position
        this.originX = player.x;
        this.originY = player.y;
        this.targetX = this.nextTile.landingPoint.x;
        this.targetY = this.nextTile.landingPoint.y;
        // set img frame x and y
      },
      update: function(attr, player) {
        // check if animation is over
        if (this.counter >= 100) {
          player.nextState = 'standing';
        } else {
          this.counter += 0.01;
          // update x position
          this.prevX = player.position.x;
          player.position.x = this.originX + (this.targetX - this.originX) * this.counter / 100;
          player.position.x = Math.floor(player.position.x);
          // update y position
          this.prevY = player.position.y;
          player.position.y = this.originY - 5 + (this.targetY - this.originY - 5) * this.counter / 100;
          player.position.y = Math.floor(player.position.y);
          player.nextState = 'jumping';
        }
      },
      render: function(attr, player) {
        var x = this.prevX + (player.position.x - this.prevX) * attr.lerp;
        x = Math.round(x) - player.w / 2;
        var y = this.prevY + (player.position.y - this.prevY) * attr.lerp;
        y = Math.round(y) - player.h;
        player.context.drawImage(
          player.img,
          player.frame.x,
          player.frame.y,
          player.frame.w,
          player.frame.h,
          x,
          y,
          player.w,
          player.h
        );
      },
      exit: function(from, to, player) {
        player.currentTile = this.nextTile;
      }
    },
    falling: {
      // animation counter
      counter: 0,
      init: function(from, to, player) {},
      update: function(attr, player) {
        console.log('AAAAAH');
        player.nextState = 'standing';
      },
      render: function(attr, player) {},
      exit: function(from, to, player) {}
    },
    dying: {
      init: function(from, to, player) {
        if (player.lives > 0) {
          player.lives -= 1;
        }
      },
      update: function(attr, player) {
        console.log('Aye', player.lives + ' lives left');
        player.nextState = 'standing';
      },
      // render: function(attr, player) {},
      exit: function(from, to, player) {}
    }
  };

  return function(game, context, firstTile) {
    return new Player(game, context, firstTile).transition();
  };
})();
