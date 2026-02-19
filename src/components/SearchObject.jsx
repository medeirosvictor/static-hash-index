import React from 'react'

const SearchObject = ({ searchObject }) => {
    if (!searchObject || searchObject.searchWord == null) return null

    return (
        <div className="search-object-container">
            <div className="search-path">
                <span className="search-path__step">"{searchObject.searchWord}"</span>
                <span className="search-path__arrow">→</span>
                <span className="search-path__step">hash: {searchObject.searchKey}</span>
                <span className="search-path__arrow">→</span>
                <span className="search-path__step search-path__step--bucket">Bucket {searchObject.bucketId}</span>
                <span className="search-path__arrow">→</span>
                <span className="search-path__step search-path__step--page">Page {searchObject.pageId}</span>
            </div>
            <div className="search-object-details">
                <div><span className="bold">Bucket ID:</span> {searchObject.bucketId}</div>
                <div><span className="bold">Page ID:</span> {searchObject.pageId}</div>
                <div><span className="bold">Search Key:</span> {searchObject.searchKey}</div>
                <div><span className="bold">Word:</span> {searchObject.searchWord}</div>
                {searchObject.isOverflowBucket &&
                    <div><span className="bold underline-overflow">From Overflow Bucket</span></div>
                }
            </div>
        </div>
    )
}

export default SearchObject
