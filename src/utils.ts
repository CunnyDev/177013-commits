import * as core from "@actions/core";

import { exec as execCb } from "node:child_process";
import { promisify } from "node:util";

const execBase = promisify(execCb);

export async function exec(cmd: string) {
  core.info(`Executing: ${cmd}`);
  return await execBase(cmd);
}

export async function getExec(cmd: string) {
  const { stdout } = await exec(cmd);
  return stdout.trim();
}

export enum Input {
  Commits = "commits",
  GitName = "git-name",
  GitEmail = "git-email",
}

export function parseDescription(desc: string) {
  const lines = desc.split("\n");

  return {
    body: lines.filter((l) => !l.startsWith("Co-authored-by:")).join("\n"),
    coAuthors: lines
      .filter((l) => l.startsWith("Co-authored-by:"))
      .map((l) => l.split(" ").slice(1).join(" ")),
  };
}
