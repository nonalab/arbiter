<p align="center">
  <a href="https://github.com/nonalab/arbiter/">
    <img alt="arbiter" src="https://github.com/nonalab/arbiter/blob/master/icon.png" width="234">
  </a>
</p>

<h1 align="center">
    Arbiter
</h1>

<h2 align="center">
    Open Source Crypto Arbitrage Platform
</h2>

# Goal

Arbiter aims to become a fully autonomous trading software. Internally, it implements a plugin system for each exchange that exposes a standard API for BUY, SELL and WITHDRAW crypto currency. This allows the core module to interact with each exchange using the same API invocation.

# Setup

The following prerequiste must be met:
- yarn@latest
- node@9
- lerna@latest

```sh
$ git clone https://github.com/nonalab/arbiter
$ cd arbiter
$ lerna bootstrap
```

Afterward, setup your credential in the `arbiter-store` module. First duplicate `dbz` into `db` directory inside `arbiter-store`, then fill out your API keys in `db/credentials`.

Then you can run:

```sh
$ lerna run build
$ lerna run start
```

# Notes

- As of 2017-12-30T12:40:04.120Z, arbiter is **NOT FUNCTIONAL** and thus **NOT PROFITABLE**. It will only update price ticker into the store. The reason being BitFinex requires `email` verification upon withdrawal.

- As of 2017-12-30T12:39:56.697Z, the bot has 2 functional exchange module, one for HitBTC and one for BitFinex. However, extending the bot to support more exchange should be trivial. Please make a PR if you do!

- Due to high traffic, BitFinex will reverse-throttle withdrawal. E.g, minimum withdrawal is $250.

- Most design question should have an answer in the rfcs  `documentations/rfcs`. Please submit an issue if you think a specification is missing.

- This project was initialized in 7 days between Dec 22 2017 and Dec 30 2017 by Joe Johans. (Commit `d1f855b8040d209e4c25e3e9efdb9b0f2dea7529` -> `eeea5a2343f6d2cb72e36734f3a5c7a935af98f5`). Please submit an issue if you spotted any piece of cancerous code. Jojo is human after all..

- Experiment with Arbiter **AT YOUR OWN RISK**. And please help improve it by submitting issue or pull request!

# Donation

If this project helped you somehow, or you are feeling generous, the nonalab appreciate your donation:

- XRB: xrb_1gc4hgszsjxrx5psudu5yy45ow43fnjkk1c9i9bm9nte8o4dsb3ysxnwm8yp

- LSK: 920007581698311528L

- ETH: 0x12e176325f73A15523F5a0ac7B86317b0d2CA2Df

- ZEC: zc9xYTCnts9BbdTvQAG5b6d95XEpdnNK4KSBc2TEio5mzCkos5BWDKTiAGqFCX5LRZivesNo9hzg9JRajntsMgBffMpFo6d

All donation will be used to fund upcoming decentralized project running on top of the donated token network.

# License

Arbiter is licensed under a [MIT License](https://github.com/nonalab/arbiter/tree/master/LICENSE)
