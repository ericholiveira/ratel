module.exports = class Composable
  constructor:(@_run,@_args=[],@_reverse=false)->
  run:(argsArray)->
    if @_reverse
      argsArray = argsArray or []
      allArgs = argsArray.concat(@_args)
    else
      allArgs = @_args.concat(argsArray)
    @_run.apply(@,allArgs)
  compose:(composable)->
    _self = @
    new Composable((args...)->composable.run([_self.run(args)]))
