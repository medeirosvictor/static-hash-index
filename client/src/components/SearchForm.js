import React, { useState, useContext } from 'react'
import SimulationContext from './contexts/SimulationContext'
import SearchObject from './SearchObject'

function SearchForm (){
    const { state } = useContext(SimulationContext)
    const  bucketList = [...state.bucketList]
    const  pageList  = [...state.pageList]
    const [ searchWord, setSearchWord ] = useState("")
    const [ notFound, setNotFound ] = useState(false)
    const [ searchObject, setSearchObject ] = useState({})
    let wordChecker = 0

    const hashFunction = (searchKey) => {
        return searchKey % 11;
    }

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

    const handleSearchWordChange = (e) => {
        setSearchWord(e.target.value)
    }

    function handleSearchFormSubmit(word) {
        if (wordChecker > 1) {
            wordChecker = 0
            setNotFound(true)
            return
        }

        let searchKey = hashFunctionWord(word)
        let bucketId = hashFunction(searchKey)
        let isOverflowBucket = false

        let bucket = bucketList.filter(bucket => {
            return bucket.id === bucketId
        }); bucket = bucket[0]

        let bucketTupleList = bucket.hashTable.filter(tuple => {
            return tuple.tupleId === searchKey
        }); let bucketTuple = bucketTupleList[0]

        //Check if inside overflow bucket
        if (!bucketTuple) {
            for (let i = 0; i < bucket.overflowBuckets.length; i++) {
                let ovBucketList = bucket.overflowBuckets[i]
                let ovBucket = ovBucketList.hashTable.filter(ovTuple => {
                    return ovTuple.tupleId === searchKey
                })

                if (ovBucket) {
                    bucketTuple = ovBucket[0]
                    isOverflowBucket = true
                }
            }
        }

        if(!bucketTuple) {
            let firstLetter = word.charAt(0);
            let newWord
            if (firstLetter === firstLetter.toUpperCase()) {
                newWord = searchWord.replace(/^\w/, c => c.toLowerCase())
                wordChecker++
            } else {
                newWord = searchWord.replace(/^\w/, c => c.toUpperCase())
                wordChecker++
            }
            handleSearchFormSubmit(newWord)
        }

        if(bucketTuple) {
            setNotFound(false)
            const pageId = bucketTuple.pageId
            const page = pageList[pageId]
            const tuple = page.filter((pageTuple, index) => {
                return pageTuple.id === searchKey
            })

            setSearchObject({...searchObject, searchWord: word, searchKey, pageId, bucketId, isOverflowBucket})

            console.log(tuple)
        }
    }

    return (
        <div className={true ? "search-form" : "hidden"}>
            <div className="main-form_input-group">
                <label htmlFor="searchKey">Search Word:</label>
                <input type="text" name="searchKey" id="searchKey" onChange={handleSearchWordChange}/>
            </div>

            <button className="submit-button" onClick={() => {handleSearchFormSubmit(searchWord)}}>
                Search
            </button>
            { notFound ? 
                <div className="search-object-container">
                    <div><span>Word Not Found</span></div>
                </div>
            :
                <SearchObject searchObject={searchObject}/>
            }
        </div>
    )
}

export default SearchForm