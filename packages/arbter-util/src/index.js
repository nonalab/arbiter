import crypto from 'crypto'

export async function wait(duration) {
	return new Promise(function (resolve, reject) {
		setTimeout(() => {
			resolve();
		}, duration);
	});
}

export function taggedLog(tag, info) {
	console.log(` --- --- --- --- ${tag} --- --- --- --- ----`);
	console.log(info);
}

export async function generateOrderId(size = 16) {
	return new Promise(function (resolve, reject) {
		crypto.randomBytes(size, (err, buf) => {
			if(err) reject(err);
			resolve(buf.toString('hex'));
		});
	});
}

export function makeEnum(array) {
	return array.reduce((p,c)=> {
		p[c] = c
		return p
	}, {})
};

export function tickerListener(ticker) {
	taggedLog(`TICKER - ${ticker.symbol}`, ticker.toString())
}

export function orderListener(order) {
	taggedLog(`ORDER - ${order.side} - ${order.symbol}`, order.toString())
}

export function authListener(respJSON) {
	taggedLog(`AUTH`, respJSON)
}

export function otherListener(respJSON) {
	taggedLog(`OTHER`, respJSON)
}

export function balanceListener(data) {
	taggedLog(`BALANCE`, data)
}

export function errorListener(data) {
	taggedLog(`ERROR`, data)
}
