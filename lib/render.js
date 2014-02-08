
var es = require('event-stream');
var parsers = require('./parsers/');

function render (opts) {
  var incoming = es.through(writer);
  var out = es.through( );
  var refs = 0;

  function writer (data) {
    var redirect = null;
    var stream = null;
    if (data.name) {
      if (/insulin-use/gi.test(data.name)) {
        redirect = insulin;
      }
      if (/glucose/gi.test(data.name)) {
        redirect = glucose;
      }
      if (redirect) {
        data.on('end', function enders ( ) {
          refs++;
          if (refs == 2) {
            out.end( );
          }
        });
        es.pipeline(data, redirect( ), es.map(function iter (chunk, next) {
          out.write(chunk);
          next( );
        }));
      }
    }
  }

  return es.pipeline(incoming, out);;
}

function glucose ( ) {
  return parsers({parser: 'smbg'});
}

function insulin ( ) {
  var out = es.through( );
  var incoming = es.through(write);
  var types = ['basal', 'bolus', 'carbs'];
  types.forEach(function through (type) {
    var stream = parsers({parser:type});
    // incoming.pipe(stream);
    out[type] = stream;
    stream.pipe(es.through(function transfer (data) {
      out.emit('data', data);
    }));
  });
  function write (data) {
    types.forEach(function transfer (type) {
      out[type].write(data);
    });
  }
  return es.pipeline(incoming, out);
}

module.exports = render;
module.exports.glucose = glucose;
module.exports.insulin = insulin;

