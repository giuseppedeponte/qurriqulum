// function to draw a cube
var helpers = {
  drawCube: function(c, x, y, wx, wy, h, color, leftColor, rightColor) {
    // left side
    c.save();
    c.beginPath();
    c.moveTo(x, y);
    c.lineTo(x - wx, y - wx * 0.5);
    c.lineTo(x - wx, y - h - wx * 0.5);
    c.lineTo(x, y - h * 1);
    c.closePath();
    c.fillStyle = leftColor;
    c.fill();
    // right side
    c.beginPath();
    c.moveTo(x, y);
    c.lineTo(x + wy, y - wy * 0.5);
    c.lineTo(x + wy, y - h - wy * 0.5);
    c.lineTo(x, y - h * 1);
    c.closePath();
    c.fillStyle = rightColor;
    c.fill();
    // top side
    c.beginPath();
    c.moveTo(x, y - h);
    c.lineTo(x - wx, y - h - wx * 0.5);
    c.lineTo(x - wx + wy, y - h - (wx * 0.5 + wy * 0.5));
    c.lineTo(x + wy, y - h - wy * 0.5);
    c.closePath();
    c.fillStyle = color;
    c.fill();
    c.restore();
  }
};
