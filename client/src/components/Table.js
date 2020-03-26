import React from 'react'
import { List } from "react-virtualized";

const Table = ({table}) => {
    const renderRow = ({ index, key, style }) => {
        return (
            <div className="table-row" key={key} style={style}>
                <div className="table-cell">
                    {table[index].id}
                </div>
                <div className="table-cell">
                    {table[index].word}
                </div>
            </div>
        )
    }

        return (
            <div className="table-container">
                <div className="table-header bold">
                    <div className="table-cell">
                        id
                    </div>
                    <div className="table-cell">
                        word
                    </div>
                </div>
                <List
                    className="table-content"
                    width={800}
                    height={700}
                    rowHeight={30}
                    rowRenderer={renderRow}
                    rowCount={table ? table.length : 0}
                />
            </div>
        )
}

export default Table