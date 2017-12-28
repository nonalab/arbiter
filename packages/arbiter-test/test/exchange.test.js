import ArbiterStore from 'arbiter-store';

const store = new ArbiterStore(['credential'])

const exchanges = [
    'hitbtc',
    // 'bitfinex'
]

const exchangeTests = [
    'auth',
    'order'
].map((macro) => getExchangeMacro(macro)
	.default
)

exchanges.map((exchange) => {
	const exchangeClass = getExchangeClass(exchange)
		.default

    exchangeTests.map((test) => test(exchange, new exchangeClass(), store))
})

function getExchangeClass(exchange) {
	return require(`arbiter-x-${exchange}`)
}

function getExchangeMacro(macro) {
	return require(`../src/exchange-macro/${macro}`)
}
