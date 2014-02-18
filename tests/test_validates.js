var should = require('should');
var validators = require('tidepool-data-model');
var es = require('event-stream');
var utils = require('../lib/utils');

// sample carb fixture, they all look like this
var fixture = {
    name: 'carbs', parser: 'carbs', schema: 'carbs'
  , input: '08/11/2013 14:33,,,,,,,10,'
  , proof: function proof (err, results) {
      var result = results.pop( );
      result.errors.should.be.empty;
      console.log(result);
      var inst = result.instance;
      inst.should.be.ok;
      inst.deviceTime.should.equal('2013-11-08T14:33:00');
      inst.value.should.equal(10);
      inst.type.should.equal('carbs');
    }
};

var fixtures = [ fixture ];
// fixtures.push(fixture);
fixtures.forEach(testFixture);

function testFixture (fixture) {
  var desc = 'animas.parses.' + fixture.name;
  describe(desc, function ( ) {
    beforeEach(function ( ) {
      this.fixture = fixture;
      var anim = '../lib/parsers/' + this.fixture.parser;
      this.parser = require(anim)(utils).stream;
      this.validate = validators({schema: this.fixture.schema});
    });

    var specifically = fixture.description || "stream should emit valid elements";
    it(specifically, function (done) {
      var prove = this.fixture.proof;
      es.pipeline(es.readArray([this.fixture.input])
        , utils.split( )
        , this.parser, validators.stream(this.validate)
        , es.writeArray(proof))
        ;

      function proof (err, results) {
        prove(err, results);
        done( );
      }
    });
  });
}
