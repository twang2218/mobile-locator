#!/usr/bin/env node

import program from 'commander';
import pkinfo from '../package';
import LocatorManager from './index';
import MapServices from './mapservice';

function parseCell(info) {
  const result = {};
  const arr = info.split(',');
  if (arr.length === 4) {
    result.mcc = arr[0];
    result.mnc = arr[1];
    result.lac = arr[2];
    result.cid = arr[3];
  }
  return result;
}

function parseArguments(data) {
  const result = {};
  data.split(',')
    .forEach(x => {
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
    .option('-c, --cell <cell>',
      'Cell tower base station information in format "MCC,MNC,LAC,CID". "-c 460,0,4219,20925"', parseCell)
    .option('-e, --engine <engine>',
      'Geolocation service engine. {google, mozilla, opencellid, yandex, cellocation, gpsspg, haoservice, mylnikov}. Default: google',
      /^(google|mozilla|opencellid|yandex|cellocation|gpsspg|haoservice|mylnikov)$/i, 'google')
    .option('-a, --arguments <arguments>', 'Arguments for geolocation engine. e.g. "key:XXX,oid:123".', parseArguments)
    .option('-m, --map <map>', 'Map service. {google, bing, openstreetmap, google.cn, bing.cn, baidu}. Default: google',
      /^(google|bing|google\.cn|bing\.cn|openstreetmap|baidu)$/i)
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
  const locator = new LocatorManager();
  const engine = locator.createEngine(program.engine, program.arguments);
  if (program.cell) {
    if (program.verbose) {
      console.log('Cell: %j', program.cell);
    }
    engine.locate(program.cell, (error, location) => {
      if (error) {
        console.error(error);
        program.help();
        return;
      }

      if (program.verbose || program.map) {
        //  Verbose or need to show a map url
        console.log('Location: %j', location);
      } else {
        //  output pure JSON
        console.log(JSON.stringify(location));
      }

      if (program.map) {
        const map = new MapServices();
        const url = map.format(program.map, location);
        console.log(`Map url: ${url}`);
      }
      return;
    });
  } else {
    console.error('Missing cell base station information.');
    program.help();
  }
}

setup();
main();
