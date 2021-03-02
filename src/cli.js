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
      '-c, --cell <string>',
      'Cell tower base station information in format "MCC,MNC,LAC,CID". "-c 460,0,4219,20925"',
      parseCell,
    )
    .option(
      '-e, --engine <string>',
      'Geolocation service engine. {cellocation, google, haoservice, mozilla, mylnikov, unwiredlabs, yandex}. Default: google',
      /^(cellocation|google|haoservice|mozilla|mylnikov|unwiredlabs|yandex)$/i,
      'google',
    )
    .option('-s, --signal <number>', 'Signal strength [dBm], e.g. "-75".')
    .option(
      '-r, --radio <string>',
      'Radio type/access technology. {gsm, cdma, wcdma, lte}. e.g. "lte".',
      /^(gsm|cdma|wcdma|lte)$/i,
    )
    .option('-a, --arguments <string>', 'Arguments for geolocation engine. e.g. "key:XXX,oid:123".', parseArguments)
    .option(
      '-m, --map <string>',
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

async function main() {
  if (!program.cell) {
    console.error('Missing cell base station information.');
    program.help();
    return;
  }

  if (program.verbose) {
    console.log('Geolocation engine: %j', program.engine);
    console.log('CellInfo: %j', { ...program.cell, signalStrength: program.signal });
    program.arguments.verbose = true;
  }

  const locate = api(program.engine, program.arguments);

  try {
    const location = await locate({
      ...program.cell,
      signalStrength: program.signal,
      accessTechnology: program.radio,
    });

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
  } catch (error) {
    console.error(error);
    program.help();
  }
}

setup();
main();
