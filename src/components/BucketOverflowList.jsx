import React from 'react'
import BucketOverflow from './BucketOverflow'

const BucketOverflowList = ({ overflowBucketList, highlightTupleId }) => {
    return (
        <div className="hash-tuples-container hash-tuple-container-overflow">
            {overflowBucketList.map((ovBucket, index) => (
                <BucketOverflow
                    overflowBucket={ovBucket.hashTable}
                    highlightTupleId={highlightTupleId}
                    key={"overflow-" + index}
                />
            ))}
        </div>
    )
}

export default BucketOverflowList
