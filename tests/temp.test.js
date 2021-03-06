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
  test('prints out network data for kicks and giggles', () => {
    console.log(network1.data.freq)
    console.log(network1.data.s[0][0].sReMax)
    console.log(network1.data.s[0][0].sReMin)
    console.log(network1.data.s[0][0].sImMax)
    console.log(network1.data.s[0][0].sImMin)
    console.log(network1.data.s[0][0].sMagMax)
    console.log(network1.data.s[0][0].sMagMin)
    console.log(network1.data.s[0][0].sDbMax)
    console.log(network1.data.s[0][0].sDbMin)
    console.log(network1.data.s[0][0].sAngleMax)
    console.log(network1.data.s[0][0].sAngleMin)
    console.log(network1.data.s[0][0].sDegMax)
    console.log(network1.data.s[0][0].sDegMin)
  })
})
