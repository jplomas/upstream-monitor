import YAML from 'yaml';
import fs from 'fs';
import { Octokit } from '@octokit/rest';
import dotenv from 'dotenv';
dotenv.config();

async function start() {
  const file = fs.readFileSync('./config.yml', 'utf8');
  const config = YAML.parse(file);
  for (const upstream of config.upstreams) {
    // TODO: auth to GitHub API

    // TODO: use `since` to get commits since last successful check
    console.log(`getting issues from GitHub for: ${upstream.org}/${upstream.repo} on branch ${upstream.branch}`);
    const octokit = new Octokit({
      auth: process.env.GITHUB_TOKEN,
    });
    const issues = await octokit.paginate('GET /repos/{owner}/{repo}/issues', {
      owner: upstream.org,
      repo: upstream.repo,
    });
    console.log('==== ISSUES ====');
    issues.forEach((issue) => {
      console.log(issue.title);
    });
    //
    console.log(`getting commits from GitHub for: ${upstream.org}/${upstream.repo} on branch ${upstream.branch}`);
    const commits = await octokit.paginate('GET /repos/{owner}/{repo}/commits', {
      owner: upstream.org,
      repo: upstream.repo,
      sha: upstream.branch,
    });
    console.log('==== COMMITS ====');
    commits.forEach((commit) => {
      // console.log(commit);
      console.log(commit.commit.message);
    });
    // TODO: compare commits and issues to last
    // TODO: write last commits and issues to markdown files
  }
}

export default start;
