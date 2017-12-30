# Model

A model defines a base class so that model consumer can guarantee the desired property exist. The model implement a basic constructor with some helper method.

For each module, if the constructor differ, then they can simply implement their own version of the model extended from the original model. This allows the code that uses the model to be the same across module.

E.g, the code to parse a Ticker from HitBTC is:

```js
    new Ticker(data)
```

and BitFinex:

```js
    new Ticker(pair, data)
```

The different is very subtle, allowing for easier implementation of new exchange.
