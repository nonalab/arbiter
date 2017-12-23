"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
var store = {
	date: Date.now(),
	data: {}
};

exports.buy = buy;
exports.sell = sell;
exports.getTargetCurrencyName = getTargetCurrencyName;
exports.calculateUnitCost = calculateUnitCost;
exports.calculatePairValue = calculatePairValue;
exports.getUSDFund = getUSDFund;
exports.recalculateTotalUSD = recalculateTotalUSD;