import ArbiterExchangeBitFinex from 'arbiter-x-bitfinex';
import ArbiterExchangeHitBTC from 'arbiter-x-hitbtc';
import ArbiterStore from 'arbiter-store';

import {
	foreverProcess
} from './main';

import {
	wait,
	taggedLog
} from './utils';

const UPDATE_INTERVAL = 500;

const bitFinexInstance = new ArbiterExchangeBitFinex();
const hitBTCInstance = new ArbiterExchangeHitBTC();
const store = new ArbiterStore()

async function init() {
	console.log('Initializing ... ');

	await Promise.all([
		store.init(),
		bitFinexInstance.open(),
		hitBTCInstance.open()
	])

	hitBTCInstance.authenticate(store.credential.hitbtc);
	bitFinexInstance.authenticate(store.credential.bitfinex);

	store.pairs.map((pair) => {
		hitBTCInstance.subscribeToTicker(pair)
		bitFinexInstance.subscribeToTicker(pair)
	});

	hitBTCInstance.on('ticker', (ticker) => tickerListener('hitbtc', ticker))
	bitFinexInstance.on('ticker', (ticker) => tickerListener('bitfinex', ticker))

	console.log('Done! Program is running ... ');
}

async function update() {
	// console.log('UPDATE >>>');
	await store.log('price')
}

async function exit() {
	console.log('EXIT...');
}

foreverProcess({
	init,
	update,
	exit,
}, UPDATE_INTERVAL);

function tickerListener(exchange, {
	ask,
	bid,
	symbol
}) {
	// taggedLog(`TICKER - ${exchange} - ${symbol}`, `ASK: ${ask} - BID: ${bid} - TIME: ${timestamp}`)
	const currency = symbol.slice(0, -3);
	updatePrice(currency, exchange, ask, bid);
}

function updatePrice(currency, exchange, ask, bid) {
	if(!store.price[currency]) {
		store.price[currency] = {}
	}
	store.price[currency][exchange] = { ask, bid }
}
