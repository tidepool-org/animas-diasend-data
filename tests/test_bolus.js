var should = require('should');
var es = require('event-stream');
var utils = require('../lib/utils');
describe('bolus stream', function ( ) {
  before(function ( )  {
    this.parser = require('../lib/parsers/bolus');
  });
  it('should require ok', function ( ) {
    this.parser.should.be.ok;
    this.parser.call.should.be.ok;
    this.parser(utils).stream.should.be.ok;
    this.parser(utils).stream.pipe.should.be.ok;
    this.parser(utils).stream.pipe.call.should.be.ok;
    this.parser(utils).parse.should.be.ok;
  });
  it('should parse some bolus records', function (done) {
    var raw = [ 'Non data, non data'
              , 'xxxx,NOTDATA'
              , '05/11/2013 03:19,0.100,,,,,,,'
              , '05/11/2013 04:00,,Normal,0.400,,,,,'
              , '05/11/2013 04:01,0.125,,,,,,,'
              , '05/11/2013 06:01,0.150,,,,,,,'
              , '05/11/2013 07:44,,,,,,,12,'
              , '05/11/2013 07:44,,Combination,0.900,,,60,,Combination unknown'
              ];
    es.pipeline(
        es.readArray(raw)
      , utils.split( )
      , this.parser(utils).stream
      , es.writeArray(finish));
    function finish (err, results) {
      (err == null).should.be.ok;
      results.length.should.equal(2);
      results[0].deviceTime.should.equal('2013-11-05T04:00:00');
      results[0].bolus.should.equal(0.400);
      results[0].value.should.equal('0.400');
      results[0].type.should.equal('bolus');
      results[1].deviceTime.should.equal('2013-11-05T07:44:00');
      results[1].bolus.should.equal(0.900);
      results[1].value.should.equal('0.900');
      results[1].extended.should.equal('');
      results[1].immediate.should.equal('');
      results[1].reason.should.equal('Combination');
      results[1].duration.should.equal('60');
      results[1].type.should.equal('insulin-use');
      results[1].notes.should.equal('Combination unknown');
      done( );
    }
  });
});
