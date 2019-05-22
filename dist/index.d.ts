import { NetworkData } from './interfaces';
declare class Network {
    private _touchstoneText;
    private _networkData;
    private _fileName;
    private _label;
    private _nPorts;
    private _importOptions;
    private _freqUnit;
    private _paramType;
    private _z0;
    readonly touchstoneText: string;
    readonly label: string;
    readonly fileName: string;
    readonly data: NetworkData;
    readonly nPorts: number;
    readonly freqUnit: string;
    readonly paramType: string;
    readonly z0: number;
    setLabel: string;
    constructor(touchstoneText: string, fileName: string);
    private parseTouchstoneText;
    private parseOptions;
    private parseData;
}
export { Network as default };
