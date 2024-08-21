const _readFile = (src, callback = () => {}, type = 'json') => fetch(src).then(responce => responce[type]()).then(data => callback(data))

export const readJSONFromFile = (src, callback) => _readFile(src, callback, 'json')
export const readTextFromFile = (src, callback) => _readFile(src, callback, 'text')
