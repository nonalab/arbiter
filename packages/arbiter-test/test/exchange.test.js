import {
	getExchangeClass,
	getExchangeMacro
} from '../src/util';

import ArbiterStore from 'arbiter-store';

const store = new ArbiterStore(['credential'])

const exchanges = [
    // 'hitbtc',
    'bitfinex'
]

const exchangeTests = [
    // 'auth',
    'order',
	// 'wallet'
].map(getExchangeMacro)

exchanges.map((exchange) => {
	const exchangeClass = getExchangeClass(exchange)

	exchangeTests.map((test) => test(exchange, new exchangeClass(), store))
})
