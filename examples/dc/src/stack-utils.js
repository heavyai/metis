export function multikey(x, y) {
  return x + "x" + y;
}

export function prepareDataForStack(data) {
  const dataMap = data.reduce((next, d) => {
    const x = d.key0;
    if (d.key1 === "other") {
      // noop
    } else if (next.hasOwnProperty(x)) {
      next[x][d.key1] = d.val;
    } else {
      next[x] = { [d.key1]: d.val };
    }
    return next;
  }, {});

  return Object.keys(dataMap).map(key => ({
    key: parseInt(key),
    value: dataMap[key]
  }));
}

export function prepareStack(chart, layerName, data, index) {
  const params = [
    { all: () => data },
    layerName,
    a => a.value[layerName]
  ]
  if (index === 0) {
    chart.group(...params)
  } else {
    chart.stack(...params)
  }
}

export function fadeDeselectedAreaOverride () {
  var bars = this.chart.chartBodyG().selectAll("rect.bar");
  if (this.chart.hasFilter()) {
    bars.classed(dc.constants.SELECTED_CLASS, d => {
      return this.chart.hasFilter(multikey(d.x, d.layer));
    });
    bars.classed(dc.constants.DESELECTED_CLASS, d => {
      return !this.chart.hasFilter(multikey(d.x, d.layer));
    });
  } else {
    bars.classed(dc.constants.SELECTED_CLASS, false);
    bars.classed(dc.constants.DESELECTED_CLASS, false);
  }
}

export function handleBarSelection (chart) {
  chart
    .selectAll("rect.bar")
    .classed("stack-deselected", function(d) {
      var key = multikey(d.x, d.layer);
      return chart.filter() && chart.filters().indexOf(key) === -1;
    })
    .on("click", function(d) {
      chart.filter(multikey(d.x, d.layer));
      chart.fadeDeselectedArea();
    });
}
