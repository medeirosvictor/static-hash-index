import React from 'react'
import Bucket from './Bucket'
import BucketOverflowList from './BucketOverflowList'

const BucketList = ({ bucketList, highlightBucketId, highlightTupleId }) => {
    if (!bucketList || bucketList.length === 0) return null

    const entries = []
    bucketList.forEach((bucket, i) => {
        if (bucket !== undefined) entries.push({ index: i, bucket })
    })

    if (entries.length === 0) return null

    return (
        <div className="section-container">
            <h2 className="section-title">
                Buckets
                <span className="tooltip" data-tooltip="Buckets store pointers (pageId, tupleId) to tuples in pages. Each word is hashed to a bucket ID. When a bucket is full, overflow buckets are chained to it.">ⓘ</span>
            </h2>
            <div className="grid-layout">
                {entries.map(({ index, bucket }) => {
                    const isHighlighted = highlightBucketId != null && index === highlightBucketId
                    return (
                        <div
                            className={"bucket-content" + (isHighlighted ? " bucket-content--highlight" : "")}
                            key={"bucket-" + index}
                            id={"bucket-" + index}
                        >
                            <div className="bucket-id">Bucket {index}</div>
                            <div className="bucket-header bold">
                                <div className="bucket-cell">Page Id</div>
                                <div className="bucket-cell">Tuple Id</div>
                            </div>
                            <Bucket
                                bucketTuples={bucket.hashTable}
                                highlightTupleId={isHighlighted ? highlightTupleId : null}
                            />
                            {bucket.overflowBuckets.length > 0 &&
                                <BucketOverflowList
                                    overflowBucketList={bucket.overflowBuckets}
                                    highlightTupleId={isHighlighted ? highlightTupleId : null}
                                />
                            }
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default BucketList
