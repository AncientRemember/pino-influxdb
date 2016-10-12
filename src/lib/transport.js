const through2 = require('through2')
var influx = require('influx')

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

    const client = influx(options)
    
    tryCreateDatabaseIfNotExists(client, options.database)

    return through2.obj(function transporter(influxPoint, enc, cb) {
        client.writePoints(options.mesearment, [influxPoint], function(err){
            if(err){
                console.warn('error writing log', influxPoint, err)
            }
        })
        cb()
    })
}