module.exports.shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

module.exports.mountTables = (simulationData, fileContentArray) => {
    console.log("Mounting tables")
    console.time("Mounting tables");
    let randomListSearchKeyIds = []
    let rows = []

    for (let i = 0; i < fileContentArray.length; i++) {
        randomListSearchKeyIds.push(i)
    }

    this.shuffleArray(randomListSearchKeyIds)

    fileContentArray.forEach((word) => {
        let rand = Math.floor(Math.random()*randomListSearchKeyIds.length)
        let id = randomListSearchKeyIds[rand]
        randomListSearchKeyIds.splice(rand, 1)
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

module.exports.mountPages = (simulationData, fileContentArray) => {
    return 0
}