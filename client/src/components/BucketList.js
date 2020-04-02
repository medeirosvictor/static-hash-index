import React from 'react'
import Bucket from './Bucket'
import BucketOverflowList from './BucketOverflowList'
import { Collection } from 'react-virtualized'

const BucketList = ({bucketList}) => {
    let currentX = 0;
    let currentY = 0;
    let nextY = 0;
    let nextX = 0;
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
        if (bucketList[index] === undefined ) {
            return ({
                width: 200,
                height: 200,
                x: 0,
                y: 0
            })
        } else {
            currentX = nextX
            currentY = nextY
            rowCount++

            if (rowCount > 3) {
                rowCount = 0
                nextY = nextY + 250
                nextX = 0
            } else {
                nextX = nextX + 225
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