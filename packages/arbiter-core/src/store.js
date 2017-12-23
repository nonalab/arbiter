const store = {
	date : Date.now(),
	data : {}
};

export {
	buy, sell,
	getTargetCurrencyName,
	calculateUnitCost,
	calculatePairValue,
	getUSDFund,
	recalculateTotalUSD
}
