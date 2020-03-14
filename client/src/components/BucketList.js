import React, { useContext } from 'react'
import SimulationContext from './contexts/SimulationContext'

const BucketList = () => {
    const { state } = useContext(SimulationContext)
    const { bucketList } = state
    let overflowBucket

    const bucketContent = bucketList.map((bucket, index) => {
        const currentBucket = bucket.hashTable.map((hashTuple) => {
            return (
                <div className="hash-tuple">
                    <div>
                        { hashTuple.pageId }
                    </div>
                    <div>
                        { hashTuple.tupleId }
                    </div>
                </div>
            )
        })

        bucket.overflowBuckets.forEach((currentOverflowBucket) => {
            overflowBucket = currentOverflowBucket.hashTable.map((hashTuple) => {
                return (
                    <div className="hash-tuple overflow-tuple">
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
                { currentBucket }
                { overflowBucket }
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