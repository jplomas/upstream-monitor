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
    // console.log('==== ISSUES ====');
    // issues.forEach((issue) => {
    //   console.log(issue.title);
    // });
    //
    console.log(`getting commits from GitHub for: ${upstream.org}/${upstream.repo} on branch ${upstream.branch}`);
    const commits = await octokit.paginate('GET /repos/{owner}/{repo}/commits', {
      owner: upstream.org,
      repo: upstream.repo,
      sha: upstream.branch,
    });
    // console.log('==== COMMITS ====');
    // commits.forEach((commit) => {
      // console.log(commit);
      // console.log(commit.commit.message);
    // });
    // TODO: compare commits and issues to last
    // TODO: write last commits and issues to markdown files

    // make a dir for each upstream
    const upstreamDir = `./content/${upstream.org}/${upstream.repo}`;
    if (!fs.existsSync(upstreamDir)) {
      fs.mkdirSync(upstreamDir, { recursive: true });
    }

    // make a dir for commits and issues
    const commitsDir = `${upstreamDir}/commits`;
    if (!fs.existsSync(commitsDir)) {
      fs.mkdirSync(commitsDir, { recursive: true });
    }
    const issuesDir = `${upstreamDir}/issues`;
    if (!fs.existsSync(issuesDir)) {
      fs.mkdirSync(issuesDir, { recursive: true });
    }

    // write each commit to a .md file in content/commits
    // write each issue to a .md file in content/issues
    commits.forEach((commit) => {
      // console.log(commit);
      const commitFile = `${commitsDir}/${commit.sha}.md`;
      if (!fs.existsSync(commitFile)) {
        fs.writeFileSync(
          commitFile,
          `---\norg: "${upstream.org}"\nrepo: "${upstream.repo}"\ndate: "${commit.commit.committer.date}"\nreviewed: false\ninprogress: false\n---\n${commit.commit.message}`,
        );
        console.log(`wrote commit file: ${commitFile}`);
      } else {
        console.log(`commit file already exists: ${commitFile} -- SKIPPING`);
      }
    });
    issues.forEach((issue) => {
      const issueFile = `${issuesDir}/${issue.number}.md`;
      if (!fs.existsSync(issueFile)) {
        fs.writeFileSync(
          issueFile,
          `---\norg: "${upstream.org}"\nrepo: "${upstream.repo}"\ntitle: "${issue.title}"\nreviewed: false\ninprogress: false\n---${issue.body}`,
        );
        console.log(`wrote issue file: ${issueFile}`);
      } else {
        console.log(`issue file already exists: ${issueFile} -- SKIPPING`);
      }
    });
  }
}

export default start;
