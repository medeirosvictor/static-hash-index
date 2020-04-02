import React from 'react'
import Page from './Page'
import { Collection } from 'react-virtualized'

const PageList = ({pageList}) => {
    let prevSize = 0
    let prevH = 0
    const renderPageContent = ({index, key, style}) => {
        return (
            <div className="page-content" key={key} style={style}>
                <div className="page-id">
                    Page {index}
                </div>
                <div className="page-header bold">
                    <div className="page-cell">
                        Tuple Id
                    </div>
                    <div className="page-cell">
                        Tuple Word
                    </div>
                </div>
                <Page pageTuples={pageList[index]}/>
            </div>
        )
    }

    const pageContent = pageList.map((page, index) => {
        return (
            <div className="page-content" key={index}>
                <div className="page-id">
                    Page {index}
                </div>
                <div className="page-header bold">
                    <div className="page-cell">
                        Tuple Id
                    </div>
                    <div className="page-cell">
                        Tuple Word
                    </div>
                </div>
                <Page pageTuples={page}/>
            </div>
        )
    })

    const _cellSizeAndPositionGetter = ({index}) => {
        let x, y
        if (index === 0 ) {
            x = 0
            y = 0
        } else if (index % 4 === 0) {
            y  = prevH+650
            x = 0
        } else {
            x  = prevSize + 250
            y = prevH
        }

        prevSize = x
        prevH = y
        return ({
            width: 200,
            height: 560,
            x: x,
            y: y
        })
    }

    return (
        <div className="page-container">
            <Collection
              cellCount={pageList.length}
              cellRenderer={renderPageContent}
              cellSizeAndPositionGetter={_cellSizeAndPositionGetter}
              height={600}
              width={1000}
            />
            {/* {pageContent} */}
        </div>
    )
}

export default PageList 