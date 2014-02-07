var should = require('should');
var es = require('event-stream');
var utils = require('../lib/utils');
describe('carbs stream', function ( ) {
  before(function ( )  {
    this.parser = require('../lib/parsers/carbs');
  });
  it('should require ok', function ( ) {
    this.parser.should.be.ok;
    this.parser.call.should.be.ok;
    this.parser(utils).stream.should.be.ok;
    this.parser(utils).stream.pipe.should.be.ok;
    this.parser(utils).stream.pipe.call.should.be.ok;
    this.parser(utils).parse.should.be.ok;
  });
  it('should parse some carbs records', function (done) {
    var raw = [ 'Non data, non data'
              , 'xxxx,NOTDATA'
              , '08/11/2013 14:33,10'
              , '08/11/2013 14:49,6'
              , '08/11/2013 14:33,,,,,,,10,'
              , '08/11/2013 14:33,,Normal,0.600,,,,,'
              , '08/11/2013 14:49,,,,,,,6,'
              , '08/11/2013 14:49,,Normal,0.350,,,,,'
              ];
    es.pipeline(
        es.readArray(raw)
      , utils.split( )
      , this.parser(utils).stream
      , es.writeArray(finish));
    function finish (err, results) {
      results.length.should.equal(2);
      results[0].deviceTime.should.equal('2013-11-08T14:33:00');
      results[0].value.should.equal(10);
      results[1].deviceTime.should.equal('2013-11-08T14:49:00');
      results[1].value.should.equal(6);
      done( );
    }
  });
});
