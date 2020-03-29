module.exports.shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

module.exports.mountTables = (simulationData, fileContentArray) => {
    console.log("Mounting tables")
    console.time("Mounting tables");
    let rows = []

    const hashFunction = (searchKey) => {
        var hash = 0;
        if (searchKey.length === 0) {
            return hash;
        }
        for (var i = 0; i < searchKey.length; i++) {
            var char = searchKey.charCodeAt(i);
            //shift 5 binary to left add char code for each char in the object (could be * 32 but bit shift is faster)
            hash = ((hash<<5)-hash)+char;
            hash = hash & hash; // Convert to 32bit integer
        }
        return hash;
    }

    fileContentArray.forEach((word) => {
        let id = hashFunction(word)
        rows.push({id, word})
    })

    console.timeEnd("Mounting tables");
    simulationData.table  = {
        table: {
            ...simulationData.table,
            content: rows,
            meta: {
                rowCount: rows.length,
                columns: ["id", "word"]
            }
        }
    }

    console.log(simulationData)
    return simulationData
}

module.exports.mountPages = (simulationData, meta) => {
    let calculatedPageSize = 0
    let calculatedPageAmount = 0
    const { table } = simulationData
    const { pageAmount, pageSize } = meta
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

    simulationData.pageList = pageList
    simulationData.meta = {
        pageAmount: calculatedPageAmount, pageSize: calculatedPageSize
    }

    console.log(simulationData)
    return simulationData
}