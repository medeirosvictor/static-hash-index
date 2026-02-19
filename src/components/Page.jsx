import React from 'react'
import { List } from 'react-virtualized'

const Page = ({ pageTuples, highlightTupleId }) => {
    if (!pageTuples || pageTuples.length === 0) return null

    const renderPage = ({ index, key, style }) => {
        const tuple = pageTuples[index]
        const isHighlighted = highlightTupleId != null && tuple.id === highlightTupleId
        return (
            <div
                className={"page-tuple" + (isHighlighted ? " page-tuple--highlight" : "")}
                key={key}
                style={style}
            >
                <div>{tuple.id}</div>
                <div>{tuple.word}</div>
            </div>
        )
    }

    return (
        <div className="page-tuples-container">
            <List
                className="table-content"
                width={200}
                height={Math.min(pageTuples.length * 50, 500)}
                rowHeight={50}
                rowRenderer={renderPage}
                rowCount={pageTuples.length}
            />
        </div>
    )
}

export default Page
