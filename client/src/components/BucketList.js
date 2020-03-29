import React from 'react'
import Bucket from './Bucket'
import BucketOverflowList from './BucketOverflowList'

const BucketList = ({bucketList}) => {
    const bucketContent = bucketList.map((bucket, index) => {
        return (
            <div className="bucket-content" key={"bucketlist"+bucket.id+Math.floor(3 * Math.random())} >
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
                {   bucket.overflowBuckets.length > 0 ?
                    <BucketOverflowList overflowBucketList={bucket.overflowBuckets} />
                :
                    null
                }
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