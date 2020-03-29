import React from 'react'
import { List } from "react-virtualized"
import BucketOverflow from './BucketOverflow'

const BucketOverflowList = ({overflowBucketList}) => {
    const totalOverflowTuples = overflowBucketList.map((currentOverflowBucket, index) => {
        return (
            <BucketOverflow overflowBucket={currentOverflowBucket.hashTable} />
        )
    })

    return (
        <div className="hash-tuples-container hash-tuple-container-overflow">
            {totalOverflowTuples}
        </div>
    )
}

export default BucketOverflowList