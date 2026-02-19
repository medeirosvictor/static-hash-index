import React, { useState, useEffect, useMemo, useRef } from 'react'
import Bucket from './Bucket'
import BucketOverflowList from './BucketOverflowList'

const PAGE_SIZE = 50

const BucketList = ({ bucketList, highlightBucketId, highlightTupleId }) => {
    if (!bucketList || (Array.isArray(bucketList) ? bucketList.length === 0 : Object.keys(bucketList).length === 0)) return null

    const entries = useMemo(() => {
        if (Array.isArray(bucketList)) {
            const result = []
            bucketList.forEach((bucket, i) => {
                if (bucket !== undefined) result.push({ index: i, bucket })
            })
            return result
        }
        // Object format (compact from worker)
        return Object.keys(bucketList)
            .map(Number)
            .sort((a, b) => a - b)
            .map(i => ({ index: i, bucket: bucketList[i] }))
    }, [bucketList])

    const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)
    const highlightRef = useRef(null)

    // If a highlighted bucket is beyond visible range, expand just enough to show it
    useEffect(() => {
        if (highlightBucketId != null) {
            const highlightIdx = entries.findIndex(e => e.index === highlightBucketId)
            if (highlightIdx >= 0 && highlightIdx >= visibleCount) {
                setVisibleCount(highlightIdx + 1)
            }
        }
    }, [highlightBucketId, entries])

    // Scroll to highlighted bucket
    useEffect(() => {
        if (highlightRef.current) {
            highlightRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' })
        }
    }, [highlightBucketId])

    if (entries.length === 0) return null

    const visible = entries.slice(0, visibleCount)
    const hasMore = visibleCount < entries.length

    return (
        <div className="section-container">
            <h2 className="section-title">
                Buckets
                <span className="section-count">({entries.length.toLocaleString()} total)</span>
                <span className="tooltip" data-tooltip="Buckets store pointers (pageId, tupleId) to tuples in pages. Each word is hashed to a bucket ID. When a bucket is full, overflow buckets are chained to it.">ⓘ</span>
            </h2>
            <div className="grid-layout">
                {visible.map(({ index, bucket }) => {
                    const isHighlighted = highlightBucketId != null && index === highlightBucketId
                    return (
                        <div
                            className={"bucket-content" + (isHighlighted ? " bucket-content--highlight" : "")}
                            key={"bucket-" + index}
                            id={"bucket-" + index}
                            ref={isHighlighted ? highlightRef : null}
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
            {hasMore && (
                <div className="load-more-container">
                    <button
                        className="load-more-button"
                        onClick={() => setVisibleCount(prev => prev + PAGE_SIZE)}
                    >
                        Show More Buckets ({Math.min(PAGE_SIZE, entries.length - visibleCount)} of {(entries.length - visibleCount).toLocaleString()} remaining)
                    </button>
                </div>
            )}
        </div>
    )
}

export default BucketList
