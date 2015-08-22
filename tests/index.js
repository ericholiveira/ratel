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
