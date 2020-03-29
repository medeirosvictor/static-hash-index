import React from 'react'

const SearchObject = ({searchObject}) => {
    return (
        <div className="search-object-container">
            <div><span className="bold">Bucket ID:</span> {searchObject.bucketId}</div>
            <div><span className="bold">Page ID:</span> {searchObject.pageId}</div>
            <div><span className="bold">Search Key:</span> {searchObject.searchKey}</div>
            <div><span className="bold">Word:</span> {searchObject.searchWord}</div>
        </div>
    )
}



export default SearchObject