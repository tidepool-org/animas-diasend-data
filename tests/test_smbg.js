var should = require('should');
var es = require('event-stream');
var utils = require('../lib/utils');
describe('smbg stream', function ( ) {
  before(function ( )  {
    this.parser = require('../lib/parsers/smbg');
  });
  it('should require ok', function ( ) {
    this.parser.should.be.ok;
    this.parser.call.should.be.ok;
    this.parser(utils).stream.should.be.ok;
    this.parser(utils).stream.pipe.should.be.ok;
    this.parser(utils).stream.pipe.call.should.be.ok;
    this.parser(utils).parse.should.be.ok;
  });
  it('should parse some smbg records', function (done) {
    var raw = [ 'Non data, non data'
              , 'xxxx,NOTDATA'
              , '05/11/2013 00:17,122'
              , '05/11/2013 03:59,308' ];
    es.pipeline(
        es.readArray(raw)
      , utils.split( )
      , this.parser(utils).stream
      , es.writeArray(finish));
    function finish (err, results) {
      results.length.should.equal(2);
      results[0].deviceTime.should.equal('2013-11-05T00:17:00');
      results[0].value.should.equal(122);
      results[1].deviceTime.should.equal('2013-11-05T03:59:00');
      results[1].value.should.equal(308);
      done( );
    }
  });
});
