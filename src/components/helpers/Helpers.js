export const hashFunction = (searchKey) => {
    return searchKey % 11
}

export const hashFunctionWord = (searchKey) => {
    var hash = 0
    if (searchKey.length === 0) return hash
    for (var i = 0; i < searchKey.length; i++) {
        var char = searchKey.charCodeAt(i)
        hash = ((hash << 5) - hash) + char
        hash = hash & hash
    }
    return Math.abs(hash)
}

export const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]]
    }
}

export const readFileContent = (uploadedFile) => {
    const reader = new FileReader()
    return new Promise((resolve, reject) => {
        reader.onload = () => {
            resolve(reader.result)
        }
        reader.onerror = () => {
            reader.abort()
            reject(new DOMException("Problem parsing input file."))
        }
        reader.readAsText(uploadedFile)
    })
}
