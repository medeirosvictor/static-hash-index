export default () => {
    self.addEventListener('message', e => { // eslint-disable-line no-restricted-globals
        if (!e) return;
        console.log("Mounting pages...")

        let calculatedPageSize = 0
        let calculatedPageAmount = 0
        const { table } = e.data
        const { pageAmount, pageSize } = e.data.meta
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

        const res = {
            pageList,
            pageAmount: calculatedPageAmount,
            pageSize: calculatedPageSize
        }

        postMessage(res)
        }
    )
}