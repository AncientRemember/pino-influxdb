const through2 = require('through2')
const URL = require('url')
var Influx = require('influx')

function tryCreateDatabaseIfNotExists(client, database){
    if(database){
        client.getDatabaseNames(function(error, names){
            if(names){
                if(names.indexOf(database) === -1){
                    client.createDatabase(database, function(error){
                        if(error){
                            console.error(error)
                        }
                    })
                }
            }
            if(error){
                console.error(error)
            }
        })
    }
}

module.exports = function transport(options) {
    const hostUrl = URL.parse(options.host)
    const client = new Influx.InfluxDB({
        host: hostUrl.hostname,
        port: hostUrl.port || 8086,
        database: options.database,
    })

    tryCreateDatabaseIfNotExists(client, options.database)

    return through2.obj(function transporter(influxPoint, enc, cb) {
        client.writePoints([influxPoint], options)
            .catch(function(err) {
                console.warn('error writing log', influxPoint, err)
            });
        cb()
    })
}