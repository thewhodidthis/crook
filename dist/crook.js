(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.Crook = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

function Crook(options) {
  var defaults = Object.create(Crook.defaults);

  // Store settings
  for (var key in defaults) {
    this[key] = (options && options[key]) || defaults[key];
  }
}

Crook.prototype = {
  constructor: Crook,

  that: function (source, lookup) {

    // TODO: Check type of args, allow images?
    var sourceData = source.getImageData(0, 0, source.canvas.width, source.canvas.height);
    var lookupData = lookup.getImageData(0, 0, lookup.canvas.width, lookup.canvas.height);

    return this._run(sourceData, lookupData);
  },

  _run: function (sourceData, lookupData) {

    // TODO: Check type of args?
    var sourcePixels = sourceData.data;
    var lookupPixels = lookupData.data;

    var targetBuffer = new ArrayBuffer(sourcePixels.length);
    var targetPixels = new Uint8ClampedArray(targetBuffer);

    var targetView32 = new Int32Array(targetBuffer);
    var sourceView32 = new Int32Array(sourcePixels.buffer);

    var lookupW = lookupData.width;
    var lookupH = lookupData.height;

    var lookupArea = lookupPixels.length * 0.25;

    for (var y = 0; y < lookupH; y += 1) {
      for (var x = 0; x < lookupW; x += 1) {
        var targetIdx = x + y * lookupW;
        var lookupIdx = targetIdx * 4;

        var sx = x + this.getShift(lookupPixels[lookupIdx + this.channel.x], this.scale.x);
        var sy = y + this.getShift(lookupPixels[lookupIdx + this.channel.y], this.scale.y);

        var sourceIdx = sx + sy * lookupW;

        if (sourceIdx < 0) {
          sourceIdx = sourceIdx + lookupArea;
        }

        if (sourceIdx > lookupArea) {
          sourceIdx = sourceIdx % lookupArea;
        }

        targetView32[targetIdx] = sourceView32[sourceIdx];
      }
    }

    return targetPixels;
  },

  getShift: function (color, scale) {
    var ratio = (color / 0xFF * 2) - 1;
    var shift = ratio * scale | 0;

    return shift;
  }
};

Crook.defaults = {

  // Which color channel to use for calculating displacement
  // 0: Red, 1: Green, 2: Blue, 3: Alpha
  channel: {
    x: 0,
    y: 0
  },

  // The multiplier to use for scaling the x and y displacement values from the lookup calculation
  scale: {
    x: 0,
    y: 0
  }
};

module.exports = Crook;

},{}]},{},[1])(1)
});