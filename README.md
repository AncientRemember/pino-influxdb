# pino-infuxdb

Influxdb transport for pino logger


## How to install
Install globally by running:
```sh
$ npm i -g pino-influxdb
```

## How to use
Usage is done by piping. You pipe your process output to pino-influxdb like so:
```sh
$ node your-program-that-outputs-pino-json | pino-influxdb --host http://somehost:8086 --database logs --measurement log
```

## Command Line options

```                                                                                                                                                                                    
  --help           Show help                                           [boolean]                                                                                                               
  --version        Show version number                                 [boolean]                                                                                                               
  --echo           Echo the logs                       [boolean] [default: true]                                                                                                               
  --measurement    The measurement name                         [default: "log"]                                                                                                               
  --database       The database name. Will be created if missing.                                                                                                                              
                                                               [default: "logs"]                                                                                                               
  --host           Influx db host url.                                                                                                                                            
                                     [string] [default: "http://localhost:8086"]                                                                                                               
  --tags           List of tags    [array] [default: ["pid","hostname","level"]] 
  ```
  
## License
This package is licensed under [MIT license](https://opensource.org/licenses/MIT)


