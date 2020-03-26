import React, { useContext, useEffect, useState } from 'react'
import { navigate, Redirect } from "@reach/router"
import { readFileContent } from './helpers/Helpers.js'
import SimulationContext from './contexts/SimulationContext'
import simulationWorker from './simulationWorker.js'
import WebWorker from './workerSetup'
import Table from './Table'

const InitForm = () => {
    const { state, dispatch } = useContext(SimulationContext)
    const [ table, setTable ] = useState({})
    const tW = new WebWorker(simulationWorker)


    const handlePageSettings = (e) => {
        const currentPageSettingSelectedRadio = e.target.elements.pageSettings.value
        const val = parseInt(e.target.elements.pageSet.value)

        if (currentPageSettingSelectedRadio === 'page-Amount') {
            dispatch({type: 'UPDATE_SIMDATA', payload: {meta: {...state.meta, pageAmount: val}}})
        } else {
            dispatch({type: 'UPDATE_SIMDATA', payload: {meta: {...state.meta, pageSize: val}}})
        }
    }

    function handleInitFormSubmit(e) {
        e.preventDefault()
        handlePageSettings(e)
        console.log("Fetching table...")
        fetch('/api/simulation/table', {
            headers : { 
              'Content-Type': 'application/json',
              'Accept': 'application/json'
             }
          })
        .then(response => response.json())
        .then(body => {
            console.log(body);
            dispatch({type: 'UPDATE_SIMDATA', payload: { table: {...state.table, ...body.table}}})
            setTable(body.table)
            buildSimulation()
        })
    }

    const buildSimulation = () => {
        tW.postMessage(state)
        
        tW.addEventListener('message', event => {
            dispatch({type: 'UPDATE_SIMDATA', payload:
                {
                    pageList: event.data.pageList,
                    bucketList: event.data.bucketList,
                    meta: {
                        ...state.meta,
                        pageAmount: event.data.calculatedPageAmount,
                        pageSize: event.data.calculatedPageSize,
                        bucketAmount: event.data.meta.bucketAmount,
                        bucketSize: event.data.meta.bucketSize,
                        bucketIds: event.data.meta.bucketIds,
                        totalOverflowAmount: event.data.meta.overflowCounter, 
                        overflowRate: event.data.meta.overflowRate,
                        isRunning: true
                    },
                    table: {
                        ...state.table,
                        content: event.data.rows,
                        meta: {
                            rowCount: event.data.rows.length,
                            columns: ["id", "word"]
                        }
                    }
                }
            })
        })
    }

    return (
        <div>
            <form className="main-form" onSubmit={handleInitFormSubmit}>
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
            <Table table={table.content}/>
        </div>
    )
}

export default InitForm