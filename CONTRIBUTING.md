## How to contribute:

### Install dependency:

```bash
npm install -g typescript@2 typescript-formatter http-server
npm install
bower install
```

we use typescript **2.x** rather than current **1.x** to match [tsconfig.json schema on the official site](http://json.schemastore.org/tsconfig)


### Building:

```bash
npm run build
```

### Testing:

CanvasToy now use Karma and Jasmine for unit test

```bash
npm test
```
You can also run visible test from example

first, start a local http-server, for example,

```bash
http-server
```

Than open the local url with you browser and goto the example folder, you will find all examples there

### Format:

Please, be sure to have formatted you code with typescript-formatter before any pull request

```bash
tsfmt src/**/*.ts -r
tsfmt tests/**/*.ts -r
```



Feel free to contribute
