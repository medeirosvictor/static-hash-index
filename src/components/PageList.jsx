import React from 'react'
import Page from './Page'

const PageList = ({ pageList, highlightPageId, highlightTupleId }) => {
    if (!pageList || pageList.length === 0) return null

    return (
        <div className="section-container">
            <h2 className="section-title">
                Pages
                <span className="tooltip" data-tooltip="Pages are fixed-size blocks that hold tuples (word + ID). Tuples are randomly distributed across pages, simulating how a database allocates disk pages.">ⓘ</span>
            </h2>
            <div className="grid-layout">
                {pageList.map((pageTuples, index) => {
                    const isHighlighted = highlightPageId != null && index === highlightPageId
                    return (
                        <div
                            className={"page-content" + (isHighlighted ? " page-content--highlight" : "")}
                            key={"page-" + index}
                            id={"page-" + index}
                        >
                            <div className="page-id">Page {index}</div>
                            <div className="page-header bold">
                                <div className="page-cell">Tuple Id</div>
                                <div className="page-cell">Tuple Word</div>
                            </div>
                            <Page
                                pageTuples={pageTuples}
                                highlightTupleId={isHighlighted ? highlightTupleId : null}
                            />
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default PageList
