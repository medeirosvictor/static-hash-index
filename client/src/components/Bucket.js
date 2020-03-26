import React from 'react'
import { List } from "react-virtualized"

const Bucket = ({bucketTuples}) => {
    const renderBucket = ({ index, key, style}) => {
        return (
            <div className="hash-tuple" key={key} style={style}>
                <div>
                    {bucketTuples[index].pageId}
                </div>
                <div>
                    {bucketTuples[index].tupleId}
                </div>
            </div>
        )
    }

    return (
        <div className="hash-tuples-container">
            <List
                className="table-content"
                width={700}
                height={700}
                rowHeight={30}
                rowRenderer={renderBucket}
                rowCount={bucketTuples.length}
            />
        </div>
    )
}

export default Bucket