interface Options {
    freqUnit: string;
    paramType: string;
    importFormat: string;
    z0: number;
}
interface NetworkData {
    freq: number[];
    s: SData[][];
}
interface AllS {
    sRe: number;
    sIm: number;
    sMag: number;
    sDb: number;
    sAngle: number;
    sDeg: number;
}
interface SData {
    sRe: number[];
    sReMin: number | null;
    sReMax: number | null;
    sIm: number[];
    sImMin: number | null;
    sImMax: number | null;
    sMag: number[];
    sMagMin: number | null;
    sMagMax: number | null;
    sDb: number[];
    sDbMin: number | null;
    sDbMax: number | null;
    sAngle: number[];
    sAngleMin: number | null;
    sAngleMax: number | null;
    sDeg: number[];
    sDegMin: number | null;
    sDegMax: number | null;
}
export { Options, NetworkData, AllS, SData };
