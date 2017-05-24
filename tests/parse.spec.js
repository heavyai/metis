import tape from "tape"
import parse, {
  aggregate,
  bin,
  collect,
  filter,
  formula,
  sample
} from "../src/sql/parse-transform"


tape("aggregate", assert => {
  assert.plan(3)
  assert.deepEqual(aggregate({
    select: [],
    groupby: [],
  }, {
    type: "aggregate",
    fields: "key0",
    ops: "count",
    groupby: "key0",
  }), {
    select: ["COUNT(key0)"],
    groupby: ["key0"],
  })
  assert.deepEqual(aggregate({
    select: [],
    groupby: []
  }, {
    type: "aggregate",
    fields: ["airtime", "depdelay"],
    ops: ["average", "count"],
    as: ["val", "color"],
    groupby: ["key0", "val"],
  }), {
    select: ["AVG(airtime) as val", "COUNT(depdelay) as color"],
    groupby: ["key0", "val"]
  })
  assert.deepEqual(aggregate({
    select: [],
    groupby: []
  }, {
    type: "aggregate",
    fields: ["airtime", "depdelay"],
    ops: ["sum", "min"],
  }), {
    select: ["SUM(airtime)", "MIN(depdelay)"],
    groupby: []
  })
})

tape("bin", assert => {
  assert.plan(1)
  assert.deepEqual(bin({
    select: [],
    from: "",
    where: [],
    groupby: [],
    having: []
  }, {
    type: "bin",
    field: "airtime",
    as: "key0",
    extent: [0, 1350],
    maxbins: 12,
  }), {
    select: ["cast((cast(airtime as float) - 0) * 0.008888888888888889 as int) as key0"],
    from: "",
    where: ["((airtime >= 0 AND airtime <= 1350) OR (airtime IS NULL))"],
    groupby: [],
    having: ["(key0 >= 0 AND key0 < 12 OR key0 IS NULL)"],
  })
})

tape("collect", assert => {
  assert.plan(4)
  assert.deepEqual(collect({
    orderby: [],
  }, {
    type: "collect",
    sort: { field: "amount", order: "ascending"},
  }), {
    orderby: ["amount ASC"],
  })
  assert.deepEqual(collect({
    orderby: [],
  }, {
    type: "collect",
    sort: { field: "amount"},
  }), {
    orderby: ["amount"]
  })
  assert.deepEqual(collect({
    orderby: [],
  }, {
    type: "collect",
    sort: { field: ["amount", "key0"], order: ["descending", "descending"]},
  }), {
    orderby: ["amount DESC", "key0 DESC"],
  })
  assert.deepEqual(collect({
    limit: "",
    offset: ""
  }, {
    type: "collect",
    limit: { row: 1000, offset: 10 },
  }), {
    limit: "1000",
    offset: "10"
  })
})
