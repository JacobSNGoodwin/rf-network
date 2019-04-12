import path from 'path'
import readFileAsync from './util/readFileAsync'

let s1p_1, s1p_2, s2p_1, s2p_2, s2p_3, s3p_1, s4p_1

beforeAll(async () => {
  s1p_1 = await readFileAsync(path.join(__dirname, 'testFiles', 'example1.s1p'))
  s1p_2 = await readFileAsync(path.join(__dirname, 'testFiles', 'example2.s1p'))
  s2p_1 = await readFileAsync(path.join(__dirname, 'testFiles', 'example1.s2p'))
  s2p_2 = await readFileAsync(path.join(__dirname, 'testFiles', 'example2.s2p'))
  s2p_3 = await readFileAsync(path.join(__dirname, 'testFiles', 'example3.s2p'))
  s3p_1 = await readFileAsync(path.join(__dirname, 'testFiles', 'example1.s3p'))
  s4p_1 = await readFileAsync(path.join(__dirname, 'testFiles', 'example1.s4p'))
})

describe('Properly loads options for example files', () => {
  test('loads a file', () => {
    expect(s1p_1).toBeTruthy()
  })
})
