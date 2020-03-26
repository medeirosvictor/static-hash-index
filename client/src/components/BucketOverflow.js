import React from 'react'
import { List } from "react-virtualized"

const BucketOverflow = ({bucketOverflowTuples}) => {

    const renderBucketOverflow = ({ index, key, style}) => {
        return (
            <div className="hash-tuple overflow-tuple" key={key} style={style}>
                <div>
                    {bucketOverflowTuples[index].pageId}
                </div>
                <div>
                    {bucketOverflowTuples[index].tupleId}
                </div>
            </div>
        )
    }

    return (
        <div className="hash-tuples-container hash-tuple-container-overflow">
            <List
                className="table-content"
                width={700}
                height={700}
                rowHeight={30}
                rowRenderer={renderBucketOverflow}
                rowCount={bucketOverflowTuples.length}
            />
        </div>
    )
}

export default BucketOverflow