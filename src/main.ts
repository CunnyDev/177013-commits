import * as core from "@actions/core";
import { Input, exec, getExec, parseDescription } from "./utils";

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

  const currentTitle = await getExec("git log -1 --pretty=%s");
  const currentDescription = await getExec("git log -1 --pretty=%b");

  const { body: cBody, coAuthors: cCoAuth } =
    parseDescription(currentDescription);

  const authorName = await getExec("git log -1 --pretty=%an");
  const authorEmail = await getExec("git log -1 --pretty=%ae");

  await exec("git reset --soft HEAD~1");

  const coAuthors = [`${authorName} <${authorEmail}>`, ...cCoAuth];
  let body = cBody;

  for (let i = 0; i < commits - commitCount; i++) {
    const title = await getExec("git log -1 --pretty=%s");
    const description = await getExec("git log -1 --pretty=%b");

    await exec("git reset --soft HEAD~1");

    const { body: pBody, coAuthors: pCoAuthors } =
      parseDescription(description);

    body += `\n${title}\n${pBody}`;
    coAuthors.push(...pCoAuthors);
  }

  await exec(`git commit -m "${currentTitle}
${body}


${[...new Set([...coAuthors])]
  .map((c) => `Co-authored-by: ${c}`)
  .join("\n")}"`);

  await exec(`git push -f`);
}

run().catch((err) => {
  core.setFailed(err.message);
});
