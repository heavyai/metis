require("script-loader!mapbox-gl/dist/mapbox-gl.js");
require("script-loader!mapbox-gl/dist/mapboxgl-overrides.js");
require("mapbox-gl/dist/mapbox-gl.css");
require("@heavyai/charting/charting.css");
require("@heavyai/charting/scss/chart.scss");

import { connect } from "./src/connector";
import {
  countDimension,
  countGroup,
  pointmapGroup,
  xDim,
  yDim,
  tweetTime,
  lineDimension
} from "./src/crossfilter";
import _ from "lodash";
import * as hc from "@heavyai/charting";
const d3 = hc.d3;

function createCharts(crossFilter, con, tableName) {
  var w = document.documentElement.clientWidth - 30;
  var h =
    Math.max(document.documentElement.clientHeight, window.innerHeight || 0) -
    200;

  var dataCount = hc
    .countWidget(".data-count")
    .dimension(countDimension)
    .group(countGroup);

  var langDomain = [
    "en",
    "pt",
    "es",
    "in",
    "und",
    "ja",
    "tr",
    "fr",
    "tl",
    "ru",
    "ar",
    "th",
    "it",
    "nl",
    "sv",
    "ht",
    "de",
    "et",
    "pl",
    "sl",
    "ko",
    "fi",
    "lv",
    "sk",
    "uk",
    "da",
    "zh",
    "ro",
    "no",
    "cy",
    "iw",
    "hu",
    "bg",
    "lt",
    "bs",
    "vi",
    "el",
    "is",
    "hi",
    "hr",
    "fa",
    "ur",
    "ne",
    "ta",
    "sr",
    "bn",
    "si",
    "ml",
    "hy",
    "lo",
    "iu",
    "ka",
    "ps",
    "te",
    "pa",
    "am",
    "kn",
    "chr",
    "my",
    "gu",
    "ckb",
    "km",
    "ug",
    "sd",
    "bo",
    "dv"
  ];
  var langOriginColors = [
    "#27aeef",
    "#ea5545",
    "#87bc45",
    "#b33dc6",
    "#f46a9b",
    "#ede15b",
    "#bdcf32",
    "#ef9b20",
    "#4db6ac",
    "#edbf33",
    "#7c4dff"
  ];
  var langColors = [];
  var pointMapDim = pointmapGroup;
  var parent = document.getElementById("chart1-example");

  mapLangColors(40);

  var sizeScale = d3.scale.linear().domain([0, 5000]).range([2, 12]);
  var pointMapChart = hc
    .rasterChart(parent, true)
    .con(con)
    .height(h / 1.5)
    .width(w)
    .mapUpdateInterval(750);
  // .mapStyle('json/dark-v8.json')
  var pointLayer = hc
    .rasterLayer("points")
    .dimension(pointMapDim)
    .group(pointMapDim)
    .cap(500000)
    .sampling(true)
    .sizeAttr("size")
    .dynamicSize(
      d3.scale.sqrt().domain([20000, 0]).range([1.0, 7.0]).clamp(true)
    )
    .sizeScale(sizeScale)
    .xAttr("x")
    .yAttr("y")
    .xDim(xDim)
    .yDim(yDim)
    .fillColorAttr("color")
    .defaultFillColor("#80DEEA")
    .fillColorScale(d3.scale.ordinal().domain(langDomain).range(langColors))
    .popupColumns([
      "tweet_text",
      "sender_name",
      "tweet_time",
      "lang",
      "origin",
      "followers"
    ]);

  function mapLangColors(n) {
    langDomain = langDomain.slice(0, n);
    for (var i = 0; i < langDomain.length; i++) {
      langColors.push(langOriginColors[i % langOriginColors.length]);
    }
  }

  pointMapChart.pushLayer("points", pointLayer).init().then(chart => {
    // custom click handler with just event data (no network calls)
    pointMapChart.map().on("mouseup", logClick);
    function logClick(result) {
      console.log("clicked!", result);
    }
    // disable with pointMapChart.map().off('mouseup', logClick)
    // custom click handler with event and nearest row data
    pointMapChart.map().on("mouseup", logClickWithData);
    function logClickWithData(event) {
      pointMapChart.getClosestResult(event.point, function(result) {
        console.log(result && result.row_set[0]);
      });
    }
    // hover effect with popup
    var debouncedPopup = _.debounce(displayPopupWithData, 250);
    pointMapChart.map().on("mousewheel", pointMapChart.hidePopup);
    pointMapChart.map().on("mousemove", pointMapChart.hidePopup);
    pointMapChart.map().on("mousemove", debouncedPopup);
    function displayPopupWithData(event) {
      pointMapChart.getClosestResult(event.point, pointMapChart.displayPopup);
    }

    return tweetTime.minMax().then(function(timeChartBounds) {
      var hcTimeChart = hc
        .lineChart(".chart2-example")
        .width(w)
        .height(h / 2.5)
        .elasticY(true)
        .renderHorizontalGridLines(true)
        .brushOn(true)
        .xAxisLabel("Time of Day")
        .yAxisLabel("Number of Tweets")
        .dimension(lineDimension)
        .group(lineDimension);

      hcTimeChart.binParams({
        extract: false,
        timeBin: "hour",
        numBins: 288, // 288 * 5 = number of minutes in a day
        binBounds: [timeChartBounds[0], timeChartBounds[1]]
      });

      hcTimeChart
        .x(d3.time.scale.utc().domain([timeChartBounds[0], timeChartBounds[1]]))
        .yAxis()
        .ticks(5);
      hcTimeChart
        .xAxis()
        .scale(hcTimeChart.x())
        .tickFormat(hc.utils.customTimeFormat)
        .orient("top");

      hc.renderAllAsync();

      window.addEventListener("resize", _.debounce(reSizeAll, 500));
      function reSizeAll() {
        var w = document.documentElement.clientWidth - 30;
        var h =
          Math.max(
            document.documentElement.clientHeight,
            window.innerHeight || 0
          ) - 200;
        pointMapChart.map().resize();
        pointMapChart.isNodeAnimate = false;
        pointMapChart.width(w).height(h / 1.5);
        hcTimeChart.width(w).height(h / 2.5);
        hc.redrawAllAsync();
      }
    });
  });
}

function init() {
  connect().then(con => {
    createCharts({}, con, "tweets_nov_feb");
  });
}

document.addEventListener("DOMContentLoaded", init, false);
