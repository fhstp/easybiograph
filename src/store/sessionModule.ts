export interface SessionState {
  highlightedDimensionId: number;
}

export function initSessionState(): SessionState {
  return {
    highlightedDimensionId: -1,
  };
}

export const sessionModule = {
  namespaced: true,
  state: initSessionState(),
  // getters,
  mutations: {
    highlightDimension(state: SessionState, dimensionId: number): void {
      state.highlightedDimensionId = dimensionId;
    },
  },
};
