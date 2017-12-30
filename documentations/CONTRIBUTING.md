----

<p align="center" class="toc">
   <strong><a href="#setup">Setup</a></strong>
   |
   <strong><a href="#writing-tests">Writing tests</a></strong>
   |
   <strong><a href="#debugging-code">Debugging code</a></strong>
   |
   <strong><a href="#internals">Internals</a></strong>
</p>

----


# Contributing

Contributions are always welcome, no matter how large or small. Before
contributing, please read the
[code of conduct](https://github.com/nonalab/arbiter/blob/master/documentation/CODE_OF_CONDUCT.md).

## Not sure where to start?

- If you aren't just making a documentation change, you'll probably want to learn a bit about a few topics.

- Check out [`/documentations`](https://github.com/nonalab/arbiter/tree/master/documentations) for information about arbiter's internals

- When you feel ready to jump into the Arbiter source code, a good place to start is to look for issues tagged with [help wanted](https://github.com/nonalab/arbiter/labels/help%20wanted) and/or [good first issue](https://github.com/nonalab/arbiter/labels/good%20first%20issue).

## Developing

Arbiter is built for Node 9 and up.

Make sure that Yarn is installed with version >= `0.28.0`.
Installation instructions can be found here: https://yarnpkg.com/en/docs/install.

### Setup

```sh
$ git clone https://github.com/nonalab/arbiter
$ cd arbiter
$ lerna bootstrap
```

Then you can run:

```sh
$ lerna run build
$ lerna run start
```

### Writing tests

Most packages in [`/packages`](https://github.com/nonalab/arbiter/tree/master/packages) have a `test` folder.

Exchange plugin packages share a single test suit in [`/packages/arbiter-test`](https://github.com/nonalab/arbiter/tree/master/arbiter-test).

#### `arbiter-x-`

All the arbiter exchange plugins are written in a similar way.

### Debugging code

A common approach to debugging JavaScript code is to walk through the code using the [Chrome DevTools](https://developers.google.com/web/tools/chrome-devtools/) debugger.
