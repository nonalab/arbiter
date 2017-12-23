import path from 'path';
import fs from 'fs-extra';

import {
	foreverProcess
} from './main';

import {
	wait,
	taggedLog
} from './utils';

import creds from '../credentials.json';

const UPDATE_INTERVAL = 500;

async function init() {
	console.log('INIT |||');
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
