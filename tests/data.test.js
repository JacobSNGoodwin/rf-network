import path from 'path'

import Network from '../dist/index'
import readFileAsync from './util/readFileAsync'

let s1p, s2p, s2p_2, s3p, s4p
let network1, network2, network2_2, network3, network4

beforeAll(async () => {
  s1p = await readFileAsync(path.join(__dirname, 'testFiles', 'example1.s1p'))
  s2p = await readFileAsync(path.join(__dirname, 'testFiles', 'example1.s2p'))
  s2p_2 = await readFileAsync(path.join(__dirname, 'testFiles', 'example2.s2p'))
  s3p = await readFileAsync(path.join(__dirname, 'testFiles', 'example1.s3p'))
  s4p = await readFileAsync(path.join(__dirname, 'testFiles', 'example1.s4p'))
  network1 = new Network(s1p, 'dummy.s1p')
  network2 = new Network(s2p, 'dummy.s2p')
  network2_2 = new Network(s2p_2, 'dummy.s2p')
  network3 = new Network(s3p, 'dummy.s3p')
  network4 = new Network(s4p, 'dummy.s4p')
})

describe('Creates correct s-parameter data from touchstone file', () => {
  test('It retrieves the proper number of frequencies', () => {
    expect(network2.data.freq.length).toBe(41)
    expect(network4.data.freq.length).toBe(1601)
    expect(network2.data.s[1][0].length).toBe(41)
    expect(network4.data.s[2][2].length).toBe(1601)
  })

  test('It creates S-parameter arrays of proper dimensions', () => {
    // dimensions are S_nm
    expect(network1.data.s.length).toBe(1) // n=1
    expect(network1.data.s[0].length).toBe(1) // m=1
    expect(network2.data.s.length).toBe(2) // n=2
    expect(network2.data.s[1].length).toBe(2) // m=2
    expect(network3.data.s.length).toBe(3) // n=3
    expect(network3.data.s[2].length).toBe(3) // m=3
    expect(network4.data.s.length).toBe(4) // n=4
    expect(network4.data.s[3].length).toBe(4) // m=4
  })

  test('It converts the data propery to real/imag', () => {
    // MA case
    // 230.431 0.975 -71.104 0.217 -48.452 7.918e-3 67.181 0.525 -169.728
    expect(network2_2.data.s[1][0][5].re).toBeCloseTo(0.1439246552667171)
    expect(network2_2.data.s[1][0][5].im).toBeCloseTo(-0.16240287437837006)
    // dB case
    //  20000000000 -11.263715 17.916544 -4.8917756 -67.797379 -4.7602587 -68.288925
    // -4.8525558 -67.711555 -12.181918 57.625542 -21.875328 -18.668461
    // -4.7540789 -68.356712 -21.906563 -19.079386 -11.333095 49.025524
    expect(network3.data.s[2][2][199].re).toBeCloseTo(0.17785476559897753)
    expect(network3.data.s[2][2][199].im).toBeCloseTo(0.20478267746196555)
  })

  test('It retrieves the frequency', () => {
    // 230.431 0.975 -71.104 0.217 -48.452 7.918e-3 67.181 0.525 -169.728
    expect(network2_2.data.freq[5]).toBe(230.431)
    //  20000000000 -11.263715 17.916544 -4.8917756 -67.797379 -4.7602587 -68.288925
    // -4.8525558 -67.711555 -12.181918 57.625542 -21.875328 -18.668461
    // -4.7540789 -68.356712 -21.906563 -19.079386 -11.333095 49.025524
    expect(network3.data.freq[199]).toBe(20000000000)
  })
})
