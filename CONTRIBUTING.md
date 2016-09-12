## How to Contribute:

### Install dependency:

```bash
npm install -g typescript@2 typescript-formatter
npm install
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
You can also run visible test by example

```bash
npm run example
```

### Format:

Please, be sure to have formatted you code with typescript-formatter before any pull request

```bash
tsfmt src/**/*.ts -r
tsfmt tests/**/*.ts -r
```



Feel free to contribute
