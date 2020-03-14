import React, { useContext } from 'react'
import SimulationContext from './contexts/SimulationContext'

const PageList = () => {
    const { state } = useContext(SimulationContext)
    const { pageList } = state

    const pageContent = pageList.map((page, index) => {
        const currentTuples = page.map((tuple, index) => {
            return (
                <div className="page-tuple" key={index}>
                    <div>
                        {tuple.id}
                    </div>
                    <div>
                        {tuple.word}
                    </div>
                </div>
            )
        })

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
                { currentTuples }
            </div>
        )
    })

    return (
        <div className="page-container">
            {pageContent}
        </div>
    )
}

export default PageList