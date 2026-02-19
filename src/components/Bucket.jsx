import React from 'react'
import { List } from "react-virtualized"

const Bucket = ({ bucketTuples, highlightTupleId }) => {
    const renderBucket = ({ index, key, style }) => {
        const tuple = bucketTuples[index]
        const isHighlighted = highlightTupleId != null && tuple.tupleId === highlightTupleId
        return (
            <div
                className={"hash-tuple" + (isHighlighted ? " hash-tuple--highlight" : "")}
                key={key}
                style={style}
            >
                <div>{tuple.pageId}</div>
                <div>{tuple.tupleId}</div>
            </div>
        )
    }

    return (
        <div className="hash-tuples-container">
            <List
                className="table-content"
                width={200}
                height={100}
                rowHeight={30}
                rowRenderer={renderBucket}
                rowCount={bucketTuples.length}
            />
        </div>
    )
}

export default Bucket
