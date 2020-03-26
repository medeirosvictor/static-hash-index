import React, { useReducer } from 'react';
import { Router } from "@reach/router"
import './static/css/index.css';
import InitForm from './components/InitForm'
import Simulation from './components/Simulation'
import SimulationContext from './components/contexts/SimulationContext'
import InitState from './components/helpers/InitState'
import simulationDataReducer from './components/reducers/simulationDataReducer'

function App() {
    const [state, dispatch] = useReducer(simulationDataReducer, InitState)

    return (
      <SimulationContext.Provider value={{state, dispatch}}>
        <div className="App">
            <h1 className="header">
                Static Index Hash Simulator
            </h1>
            <Router>
                <InitForm path="/" />
                <Simulation path="/simulation"/>
            </Router>
        </div>
      </SimulationContext.Provider>
    );
}

export default App;
