import React from 'react'

function SearchForm (){
    function handleSearchFormSubmit() {
        console.log("searching for key...")
    }

    return (
        <div className={true ? "search-form" : "hidden"}>
            <div className="main-form_input-group">
                <label htmlFor="searchKey">Search Key:</label>
                <input type="text" name="searchKey" id="searchKey" placeholder="0"/>
            </div>

            <button className="submit-button" onClick={handleSearchFormSubmit}>
                Search
            </button>
        </div>
    )
}

export default SearchForm