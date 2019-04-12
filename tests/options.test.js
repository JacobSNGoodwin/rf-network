import path from 'path'
import readFileAsync from './util/readFileAsync'

let s1p_1
// , s1p_2, s2p_1, s2p_3, s3p_1, s4p_1

beforeAll(async () => {
  s1p_1 = await readFileAsync(path.join(__dirname, 'testFiles', 'example1.s1p'))
})

test('loads a file', () => {
  console.log(s1p_1)
  expect(true).toBeTruthy()
})
