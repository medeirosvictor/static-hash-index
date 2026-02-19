import React, { useState, useContext, useRef } from 'react'
import SimulationContext from './contexts/SimulationContext'
import SearchObject from './SearchObject'
import { hashFunction, hashFunctionWord } from './helpers/Helpers'

function SearchForm({ onSearchResult }) {
    const { state } = useContext(SimulationContext)
    const bucketList = state.bucketList || []
    const [searchWord, setSearchWord] = useState('')
    const [notFound, setNotFound] = useState(false)
    const [searchObject, setSearchObject] = useState(null)
    const retryCount = useRef(0)

    const handleSearchWordChange = (e) => {
        setSearchWord(e.target.value)
    }

    function handleSearchFormSubmit(word) {
        if (!word || word.trim() === '') return

        if (retryCount.current > 1) {
            retryCount.current = 0
            setNotFound(true)
            setSearchObject(null)
            if (onSearchResult) onSearchResult(null)
            return
        }

        let searchKey = hashFunctionWord(word)
        let bucketId = hashFunction(searchKey)
        let isOverflowBucket = false

        let bucket = bucketList[bucketId]
        if (!bucket) {
            retryCount.current = 0
            setNotFound(true)
            setSearchObject(null)
            if (onSearchResult) onSearchResult(null)
            return
        }

        let bucketTupleList = bucket.hashTable.filter(tuple => tuple.tupleId === searchKey)
        let bucketTuple = bucketTupleList[0]

        // Check overflow buckets
        if (!bucketTuple) {
            for (let i = 0; i < bucket.overflowBuckets.length; i++) {
                let ovBucketList = bucket.overflowBuckets[i]
                let ovBucket = ovBucketList.hashTable.filter(ovTuple => ovTuple.tupleId === searchKey)
                if (ovBucket && ovBucket.length > 0) {
                    bucketTuple = ovBucket[0]
                    isOverflowBucket = true
                    break
                }
            }
        }

        if (!bucketTuple) {
            // Try toggling first letter case
            let firstLetter = word.charAt(0)
            let newWord
            if (firstLetter === firstLetter.toUpperCase()) {
                newWord = word.charAt(0).toLowerCase() + word.slice(1)
            } else {
                newWord = word.charAt(0).toUpperCase() + word.slice(1)
            }
            retryCount.current++
            handleSearchFormSubmit(newWord)
            return
        }

        retryCount.current = 0
        setNotFound(false)

        const pageId = bucketTuple.pageId
        const result = { searchWord: word, searchKey, pageId, bucketId, isOverflowBucket }
        setSearchObject(result)
        if (onSearchResult) onSearchResult(result)
    }

    function onSearch() {
        retryCount.current = 0
        setNotFound(false)
        handleSearchFormSubmit(searchWord)
    }

    return (
        <div className="search-form">
            <div className="main-form_input-group">
                <label htmlFor="searchKey">Search Word:</label>
                <input
                    type="text"
                    name="searchKey"
                    id="searchKey"
                    value={searchWord}
                    onChange={handleSearchWordChange}
                    onKeyDown={(e) => { if (e.key === 'Enter') onSearch() }}
                    placeholder="e.g. hello"
                />
            </div>

            <button className="submit-button" onClick={onSearch}>
                Search
            </button>
            {notFound ?
                <div className="search-object-container search-object-container--not-found">
                    <div><span>Word Not Found</span></div>
                </div>
                :
                <SearchObject searchObject={searchObject} />
            }
        </div>
    )
}

export default SearchForm
