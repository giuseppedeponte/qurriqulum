// FACTORY FUNCTION FOR THE GAME monster
var createMonster = (function() {
  var Monster = function(game, context, config, firstTile) {
    this.game = game;
    this.context = context;
    this.img = null;
    this.currentTile = firstTile;
    Monster.prototype.events = {
      load: [],
      standing: [],
      jumping: []
    };
    this.frame = {
      src: './img/' + config.imgSrc,
      sourceWidth: 417,
      sourceHeight: 156,
      x: 0,
      y: 0,
      w: 104.25,
      h: 156
    };
  };
  // common props and methods
  Monster.prototype.position = {
    x: 0,
    y: 0,
    dirX: 0,
    dirY: 0
  };
  Monster.prototype.w = 50;
  Monster.prototype.h = 75;
  // PUB/SUB MECHANISM
  Monster.prototype.on = function(event, listener) {
    var i = this.events[event].push(listener) - 1;
    var that = this;
    return {
      remove: function() {
        delete that.events[event][i];
      }
    };
  };
  Monster.prototype.publish = function(event, info) {
    info = info != undefined ? info : {};
    for (var i = 0; this.events[event][i]; i += 1) {
      this.events[event][i]('monster.' + event, info);
    }
  };
  Monster.prototype.unsubscribe = function(){
    var i;
    for (i=0; this.subscriptions[i]; i += 1) {
      this.subscriptions[i].remove();
    }
  };
  // STATE MACHINE MECHANISM
  Monster.prototype.currentState = '';
  Monster.prototype.nextState = 'load';
  Monster.prototype.transition = function() {
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
      this.publish(that.currentState, that);
    }
    return this;
  };
  Monster.prototype.update = function(event, info) {
    if (this.states[this.currentState].update) {
      var that = this;
      this.states[this.currentState].update(info, that);
    }
    this.transition();
  };
  Monster.prototype.render = function(event, info) {
    if (this.states[this.currentState].render) {
      var that = this;
      this.context.save();
      this.states[this.currentState].render(info, that);
      this.context.restore();
    }
  };
  Monster.prototype.states = {
    load: {
      init: function(from, to, monster) {
        // load monster initial position
        monster.position.x = monster.currentTile.landingPoint.x;
        monster.position.y = monster.currentTile.landingPoint.y;
        // load monster img
        monster.img = new Image();
        monster.img.addEventListener('load', function() {
          monster.nextState = 'standing';
          monster.transition();
        });
        monster.img.src = monster.frame.src;
      },
      // update: function(attr, monster) {},
      // render: function(attr, monster) {},
      exit: function(from, to, monster) {
        var that = this;
        monster.subscriptions = [];
        monster.subscriptions.push(monster.game.on('update', function(e, info) {
          monster.update(e, info);
        }));
        monster.subscriptions.push(monster.game.on('render', function(e, info) {
          monster.render(e, info);
        }));
      }
    },
    standing: {
      init: function(from, to, monster) {
        var that = this;
        this.counter = 0;
        // set image frame x and y
        monster.frame.x = 3 * monster.frame.w;
        monster.frame.y = 0;
        // set position
        monster.position.x = monster.currentTile.landingPoint.x;
        monster.position.y = monster.currentTile.landingPoint.y;
      },
      randomDirection: function() {
        var dir = {x: 0, y: 0};
        var xOrY = Math.round(Math.random()) === 0 ? 'x' : 'y';
        dir[xOrY] = Math.round(Math.random()) === 0 ? 1 : -1;
        return dir;
      },
      update: function(attr, monster) {
        if (this.counter <= 100) {
          this.counter += 0.02;
          return;
        }
        // get random direction
        var dir = this.randomDirection();
        monster.position.dirX = dir.x;
        monster.position.dirY = dir.y;
        // check if next position is a tile or not
        if (monster.currentTile.next(dir.x, dir.y)) {
          monster.nextState = 'jumping';
        } else {
          monster.nextState = 'standing';
        }
      },
      render: function(attr, monster) {
        monster.context.drawImage(
          monster.img,
          monster.frame.x,
          monster.frame.y,
          monster.frame.w,
          monster.frame.h,
          monster.position.x - monster.w / 2,
          monster.position.y - monster.h,
          monster.w,
          monster.h
        );
      },
      exit: function(from, to, monster) {
      }
    },
    jumping: {
      // animation counter
      counter: 0,
      init: function(from, to, monster) {
        // get next tile reference
        this.nextTile = monster.currentTile.next(monster.position.dirX, monster.position.dirY);
        // start the counter
        this.counter = 0;
        // store initial position
        this.originX = monster.position.x;
        this.originY = monster.position.y;
        this.targetX = this.nextTile.landingPoint.x;
        this.targetY = this.nextTile.landingPoint.y;
        // set img frame x and y
        monster.frame.x = 2 * monster.frame.w;
      },
      update: function(attr, monster) {
        // check if animation is over
        if (this.counter >= 100) {
          monster.nextState = 'standing';
        } else {
          this.counter += 0.003;
          // update x position
          this.prevX = monster.position.x;
          monster.position.x = this.originX + (this.targetX - this.originX) * this.counter / 100;
          monster.position.x = Math.floor(monster.position.x);
          // update y position
          this.prevY = monster.position.y;
          monster.position.y = this.originY - 7 + (this.targetY - this.originY - 7) * this.counter / 100;
          monster.position.y = Math.floor(monster.position.y);
          monster.nextState = 'jumping';
        }
      },
      render: function(attr, monster) {
        var x = this.prevX + (monster.position.x - this.prevX) * attr.lerp;
        x = Math.round(x) - monster.w / 2;
        var y = this.prevY + (monster.position.y - this.prevY) * attr.lerp;
        y = Math.round(y) - monster.h;
        monster.frame.x = monster.position.dirX < 0 || monster.position.dirY < 0
                         ? this.counter < 80
                            ? monster.frame.w
                            : 0
                         : this.counter < 80 ?
                            2 * monster.frame.w
                            : 3 * monster.frame.w;
        monster.context.drawImage(
          monster.img,
          monster.frame.x,
          monster.frame.y,
          monster.frame.w,
          monster.frame.h,
          x,
          y,
          monster.w,
          monster.h
        );
      },
      exit: function(from, to, monster) {
        monster.currentTile = this.nextTile;
        monster.position.x = monster.currentTile.landingPoint.x;
        monster.position.y = monster.currentTile.landingPoint.y;
      }
    }
  };

  return function(game, context, config, firstTile) {
    return new Monster(game, context, config, firstTile).transition();
  };
})();
