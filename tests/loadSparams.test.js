import fetch from 'cross-fetch'

test('Fetching fetch', async () => {
  const response = await fetch('http://localhost:3000/example1.s2p')
  console.log(response.text)
  expect(response).toBeTruthy()
})
