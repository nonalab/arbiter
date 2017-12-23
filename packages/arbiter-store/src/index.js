import path from 'path';
import fs from 'fs-extra';

export default class ArbiterStore {
	constructor(dbFiles = ['credential', 'pairs', 'price'], dbPath = '../db') {
		this.date = Date.now()

		this.path = {}

		dbFiles.map((file) => {
			this.path[file] = path.resolve(__dirname, `${dbPath}/${file}.json`)
		})

		this.dbFiles = dbFiles;
	}

	async init() {
		return Promise.all(this.dbFiles.map(async (file) => {
			this[file] = await fs.readJson(this.path[file])
		}))
	}

    // This log the data to the desired file
    async log(file) {
        return fs.writeJson(this.path[file], this[file], {spaces: 2})
    }

    // This cache the data into memory in a key/value fashion
    cacheKeyValue(file, key, value) {
        if (!this[file] || !this[file][key]) {
            return;
        }
        this[file][key] = value;
    }
}
