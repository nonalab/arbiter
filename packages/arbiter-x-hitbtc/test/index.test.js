import test from 'ava';

import {
	authListener,
	otherListener,
	tickerListener,
	orderListener,
	balanceListener,
	errorListener,
	taggedLog
} from 'arbiter-util';

import ArbiterExchange from '../src';

import creds from '../credentials.json';

const exchangeInstance = new ArbiterExchange()

test.before(async t => {
	exchangeInstance
		// .on('balance', balanceListener)
		// .on('other', otherListener)
		.on('error', () => {
			t.fail()
		})

	await exchangeInstance.open()
})

test.after(async t => {
	await exchangeInstance.close()
})


test('Subscribe to ticker', async t => {
	exchangeInstance.subscribeToTicker('ETHUSD')

	const ticker = await exchangeInstance.waitFor('ticker')

	t.is(ticker.symbol, 'ETHUSD')
});

test('Authenticate and get balance', async t => {
	await exchangeInstance.authenticate(creds)

	taggedLog('AUTH', 'SUCCESS')

	exchangeInstance.requestTradingBalance()

	await t.notThrows(exchangeInstance.waitFor('balance'));
});
