import React, { useContext, useState } from 'react'
import SearchForm from './SearchForm'
import SimulationContext from './contexts/SimulationContext'

import Table from './Table'
import PageList from './PageList'
import BucketList from './BucketList'
import SimulationInfo from './SimulationInfo'

const BASE = import.meta.env.BASE_URL || '/'

const Simulation = () => {
    const { state, dispatch } = useContext(SimulationContext)
    const [table, setTable] = useState({})
    const [pageList, setPageList] = useState([])
    const [bucketList, setBucketList] = useState([])
    const [simulationStatus, setSimulationStatus] = useState('')
    const [error, setError] = useState(null)
    const [loadProgress, setLoadProgress] = useState(0)
    const [highlightBucketId, setHighlightBucketId] = useState(null)
    const [highlightPageId, setHighlightPageId] = useState(null)
    const [highlightTupleId, setHighlightTupleId] = useState(null)

    const handlePageSettings = (e) => {
        const currentPageSettingSelectedRadio = e.target.elements.pageSettings.value
        const val = parseInt(e.target.elements.pageSet.value, 10)

        if (isNaN(val) || val <= 0) {
            setError('Please enter a positive number.')
            return false
        }

        setError(null)

        if (currentPageSettingSelectedRadio === 'page-Amount') {
            dispatch({ type: 'UPDATE_SIMDATA', payload: { meta: { ...state.meta, pageAmount: val, pageSize: 0 } } })
        } else {
            dispatch({ type: 'UPDATE_SIMDATA', payload: { meta: { ...state.meta, pageSize: val, pageAmount: 0 } } })
        }
        return true
    }

    function fetchWithProgress(url) {
        return fetch(url).then(response => {
            if (!response.ok) throw new Error(`Failed to load words.json (${response.status})`)

            const contentLength = response.headers.get('Content-Length')
            if (!contentLength || !response.body) {
                // Fallback: no streaming, just parse
                return response.json()
            }

            const total = parseInt(contentLength, 10)
            let loaded = 0
            const reader = response.body.getReader()
            const chunks = []

            function pump() {
                return reader.read().then(({ done, value }) => {
                    if (done) {
                        const blob = new Blob(chunks)
                        return blob.text().then(text => JSON.parse(text))
                    }
                    loaded += value.byteLength
                    chunks.push(value)
                    setLoadProgress(Math.round((loaded / total) * 100))
                    return pump()
                })
            }
            return pump()
        })
    }

    function handleInitFormSubmit(e) {
        e.preventDefault()
        if (!handlePageSettings(e)) return

        setSimulationStatus('loading')
        setLoadProgress(0)

        const pageSettingRadio = e.target.elements.pageSettings.value
        const val = parseInt(e.target.elements.pageSet.value, 10)
        const metaOverride = pageSettingRadio === 'page-Amount'
            ? { pageAmount: val, pageSize: 0 }
            : { pageSize: val, pageAmount: 0 }

        fetchWithProgress(BASE + 'words.json')
            .then(data => {
                const tableData = data.table
                dispatch({ type: 'UPDATE_SIMDATA', payload: { table: tableData } })
                setTable(tableData)
                buildSimulation({ ...state, table: tableData, meta: { ...state.meta, ...metaOverride } })
            })
            .catch(err => {
                console.error(err)
                setError('Failed to load word data. Check your connection and try again.')
                setSimulationStatus('')
            })
    }

    const buildSimulation = (currentState) => {
        setSimulationStatus('building')

        const tW = new Worker(new URL('./simulationWorker.js', import.meta.url), { type: 'module' })
        tW.postMessage(currentState)

        tW.addEventListener('message', event => {
            const result = event.data

            dispatch({
                type: 'UPDATE_SIMDATA', payload: {
                    pageList: result.pageList,
                    bucketList: result.bucketList,
                    meta: {
                        ...currentState.meta,
                        pageAmount: result.pageAmount,
                        pageSize: result.pageSize,
                        bucketAmount: result.meta.bucketAmount,
                        bucketSize: result.meta.bucketSize,
                        bucketIds: result.meta.bucketIds,
                        totalOverflowAmount: result.meta.totalOverflowAmount,
                        overflowRate: result.meta.overflowRate,
                        simulationStatus: 'running'
                    },
                    table: {
                        content: result.rows,
                        meta: {
                            rowCount: result.rows.length,
                            columns: ['id', 'word']
                        }
                    }
                }
            })

            setPageList(result.pageList)
            setBucketList(result.bucketList)
            setSimulationStatus('running')
            tW.terminate()
        })
    }

    const handleSearchResult = (result) => {
        if (result) {
            setHighlightBucketId(result.bucketId)
            setHighlightPageId(result.pageId)
            setHighlightTupleId(result.searchKey)
        } else {
            setHighlightBucketId(null)
            setHighlightPageId(null)
            setHighlightTupleId(null)
        }
    }

    return (
        <div>
            {error && <div className="text-center error-message">{error}</div>}

            {simulationStatus === 'building' || simulationStatus === 'loading' || simulationStatus === 'running' ?
                <div>
                    <div className="text-center">
                        {simulationStatus === 'running'
                            ? <span className="status-badge status-badge--running">Simulation is Running</span>
                            : <div className="loading-status">
                                <span>
                                    {simulationStatus === 'loading' ? 'Loading word data' : 'Building Simulation'}
                                </span>
                                {simulationStatus === 'loading' && (
                                    <div className="progress-bar">
                                        <div
                                            className="progress-bar__fill"
                                            style={{ width: loadProgress + '%' }}
                                        />
                                        <span className="progress-bar__label">{loadProgress}%</span>
                                    </div>
                                )}
                                {simulationStatus === 'building' && (
                                    <div className="progress-bar">
                                        <div className="progress-bar__fill progress-bar__fill--indeterminate" />
                                        <span className="progress-bar__label">Processing...</span>
                                    </div>
                                )}
                              </div>
                        }
                    </div>
                    {simulationStatus === 'running' &&
                        <div className="simulation-status">
                            <SimulationInfo />
                            <SearchForm onSearchResult={handleSearchResult} />
                        </div>
                    }
                </div>
                :
                <form className="main-form" onSubmit={handleInitFormSubmit}>
                    <div className="toggle-radio">
                        <label className="text-left bold">Page Settings: </label>
                        <input type="radio" name="pageSettings" value="page-Amount" id="page-Amount" required defaultChecked />
                        <label htmlFor="page-Amount">
                            Page Amount
                            <span className="tooltip" data-tooltip="Set the total number of pages. Tuples will be evenly distributed across pages.">ⓘ</span>
                        </label>

                        <input type="radio" name="pageSettings" value="page-Size" id="page-Size" />
                        <label htmlFor="page-Size">
                            Page Size (in Tuples)
                            <span className="tooltip" data-tooltip="Set how many tuples each page holds. The number of pages is calculated automatically.">ⓘ</span>
                        </label>
                    </div>

                    <div className="main-form_input-group">
                        <input type="number" name="pageSet" id="pageSet" placeholder="e.g. 100" min="1" required />
                    </div>

                    <button className="submit-button" type="submit">
                        Simulate
                    </button>
                </form>
            }

            <Table table={table.content} />
            <PageList
                pageList={pageList}
                highlightPageId={highlightPageId}
                highlightTupleId={highlightTupleId}
            />
            <BucketList
                bucketList={bucketList}
                highlightBucketId={highlightBucketId}
                highlightTupleId={highlightTupleId}
            />
        </div>
    )
}

export default Simulation
