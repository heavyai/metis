require("script-loader!mapbox-gl/dist/mapbox-gl.js");
require("script-loader!mapbox-gl/dist/mapboxgl-overrides.js");
require("mapbox-gl/dist/mapbox-gl.css");
require("@mapd/mapdc/mapdc.css");
require("./style/chart.css");

import { connect } from "./src/connector";
import {
  countDimension,
  countGroup,
  pointmapGroup,
  xDim,
  yDim
} from "./src/crossfilter";
import * as dc from "@mapd/mapdc";
const d3 = dc.d3;

function createCharts(crossFilter, con, tableName) {
  var w = document.documentElement.clientWidth - 30;
  var h =
    Math.max(document.documentElement.clientHeight, window.innerHeight || 0) -
    200;

  var dataCount = dc
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
  var pointMapChart = dc
    .rasterChart(parent, true)
    .con(con)
    .height(h / 1.5)
    .width(w)
    .mapUpdateInterval(750);
  // .mapStyle('json/dark-v8.json')
  var pointLayer = dc
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

  pointMapChart
    .pushLayer("points", pointLayer)
    .init()
    .then(chart => {
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

      /* Calling dc.renderAll() will render all of the charts we set up.  Any
              crossFilters applied by the user (via clicking the bar chart, scatter plot or dragging the time brush) will automagically call redraw on the charts without any intervention from us
            */
      dc.renderAllAsync();
      /*--------------------------RESIZE EVENT------------------------------*/
      /* Here we listen to any resizes of the main window.  On resize we resize the corresponding widgets and call dc.renderAll() to refresh everything */
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
        pointMapChart.width(w).height(h / 1.5).render();
        dc.redrawAllAsync();
      }
    })
    .catch(e => console.log(e));
}

function init() {
  connect().then(con => {
    createCharts({}, con, "tweets_nov_feb");
  });
}

document.addEventListener("DOMContentLoaded", init, false);

function mapApiLoaded() {
  globalGeocoder = new google.maps.Geocoder();
  geocoderObject.geocoder = globalGeocoder;
}
