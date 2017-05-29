import { xfilterDataNode } from "./datagraph";

export function filter(id, filter) {
  const { transform } = xfilterDataNode.getState();
  const xfilters = transform[0].filter;
  const index = xfilters.findIndex(f => f.id === id);
  console.log(filter);
  if (index !== -1) {
    xfilters[index] = {
      id: id,
      ...filter
    };
  } else {
    xfilters.push({
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
