import React from 'react'
import BucketOverflow from './BucketOverflow'

const BucketOverflowList = ({overflowBucketList}) => {
    const totalOverflowTuples = overflowBucketList.map((currentOverflowBucket, index) => {
        return (
            <BucketOverflow overflowBucket={currentOverflowBucket.hashTable} key={"overflowbucketlist" + Math.random() + ":" + currentOverflowBucket.hashTable.length}/>
        )
    })

    return (
        <div className="hash-tuples-container hash-tuple-container-overflow" key={"overflowbucketlist" + Math.random() + ":"}>
            {totalOverflowTuples}
        </div>
    )
}

export default BucketOverflowList