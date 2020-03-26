import React from 'react'
import { List } from "react-virtualized"

const Page = ({pageTuples}) => {

    const renderPage = ({ index, key, style}) => {
        return (
            <div className="page-tuple" key={key} style={style}>
                <div>
                    {pageTuples[index].id}
                </div>
                <div>
                    {pageTuples[index].word}
                </div>
            </div>
        )
    }

    return (
        <div className="page-tuples-container">
            <List
                className="table-content"
                width={700}
                height={700}
                rowHeight={30}
                rowRenderer={renderPage}
                rowCount={pageTuples.length}
            />
        </div>
    )
}

export default Page