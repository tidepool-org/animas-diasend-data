var request = require('request'),
  moment = require('moment'),
  es = require('event-stream'),
  config = require('../package.json').config
  ;

function download (opts) {
  var pool = { };
  var request = require('request').defaults(defaultOptions(pool));
  var jar = request.jar( );
  var out = es.through( );

  function login (elem, next) {
    var o = {jar: jar, form: {user: opts.username, passwd: opts.password}};
    request.post(config.login, o).pipe(es.writeArray(next));
  }

  function view (last, next) {
    var m = moment();
    var qs = { period: 'arbitrary', endtime: m.format('YYYY-MM-DD'),
      starttime: m.subtract('days', opts.days || 14).format('YYYY-MM-DD'),
    };
    
    var o = {jar: jar, qs: qs};
    request.get(config.view, o).pipe(es.writeArray(next));
  }

  function xls (err, results) {
    var o = {jar: jar};
    request.get(config.xls, o).pipe(out);
  }
  var stream = es.pipeline(es.readArray([ opts ]), es.map(login), es.map(view), es.writeArray(xls));
  return out;
}

function defaultOptions (pool) {
  return { jar: true, pool: pool, followRedirect: false };
}
module.exports = download;
module.exports.defaultOptions = defaultOptions;

