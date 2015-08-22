Composable = require('./composable')
composableFactory = (reverse)->
  (run,args...)-> resultFactory(new Composable(run,args,reverse))

resultFactory = (composable)->
  result = (args...)->
    if args and typeof args[0] == 'function' and args[0]._composable
      resultFactory(composable.compose(args[0]._composable))
    else
      result._composable.run(args)
  result._composable = composable
  result
module.exports = composableFactory
