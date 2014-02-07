module.exports = function config (utils) {

  function parse (raw, callback) {
    var selector = utils.selector('smbg', 'deviceTime', 'value');
    var data = selector(raw);
    data.value = parseInt(data.value);
    data.type = 'smbg';
    data.units = 'mg/dl';
    data.deviceTime = utils.reformatISO(data.deviceTime);
    return callback(null, data);
  }

  function isValid (data) {
    if (!isNaN(data.value) && data.type == 'smbg') {
      return true;
    }
    return false;
  }

  var stream = utils.pipeline(utils.map(parse), utils.validator(isValid));
  var parser = { parse: parse, stream: stream };
  return parser;
}

