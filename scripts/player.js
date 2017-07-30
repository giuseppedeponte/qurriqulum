var player = (function() {
  var Player = function(context, map) {
    this.context = context;
    this.map = map;
    this.keys = {
      k37: false,
      k38: false,
      k39: false,
      k40: false
    };
    this.tile = map.tiles[0][0];
    this.isMoving = false;
    this.w = 50;
    this.h = 75;
    this.x = this.tile.landingPoint.x;
    this.y = this.tile.landingPoint.y;
  };
  Player.prototype.init = function() {
    this.img = new Image();
    this.img.addEventListener('load', function() {
      this.bindEvents().render();
    }.bind(this));
    this.img.src = 'file:///C:/Users/drventisette/qbert/img/player.png';
    return this;
  };
  Player.prototype.bindEvents = function() {
    var that = this;
    window.addEventListener('keydown', function(e) {
      e.preventDefault();
      if (that.keys.hasOwnProperty('k' + e.keyCode)) {
        that.keys['k' + e.keyCode] = true;
      }
    });
    window.addEventListener('keyup', function(e) {
      e.preventDefault();
      if (that.keys.hasOwnProperty('k' + e.keyCode)) {
        that.keys['k' + e.keyCode] = false;
      }
    });
    var animate = function(that, fps) {
      var start;
      var delta;
      var lerp = 0;
      var step = function(timestamp) {
        if (!start) { start = timestamp; }
        delta = Math.min(1000, timestamp - start);
        while (delta >= fps) {
          that.update();
          delta -= fps;
        }
        lerp = delta / fps;
        that.context.clearRect(0,0,600,600);
        that.map.render();
        that.render(lerp);
        window.requestAnimationFrame(step);
        start = timestamp;
      }
      window.requestAnimationFrame(step);
    };

    animate(this, 60/1000);

    // game.on('play.update') ==> this.update
    // game.on('play.render') ==> this.render
    return this;
  };
  Player.prototype.checkInput = function() {
    this.dirX = 0;
    this.dirY = 0;
    switch (true) {
      case this.keys.k37: {
        // LEFT
        this.dirX = -1;
        return true;
      }
      case this.keys.k38: {
        // UP
        this.dirY = -1;
        return true;
      }
      case this.keys.k39: {
        // RIGHT
        this.dirX = 1;
        return true;
      }
      case this.keys.k40: {
        // DOWN
        this.dirY = 1;
        return true;
      }
      default : {
        return false;
        break;
      }
    }
  };
  Player.prototype.jump = function() {
    if (this.counter >= 100) {
      this.x = this.target.x;
      this.y = this.target.y;
      this.isMoving = false;
      this.counter = 0;
      this.tile = this.nextTile;
      var t = this.map.getTile(this.tile.id, 'xy');
      this.map.update(t.y, t.x);
    } else {
      this.isMoving = true;
      this.counter += 0.01;
      this.prevX = this.x;
      this.x = this.origin.x + (this.target.x - this.origin.x) * this.counter / 100;
      this.x = Math.floor(this.x);
      this.prevY = this.y;
      this.y = this.origin.y - 5 + (this.target.y - this.origin.y - 5) * this.counter / 100;
      this.y = Math.floor(this.y);
    }
  };
  Player.prototype.changeTile = function() {
    var t = this.map.getTile(this.tile.id, 'xy');
    var nextTileX = t.x + this.dirX;
    var nextTileY = t.y + this.dirY;
    this.nextTile = this.map.getTile(nextTileY + ',' + nextTileX) || null;
    if (this.nextTile) {
      this.target = {
        x: this.nextTile.landingPoint.x,
        y: this.nextTile.landingPoint.y
      };
      this.origin = {
        x: this.tile.landingPoint.x,
        y: this.tile.landingPoint.y
      };
      this.counter = 0;
      this.isMoving = true;
    } else {
      this.isMoving = false;
    }
  };
  Player.prototype.update = function() {
    switch (true) {
      case (!this.isMoving): {
        if (this.checkInput()) {
          this.changeTile();
        }
        break;
      }
      case (this.isMoving): {
        this.jump();
        break;
      }
      /*
      case (this.target && this.x === this.target.x && this.y === this.target.y): {
        this.tile = this.nextTile;
        delete this.nextTile;
        delete this.target;
        this.isMoving = false;
      }
      */
    }
    return this;
  };
  var count = 0;
  var progress = 0;
  Player.prototype.render = function(lerp) {
    var x, y;
    x = this.isMoving
        ? Math.round(this.prevX + (this.x - this.prevX) * lerp)
        : this.x;
    y = this.isMoving
        ? Math.round(this.prevY + (this.y - this.prevY) * lerp)
        : this.y;
    x = x - this.w / 2;
    y = y - this.h;
    sx = this.isMoving
         ? this.dirX < 0 || this.dirY < 0
           ? 104.25
           : 104.25 * 2
         : 104.25 * 3;
    this.context.save();
    this.context.fillStyle = 'dodgerblue';
    // this.context.fillRect(x, y, this.w, this.h);
    this.context.drawImage(this.img, sx, 0, 104.25, 156, x, y, this.w, this.h);
    this.context.restore();
    return this;
  };
  return function(context, map) {
    return new Player(context, map).init();
  };
}());
