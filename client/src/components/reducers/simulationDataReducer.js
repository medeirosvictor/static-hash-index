import _ from 'lodash'

const simulationDataReducer = (state, action) => {
  switch (action.type) {
    case 'UPDATE_SIMDATA':
      return _.merge(state, action.payload)
    default:
      return state;
  }
};

export default simulationDataReducer