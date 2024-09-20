const { cli } = require('clibuilder');

const validate = require('./validate');

const app = cli({ name: 'upstream-monitor', version: '1.0.0' }).default({
  run() {
    validate();
  },
});

app.parse(process.argv).catch((e) => {
  console.error(e);
  process.exit(e?.code || 1);
});
