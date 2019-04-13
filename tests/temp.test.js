import path from 'path'

import Network from '../dist/index'
import readFileAsync from './util/readFileAsync'

let s1p, s2p, s2p_3, s3p, s4p

beforeAll(async () => {
  s1p = await readFileAsync(path.join(__dirname, 'testFiles', 'example1.s1p'))
  s2p = await readFileAsync(path.join(__dirname, 'testFiles', 'example1.s2p'))
  // s2p_3 = await readFileAsync(path.join(__dirname, 'testFiles', 'example3.s2p'))
  // s3p = await readFileAsync(path.join(__dirname, 'testFiles', 'example1.s3p'))
  // s4p = await readFileAsync(path.join(__dirname, 'testFiles', 'example1.s4p'))
})

describe('It is just for playing around', () => {
  test('It creates a network', () => {
    const network = new Network(s1p, 'dummy.s1p')
  })
})
