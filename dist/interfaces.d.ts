import math from 'mathjs';
interface Options {
    freqUnit: string;
    paramType: string;
    importFormat: string;
    z0: number;
}
interface NetworkData {
    freq: number[];
    s: math.Complex[][][];
}
export { Options, NetworkData };
