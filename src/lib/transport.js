const through2 = require('through2')
const URL = require('url')
var Influx = require('influx')

function tryCreateDatabaseIfNotExists(client, database){
    if(database) {
        client.getDatabaseNames()
            .then(function (names) {
                if (names.indexOf(database) === -1) {
                    return client.createDatabase(database)
                }
            })
            .catch(function (error) {
                console.error(error)
            })
    }
}

module.exports = function transport(options) {
    const hostUrl = URL.parse(options.host)
    const client = new Influx.InfluxDB({
        host: hostUrl.hostname,
        port: hostUrl.port || 8086,
        database: options.database,
        username: options.un,
        password: options.pa,
    })

    tryCreateDatabaseIfNotExists(client, options.database)

    return through2.obj(function transporter(influxPoint, enc, cb) {
        client.writePoints([influxPoint], options)
            .catch(function(err) {
                console.warn('error writing log', influxPoint, err)
            })
        cb()
    })
}