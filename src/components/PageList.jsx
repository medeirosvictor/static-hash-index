import React, { useState, useEffect, useRef } from 'react'
import Page from './Page'

const PAGE_SIZE = 50

const PageList = ({ pageList, highlightPageId, highlightTupleId }) => {
    if (!pageList || pageList.length === 0) return null

    const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)
    const highlightRef = useRef(null)

    // If a highlighted page is beyond visible range, expand just enough
    useEffect(() => {
        if (highlightPageId != null && highlightPageId >= visibleCount) {
            setVisibleCount(highlightPageId + 1)
        }
    }, [highlightPageId])

    // Scroll to highlighted page
    useEffect(() => {
        if (highlightRef.current) {
            highlightRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' })
        }
    }, [highlightPageId])

    const visible = pageList.slice(0, visibleCount)
    const hasMore = visibleCount < pageList.length

    return (
        <div className="section-container">
            <h2 className="section-title">
                Pages
                <span className="section-count">({pageList.length.toLocaleString()} total)</span>
                <span className="tooltip" data-tooltip="Pages are fixed-size blocks that hold tuples (word + ID). Tuples are randomly distributed across pages, simulating how a database allocates disk pages.">ⓘ</span>
            </h2>
            <div className="grid-layout">
                {visible.map((pageTuples, index) => {
                    const isHighlighted = highlightPageId != null && index === highlightPageId
                    return (
                        <div
                            className={"page-content" + (isHighlighted ? " page-content--highlight" : "")}
                            key={"page-" + index}
                            id={"page-" + index}
                            ref={isHighlighted ? highlightRef : null}
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
            {hasMore && (
                <div className="load-more-container">
                    <button
                        className="load-more-button"
                        onClick={() => setVisibleCount(prev => prev + PAGE_SIZE)}
                    >
                        Show More Pages ({Math.min(PAGE_SIZE, pageList.length - visibleCount)} of {(pageList.length - visibleCount).toLocaleString()} remaining)
                    </button>
                </div>
            )}
        </div>
    )
}

export default PageList
