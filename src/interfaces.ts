interface Options {
  freqUnit: string
  paramType: string
  importFormat: string
  z0: number
}

interface NetworkData {
  freq: number[]
  s: SData[][]
}

interface AllS {
  sRe: number
  sIm: number
  sMag: number
  sDb: number
  sAngle: number
  sDeg: number
}

interface SData {
  sRe: number[]
  sReMin: number
  sReMax: number
  sIm: number[]
  sImMin: number
  sImMax: number
  sMag: number[]
  sMagMin: number
  sMagMax: number
  sDb: number[]
  sDbMin: number
  sDbMax: number
  sAngle: number[]
  sAngleMin: number
  sAngleMax: number
  sDeg: number[]
  sDegMin: number
  sDegMax: number
}

export { Options, NetworkData, AllS, SData }
