export const getExtent = ({ values: { value } }, interval = 0) => {
  return value[0] ? value[0].intervals[interval].extent : null;
};

export const formatTime = d3.timeFormat("%Y-%m-%d %-I:%M:%S");

export const toVega = vlSpec => vega.parse(vl.compile(vlSpec).spec);

export const mergeSignals = view =>
  view.getState({
    signals: (signal, props) => {
      view._signals = Object.assign(view._signals, { [signal]: props });
    }
  });
