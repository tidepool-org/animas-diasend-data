module.exports = function config (utils) {

  function parse (raw, callback) {
    var keys = [ 'bolusType', 'bolusVolume', 'duration', 'notes'
               , 'deviceTime', 'extendedVolume', 'immediateVolume' ];
    var selector = utils.selector('insulin', keys);
    var value = selector(raw);
    var data = {
      value: value.bolusVolume
    , duration: value.duration
    , bolus: parseFloat(value.bolusVolume)
    , type: 'insulin-use'
    , reason: value.bolusType
    , units: 'U'
    , extended: value.extendedVolume
    , immediate: value.immediateVolume
    , notes: value.notes
    , deviceTime: utils.reformatISO(value.deviceTime)
    };
    if (data.reason == 'Normal') {
      data = {
        deviceTime: data.deviceTime
      , value: data.value
      , type: 'bolus'
      , bolus: data.bolus
      , units: data.units
      };
    }
    return callback(null, data);
  }

  function isValid (data) {
    return (!isNaN(data.value) && !isNaN(data.bolus) && data.type && data.units);
  }

  var stream = utils.pipeline(utils.map(parse), utils.validator(isValid));
  var parser = { parse: parse, stream: stream };
  return parser;
}

