// TILEMAP MODULE
var createTilemap = (function() {
  // single tile constructor
  var Tile = function(id, x, y, s, color, leftColor, rightColor, map) {
    this.id = id;
    this.x = x;
    this.y = y;
    this.s = s;
    this.value = 0;
    this.color = color;
    this.leftColor = leftColor;
    this.rightColor = rightColor;
    this.map = map;
    this.hasPlayer = false;
    this.hasMonster = false;
    this.landingPoint = {
      x: x,
      y: y - 1.5 * s
    };
  };
  Tile.prototype.render = function(context) {
    var that = this;
    helpers.drawCube(context, that.x, that.y, that.s, that.s, that.s, that.color, that.leftColor, that.rightColor);
    return this;
  };
  Tile.prototype.value = function(value) {
    if (value) {
      this.value = value;
    }
    return this.value;
  };
  Tile.prototype.next = function(dirX, dirY) {
    var nextY = parseInt(this.id.split(',')[0]) + dirY;
    var nextX = parseInt(this.id.split(',')[1]) + dirX;
    return this.map.getTile(nextY + ',' + nextX);
  };
  // tilemap constructor
  var Tilemap = function(game, context, config) {
    var that = this;
    this.context = context;
    this.game = game;
    this.map = config.map;
    this.target = config.target || 1;
    this.colors = config.colors;
    this.tiles = [];
    for (var y = 0; config.map[y]; y += 1) {
      var lX = config.oX - config.tileSize * y;
      var lY = config.oY + 1.5 * config.tileSize * y;
      this.tiles[y] = [];
      for (var x = 0; x < config.map[y].length; x += 1) {
        var cX = lX + config.tileSize * x;
        var cY = lY + 1.5 * config.tileSize * x;
        if (config.map[y][x] === 0) {
          this.tiles[y][x] = new Tile(y + ',' + x, cX, cY, config.tileSize, config.colors.base, config.colors.left, config.colors.right, that);
        } else {
          this.tiles[y][x] = null;
        }
      }
    }
  };
  Tilemap.prototype.init = function() {
    this.bindEvents().render();
    return this;
  };
  Tilemap.prototype.bindEvents = function() {
    var that = this;
    this.game.on('render', that.render.bind(this));
    this.game.on('player.standing', function(e, player) {
      var y, x;
      for (y = 0; that.tiles[y]; y += 1) {
        for (x = 0; that.tiles[y][x]; x += 1) {
          that.tiles[y][x].hasPlayer = false;
        }
      }
      player.currentTile.hasPlayer = true;
      that.update(player.currentTile);
    });
    return this;
  };
  // method to update a tile
  Tilemap.prototype.update = function(tile) {
    var id = tile.id.split(',');
    var x = parseInt(id[1]);
    var y = parseInt(id[0]);
    if (this.map[y] && this.map[y][x] === 0 && this.map[y][x] < this.target){
      this.map[y][x] += 1;
      this.tiles[y][x].color = this.colors.target;
    }
    return this;
  };
  // method to render the map
  Tilemap.prototype.render = function() {
    if (this.isCompleted()) {
      this.blink();
    }
    var that = this;
    for (y = 0; this.tiles[y]; y += 1) {
      for (x = 0; this.tiles[y][x]; x += 1) {
         this.tiles[y][x].render(that.context);
      }
    }
    return this;
  };
  Tilemap.prototype.isTile = function(y, x) {
    return (this.tiles[y] !== undefined && this.tiles[y][x] !== null);
  };
  Tilemap.prototype.getTile = function(id, getXY) {
    var parsedId = id.split(',');
    var tileY = parseInt(parsedId[0]);
    var tileX = parseInt(parsedId[1]);
    return !this.isTile(tileY, tileX)
           ? null
           : getXY
             ? { y: tileY, x: tileX }
             : this.tiles[tileY][tileX];
  };
  Tilemap.prototype.blink = function() {
    if (!this.counter) { this.counter = 0; }
    this.counter += 1;
    if (this.counter % 10 === 0) {
      for (y = 0; this.tiles[y]; y += 1) {
        for (x = 0; x < this.tiles[y].length; x += 1) {
          if (this.tiles[y][x].color === this.colors.target) {
            this.tiles[y][x].color = this.colors.base;
          } else {
            this.tiles[y][x].color = this.colors.target;
          }
        }
      }
    }
  };
  Tilemap.prototype.isCompleted = function() {
    var y, x;
    for (y = 0; this.map[y]; y += 1) {
      for (x = 0; x < this.map[y].length; x += 1) {
        if (this.map[y][x] !== this.target) {
          return false;
        }
      }
    }
    return true;
  };
  return function(context, oX, oY, tileSize, map, colors, target) {
    return new Tilemap(context, oX, oY, tileSize, map, colors, target).init();
  };
}());
