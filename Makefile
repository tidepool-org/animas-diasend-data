MOCHA=./node_modules/.bin/mocha
TESTS=tests/*.js

test:
	${MOCHA} -R tap ${TESTS}

BLANKET=--require blanket
travis-cov:
	NODE_ENV=test node_modules/.bin/mocha ${BLANKET} -R 'travis-cov' ${TESTS}

coveralls:
	NODE_ENV=test \
	./node_modules/.bin/mocha ${BLANKET} -R mocha-lcov-reporter \
     ${TESTS} | ./coverall.sh

coverhtml:
	./node_modules/.bin/mocha ${BLANKET} -R html-cov  ${TESTS} > test/coverage.html

precover:
	./node_modules/.bin/mocha ${BLANKET} ${SHOULD} -R html-cov ${TESTS} | w3m -T text/html

travis: test travis-cov coveralls coverhtml

