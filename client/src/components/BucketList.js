import React, { useContext } from 'react'
import SimulationContext from './contexts/SimulationContext'
import Bucket from './Bucket'
import BucketOverflow from './BucketOverflow'

const BucketList = () => {
    const { state } = useContext(SimulationContext)
    const { bucketList } = state
    let overflowBuckets

    const bucketContent = bucketList.map((bucket, index) => {
        bucket.overflowBuckets.forEach((currentOverflowBucket) => {
            overflowBuckets = currentOverflowBucket.hashTable.map((hashTuple) => {
                return (
                    <div className="hash-tuple overflow-tuple" key={index*20}>
                        <div>
                            { hashTuple.pageId }
                        </div>
                        <div>
                            { hashTuple.tupleId }
                        </div>
                    </div>
                )
            })
        })

        return (
            <div className="bucket-content" key={index*10}>
                <div className="bucket-id">
                    Bucket { bucket.id }
                </div>
                <div className="bucket-header bold">
                    <div className="bucket-cell">
                        Page Id
                    </div>
                    <div className="bucket-cell">
                        Tuple Id
                    </div>
                </div>
                <Bucket bucketTuples={bucket.hashTable}/>
                { overflowBuckets }
            </div>
        )
    })

    return (
        <div className="bucket-container">
            { bucketContent }
        </div>
    )
}

export default BucketList