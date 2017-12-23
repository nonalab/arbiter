import path from 'path';
import fs from 'fs-extra';

import {
	foreverProcess
} from './main';

import {
	wait,
	taggedLog
} from './utils';

import ArbiterExchangeBitFinex from 'arbiter-x-bitfinex';

import ArbiterExchangeHitBTC from 'arbiter-x-hitbtc';

import creds from '../credentials.json';

const dbPath = path.resolve(__dirname, '../db.json');

const UPDATE_INTERVAL = 500;

async function init() {
	console.log('INIT |||');
	const bitFinexInstance = new ArbiterExchangeBitFinex();
	const hitBTCInstance = new ArbiterExchangeHitBTC();

	const [data, ] = await Promise.all([
		fs.readJson(dbPath),
		bitFinexInstance.open(),
		hitBTCInstance.open()
	])

	hitBTCInstance.authenticate(creds.hitbtc);
	bitFinexInstance.authenticate(creds.bitfinex);

	data.watchingPairs.map((pair) => {
		hitBTCInstance.subscribeToTicker(pair)
		bitFinexInstance.subscribeToTicker(pair)
	});

	hitBTCInstance.on('ticker', (ticker) => tickerListener('HITBTC', ticker))
	bitFinexInstance.on('ticker', (ticker) => tickerListener('BITFIN', ticker))
}

async function update() {
	console.log('UPDATE >>>');
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
	symbol,
	time
}) {
	taggedLog(`TICKER - ${exchange} - ${symbol}`, `ASK: ${ask} - BID: ${bid} - TIME: ${time}`)
}
