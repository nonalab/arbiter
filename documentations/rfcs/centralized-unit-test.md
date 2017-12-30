# Centralized Test

Most of the test, especially for the exchange modules, are condensed into the `arbiter-test` module. The reason being, in order to test that each and every exchange module has the same API, they should pass the same test suite, using the same API call.

At the moment, hitbtc and bitfinex passes most of the test.
