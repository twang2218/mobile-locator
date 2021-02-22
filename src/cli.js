#!/usr/bin/env node

const program = require('commander');
const pkinfo = require('../package');
const api = require('.');
const map = require('./map');

function parseCell(info) {
  const result = {};
  const arr = info.split(',');
  if (arr.length === 4) {
    [
      result.mobileCountryCode,
      result.mobileNetworkCode,
      result.locationAreaCode,
      result.cellId,
    ] = arr;
  }
  return result;
}

function parseArguments(data) {
  const result = {};
  data.split(',').forEach((x) => {
    const pair = x.split(':');
    if (pair[0]) {
      result[pair[0].trim()] = pair[1].trim();
    }
  });
  return result;
}

function setup() {
  program
    .description('Locate geolocation information based on Cell base station data')
    .version(pkinfo.version)
    .option(
      '-c, --cell <cell>',
      'Cell tower base station information in format "MCC,MNC,LAC,CID". "-c 460,0,4219,20925"',
      parseCell,
    )
    .option(
      '-e, --engine <engine>',
      'Geolocation service engine. {cellocation, google, haoservice, mozilla, mylnikov, unwiredlabs, yandex}. Default: google',
      /^(cellocation|google|haoservice|mozilla|mylnikov|unwiredlabs|yandex)$/i,
      'google',
    )
    .option('-s, --signalStrength <number>', 'Signal strength [dBm], e.g. "-75".')
    .option(
      '-r, --radio <radioType>',
      'Radio type/access technology. {gsm, cdma, wcdma, lte}. e.g. "lte".',
      /^(gsm|cdma|wcdma|lte)$/i,
    )
    .option('-a, --arguments <arguments>', 'Arguments for geolocation engine. e.g. "key:XXX,oid:123".', parseArguments)
    .option(
      '-m, --map <map>',
      'Map service. {google, bing, openstreetmap, google.cn, bing.cn, baidu}. Default: google',
      /^(google|bing|google\.cn|bing\.cn|openstreetmap|baidu)$/i,
    )
    .option('-v, --verbose', 'Verbose output.')
    .on('--help', () => {
      console.log('  Examples:');
      console.log();
      console.log('    $ mobile-locator -a "key:XXX" -c 460,0,4219,20925');
      console.log('    $ mobile-locator -e cellocation -a "system:bd09" -m baidu -c 460,0,4219,20925');
      console.log();
    })
    .parse(process.argv);
}

function main() {
  if (program.verbose) {
    console.log('Geolocation engine: %j', program.engine);
    program.arguments.verbose = true;
  }
  const locate = api(program.engine, program.arguments);
  if (program.cell) {
    if (program.verbose) {
      console.log('cellInfo: %j', { ...program.cell, signalStrength: program.signalStrength });
    }
    locate({ ...program.cell, signalStrength: program.signalStrength, accessTechnology: program.radio })
      .then((location) => {
        if (program.verbose || program.map) {
          //  Verbose or need to show a map url
          console.log('Location: %j', location);
        } else {
          //  output pure JSON
          console.log(JSON.stringify(location));
        }

        if (program.map) {
          const url = map(program.map, location);
          console.log(`Map url: ${url}`);
        }
      })
      .catch((error) => {
        console.error(error);
        program.help();
      });
  } else {
    console.error('Missing cell base station information.');
    program.help();
  }
}

setup();
main();
