(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function() {
  var Composable,
    __slice = [].slice;

  module.exports = Composable = (function() {
    function Composable(_run, _args, _reverse) {
      this._run = _run;
      this._args = _args != null ? _args : [];
      this._reverse = _reverse != null ? _reverse : false;
    }

    Composable.prototype.run = function(argsArray) {
      var allArgs;
      if (this._reverse) {
        argsArray = argsArray || [];
        allArgs = argsArray.concat(this._args);
      } else {
        allArgs = this._args.concat(argsArray);
      }
      return this._run.apply(this, allArgs);
    };

    Composable.prototype.compose = function(composable) {
      var _self;
      _self = this;
      return new Composable(function() {
        var args;
        args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
        return composable.run([_self.run(args)]);
      });
    };

    return Composable;

  })();

}).call(this);

//# sourceMappingURL=maps/composable.js.map

},{}],2:[function(require,module,exports){
(function() {
  var Composable, composableFactory, resultFactory,
    __slice = [].slice;

  Composable = require('./composable');

  composableFactory = function(reverse) {
    return function() {
      var args, run;
      run = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
      return resultFactory(new Composable(run, args, reverse));
    };
  };

  resultFactory = function(composable) {
    var result;
    result = function() {
      var args;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      if (args && typeof args[0] === 'function' && args[0]._composable) {
        return resultFactory(composable.compose(args[0]._composable));
      } else {
        return result._composable.run(args);
      }
    };
    result._composable = composable;
    return result;
  };

  module.exports = composableFactory;

}).call(this);

//# sourceMappingURL=maps/composableFactory.js.map

},{"./composable":1}],3:[function(require,module,exports){
(function() {
  var composableFactory;

  composableFactory = require('./composableFactory');

  module.exports = {
    f: composableFactory(false),
    reverse: composableFactory(true),
    obj: function(o, reverse) {
      var method, prop, res;
      if (reverse == null) {
        reverse = false;
      }
      res = {};
      method = composableFactory(reverse);
      for (prop in o) {
        if (typeof o[prop] === 'function') {
          res[prop] = method(o[prop]);
        } else {
          res[o[prop]] = o[prop];
        }
      }
      return res;
    }
  };

}).call(this);

//# sourceMappingURL=maps/index.js.map

},{"./composableFactory":2}],4:[function(require,module,exports){
var R = require('../compiled/index');

describe("A composableFunction", function() {
  it("must define default fields", function() {
    expect(R.f).toBeDefined();
    expect(R.reverse).toBeDefined();
    expect(R.obj).toBeDefined();
  });
  it("must be composable in regular order", function() {
    var sumNumbers = function(x,y){return x+y;};
    var add1 = R.f(sumNumbers,1);
    var squared = R.f(function(x){return x*x;});
    expect(sumNumbers(3,4)).toBe(7);
    expect(add1(1)).toBe(2);
    var squareOfNumberPlus1 = add1(squared);
    expect(add1(1)).toBe(2);
    expect(squareOfNumberPlus1(1)).toBe(4);
    expect(squareOfNumberPlus1(2)).toBe(9);

    var squareOfSum = R.f(sumNumbers)(squared);
    expect(squareOfSum(2,3)).toBe(25);
    expect(squareOfSum(add1)(2,3)).toBe(26);
  });
  it("must be composable in reverse order", function() {
    var sumNumbers = function(x,y){return x+y;};
    var add1 = R.reverse(sumNumbers,1);
    var squared = R.reverse(function(x){return x*x;});
    expect(add1(1)).toBe(2);
    var squareOfNumberPlus1 = add1(squared);
    expect(add1(1)).toBe(2);
    expect(squareOfNumberPlus1(1)).toBe(4);
    var subtract = function(a,b){return a-b;};
    expect(R.reverse(subtract,10)(0)).toBe(-10);
    expect(R.reverse(subtract)(10,0)).toBe(10);
    expect(R.f(subtract,10)(0)).toBe(10);
    expect(R.f(subtract)(10,0)).toBe(10);
  });
  it("must be composable in regular order", function() {
    var f = function(x){return x+2;};
    var g = function(x){return x*3;};
    var functions = {f:f,g:g};
    var functionsR = R.obj(functions);
    functionsR.fog = functionsR.f(functionsR.g);
    expect(functionsR.fog(2)).toBe(12);

    f = function(x,y){return x-y;};
    functions = {f:f,g:g};
    var functionsReverseR = R.obj(functions,true);
    functionsReverseR.fog = functionsReverseR.f(functionsReverseR.g);
    expect(functionsReverseR.fog(2,1)).toBe(3);

    //The functionsR must continue to work
    expect(functionsR.fog(2)).toBe(12);
  });
});

},{"../compiled/index":3}]},{},[4]);
