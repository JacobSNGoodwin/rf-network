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
    expect(network2.data.s[1][0].sDb.length).toBe(41)
    expect(network4.data.s[2][2].sRe.length).toBe(1601)
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

  test('It converts the data properly', () => {
    // MA case
    // 230.431 0.975 -71.104 0.217 -48.452 7.918e-3 67.181 0.525 -169.728
    expect(network2_2.data.s[1][0].sRe[5]).toBeCloseTo(0.1439246552667171)
    expect(network2_2.data.s[1][0].sIm[5]).toBeCloseTo(-0.16240287437837006)
    expect(network2_2.data.s[1][0].sMag[5]).toBeCloseTo(0.217)
    expect(network2_2.data.s[1][0].sDb[5]).toBeCloseTo(-13.27080532302941)
    expect(network2_2.data.s[1][0].sAngle[5]).toBeCloseTo(-0.8456469291762926)
    expect(network2_2.data.s[1][0].sDeg[5]).toBeCloseTo(-48.452)
    // dB case
    //  20000000000 -11.263715 17.916544 -4.8917756 -67.797379 -4.7602587 -68.288925
    // -4.8525558 -67.711555 -12.181918 57.625542 -21.875328 -18.668461
    // -4.7540789 -68.356712 -21.906563 -19.079386 -11.333095 49.025524
    expect(network3.data.s[2][2].sRe[199]).toBeCloseTo(0.17785476559897753)
    expect(network3.data.s[2][2].sIm[199]).toBeCloseTo(0.20478267746196555)
    expect(network3.data.s[2][2].sMag[199]).toBeCloseTo(0.2712347002777459)
    expect(network3.data.s[2][2].sDb[199]).toBeCloseTo(-11.333095)
    expect(network3.data.s[2][2].sAngle[199]).toBeCloseTo(0.8556568113155004)
    expect(network3.data.s[2][2].sDeg[199]).toBeCloseTo(49.025524)

    // RI case
    // 10000000	-4.189702e-004	-6.036301e-003	1.125312e-004	1.948526e-003	9.888079e-001	-3.101550e-002	4.432041e-004	1.257651e-002
    // 1.148831e-004	1.945504e-003	-2.293476e-005	-5.343654e-003	4.434631e-004	1.258978e-002	9.882661e-001	-3.080080e-002
    // 9.879310e-001	-3.076082e-002	4.410421e-004	1.258389e-002	2.321825e-004	-5.372035e-003	9.465918e-005	1.955993e-003
    // 4.451862e-004	1.257572e-002	9.885864e-001	-3.089876e-002	9.581627e-005	1.958501e-003	-2.207836e-005	-5.279712e-003
    expect(network4.data.s[0][0].sRe[0]).toBeCloseTo(-4.189702e-4)
    expect(network4.data.s[0][0].sIm[0]).toBeCloseTo(-6.036301e-3)
    expect(network4.data.s[0][0].sMag[0]).toBeCloseTo(0.006050823563044046)
    expect(network4.data.s[0][0].sDb[0]).toBeCloseTo(-44.3637102109384)
    expect(network4.data.s[0][0].sAngle[0]).toBeCloseTo(-1.640093622849606)
    expect(network4.data.s[0][0].sDeg[0]).toBeCloseTo(-93.97044259560342)
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
