const through2 = require('through2')

function parseJson(text){
    if(!text || typeof(text) !== 'string' || text.charAt(0) !== '{' || text.charAt(text.length - 1) !== '}'){
        return null
    }
    try{
        return JSON.parse(text)
    }catch(e){
        //console.log(e)
        return null
    }
}

function stringify(obj){
    if(obj === null || obj === undefined){
        return obj
    }
    if(typeof(obj) === 'object'){
        return JSON.stringify(obj)
    }
    return obj.toString()
}

function buildInfluxPoint(obj, tagKeys, measurement){
    if(!obj || !obj.time){
        return null
    }
    const tags = tagKeys.reduce((sum, tag) => {
        sum[tag] = stringify(obj[tag])
        return sum
    }, {})
    const fields = Object.keys(obj).reduce((sum, key) => {
        if(!tags[key]){
            sum[key] = key === 'time' ? obj[key] : stringify(obj[key])
        }
        return sum
    }, {})
    return {
        fields: fields,
        tags: tags,
        measurement: measurement
    }
}



module.exports = function transform(tags, measurement){
    return through2.obj(function transformer(textLine, enc, cb) {
        const obj = parseJson(textLine)
        const influxPoint = buildInfluxPoint(obj, tags, measurement)
        if(influxPoint){
            this.push(influxPoint)
        }
        cb()
    })
}