## How to Contribute:

### Install dependency:

```bash
npm install -g typescript typescript-formatter
npm install
```

to update typescript to latest version, you must upgrade it after install

```bash
npm upgrade -g typescript
```

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