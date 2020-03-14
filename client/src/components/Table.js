import React, { useContext } from 'react'
import SimulationContext from './contexts/SimulationContext'

const Table = () => {
    const { state } = useContext(SimulationContext)
    const table = state.table

    const rows = table.content.map((row, index) => {
        const { id, word } = row

        return (
            <div className="table-row" key={index}>
                <div className="table-cell">
                    {id}
                </div>
                <div className="table-cell">
                    {word}
                </div>
            </div>
        )
    })


    return (
        <div className={state.meta.isRunning ? "table-container" : "hidden"}>
            <div className="table-header bold">
                <div className="table-cell">
                    id
                </div>
                <div className="table-cell">
                    word
                </div>
            </div>
            <div className="table-content">
                { rows }
            </div>
        </div>
    )
}

export default Table