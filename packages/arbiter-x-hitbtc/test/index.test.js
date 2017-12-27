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

test('Subscribe to ticker', async t => {

	const exchangeInstance = new ArbiterExchange();

    exchangeInstance
		// .on('other', otherListener)
		.on('error', errorListener)

	try {
		await exchangeInstance.open()

		exchangeInstance.subscribeToTicker('ETHUSD')

        const ticker = await exchangeInstance.waitFor('ticker')

        t.is(ticker.symbol, 'ETHUSD')

        await exchangeInstance.close()

	} catch(e) {
		taggedLog('ERROR', e);
	}
});

test('Authenticate and get balance', async t => {

	const exchangeInstance = new ArbiterExchange();

	exchangeInstance
		// .on('other', otherListener)
		.on('error', errorListener)
        .on('balance', balanceListener)

	try {
		await exchangeInstance.open()

		await exchangeInstance.authenticate(creds)

		taggedLog('AUTH', 'SUCCESS')

		exchangeInstance.requestTradingBalance()

        await t.notThrows(exchangeInstance.waitFor('balance'));

        await exchangeInstance.close()
	} catch(e) {
		taggedLog('ERROR', e);
	}
});
