const InitState = {
    meta: {
        file: {},
        fileContent: "",
        pageSize: 0,
        pageAmount: 0,
        bucketAmount: 0,
        bucketIds: [],
        bucketSize: 0,
        simulationStatus: false,
        hashFunction: "H(k) = |k| mod 466997",
        collisionRate: 0,
        overflowRate: 0,
        totalCollisionAmount: 0,
        totalOverflowAmount: 0
    },
    table: {
        meta: {
            rowCount: 0,
            columns: ["id", "word"]
        },
        content: []
    },
    pageList: [],
    bucketList: []
}

export default InitState