function deepMerge(target, source) {
  const result = { ...target }
  for (const key of Object.keys(source)) {
    const srcVal = source[key]
    const tgtVal = target[key]
    if (
      srcVal && typeof srcVal === 'object' && !Array.isArray(srcVal) &&
      tgtVal && typeof tgtVal === 'object' && !Array.isArray(tgtVal)
    ) {
      result[key] = deepMerge(tgtVal, srcVal)
    } else {
      result[key] = srcVal
    }
  }
  return result
}

const simulationDataReducer = (state, action) => {
  switch (action.type) {
    case 'UPDATE_SIMDATA':
      return deepMerge(state, action.payload)
    default:
      return state
  }
}

export default simulationDataReducer
