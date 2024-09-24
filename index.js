import { cli } from 'clibuilder';

import validate from './validate.js';
import start from './start.js';

const app = cli({ name: 'upstream-monitor', version: '1.0.0' })
  .default({
    run() {
      validate();
    },
  })
  .command({
    name: 'validate',
    desc: 'validate the configuration',
    run() {
      validate();
    },
  })
  .command({
    name: 'start',
    desc: 'check the upstreams for pushes and issues',
    run() {
      // still need to ensure configuration is valid
      validate();
      start();
    },
  });

app.parse(process.argv).catch((e) => {
  console.error(e);
  process.exit(e?.code || 1);
});
