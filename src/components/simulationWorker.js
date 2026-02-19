// Web Worker for building simulation (Vite native worker)
self.addEventListener('message', e => {
    if (!e) return;

    const state = e.data
    let tableContent = state.table.content
    let bucketIds = []
    let bucketList = []
    let bucketSize = 0

    //Hash Function
    const hashFunction = (searchKey) => {
        return searchKey % 11;
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

    let calculatedPageSize = 0
    let calculatedPageAmount = 0
    const { pageAmount, pageSize } = state.meta
    let pageList = []

    if (pageAmount > 0) {
        calculatedPageSize = Math.ceil(tableContent.length / pageAmount)
        calculatedPageAmount = pageAmount
    } else if (pageSize > 0) {
        calculatedPageAmount = Math.ceil(tableContent.length / pageSize)
        calculatedPageSize = pageSize
    }

    // Fisher-Yates shuffle (O(n) instead of O(n²) splice)
    const shuffled = tableContent.slice()
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }

    // Slice shuffled array into pages
    for (let i = 0; i < calculatedPageAmount; i++) {
        const start = i * calculatedPageSize
        if (start >= shuffled.length) break
        const end = Math.min(start + calculatedPageSize, shuffled.length)
        pageList[i] = shuffled.slice(start, end)
    }

    // Build buckets

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

    // Convert sparse array to dense object for efficient postMessage serialization
    const compactBucketList = {}
    bucketList.forEach((bucket, i) => {
        if (bucket !== undefined) {
            compactBucketList[i] = bucket
        }
    })

    const res = {
        rows: tableContent,
        pageList,
        bucketList: compactBucketList,
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

    postMessage(res)
})
