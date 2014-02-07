
var X = require('xlsjs')
  , es = require('event-stream')
  ;

/**
 *
 */
function xls (opts) {
  var out = es.through( );
  var worker = es.through(workbooks);
  function incoming (err, results) {
    var all = Buffer.concat(results);
    var wb = X.read(all, {type: 'binary'});
    worker.write(wb);
  }

  function workbooks (wb) {
    this.emit('data', wb);
  }

  function csv (sheet, next) {
    var data = X.utils.make_csv(sheet, {FS: ',', RS: "\n"});
    data = data.split("\n");
    var name = sheet.name.replace(/ +/g, '-');
    var mediate = es.readArray(data);
    mediate.name = name;
    next(null, mediate);
  }

  es.pipeline(worker, sheets(opts), es.map(csv), out);

  var stream = es.duplex(es.writeArray(incoming), out);
  return stream;
}

function sheets (opts) {
  var out = es.through(writer);
  function writer (wb) {
    var names = es.readArray(wb.SheetNames);
    var self = this;
    function iter (name, next) {
      var sheet = wb.Sheets[name];
      sheet.name = name;
      self.emit('data', sheet);
      next(null, sheet);
    }
    es.pipeline(names, es.map(iter));
  }
  return out;
}

module.exports = xls;

