import React from 'react'
import Bucket from './Bucket'
import BucketOverflowList from './BucketOverflowList'
import { Collection } from 'react-virtualized'

const BucketList = ({bucketList}) => {
    let nextSize = 0
    let prevH = 0
    let rowCount = 0
    const validBucketsLength = bucketList.filter(function(value) { return value !== undefined }).length

    const renderBucketContent = ({index, key, style}) => {
        if (bucketList[index]) {
            return (
                <div className="bucket-content" key={key} style={style}>
                        <div className="bucket-id">
                            Bucket { index }
                        </div>
                        <div className="bucket-header bold">
                            <div className="bucket-cell">
                                Page Id
                            </div>
                            <div className="bucket-cell">
                                Tuple Id
                            </div>
                        </div>
                        <Bucket bucketTuples={bucketList[index].hashTable}/>
                        {   bucketList[index].overflowBuckets.length > 0 ?
                            <BucketOverflowList overflowBucketList={bucketList[index].overflowBuckets} />
                        :
                            null
                        }
                    </div>
            )
        }
    }

    const bucketContent = bucketList.map((bucket, index) => {
        if (bucket) {
            return (
                <div className="bucket-content" key={"bucketlist"+index+Math.floor(3 * Math.random())} >
                    <div className="bucket-id">
                        Bucket { index }
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
    }
    })

    const _cellSizeAndPositionGetter = ({index}) => {
        let currentX, currentY
        if (bucketList[index] === undefined ) {
            console.log(bucketList[index])
            return ({
                width: 200,
                height: 200,
                x: 0,
                y: 0
            })
        } else {
            currentX = nextSize
            nextSize = nextSize + 225
            currentY = prevH
            rowCount++

            if (rowCount > 4) {
                rowCount = 0
                currentY = prevH
                prevH = prevH + 250
                nextSize = 0
                currentX = 0
            }

            return ({
                width: 200,
                height: 200,
                x: currentX,
                y: currentY
            })
        }

    }

    return (
        <div className="bucket-container">
            <Collection
              cellCount={validBucketsLength}
              cellRenderer={renderBucketContent}
              cellSizeAndPositionGetter={_cellSizeAndPositionGetter}
              height={200}
              width={1000}
            />
            {/* { bucketContent } */}
        </div>
    )
}

export default BucketList