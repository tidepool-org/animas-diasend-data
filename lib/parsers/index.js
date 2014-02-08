
var types = ['basal', 'bolus', 'carbs', 'smbg'];

var utils = require('../utils');
var parsers = { };

function lookup (parser) {
  return parsers[parser] = require('./' + parser);
}
types.forEach(lookup);

function parser (opts) {
  var handler = parser.parsers[opts.parser](utils);
  return utils.pipeline(utils.split( ), handler.stream, utils.validate( ));
}
parser.parsers = parsers;
parser.types = types;
module.exports = parser;

