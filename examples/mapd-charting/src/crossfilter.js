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
  samplingRatio() {
    return;
  },
  getCrossfilterId() {
    return 2;
  },
  getProjectOn() {
    return [
      "conv_4326_900913_x(lon) AS x",
      "conv_4326_900913_y(lat) AS y",
      "lang AS color",
      "followers AS size"
    ];
  }
};

export const xDim = {
  value() {
    return ["lon"];
  },
  filter(range: Array<number>) {
    if (!crossfilter.getState().transform.length) {
      crossfilter.transform({
        type: "filter",
        id: "range",
        expr: {
          type: "between",
          field: "lon",
          left: range[0],
          right: range[1]
        }
      });
    } else {
      crossfilter.transform(filter => {
        filter[0] = {
          type: "filter",
          id: "range",
          expr: {
            type: "between",
            field: "lon",
            left: range[0],
            right: range[1]
          }
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
  filter(range: Array<number>) {
    if (!crossfilter.getState().transform.length) {
      crossfilter.transform({
        type: "filter",
        id: "range",
        expr: {
          type: "between",
          field: "lat",
          left: range[0],
          right: range[1]
        }
      });
    } else {
      crossfilter.transform(filter => {
        filter[1] = {
          type: "filter",
          id: "range",
          expr: {
            type: "between",
            field: "lat",
            left: range[0],
            right: range[1]
          }
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
  filterMulti([[min, max]]: [[Date, Date]]) {
    crossfilter.transform(filter => {
      filter[2] = {
        type: "crossfilter",
        signal: "mapd",
        filter: [
          {
            type: "filter",
            id: "range",
            expr: {
              type: "between",
              field: "tweet_time",
              left: "TIMESTAMP(0) '" +
                min.toISOString().slice(0, 19).replace("T", " ") +
                "'",
              right: "TIMESTAMP(0) '" +
                max.toISOString().slice(0, 19).replace("T", " ") +
                "'"
            }
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
  binParams() {
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
  all(callback: Function) {
    timeDimensionNode.values().then(a => {
      callback(null, a);
    });
  }
};
