import fs from 'fs'

const readFileAsync = fileName => {
  return new Promise(function(resolve, reject) {
    fs.readFile(fileName, (err, data) => {
      err ? reject(err) : resolve(data)
    })
  })
}

export default readFileAsync
