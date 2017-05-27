import { xfilterDataNode } from "./datagraph";

export function filter(id, filter) {
  const { transform } = xfilterDataNode.getState();
  const xfilters = transform[0].filter;
  const index = xfilters.findIndex(f => f.id === id);

  if (index !== -1) {
    xfilters[index] = {
      type: "filter",
      id: id,
      ...filter
    };
  } else {
    xfilters.push({
      type: "filter",
      id: id,
      ...filter
    });
  }
}

function filterAll() {
  const { transform } = xfilterDataNode.getState();
  transform[0].filter = [];
}

export default {
  filter,
  filterAll
};
