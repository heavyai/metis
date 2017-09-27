export const getExtent = ({ values: { value } }, interval = 0) => {
  return value[0] ? value[0].intervals[interval].extent : null;
};
