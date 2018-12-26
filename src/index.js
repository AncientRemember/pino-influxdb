#! /usr/bin/env node

const pump = require('pump')
const split2 = require('split2')
const pick = require('lodash.pick')
const argv = require('yargs')
    .usage('$0 --url http://server.domain:8086')
    .env('PINO_INFLUXDB')
    .help()
    .version(function () {
        return require('../package.json').version
    })
    .options({
        echo: {
            default: true,
            type: 'boolean',
            description: 'Echo the log'
        },
        measurement: {
            default: 'log',
            requiresArg: true,
            description: 'The measurement name'
        },
        database: {
            default: 'logs',
            requiresArg: true,
            description: 'The database name. Will be created if missing.'
        },
        host: {
            alias: 'host',
            array: false,
            default: 'http://localhost:8086',
            requiresArg: true,
            describe: 'Influx db host url.'
        },
        un:{
            alias: 'un',
            array: false,
            default: null,
            requiresArg: true,
            describe: 'Influx db username.'
        },
        pa:{
            alias: 'pa',
            array: false,
            default: null,
            requiresArg: true,
            describe: 'Influx db password.'
        },
        tags: {
            array: true,
            default: ['pid', 'hostname', 'level'],
            requiresArg: true,
            describe: 'List of tags'
        }
    })
    .argv


const transform = require('./lib/transform')
const transport = require('./lib/transport')

const transformToInfluxPoint = transform(Array.from(argv.tags), argv.measurement)
const transportPoints = transport(pick(argv, ['database', 'host','un','pa']))

pump(process.stdin, split2(), transformToInfluxPoint, transportPoints, function (err) { err && console.error(err) })



