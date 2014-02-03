
var X = require('xlsjs')
  , es = require('event-stream')
  ;

function xls (opts) {
  var out = es.through( );
  var worker = es.through(workbooks);
  function incoming (err, results) {
    var all = Buffer.concat(results);
    var wb = X.read(all, {type: 'binary'});
    console.log(wb.SheetNames);
    worker.write(wb);
  }

  function workbooks (wb) {
    this.emit('data', wb);
  }

  function csv (sheet, next) {
    var data = X.utils.make_csv(sheet, {FS: ',', RS: "\n"});
    data = data.split("\n");
    var name = sheet.name.replace(' ', '-');
    console.log("CSV LEN", data.length);
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
      // console.log("SHEET", sheet);
      self.emit('data', sheet);
      next(null, sheet);
    }
    es.pipeline(names, es.map(iter));
  }
  return out;
}


if (!module.parent) {

  var fs = require('fs');
  var name = 'examples/anonymous-diasend.xls';
  var input = fs.createReadStream(name);

  var worker = input.pipe(xls( ));
  worker.pipe(es.map(function iter (csv, next) {
   csv.pipe(es.writeArray(function dump (err, results) {
    console.log("##", csv.name);
    console.log(results.join("\n"));
   }));

  }));

}
