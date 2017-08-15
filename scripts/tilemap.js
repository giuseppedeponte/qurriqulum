'use strict';
// TILEMAP MODULE
helpers.createTilemap = (function() {
  // single tile constructor
  var Tile = function(id, x, y, s, baseColors, leftColor, rightColor, map) {
    this.id = id;
    this.x = x;
    this.y = y;
    this.s = s;
    this.baseColors = baseColors;
    this.leftColor = leftColor;
    this.rightColor = rightColor;
    this.map = map;
    this.val = 0;
    this.hasPlayer = false;
    this.hasMonster = false;
    this.landingPoint = {
      x: x,
      y: y - 1.5 * s
    };
  };
  Tile.prototype.blink = function(counter) {
    this.currentColor = this.currentColor === 0 ? this.currentColor = this.baseColors.length - 1 : this.currentColor = 0;
  };
  Tile.prototype.render = function(context) {
    var that = this;
    helpers.drawCube(context, that.x, that.y, that.s, that.s, that.s, that.baseColors[that.currentColor], that.leftColor, that.rightColor);
    return this;
  };
  Tile.prototype.value = function(value) {
    if (value) {
      this.val = value;
      this.currentColor = value;
    }
    return this.val;
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
    this.remainingTiles = 0;
    for (var y = 0; config.map[y]; y += 1) {
      var lX = config.oX - config.tileSize * y;
      var lY = config.oY + 1.5 * config.tileSize * y;
      this.tiles[y] = [];
      for (var x = 0; x < config.map[y].length; x += 1) {
        var cX = lX + config.tileSize * x;
        var cY = lY + 1.5 * config.tileSize * x;
        if (config.map[y][x] !== '') {
          this.remainingTiles += this.target - config.map[y][x];
          this.tiles[y][x] = new Tile(y + ',' + x, cX, cY, config.tileSize, config.colors.base, config.colors.left, config.colors.right, that);
          this.tiles[y][x].value(config.map[y][x]);
          this.tiles[y][x].currentColor = this.tiles[y][x].value();
        } else {
          this.tiles[y][x] = null;
        }
      }
    }
    this.totalTiles = this.remainingTiles;
  };
  Tilemap.prototype.init = function() {
    this.bindEvents();
    return this;
  };
  Tilemap.prototype.bindEvents = function() {
    var that = this;
    this.subscriptions = [];
    this.subscriptions.push(
      this.game.on('render', function(e, info) {
        that.render(e, info);
      })
    );
    this.subscriptions.push(
      this.game.on('monster.standing', function(e, monster) {
        var y, x;
        for (y = 0; y < that.tiles.length; y += 1) {
          for (x = 0; x < that.tiles[y].length; x += 1) {
            if (that.tiles[y][x]) {
              that.tiles[y][x].hasMonster = false;
            }
          }
        }
        monster.currentTile.hasMonster = true;
      })
    );
    this.subscriptions.push(
      this.game.on('player.standing', function(e, player) {
        var y, x;
        for (y = 0; y < that.tiles.length; y += 1) {
          for (x = 0; x < that.tiles[y].length; x += 1) {
            if (that.tiles[y][x]) {
              that.tiles[y][x].hasPlayer = false;
            }
          }
        }
        player.currentTile.hasPlayer = true;
        that.update(player.currentTile);
        player.score = (that.totalTiles - that.remainingTiles) * 100;
      })
    );
    return this;
  };
  Tilemap.prototype.unsubscribe = function() {
    var i;
    for (i=0; this.subscriptions[i]; i += 1) {
      this.subscriptions[i].remove();
    }
  };
  // method to update a tile
  Tilemap.prototype.update = function(tile) {
    var id = tile.id.split(',');
    var x = parseInt(id[1]);
    var y = parseInt(id[0]);
    if (this.tiles[y] && this.tiles[y][x].value() < this.target){
      this.tiles[y][x].value(this.tiles[y][x].value() + 1);
      this.remainingTiles -= 1;
    }
    return this;
  };
  // method to render the map
  Tilemap.prototype.render = function() {
    var x, y;
    if (this.isCompleted()) {
      this.blink();
    }
    var that = this;
    for (y = 0; y < this.tiles.length; y += 1) {
      for (x = 0; x < this.tiles[y].length; x += 1) {
        if (this.tiles[y][x]) {
         this.tiles[y][x].render(that.context);
        }
      }
    }
    return this;
  };
  Tilemap.prototype.isTile = function(y, x) {
    return (this.tiles[y] && this.tiles[y][x] !== null && this.tiles[y][x] !== undefined);
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
  Tilemap.prototype.getRandomTile = function() {
    var that = this;
    var y;
    var x;
    do {
      y = Math.round(Math.random() * (that.tiles.length - 2)) + 1;
      x = Math.round(Math.random() * (that.tiles[y].length - 2)) + 1;
    } while (!this.isTile(y, x));
    return this.tiles[y][x];
  };
  Tilemap.prototype.blink = function() {
    var that = this;
    var x, y;
    if (!this.counter) { this.counter = 0; }
    this.counter += 1;
    if (this.counter % 10 === 0) {
      for (y = 0; y < this.tiles.length; y += 1) {
        for (x = 0; x < this.tiles[y].length; x += 1) {
          if (this.tiles[y][x]) {
            this.tiles[y][x].blink(that.counter);
          }
        }
      }
    }
  };
  Tilemap.prototype.isCompleted = function() {
    return this.remainingTiles === 0 ? true : false;
  };
  return function(context, oX, oY, tileSize, map, colors, target) {
    return new Tilemap(context, oX, oY, tileSize, map, colors, target).init();
  };
}());
