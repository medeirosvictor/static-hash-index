import React, { useContext, useState } from 'react'
import SearchForm from "./SearchForm"
import SimulationContext from './contexts/SimulationContext'
import simulationWorker from './simulationWorker.js'
import WebWorker from './workerSetup'
import Table from './Table'
import PageList from './PageList'
import BucketList from './BucketList'
import loading from './loading.gif'
import SimulationInfo from './SimulationInfo'

const Simulation = () => {
    const { state, dispatch } = useContext(SimulationContext)
    const [ table, setTable ] = useState({})
    const [ pageList, setPageList ] = useState([])
    const [ bucketList, setBucketList ] = useState([])
    const [ simulationStatus, setSimulationStatus ] = useState("")
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
            dispatch({type: 'UPDATE_SIMDATA', payload: { table: {...state.table, ...body.table}}})
            setTable(body.table)
            buildSimulation()
        })
        
    }

    const buildSimulation = () => {
        setSimulationStatus("building")
        dispatch({type: 'UPDATE_SIMDATA', payload: {meta: {...state.meta, simulationStatus: "building"}}})
        tW.postMessage(state)
        
        tW.addEventListener('message', event => {
            dispatch({type: 'UPDATE_SIMDATA', payload:
                {
                    pageList: event.data.pageList,
                    bucketList: event.data.bucketList,
                    meta: {
                        ...state.meta,
                        pageAmount: event.data.pageAmount,
                        pageSize: event.data.pageSize,
                        bucketAmount: event.data.meta.bucketAmount,
                        bucketSize: event.data.meta.bucketSize,
                        bucketIds: event.data.meta.bucketIds,
                        totalOverflowAmount: event.data.meta.totalOverflowAmount, 
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

            setPageList(state.pageList)
            setBucketList(state.bucketList)
            setSimulationStatus("running")
            dispatch({type: 'UPDATE_SIMDATA', payload: {meta: {...state.meta, simulationStatus: "running"}}})
            // navigate("/simulation")
        })
    }

    return (
        <div>
            { simulationStatus === 'building' || simulationStatus === 'running' ? 
                <div>
                    <div className="text-center">{simulationStatus === "running" ? <span>Simulation is Running</span> : <span>Building Simulation <img className="loading-icon" src={loading} alt="loading-icon"/></span>}</div>
                    {simulationStatus === "running" ? 
                    <div className="simulation-status">
                        <SimulationInfo />
                        <SearchForm/>
                    </div>
                    :
                    null}
                </div>
            :
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

                <button className="submit-button" type="submit">
                    Simulate
                </button>
            </form>
            }

            <Table table={table.content}/>
            <PageList pageList={pageList}/>
            <BucketList bucketList={bucketList}/>
        </div>
    )
}

export default Simulation