"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function optionsFromText(optionsLine) {
    var options = {
        freqUnit: 'GHZ',
        paramType: 'S',
        importFormat: 'MA',
        z0: 50
    };
    // split tokens and trim whitespace
    var optionsArray = optionsLine
        .trim()
        .toUpperCase()
        .split(/\s+/);
    while (optionsArray.length > 0) {
        // shift elements out of array as they're found
        var option = optionsArray[0];
        if (option === '#') {
            optionsArray.shift();
        }
        else if (option === 'GHZ' ||
            option === 'MHZ' ||
            option === 'KHZ' ||
            option === 'HZ') {
            options.freqUnit = optionsArray.shift();
        }
        else if (option === 'S' ||
            option === 'Y' ||
            option === 'Z' ||
            option === 'H' ||
            option === 'G') {
            options.paramType = optionsArray.shift();
            // if (options.paramType !== 'S') {
            //   throw new Error('Currently only S-parameters are supported')
            // }
        }
        else if (option === 'DB' || option === 'MA' || option === 'RI') {
            options.importFormat = optionsArray.shift();
        }
        else if (option === 'R') {
            optionsArray.shift();
            options.z0 = +optionsArray.shift();
        }
        else {
            optionsArray.shift();
        }
    }
    return options;
}
exports.optionsFromText = optionsFromText;
