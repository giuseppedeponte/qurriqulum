'use strict';
// FACTORY FUNCTION FOR THE GAME PLAYER
HELPERS.createPlayer = (function() {
  var Player = function(game, context, config, firstTile) {
    this.game = game;
    this.context = context;
    this.img = null;
    this.sfx = [
      'bouncee',
      'die',
      'resume',
      'scream',
      'win'
    ];
    this.lives = 5;
    this.score = 0;
    this.firstTile = firstTile;
    this.currentTile = firstTile;
    Player.prototype.events = {
      load: [],
      standing: [],
      jumping: [],
      hit: [],
      falling: [],
      resuming: [],
      dying: []
    };
    this.position = {
      x: 0,
      y: 0,
      dirX: 0,
      dirY: 0
    };
    this.w = 50;
    this.h = 75;
    this.frame = {
      src: './img/player.png',
      sourceWidth: 417,
      sourceHeight: 156,
      x: 0,
      y: 0,
      w: 104.25,
      h: 156
    };
    this.currentState = '';
    this.nextState = 'load';
  };
  // PUB/SUB MECHANISM
  Player.prototype.on = function(event, listener) {
    var i = this.events[event].push(listener) - 1;
    var that = this;
    return {
      remove: function() {
        delete that.events[event][i];
      }
    };
  };
  Player.prototype.publish = function(event, info) {
    var i;
    info = info != undefined ? info : {};
    for (i = 0; this.events[event][i]; i += 1) {
      this.events[event][i]('player.' + event, info);
    }
  };
  Player.prototype.unsubscribe = function() {
    var i;
    for (i=0; this.subscriptions[i]; i += 1) {
      this.subscriptions[i].remove();
    }
  };
  // STATE MACHINE MECHANISM
  Player.prototype.transition = function() {
    var that = this;
    var from;
    if (this.nextState !== this.currentState) {
      if (this.states[this.currentState]
        && this.states[this.currentState].exit) {
        this.states[this.currentState]
            .exit(that.currentState, that.nextState, that);
      }
      from = this.currentState;
      this.currentState = this.nextState;
      if (this.states[this.currentState].init) {
        this.states[this.currentState].init(from, that.currentState, that);
      }
      this.publish(that.currentState, that);
    }
    return this;
  };
  Player.prototype.update = function(event, info) {
    var that;
    if (this.states[this.currentState].update) {
      that = this;
      this.states[this.currentState].update(info, that);
    }
    this.transition();
  };
  Player.prototype.render = function(event, info) {
    var that;
    if (this.states[this.currentState].render) {
      that = this;
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
        // load sounds
        HELPERS.loadSounds(player.sfx, function(result) {
          player.sfx = result;
        });
        // load player img
        player.img = new Image();
        player.img.addEventListener('load', function() {
          player.nextState = 'standing';
          player.transition();
        }, false);
        player.img.src = player.frame.src;
      },
      exit: function(from, to, player) {
        player.subscriptions = [];
        player.subscriptions.push(player.game.on('update', function(e, info) {
          player.update(e, info);
        }));
        player.subscriptions.push(player.game.on('render', function(e, info) {
          player.render(e, info);
        }));
      }
    },
    // the player stands on a cube, waiting for user input to move
    standing: {
      keys: {
        k37: false, // left
        k38: false, // up
        k39: false, // right
        k40: false // down
      },
      toggleKey: function(e) {
        e.preventDefault();
        if (this.keys.hasOwnProperty('k' + e.keyCode)) {
          this.keys['k' + e.keyCode] = (e.type === 'keydown') ? true : false;
        }
      },
      parseKeys: function() {
        var direction = {
          x: 0,
          y: 0
        };
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
            direction.y = 1;
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
        this.counter = 0;
        window.addEventListener('keydown', that.toggleKey.bind(that), false);
        window.addEventListener('keyup', that.toggleKey.bind(that), false);
        // set image frame x and y
        player.frame.x = 3 * player.frame.w;
        player.frame.y = 0;
        // set player position
        player.position.x = player.currentTile.landingPoint.x;
        player.position.y = player.currentTile.landingPoint.y;
      },
      update: function(attr, player) {
        var dir;
        if (this.counter <= 100) {
          this.counter += 0.02;
          return;
        }
        // check collisions with monsters
        if (player.currentTile.hasMonster) {
          player.nextState = 'hit';
          return;
        }
        // check input
        dir = this.parseKeys();
        if (dir.x || dir.y) {
          // update direction
          player.position.dirX = dir.x;
          player.position.dirY = dir.y;
          // check if next position is a tile or not
          if (player.currentTile.next(dir.x, dir.y)) {
            player.nextState = 'jumping';
          } else {
            player.nextState = 'falling';
          }
        } else {
          player.nextState = 'standing';
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
        window.removeEventListener('keyup', that.toggleKey.bind(that));
        window.removeEventListener('keydown', that.toggleKey.bind(that));
      }
    },
    // the player move from a cube to another
    jumping: {
      // animation counter
      counter: 0,
      init: function(from, to, player) {
        // get next tile reference
        this.nextTile = player.currentTile.next(player.position.dirX,
                                                player.position.dirY);
        // start the counter
        this.counter = 0;
        // store initial position
        this.originX = player.position.x;
        this.originY = player.position.y;
        this.targetX = this.nextTile.landingPoint.x;
        this.targetY = this.nextTile.landingPoint.y;
        // set img frame x and y
        player.frame.x = 2 * player.frame.w;
      },
      update: function(attr, player) {
        // check if animation is over
        if (this.counter >= 100) {
          // jumping sound
          player.sfx.bouncee.play();
          player.nextState = 'standing';
        } else {
          this.counter += 0.005;
          // update x position
          this.prevX = player.position.x;
          player.position.x = this.originX
                              + (this.targetX - this.originX)
                              * this.counter / 100;
          player.position.x = Math.floor(player.position.x);
          // update y position
          this.prevY = player.position.y;
          player.position.y = this.originY - 7
                              + (this.targetY - this.originY - 7)
                              * this.counter / 100;
          player.position.y = Math.floor(player.position.y);
          player.nextState = 'jumping';
        }
      },
      render: function(attr, player) {
        var x = this.prevX + (player.position.x - this.prevX) * attr.lerp;
        x = Math.round(x) - player.w / 2;
        var y = this.prevY + (player.position.y - this.prevY) * attr.lerp;
        y = Math.round(y) - player.h;
        player.frame.x = player.position.dirX < 0 || player.position.dirY < 0
                         ? this.counter < 80
                            ? player.frame.w
                            : 0
                         : this.counter < 80 ?
                            2 * player.frame.w
                            : 3 * player.frame.w;
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
    // the player is hit by an enemy
    hit: {
      init: function(from, to, player) {
        if (player.lives > 0) {
          player.lives -= 1;
        }
        this.counter = 0;
        player.frame.x = 3 * player.frame.w;
        player.frame.y = 0;
        // scream
        player.sfx.scream.play();
      },
      update: function(attr, player) {
        if (this.counter > 50000) {
          if (player.lives > 0) {
            player.lives -= 1;
            player.nextState = 'resuming';
          } else {
            player.nextState = 'dying';
          }
        } else {
          this.counter += 1;
          player.nextState = 'hit';
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
        HELPERS.drawBubble(player.position.x - player.w / 2,
                          player.position.y - player.h,
                          player);
      },
      exit: function(from, to, player) {
        player.currentTile = player.firstTile;
      }
    },
    // the player falls off the map
    falling: {
      // animation counter
      counter: 0,
      init: function(from, to, player) {
        // start the counter
        this.counter = 0;
        // store initial position
        this.originX = player.position.x;
        this.originY = player.position.y;
        if (player.position.dirX === -1 || player.position.dirY === -1) {
          this.targetY = player.position.y - 300;
        } else {
          this.targetY = player.position.y + 300;
        }
        if (player.position.dirX === -1 || player.position.dirY === 1) {
          this.targetX = player.position.x - 300;
        } else {
          this.targetX = player.position.x + 300;
        }
        // set img frame x and y
        player.frame.x = 2 * player.frame.w;
        // scream !
        player.sfx.scream.play();
      },
      update: function(attr, player) {
        // check if animation is over
        if (this.counter > 1500) {
          if (player.lives > 0) {
            player.lives -= 1;
            player.nextState = 'resuming';
          } else {
            player.nextState = 'dying';
          }
        } else {
          this.counter += 0.01;
          // update x position
          this.prevX = player.position.x;
          player.position.x = this.originX
                              + (this.targetX - this.originX)
                              * this.counter / 1000;
          player.position.x = Math.floor(player.position.x);
          // update y position
          this.prevY = player.position.y;
          player.position.y = this.originY - 7
                              + (this.targetY + this.counter - this.originY - 7)
                              * this.counter / 1000;
          player.position.y = Math.floor(player.position.y);
          player.nextState = 'falling';
        }
      },
      render: function(attr, player) {
        var x = this.prevX + (player.position.x - this.prevX) * attr.lerp;
        x = Math.round(x) - player.w / 2;
        var y = this.prevY + (player.position.y - this.prevY) * attr.lerp;
        y = Math.round(y) - player.h;
        player.frame.x = player.position.dirX < 0 || player.position.dirY < 0
                         ? player.frame.w
                         : 2 * player.frame.w;
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
        HELPERS.drawBubble(x, y, player);
      },
      exit: function(from, to, player) {
        player.position.x = player.currentTile.landingPoint.x;
        player.position.y = player.currentTile.landingPoint.y;
      }
    },
    // the player resuscitate after a hit or a fall
    resuming: {
      init: function(from, to, player) {
        // start the counter
        this.counter = 0;
        // set player position
        player.position.x = player.currentTile.landingPoint.x;
        player.position.y = player.currentTile.landingPoint.y;
                // set img frame x and y
        player.frame.x = 3 * player.frame.w;
        this.show = true;
        // resuming sound
        player.sfx.resume.play();
      },
      update: function(attr, player) {
        if (this.counter < 50000) {
          this.counter = parseInt(this.counter);
          this.counter += 1;
          player.position.x = player.currentTile.landingPoint.x;
          this.prevX = player.currentTile.landingPoint.x;
          player.position.y = player.currentTile.landingPoint.y;
          this.prevY = player.currentTile.landingPoint.y;
          if (this.counter % 5000 === 0) {
            this.show = !this.show;
          }
          player.nextState = 'resuming';
        } else {
          player.nextState = 'standing';
        }
      },
      render: function(attr, player) {
        var x = player.position.x - player.w / 2;
        var y = player.position.y - player.h;
        if (!this.show) {
          return;
        }
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

      }
    },
    // the player has no more lives
    dying: {
      init: function(from, to, player) {},
      update: function(attr, player) {
        player.lives = 5;
        player.nextState = 'standing';
      },
      // render: function(attr, player) {},
      exit: function(from, to, player) {}
    }
  };

  return function(game, context, config, firstTile) {
    return new Player(game, context, config, firstTile).transition();
  };
})();
