import React, { useContext, useState } from 'react'
import { navigate } from "@reach/router"
import { shuffleArray, readFileContent, hashFunction } from './helpers/Helpers.js'
import SimulationContext from './contexts/SimulationContext'
import _ from 'lodash'

const InitForm = () => {
    const { state, dispatch } = useContext(SimulationContext)

    function handleInitFormSubmit(e) {
        e.preventDefault()
        handlePageSettings(e)
        console.time("building tables");
        mountTable()
        console.timeEnd("building tables");
        // console.time("building pages");
        // mountPages()
        // console.timeEnd("building pages");
        // console.time("building buckets");
        // setBucketData()
        // mountBuckets()
        // console.timeEnd("building buckets");
        dispatch({type: 'UPDATE_SIMDATA', payload: {meta: {...state.meta, isRunning: true}}})
        // navigate("/simulation")
    }

    const handlePageSettings = (e) => {
        const currentPageSettingSelectedRadio = e.target.elements.pageSettings.value
        const val = parseInt(e.target.elements.pageSet.value)

        if (currentPageSettingSelectedRadio === 'page-Amount') {
            dispatch({type: 'UPDATE_SIMDATA', payload: {meta: {...state.meta, pageAmount: val}}})
        } else {
            dispatch({type: 'UPDATE_SIMDATA', payload: {meta: {...state.meta, pageSize: val}}})
        }
    }

    const mountTable = () => {
        console.log("Mounting tables...")
        let rows = []
        fetch('/api/simulation/table')
            .then((table) => {
                if (table)  {
                    console.log(table)
                }
                return table
            })

        console.log("Tables Finished")
    }

    const mountPages = () => {
        console.log("Mounting pages...")

        let calculatedPageSize = 0
        let calculatedPageAmount = 0
        const { table } = state
        const { pageAmount, pageSize } = state.meta
        let pageList = []
        const tableContentString = [...table.content]

        if (pageAmount > 0) {

            calculatedPageSize = Math.ceil(table.content.length / pageAmount)

            calculatedPageAmount = pageAmount
        } else if (pageSize > 0) {

            calculatedPageAmount = Math.ceil(table.content.length / pageSize)

            calculatedPageSize = pageSize
        }

        for (let i = 0; i < calculatedPageAmount; i++) {
            if (tableContentString.length === 0) {
                break
            }

            for (let j = 0; j < calculatedPageSize; j++) {
                if (j === 0) {
                    pageList[i] = []
                }

                if (tableContentString.length === 0) {
                    break
                }

                let rand = Math.floor(Math.random()*tableContentString.length)
                let tuple = tableContentString[rand]
                tableContentString.splice(rand, 1)
                pageList[i].push(tuple)
            }
        }

        dispatch({type: 'UPDATE_SIMDATA', payload: {pageList, meta:{pageAmount: calculatedPageAmount, pageSize: calculatedPageSize}}})

        console.log("Pages Finished")
    }

    const setBucketData = () => {
        const currentHashFunction = state.meta.hashFunction
        const currentTableContent = state.table.content
        let bucketIds = []
        let bucketSize = 0
        console.log(currentHashFunction)

        //H(k) = |k| mod 11 
        // Collision Rate = Total Number of Collisions / Amount of hash keys
        // Overflow Rate =  Total number of overflows / Amount of hash keys

        for (let i = 0; i < currentTableContent.length; i++) {
            let currentId = currentTableContent[i].id

            //apply hash
            let bucketId = hashFunction(currentId)

            bucketIds = _.union(bucketIds, [bucketId])
        }

        bucketSize = Math.ceil(currentTableContent.length / bucketIds.length)

        dispatch({type: 'UPDATE_SIMDATA', payload: {
            meta: {
                ...state.meta,
                bucketAmount: bucketIds.length,
                bucketSize,
                bucketIds: bucketIds.sort()
            }
        }})
    }

    const mountBuckets = () => {
        console.log("Mounting Buckets")
        const { bucketIds, bucketSize, bucketAmount } = state.meta
        const { pageList } = state
        let overflowCounter = 0

        let bucketList = bucketIds.map((bucketId) => {
            return {
                id: bucketId,
                hashTable: [],
                overflowBuckets: []
            }
        })

        for (let i = 0; i < pageList.length; i++) {
            for (let j = 0; j < pageList[i].length; j++) {
                let currentPageId = i
                let currentTupleId = pageList[i][j].id

                //apply hash
                let currentHashKey = hashFunction(currentTupleId)

                let currentBucket = bucketList.find((bucket) => { return bucket.id === currentHashKey})
                if (currentBucket) {
                    if (currentBucket.hashTable.length < bucketSize) {
                        currentBucket.hashTable.push({
                            pageId: currentPageId,
                            tupleId: currentTupleId
                        })
                    } else {
                        //Overflow case
                        //inside currentBucket find the overflow array if empty create a bucket object inside
                        // if not empty but already full create another bucket inside overflow

                        if (currentBucket.overflowBuckets.length > 0) {
                            //there are overflowbuckets
                            let overflowBucketList = currentBucket.overflowBuckets
                            let currentOverflowBucket = overflowBucketList.find(overflowBucket => overflowBucket.hashTable.length < bucketSize)

                            if (currentOverflowBucket) {
                                currentOverflowBucket.hashTable.push({
                                    pageId: currentPageId,
                                    tupleId: currentTupleId
                                })
                            } else {
                                debugger
                                currentBucket.overflowBuckets[currentBucket.overflowBuckets.length-1] = []
                                currentBucket.overflowBuckets[currentBucket.overflowBuckets.length-1].push({
                                    id: currentBucket.id,
                                    hashTable: [{
                                        pageId: currentPageId,
                                        tupleId: currentTupleId
                                    }],
                                    isOverflowBucket: true
                                })
                                overflowCounter++
                            }
                        } else {
                            //There are no overflowbuckets inside this bucket yet
                            currentBucket.overflowBuckets = []
                            currentBucket.overflowBuckets.push({
                                id: currentBucket.id,
                                hashTable: [{
                                    pageId: currentPageId,
                                    tupleId: currentTupleId
                                }],
                                isOverflowBucket: true
                            })
                            overflowCounter++
                        }
                    }
                }
            }
        }

        const overflowRate = Math.floor((overflowCounter / bucketAmount))

        dispatch({type: 'UPDATE_SIMDATA', 
            payload: {
                ...state,
                bucketList,
                meta: {
                    ...state.meta, 
                    totalOverflowAmount: overflowCounter, 
                    overflowRate
                }
            }
        })

        console.log("Buckets Finished")
    }

    const handleFileRead = async event => {
        event.persist();

        if (!event.target || !event.target.files) {
            return;
        }

        const fileList = event.target.files;
        const latestUploadedFile = fileList.item(fileList.length - 1);

        try {
            const fileContent = await readFileContent(latestUploadedFile);
            dispatch({type: 'UPDATE_SIMDATA', payload: {meta: {...state.meta, fileContent: fileContent, file: latestUploadedFile}}})
        } catch (e) {
            console.log(e);
        }
    }

    return (
        <form className="main-form" onSubmit={handleInitFormSubmit}>
            <div className="main-form_input-group">
                <label htmlFor="main-form-file-input" className="bold">File Import:</label>
                <input type="file" name="main-form-file-input" id="main-form-file-input" placeholder="0" onChange={handleFileRead} required/>
            </div>

            <div className="toggle-radio">
                <label className="text-left bold">Page Settings: </label>
                <input type="radio" name="pageSettings" value="page-Amount" id="page-Amount" required defaultChecked/>
                <label htmlFor="page-Amount">Page Amount</label>

                <input type="radio" name="pageSettings" value="page-Size" id="page-Size" />
                <label htmlFor="page-Size">Page Size (in Tuples)</label>
            </div>

            <div className="main-form_input-group">
                <input type="text" name="pageSet" id="pageSet" placeholder="0" required/>
            </div>

            <div className="main-form_input-group">
                <label className="bold">Hash Function:</label>
                <div>
                    {state.meta.hashFunction}
                </div>
            </div>

            <button className="submit-button" type="submit">
                Simulate
            </button>
        </form>
    )
}

export default InitForm