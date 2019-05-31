interface Options {
  freqUnit: string
  paramType: string
  importFormat: string
  z0: number
}

interface NetworkData {
  freq: number[]
  s: SData[][][]
}

interface AllS {
  sRe: number[]
  sIm: number[]
  sMag: number[]
  sDb: number[]
  sAngle: number[]
  sDeg: number[]
}

interface SData extends AllS {
  sReMin: number
  sReMax: number
  sImMin: number
  sImMax: number
  sMagMin: number
  sMagMax: number
  sDbMin: number
  sDbMax: number
  sAngleMin: number
  sAngleMax: number
  sDegMin: number
  sDegMax: number
}

export { Options, NetworkData, AllS, SData }
