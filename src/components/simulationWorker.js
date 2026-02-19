// Web Worker for building simulation (Vite native worker)
self.addEventListener('message', e => {
    if (!e) return;

    console.time("BUILDING SIMULATION");
    const state = e.data
    let tableContent = state.table.content
    let bucketIds = []
    let bucketList = []
    let bucketSize = 0

    //Hash Function
    const hashFunction = (searchKey) => {
        return searchKey % 466997;
    }

    const hashFunctionWord = (searchKey) => {
        var hash = 0;
        if (searchKey.length === 0) {
            return hash;
        }
        for (var i = 0; i < searchKey.length; i++) {
            var char = searchKey.charCodeAt(i);
            hash = ((hash<<5)-hash)+char;
            hash = hash & hash;
        }
        return Math.abs(hash);
    }

    // Start - Setting up Bucket IDs List
    for (let i = 0; i < tableContent.length; i++) {
        let currentWord = tableContent[i].word

        let bucketId = hashFunctionWord(currentWord)
        bucketId = hashFunction(bucketId)

        bucketIds.push(bucketId)
        bucketList[bucketId] = {
            hashTable: [],
            overflowBuckets: []
        }
    }

    bucketIds = [...new Set(bucketIds)]
    bucketIds.sort()

    bucketSize = Math.ceil(tableContent.length / bucketIds.length)
    const bucketAmount = bucketIds.length

    // End - Setting up Bucket IDs List

    console.log("Mounting pages...")
    console.time("building pages");

    let calculatedPageSize = 0
    let calculatedPageAmount = 0
    const { pageAmount, pageSize } = state.meta
    let pageList = []
    const tableContentString = [...tableContent]

    if (pageAmount > 0) {
        calculatedPageSize = Math.ceil(tableContent.length / pageAmount)
        calculatedPageAmount = pageAmount
    } else if (pageSize > 0) {
        calculatedPageAmount = Math.ceil(tableContent.length / pageSize)
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

    console.timeEnd("building pages");

    console.log("Mounting buckets...")
    console.time("building buckets");

    let overflowCounter = 0
    for (let i = 0; i < pageList.length; i++) {
        for (let j = 0; j < pageList[i].length; j++) {
            let currentPageId = i
            let currentTupleWord = pageList[i][j].word
            let currentTupleId = pageList[i][j].id

            let currentHashKey = hashFunctionWord(currentTupleWord)
            let bucketId = hashFunction(currentHashKey)
            bucketId = bucketId === -0 ? 0 : bucketId

            let currentBucket = bucketList[bucketId]
            if (currentBucket) {
                if (currentBucket.hashTable.length < bucketSize) {
                    currentBucket.hashTable.push({
                        pageId: currentPageId,
                        tupleId: currentTupleId
                    })
                } else {
                    // Overflow case
                    if (currentBucket.overflowBuckets.length > 0) {
                        let overflowBucketList = currentBucket.overflowBuckets
                        let currentOverflowBucket = overflowBucketList.find((overflowBucket) => {return overflowBucket.hashTable.length < bucketSize})

                        if (currentOverflowBucket) {
                            currentOverflowBucket.hashTable.push({
                                pageId: currentPageId,
                                tupleId: currentTupleId
                            })
                        } else {
                            // All existing overflow buckets are full — create a new one
                            currentBucket.overflowBuckets.push({
                                id: bucketId,
                                hashTable: [{
                                    pageId: currentPageId,
                                    tupleId: currentTupleId
                                }],
                                isOverflowBucket: true
                            })
                            overflowCounter += 1
                        }
                    } else {
                        // First overflow bucket for this bucket
                        currentBucket.overflowBuckets = []
                        currentBucket.overflowBuckets.push({
                            id: bucketId,
                            hashTable: [{
                                pageId: currentPageId,
                                tupleId: currentTupleId
                            }],
                            isOverflowBucket: true
                        })
                        overflowCounter += 1
                    }
                }
            }
        }
    }

    const overflowRate = (overflowCounter / bucketAmount).toFixed(2) * 100 

    console.timeEnd("building buckets");
    console.timeEnd("BUILDING SIMULATION");
    const res = {
        rows: tableContent,
        pageList,
        bucketList,
        pageAmount: calculatedPageAmount,
        pageSize: calculatedPageSize,
        meta: {
            ...state.meta,
            bucketAmount: bucketIds.length,
            bucketSize,
            bucketIds: bucketIds,
            totalOverflowAmount: overflowCounter,
            overflowRate
        }
    }

    console.log(res)
    postMessage(res)
})
