const app = require('./server')

module.exports = async () => {
  global.httpServer = await app.listen(3000, () =>
    console.log(`App listening on port 3000!`)
  )
}
