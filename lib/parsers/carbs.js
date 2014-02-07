module.exports = function config (utils) {

  function parse (raw, callback) {
    var selector = utils.selector('insulin', 'deviceTime', 'carbs');
    var value = selector(raw);
    var data = {
      value: parseInt(value.carbs)
    , type: 'carbs'
    , units: 'grams'
    , deviceTime: utils.reformatISO(value.deviceTime)
    };
    return callback(null, data);
  }

  function isValid (data){
    return (!isNaN(data.value) && data.type && data.units);
  }

  var stream = utils.pipeline(utils.map(parse), utils.validator(isValid));
  var parser = { parse: parse, stream: stream };
  return parser;
}

