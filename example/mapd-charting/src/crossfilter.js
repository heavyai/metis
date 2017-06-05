import {
  countDimensionNode,
  countGroupNode,
  crossfilter,
  pointmapNode,
  minMaxNode,
  timeDimensionNode
} from "./datagraph";

import { d3 } from "@mapd/mapdc";

export const countDimension = {
  sizeAsync() {
    return countDimensionNode.values().then(([{ records }]) => records);
  }
};

export const countGroup = {
  valueAsync() {
    return countGroupNode.values().then(([{ records }]) => {
      pointmapNode.transform(filter => {
        filter[6] = {
          type: "sample",
          method: "multiplicative",
          size: records,
          limit: 500000
        };
        return filter;
      });

      return records;
    });
  },
  getCrossfilterId() {
    return 2;
  }
};

export const pointmapGroup = {
  type: "group",
  writeTopQuery() {
    return pointmapNode.toSQL();
  },
  samplingRatio(a) {
    return;
  },
  getCrossfilterId() {
    return 2;
  },
  getProjectOn() {
    return [
      "conv_4326_900913_x(lon) as x",
      "conv_4326_900913_y(lat) as y",
      "lang as color",
      "followers as size"
    ];
  }
};

export const xDim = {
  value() {
    return ["lon"];
  },
  filter(range) {
    if (!crossfilter.getState().transform.length) {
      crossfilter.transform({
        type: "filter.range",
        field: "lon",
        range
      });
    } else {
      crossfilter.transform(filter => {
        filter[0] = {
          type: "filter.range",
          field: "lon",
          range
        };
        return filter;
      });
    }
  }
};

export const yDim = {
  value() {
    return ["lat"];
  },
  filter(range) {
    if (!crossfilter.getState().transform.length) {
      crossfilter.transform({
        type: "filter.range",
        field: "lat",
        range
      });
    } else {
      crossfilter.transform(filter => {
        filter[1] = {
          type: "filter.range",
          field: "lat",
          range
        };
        return filter;
      });
    }
  }
};

export const tweetTime = {
  toSQL() {
    return minMaxNode.toSQL();
  },
  minMax() {
    return minMaxNode
      .values()
      .then(([{ minimum, maximum }]) => [minimum, maximum]);
  }
};

export const lineDimension = {
  filter() {
    return;
  },
  filterMulti([[min, max]]) {
    crossfilter.transform(filter => {
      filter[2] = {
        type: "crossfilter",
        signal: "mapd",
        filter: [
          {
            type: "filter.range",
            id: "range",
            field: "tweet_time",
            range: [
              "TIMESTAMP(0) '" +
                min.toISOString().slice(0, 19).replace("T", " ") +
                "'",
              "TIMESTAMP(0) '" +
                max.toISOString().slice(0, 19).replace("T", " ") +
                "'"
            ]
          }
        ]
      };

      return filter;
    });
  },
  filterAll() {
    return;
  },
  value() {
    return ["tweet_time"];
  },
  binParams(a, b) {
    return [
      {
        extract: false,
        timeBin: "hour",
        numBins: 288,
        binBounds: []
      },
      null
    ];
  },
  all(callback) {
    timeDimensionNode.values().then(a => {
      callback(null, a);
    });
  }
};
