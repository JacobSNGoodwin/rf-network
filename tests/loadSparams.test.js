import fetch from 'cross-fetch'

test('Fetching fetch', async () => {
  const response = await fetch('http://localhost:3000/example1.s2p')
  const text = await response

  console.log(typeof response)
  expect(response).toBeTruthy()
})
