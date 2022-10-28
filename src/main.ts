import * as core from "@actions/core";
import { Input, exec, getExec, getCommitInfo } from "./utils";

async function run() {
  const commits = +core.getInput(Input.Commits);
  const gitName = core.getInput(Input.GitName);
  const gitEmail = core.getInput(Input.GitEmail);

  if (isNaN(commits) || !gitName || !gitEmail) {
    core.error(`Something is off please check:
commits: ${commits}
git-name: ${gitName}
git-email: ${gitEmail}`);
    core.setFailed("Invalid inputs");
  }

  await exec(`git config --local user.name ${gitName}`);
  await exec(`git config --local user.email ${gitEmail}`);

  const commitCount = +(await getExec("git rev-list --count HEAD"));

  if (isNaN(commitCount)) {
    core.error("Invalid commit count, probably git not found");
  }

  if (commitCount <= commits) {
    core.info(
      "Commit count is less than or equal to the input, we cannot do anything with it. Spam commit until it reach that amount!"
    );
    return 0;
  }

  const current = await getCommitInfo();
  await exec("git reset --soft HEAD~1");

  const allAuthors = current.authors;
  let body = current.body;

  for (let i = 0; i < commitCount - commits; i++) {
    const now = await getCommitInfo();
    await exec("git reset --soft HEAD~1");

    body += `\n${now.title}\n${now.body}`;
    allAuthors.push(...now.authors);
  }

  const coAuthors = [...new Set(allAuthors)];

  core.info(JSON.stringify({ body, coAuthors }, null, 2));

  await exec(`git commit -m "${current.title}
${body}


${coAuthors.map((c) => `Co-authored-by: ${c}`).join("\n")}" --allow-empty`);

  await exec(`git push -f`);
}

run().catch((err) => {
  core.setFailed(err.message);
});
