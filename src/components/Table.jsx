import React from 'react'
import { List } from 'react-virtualized'

const Table = ({ table }) => {
    if (!table || table.length === 0) return null

    const renderRow = ({ index, key, style }) => {
        return (
            <div className="table-row" key={key} style={style}>
                <div className="table-cell">{table[index].id}</div>
                <div className="table-cell">{table[index].word}</div>
            </div>
        )
    }

    return (
        <div className="section-container">
            <h2 className="section-title">
                Word Table
                <span className="tooltip" data-tooltip="The complete dataset of words with their hash IDs. Each word is hashed using a Java-style hashCode function to produce a 32-bit integer ID.">ⓘ</span>
            </h2>
            <div className="table-container">
                <div className="table-header bold">
                    <div className="table-cell">id</div>
                    <div className="table-cell">word</div>
                </div>
                <List
                    className="table-content"
                    width={800}
                    height={700}
                    rowHeight={30}
                    rowRenderer={renderRow}
                    rowCount={table.length}
                />
            </div>
        </div>
    )
}

export default Table
