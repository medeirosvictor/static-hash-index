import React, { useContext } from 'react'
import SimulationContext from './contexts/SimulationContext'
import { List } from "react-virtualized";

const Table = () => {
    const { state } = useContext(SimulationContext)
    const table = state.table
    const tableContent = table.content

    // const rows = table.content.map((row, index) => {
    //     const { id, word } = row

    //     return (
    //         <div className="table-row" key={index}>
    //             <div className="table-cell">
    //                 {id}
    //             </div>
    //             <div className="table-cell">
    //                 {word}
    //             </div>
    //         </div>
    //     )
    // })

    const renderRow = ({ index, key, style }) => {
        return (
            <div className="table-row" key={key} style={style}>
                <div className="table-cell">
                    {tableContent[index].id}
                </div>
                <div className="table-cell">
                    {tableContent[index].word}
                </div>
            </div>
        )
    }


    return (
        <div>
            <div className="table-content">
                <div className="table-header bold">
                    <div className="table-cell">
                        id
                    </div>
                    <div className="table-cell">
                        word
                    </div>
                </div>
                <List
                    className="List"
                    width={600}
                    height={600}
                    rowHeight={30}
                    rowRenderer={renderRow}
                    rowCount={tableContent.length}
                />
            </div>
        </div>
    )
}

export default Table