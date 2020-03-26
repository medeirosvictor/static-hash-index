export default () => {
    self.addEventListener('message', e => { // eslint-disable-line no-restricted-globals
            if (!e) return;

            console.time("BUILDING SIMULATION");
            const state = e.data
            let tableContent = state.table.content
            let bucketIds = []
            let bucketSize = 0
            tableContent = tableContent.splice(10000, Number.MAX_VALUE)
            console.log(tableContent)

            const hashFunction = (searchKey) => {
                var hash = 0;
                if (searchKey.length == 0) {
                    return hash;
                }
                for (var i = 0; i < searchKey.length; i++) {
                    var char = searchKey.charCodeAt(i);
                    hash = ((hash<<5)-hash)+char;
                    hash = hash & hash; // Convert to 32bit integer
                }
                return hash;
            }

            console.log("Bucket setup")

            for (let i = 0; i < tableContent.length; i++) {
                let currentWord = tableContent[i].word

                let bucketId = hashFunction(currentWord)

                bucketIds.push(bucketId)
            }

            console.log("removing dale")
            console.log(bucketIds)
            bucketIds = [...new Set(bucketIds)]
            console.log(bucketIds)

            bucketSize = Math.ceil(tableContent.length / bucketIds.length)
            let overflowCounter = 0
            const bucketAmount = bucketIds.length

            let bucketList = bucketIds.map((bucketId) => {
                return {
                    id: bucketId,
                    hashTable: [],
                    overflowBuckets: []
                }
            })

            console.log("End Bucket setup")

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
            console.log(pageList)
            console.timeEnd("building pages");

            console.log("Mounting buckets...")
            console.time("building buckets");

            const currentHashFunction = state.meta.hashFunction
            console.log(currentHashFunction)

            //H(k) = |k| mod 11 
            // Collision Rate = Total Number of Collisions / Amount of hash keys
            // Overflow Rate =  Total number of overflows / Amount of hash keys

            for (let i = 0; i < pageList.length; i++) {
                for (let j = 0; j < pageList[i].length; j++) {
                    let currentPageId = i
                    let currentTupleWord = pageList[i][j].word

                    //apply hash
                    let currentHashKey = hashFunction(currentTupleWord)

                    let currentBucket = bucketList.find((bucket) => { return bucket.id === currentHashKey})
                    if (currentBucket) {
                        if (currentBucket.hashTable.length < bucketSize) {
                            currentBucket.hashTable.push({
                                pageId: currentPageId,
                                tupleId: currentTupleWord
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
                                        tupleId: currentTupleWord
                                    })
                                } else {
                                    currentBucket.overflowBuckets[currentBucket.overflowBuckets.length-1] = []
                                    currentBucket.overflowBuckets[currentBucket.overflowBuckets.length-1].push({
                                        id: currentBucket.id,
                                        hashTable: [{
                                            pageId: currentPageId,
                                            tupleId: currentTupleWord
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
                                        tupleId: currentTupleWord
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
                    bucketIds: bucketIds.sort(),
                    totalOverflowAmount: overflowCounter,
                    overflowRate
                }
            }

            console.log(res)
            postMessage(res)
        }
    )
}