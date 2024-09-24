import YAML from 'yaml';
import fs from 'fs';

function validate() {
  const file = fs.readFileSync('./config.yml', 'utf8');
  const config = YAML.parse(file);
  if (!config) {
    console.log('Invalid config file');
    process.exit(1);
  }
  if (!config.upstreams) {
    console.log('No upstreams defined');
    process.exit(1);
  }
  if (!config.upstreams.length) {
    console.log('No upstreams defined');
    process.exit(1);
  }
  // validate config
  let validConfig = true;
  for (const upstream of config.upstreams) {
    if (!upstream.source) {
      console.log(`Missing source defined for dependency at index ${config.upstreams.indexOf(upstream)}`);
      validConfig = false;
    }
    if (upstream.source.toLowerCase() !== 'github') {
      console.log(
        `Only Github is supported as a source (${upstream.source} at index ${config.upstreams.indexOf(upstream)})`,
      );
      validConfig = false;
    }
    if (!upstream.org) {
      console.log(`Missing org for dependency at index ${config.upstreams.indexOf(upstream)}`);
      validConfig = false;
    }
    if (!upstream.repo) {
      console.log(`Missing repo for dependency at index ${config.upstreams.indexOf(upstream)}`);
      validConfig = false;
    }
    if (!upstream.branch) {
      console.log(`Missing branch for dependency at index ${config.upstreams.indexOf(upstream)}`);
      validConfig = false;
    }
  }
  if (!validConfig) {
    process.exit(1);
  }
  // console.log(config);
  console.log('Valid config');
}

export default validate;
