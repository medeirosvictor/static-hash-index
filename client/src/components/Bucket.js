import React from 'react'
import { List } from "react-virtualized"

const Bucket = ({bucketTuples}) => {
    const hashFunctionWord = (searchKey) => {
        var hash = 0;
        if (searchKey.length === 0) {
            return hash;
        }
        for (var i = 0; i < searchKey.length; i++) {
            var char = searchKey.charCodeAt(i);
            //shift 5 binary to left add char code for each char in the object (could be * 32 but bit shift is faster)
            hash = ((hash<<5)-hash)+char;
            hash = hash & hash; // Convert to 32bit integer
        }
        return hash;
    }

    const renderBucket = ({ index, key, style}) => {
        return (
            <div className="hash-tuple" key={hashFunctionWord("bucket"+bucketTuples[index].pageId +""+ bucketTuples[index].tupleId+""+key)} style={style}>
                <div>
                    {bucketTuples[index].pageId}
                </div>
                <div>
                    {bucketTuples[index].tupleId}
                </div>
            </div>
        )
    }

    return (
        <div className="hash-tuples-container">
            <List
                className="table-content"
                width={200}
                height={100}
                rowHeight={30}
                rowRenderer={renderBucket}
                rowCount={bucketTuples.length}
            />
        </div>
    )
}

export default Bucket