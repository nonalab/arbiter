import ArbiterStore from 'arbiter-store';

const store = new ArbiterStore(['credential'])

const exchanges = [
    'hitbtc',
    // 'bitfinex'
]

const exchangeTests = [
    'auth',
    'order',
	// 'wallet'
].map(getExchangeMacro)

exchanges.map((exchange) => {
	const exchangeClass = getExchangeClass(exchange)

	exchangeTests.map((test) => test(exchange, new exchangeClass(), store))
})

function getExchangeClass(exchange) {
	const exchangeClass = require(`arbiter-x-${exchange}`)
	return exchangeClass.default
}

function getExchangeMacro(name) {
	const macro = require(`../src/exchange-macro/${name}`)
	return macro.default
}
