export default function createXFilter(xfilterNode) {
  return {
    filter(id, state) {
      const { transform } = xfilterNode.getState();
      const xfilters = transform[0].filter;
      const index = xfilters.findIndex(f => f.id === id);
      if (index !== -1) {
        xfilters[index] = {
          type: "filter",
          id: id,
          ...state
        };
      } else {
        xfilters.push({
          type: "filter",
          id: id,
          ...state
        });
      }
    },
    remove(id) {
      const { transform } = xfilterNode.getState();
      const xfilters = transform[0].filter;
      const index = xfilters.findIndex(f => f.id === id);
      xfilters.splice(index, 1);
    },
    filterAll() {
      xfilterNode.transform(() => []);
    }
  };
}
