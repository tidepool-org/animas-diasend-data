
var es = require('event-stream');
var columns = require('./columns');
var moment = require('moment');

function validator (valid) {
  function each (data, next) {
    if (valid(data)) {
      return next(null, data);
    }
    next( );
  }
  return es.map(each);
}
// XXX.TODO.bewest: The diasend upload/download can be sensitive to
// locale.  The locale selected by the diasend upload process controls
// the format here (not the timezone).
var INCOMING_DATE_FMT = 'DD/MM/YYYY';
var INCOMING_TIME_FMT = 'HH:mm:ss';
var INCOMING_DATETIME = INCOMING_DATE_FMT + ' ' + INCOMING_TIME_FMT;
var OUTGOING_DATE_FMT = 'YYYY-MM-DDTHH:mm:ss';
function reformatISO (str) {
  return moment(str, INCOMING_DATETIME).format(OUTGOING_DATE_FMT);
}

function validTime (str) {
  return moment(str, OUTGOING_DATE_FMT).isValid( );
}

function times (valid) {
  function withTime (data, next) {
    if (valid(data.time)) {
      return next(null, data);
    }
    next( );
  }
  return es.map(withTime);
}

function validTimes ( ) {
  return times(validTime);
}

function hasValue (data) {
  return (data.value !== null);
}
function validValues ( ) {
  function iter (data, next) {
    if (hasValue(data)) {
      return next(null, data);
    }
    next( );
  }
  return es.map(iter);
}


function fields (raw) {
  var fields = raw.split(',');
  return fields;
}

function responder (stream, filter) {
  var tr = es.through( );

  stream.on('type', function (data) {
    if (data.type.match(filter)) {
      return tr.push(data.data);
    }
  });
  return es.pipeline(stream, tr);
}

function split ( ) {
  function iter (data, next) {
    next(null, fields(data));
  }
  return es.map(iter);
}

function validate ( ) {
  return es.pipeline(validTimes( ), validValues( ));
}

var api = {
    selector: columns
  , validator: validator
  , map: es.map
  , pipeline: es.pipeline
  , validTimes: validTimes
  , reformatISO: reformatISO
  , split: split
  , validate: validate
  , responder: responder
};
module.exports = api;
