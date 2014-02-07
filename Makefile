MOCHA=./node_modules/.bin/mocha
TESTS=tests/*.js

test:
	${MOCHA} -R tap ${TESTS}
