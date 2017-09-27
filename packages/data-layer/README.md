# sql-datagraph &middot; [![Build Status](https://travis-ci.com/mapd/mapd-data-layer.svg?token=PevoQNBcptry9Dnrqejy&branch=master)](https://travis-ci.com/mapd/mapd-data-layer) [![codecov](https://codecov.io/gh/mapd/mapd-data-layer/branch/master/graph/badge.svg?token=J68Anjg8je)](https://codecov.io/gh/mapd/mapd-data-layer)

* [**API Documentation**](docs/API.md)
* [**Crossfiltering Vega Example**](https://mapd.github.io/mapd-data-layer/example/vega)
* [**MapD Raster Chart Example**](https://mapd.github.io/mapd-data-layer/example/mapd-charting)

Declaratively build SQL data pipelines. Based on the [Vega Transform API](https://vega.github.io/vega/docs/transforms/).

# Installation

Using `npm`

```bash
npm install mapd-data-layer --save
```

Or using `yarn`

```bash
yarn add mapd-data-layer
```

One can then import it:

```js
import {createDataGraph} from "mapd-data-layer"
```

Or use the bundled version:

```html
<script src="/path/to/js/mapd-data-layer.min.js"></script>
```

# Development

To get started, first install the dependencies using the `yarn` command.

Each example folder also has its own set of dependencies, which can also be installed by using `yarn`. Running the `npm start` command in each example folder will start a `webpack-dev-server` serving that example.

The `flow` type-checker tool is used in development and type declarations can be found in each file. Expression and transform types are declared in `src/types`.

# Prior Art
* [Vega Transform](https://vega.github.io/vega/docs/transforms/)
* [Vega Architecture](http://idl.cs.washington.edu/papers/reactive-vega-architecture/)
* [Calcite Relational Algebra](https://calcite.apache.org/docs/algebra.html)
* [Crossfilter API](https://github.com/square/crossfilter/wiki/API-Reference)

# Contributing

In order to clarify the intellectual property license granted with Contributions from any person or entity, MapD must have a Contributor License Agreement ("CLA") on file that has been signed by each Contributor, indicating agreement to the [Contributor License Agreement](CLA.md). If you have not already done so, please complete and sign, then scan and email a pdf file of this Agreement to [contributors@mapd.com](mailto:contributors@mapd.com). Please read the agreement carefully before signing and keep a copy for your records.

# License

This project is licensed under the [Apache License, Version 2.0](https://www.apache.org/licenses/LICENSE-2.0).
