import React, { useContext } from 'react'
import SimulationContext from './contexts/SimulationContext'

const SimulationInfo = () => {
    const { state } = useContext(SimulationContext)

    return (
        <div className="simulation-info">
            <h3 className="simulation-info__title">
                Simulation Stats
                <span className="tooltip tooltip--light" data-tooltip="Summary statistics for the current simulation run. Overflow occurs when a bucket exceeds its capacity and chains to additional buckets.">ⓘ</span>
            </h3>
            <div>
                <span className="bold">Pages Amount: </span> {state.meta.pageAmount}
            </div>
            <div>
                <span className="bold">Page Size (in tuples): </span> {state.meta.pageSize}
            </div>
            <div>
                <span className="bold">Bucket Amount: </span> {state.meta.bucketAmount}
            </div>
            <div>
                <span className="bold">Bucket Size (in "hash" tuples): </span> {state.meta.bucketSize}
            </div>
            <div>
                <span className="bold">Hash Function: </span> {state.meta.hashFunction}
            </div>
            <div>
                <span className="bold">Overflow Rate: </span> {state.meta.overflowRate}%
            </div>
            <div>
                <span className="bold">Overflow Amount: </span> {state.meta.totalOverflowAmount}
            </div>
        </div>
    )
}

export default SimulationInfo
