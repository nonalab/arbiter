import ArbiterExchangeBitFinex from 'arbiter-x-bitfinex';
import ArbiterExchangeHitBTC from 'arbiter-x-hitbtc';
import ArbiterStore from 'arbiter-store';

import {
	taggedLog
} from 'arbiter-utils';

import {
	foreverProcess
} from './main';

const UPDATE_INTERVAL = 900;

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
	updatePrice(symbol, exchange, ask, bid);
}

function updatePrice(symbol, exchange, ask, bid) {
	if(!store.price[symbol]) {
		store.price[symbol] = {
			ask: {},
			bid: {}
		}
	}
	store.price[symbol].ask[exchange] = ask;

	store.price[symbol].bid[exchange] = bid;
}
