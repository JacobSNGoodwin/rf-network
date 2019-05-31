import path from 'path'

import Network from '../dist/index'
import readFileAsync from './util/readFileAsync'

let s1p, s2p, s3p
let network1, network2, network3

beforeAll(async () => {
  s1p = await readFileAsync(path.join(__dirname, 'testFiles', 'example1.s1p'))
  s2p = await readFileAsync(path.join(__dirname, 'testFiles', 'example1.s2p'))
  s3p = await readFileAsync(path.join(__dirname, 'testFiles', 'example1.s3p'))
  network1 = new Network(s1p, 'dummy.s1p')
  network2 = new Network(s2p, 'dummy.s2p')
  network3 = new Network(s3p, 'dummy.s3p')
})

describe('Creates S-parameter data', () => {
  test.skip('prints out network data for kicks and giggles', () => {
    console.log(network1.data.freq)
    console.log(network1.data.s[0][0].sRe)
    console.log(network1.data.s[0][0].sIm)
    console.log(network1.data.s[0][0].sMag)
    console.log(network1.data.s[0][0].sDb)
    console.log(network1.data.s[0][0].sAngle)
    console.log(network1.data.s[0][0].sDeg)
  })
})
