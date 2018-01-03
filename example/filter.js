var crook = (function () {
'use strict';

// Three ways of handling excess
var clamp = function (v, max) { return (v >= max ? max - 1 : Math.max(v, 0)); };
var pleat = function (v, max) { return (v >= max || v < 0 ? v + (max * Math.sign(v)) : v); };
var skirt = function (v, max) { return (v >= max || v < 0 ? NaN : v); };

// Color shift above and below gray
var shift = function (color, scale) {
  var ratio = scale * (color - 128) / 256;

  return Math.sign(ratio) * Math.round(Math.abs(ratio))
};

// Set up with number of splits (resolution),
// get a lambda for processing each data frame in return
var crook = function (ref) {
  if ( ref === void 0 ) ref = {};
  var channel = ref.channel; if ( channel === void 0 ) channel = { x: 0, y: 0 };
  var scale = ref.scale; if ( scale === void 0 ) scale = channel;
  var mode = ref.mode; if ( mode === void 0 ) mode = 0;

  // Wrap how?
  var round = mode ? mode === 1 ? clamp : pleat : skirt;

  // Expects and returns an `ImageData` like object
  return function (source, lookup) {
    if ( source === void 0 ) source = { data: [], width: 0, height: 0 };
    if ( lookup === void 0 ) lookup = source;

    var target = new Int32Array(source.data.buffer);
    var mirror = new Int32Array(target);

    // Extract color map dimensions
    var w = lookup.width;
    var h = lookup.height;

    for (var i = 0, stop = w * h; i < stop; i += 1) {
      // In steps of four - r/g/b/a
      var j = i * 4;

      // Horizontal
      var x = i % w;

      // Vertical
      var y = Math.floor(i / w);

      // Process coords
      var x1 = x + shift(lookup.data[j + channel.x], scale.x);
      var y1 = y + shift(lookup.data[j + channel.y], scale.y);

      var x2 = round(x1, w);
      var y2 = round(y1, h);

      // Color map index
      var k = x2 + (y2 * w);

      // Replace input data with color map data or a blank pixel
      target[i] = k >= 0 ? mirror[k] : [0, 0, 0, 255];
    }

    return source
  }
};

return crook;

}());

