import React from 'react'
import { List } from "react-virtualized"

const BucketOverflow = ({overflowBucket}) => {
    const renderBucketOverflow = ({ index, key, style}) => {
        return (
            <div className="hash-tuple overflow-tuple" key={"overflowtuple"+key+":"+overflowBucket[index].pageId+":"+overflowBucket[index].tupleId}  style={style}>
                <div>
                    {overflowBucket[index].pageId}
                </div>
                <div>
                    {overflowBucket[index].tupleId}
                </div>
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