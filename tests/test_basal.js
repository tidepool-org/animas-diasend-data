var should = require('should');
var es = require('event-stream');
var utils = require('../lib/utils');
describe('basal stream', function ( ) {
  before(function ( )  {
    this.parser = require('../lib/parsers/basal');
  });
  it('should require ok', function ( ) {
    this.parser.should.be.ok;
    this.parser.call.should.be.ok;
    this.parser(utils).stream.should.be.ok;
    this.parser(utils).stream.pipe.should.be.ok;
    this.parser(utils).stream.pipe.call.should.be.ok;
    this.parser(utils).parse.should.be.ok;
  });
  it('should parse some basal records', function (done) {
    var raw = [ 'Non data, non data'
              , 'xxxx,NOTDATA'
              , '23/11/2013 17:00,0.000,,,,,,,'
              , '23/11/2013 17:05,0.125,,,,,,,'
              , '23/11/2013 17:38,,,,,,,6,'
              , '23/11/2013 17:45,,,,,,,2,'

              ];
    es.pipeline(
        es.readArray(raw)
      , utils.split( )
      , this.parser(utils).stream
      , es.writeArray(finish));
    function finish (err, results) {
      results.length.should.equal(2);
      results[0].deviceTime.should.equal('2013-11-23T17:00:00');
      results[0].basal.should.equal(0.000);
      results[0].value.should.equal('0.000');
      results[1].deviceTime.should.equal('2013-11-23T17:05:00');
      results[1].basal.should.equal(0.125);
      results[1].value.should.equal('0.125');
      done( );
    }
  });
});
