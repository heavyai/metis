# sql-datagraph 

Declaratively build SQL data pipelines. Based on the [Vega Transform API](https://vega.github.io/vega/docs/transforms/).

# Installation

Using `npm`

```bash
npm install @heavyai/data-layer --save
```

Or using `yarn`

```bash
yarn add @heavyai/data-layer
```

One can then import it:

```js
import {createDataGraph} from "@heavyai/data-layer"
```

Or use the bundled version:

```html
<script src="/path/to/js/data-layer.min.js"></script>
```

# Development

To get started, first install the dependencies using the `yarn` command.

The `flow` type-checker tool is used in development and type declarations can be found in each file. Expression and transform types are declared in `src/types`.

# Prior Art
* [Vega Transform](https://vega.github.io/vega/docs/transforms/)
* [Vega Architecture](http://idl.cs.washington.edu/papers/reactive-vega-architecture/)
* [Calcite Relational Algebra](https://calcite.apache.org/docs/algebra.html)
* [Crossfilter API](https://github.com/square/crossfilter/wiki/API-Reference)

# License

This project is licensed under the [Apache License, Version 2.0](https://www.apache.org/licenses/LICENSE-2.0).
