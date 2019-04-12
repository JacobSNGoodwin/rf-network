import path from 'path'

import Network from '../dist/index'
import readFileAsync from './util/readFileAsync'
import { noOptions, emptyOptions, uncommonOptions } from './util/options'

let s1p, s2p, s2p_3, s3p, s4p

beforeAll(async () => {
  s1p = await readFileAsync(path.join(__dirname, 'testFiles', 'example1.s1p'))
  s2p = await readFileAsync(path.join(__dirname, 'testFiles', 'example1.s2p'))
  s2p_3 = await readFileAsync(path.join(__dirname, 'testFiles', 'example3.s2p'))
  s3p = await readFileAsync(path.join(__dirname, 'testFiles', 'example1.s3p'))
  s4p = await readFileAsync(path.join(__dirname, 'testFiles', 'example1.s4p'))
})

describe('Properly loads options for example files', () => {
  test('s1p file', () => {
    const network = new Network(s1p, 'example1.s1p')
    expect(network.options.freqUnit).toBe('HZ')
    expect(network.options.paramType).toBe('S')
    expect(network.options.format).toBe('DB')
    expect(network.options.z0).toBe(50)
  })
  test('s2p file', () => {
    const network = new Network(s2p, 'example1.s2p')
    expect(network.options.freqUnit).toBe('HZ')
    expect(network.options.paramType).toBe('S')
    expect(network.options.format).toBe('DB')
    expect(network.options.z0).toBe(50)
  })
  test('s2p file - 3', () => {
    const network = new Network(s2p_3, 'example3.s2p')
    expect(network.options.freqUnit).toBe('MHZ')
    expect(network.options.paramType).toBe('S')
    expect(network.options.format).toBe('DB')
    expect(network.options.z0).toBe(50)
  })
  test('s3p file', () => {
    const network = new Network(s3p, 'example1.s3p')
    expect(network.options.freqUnit).toBe('HZ')
    expect(network.options.paramType).toBe('S')
    expect(network.options.format).toBe('DB')
    expect(network.options.z0).toBe(50)
  })
  test('s4p file', () => {
    const network = new Network(s4p, 'example1.s4p')
    expect(network.options.freqUnit).toBe('HZ')
    expect(network.options.paramType).toBe('S')
    expect(network.options.format).toBe('RI')
    expect(network.options.z0).toBe(50)
  })
})

describe.skip('Properly handles default options cases', () => {
  test('Returns error if no comment line', () => {
    expect(() => {
      new Network(noOptions)
    }).toThrowError(new Error('Could not parse options index'))
  })
  test('Returns default on line with only #', () => {
    const network = new Network(emptyOptions)
    expect(network.options.freqUnit).toBe('GHZ')
    expect(network.options.paramType).toBe('S')
    expect(network.options.format).toBe('MA')
    expect(network.options.z0).toBe(50)
  })
  test('Works with less common options', () => {
    const network = new Network(uncommonOptions)
    expect(network.options.freqUnit).toBe('KHZ')
    expect(network.options.paramType).toBe('G')
    expect(network.options.format).toBe('RI')
    expect(network.options.z0).toBe(10.5)
  })
})
