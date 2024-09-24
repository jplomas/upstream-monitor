import YAML from 'yaml';
import fs from 'fs';
import { Octokit } from '@octokit/rest';

async function start() {
  const file = fs.readFileSync('./config.yml', 'utf8');
  const config = YAML.parse(file);
  for (const upstream of config.upstreams) {
    console.log(`getting issues from GitHub for: ${upstream.org}/${upstream.repo} on branch ${upstream.branch}`);
    const octokit = new Octokit({});
    const issues = await octokit.rest.issues.listForRepo({
      owner: upstream.org,
      repo: upstream.repo,
    });
    console.log(issues);
  }
}

export default start;
