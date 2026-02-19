import React from 'react'
import { List } from "react-virtualized"

const BucketOverflow = ({ overflowBucket, highlightTupleId }) => {
    const renderBucketOverflow = ({ index, key, style }) => {
        const tuple = overflowBucket[index]
        const isHighlighted = highlightTupleId != null && tuple.tupleId === highlightTupleId
        return (
            <div
                className={"hash-tuple overflow-tuple" + (isHighlighted ? " hash-tuple--highlight" : "")}
                key={key}
                style={style}
            >
                <div>{tuple.pageId}</div>
                <div>{tuple.tupleId}</div>
            </div>
        )
    }

    return (
        <div className="hash-tuples-overflow-container">
            <List
                className="table-content"
                width={200}
                height={100}
                rowHeight={30}
                rowRenderer={renderBucketOverflow}
                rowCount={overflowBucket.length}
            />
        </div>
    )
}

export default BucketOverflow
