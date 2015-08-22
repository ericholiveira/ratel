composableFactory = require('./composableFactory')
module.exports={
  f : composableFactory(false),
  reverse : composableFactory(true)
  obj: (o,reverse=false)->
    res = {}
    method = composableFactory(reverse)
    for prop of o
      if typeof o[prop] == 'function'
        res[prop] = method(o[prop])
      else
        res[o[prop]] = o[prop]
    res

}
