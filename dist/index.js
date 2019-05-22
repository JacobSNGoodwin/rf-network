"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var optionsFromText_1 = __importDefault(require("./util/optionsFromText"));
var dataFromTextLines_1 = __importDefault(require("./util/dataFromTextLines"));
var Network = /** @class */ (function () {
    function Network(touchstoneText, fileName) {
        var _this = this;
        // gets the options from the options line
        this.parseOptions = function (textLine) { return optionsFromText_1.default(textLine); };
        this.parseData = function (dataLines) {
            return dataFromTextLines_1.default(dataLines, _this._importOptions, _this.nPorts);
        };
        this._touchstoneText = touchstoneText;
        this._label = fileName;
        this._fileName = fileName;
        var fileType = fileName.split('.').pop();
        if (!fileType) {
            throw new Error('Could not determine file type or number of ports');
        }
        var matchArray = fileType.match(/\d+/g);
        if (!matchArray) {
            throw new Error('Could not determine file type or number of ports');
        }
        this._nPorts = +matchArray[0];
        // default parameter types
        this._importOptions = {
            freqUnit: 'GHz',
            paramType: 'S',
            importFormat: 'MA',
            z0: 50
        };
        this._freqUnit = 'GHz';
        this._paramType = 'S';
        this._z0 = 50;
        this._networkData = this.parseTouchstoneText(touchstoneText);
    }
    Object.defineProperty(Network.prototype, "touchstoneText", {
        get: function () {
            return this._touchstoneText;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Network.prototype, "label", {
        get: function () {
            return this._label;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Network.prototype, "fileName", {
        get: function () {
            return this._fileName;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Network.prototype, "data", {
        get: function () {
            return this._networkData;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Network.prototype, "nPorts", {
        get: function () {
            return this._nPorts;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Network.prototype, "freqUnit", {
        get: function () {
            return this._freqUnit;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Network.prototype, "paramType", {
        get: function () {
            return this._paramType;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Network.prototype, "z0", {
        get: function () {
            return this._z0;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Network.prototype, "setLabel", {
        set: function (newLabel) {
            this._label = newLabel;
        },
        enumerable: true,
        configurable: true
    });
    Network.prototype.parseTouchstoneText = function (text) {
        // get text line-by-line
        var textArray = text.split('\n');
        var optionsIndex = null;
        var dataIndex = null;
        for (var i = 0; i < textArray.length; i++) {
            if (textArray[i][0] === '#') {
                optionsIndex = i;
            }
            if (optionsIndex && // we've already found options
                textArray[i] && // the line has text
                i > optionsIndex && // we're past the options index
                textArray[i][0] !== '!' // it's not a comment line (can be comment after options, eww)
            ) {
                // start of data which needs to be handled different for different
                // values of nPort
                dataIndex = i;
                break;
            }
        }
        // Check if no options could be found
        if (!optionsIndex) {
            throw new Error('Could not parse options index');
        }
        if (!dataIndex) {
            throw new Error('Could not parse S-parameter data');
        }
        this._importOptions = this.parseOptions(textArray[optionsIndex]);
        this._freqUnit = this._importOptions.freqUnit;
        this._paramType = this._importOptions.paramType;
        this._z0 = this._importOptions.z0;
        var data = this.parseData(textArray.slice(dataIndex));
        return data;
    };
    return Network;
}());
exports.default = Network;
