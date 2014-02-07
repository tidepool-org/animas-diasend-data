
var cols = {
    insulin: {
      deviceTime: 0
    , basal: 1
    , bolusType: 2
    , bolusVolume: 3
    , immediateVolume: 4
    , extendedVolume: 5
    , duration: 6
    , carbs: 7
    , notes: 8
    }
  , smbg: {
      deviceTime: 0
    , value: 1
    }
  , settings: { }
};

function selector (type, fields) {
  var named = cols[type];
  if (!Array.isArray(fields)) {
    fields = Array.prototype.slice.apply(arguments, [1]);
  }
  function get (key) {
    return named[key];
  }
  function select (from) {
    var out = { };
    fields.forEach(function iter (key) {
      out[key] = from[get(key)];
    });
    return out;
  }
  select.columns = named;
  select.col_for = get;
  return select;
}

module.exports = selector;
module.exports.raw = cols;
