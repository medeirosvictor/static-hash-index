import React, { useContext } from 'react'
import Table from "./Table"
import SearchForm from "./SearchForm"
import PageList from "./PageList"
import BucketList from "./BucketList"
import SimulationInfo from "./SimulationInfo"
import SimulationContext from './contexts/SimulationContext'
import { Redirect } from '@reach/router'

const Simulation = () => {
    const { state } = useContext(SimulationContext)
    const { isRunning } = state.meta

    if (!isRunning) {
        return (<Redirect to="/" noThrow/>)
      } else {
        return (
            <div className="simulation-content">
                <SimulationInfo />
                <SearchForm/>
                <div className="simulation-core">
                    <PageList />
                    <BucketList />
                </div>
            </div>
        )
      }
}

export default Simulation