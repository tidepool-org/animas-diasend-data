module.exports = function config (utils) {

  function parse (raw, callback) {
    if (raw.slice(4).join('') != '') return callback( );
    var selector = utils.selector('insulin', 'deviceTime', 'basal');
    var value = selector(raw);
    var data = {
      value: value.basal
    , basal: parseFloat(value.basal)
    , type: 'basal-start'
    , units: 'U/h'
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

