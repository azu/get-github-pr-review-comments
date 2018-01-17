// MIT © 2017 azu
"use strict";
const assert = require("assert");
const GH_TOKEN = process.env.GH_TOKEN;
import GitHubAPI from "./GitHub";
import { getFormatter } from "./formatter";

/**
 *
 * @param {string} commitSha
 * @param {{
 *  token: string,
 *  projectRoot: string,
 *  repo: string,
 *  format: string
 * }} flag
 */
module.exports = function (commitSha, flag) {
    const [owner, repo] = flag.repo.split("/");
    assert(owner && repo, "--repo owner/repo");
    const ghToken = GH_TOKEN || flag.token;
    assert(ghToken, "--token xxx or export GH_TOKEN=xxx");
    const projectRoot = flag.projectRoot;
    assert(projectRoot, "--projectRoot /path/to/dir");
    const outFormat = flag.format;

    const github = new GitHubAPI(ghToken);
    const formatter = getFormatter(outFormat);
    return github.getPR({
        owner: owner,
        repo: repo,
        commitSha: commitSha
    }).then(response => {
        if (response.data.total_count === 0) {
            return;
        }
        const item = response.data.items[0];
        return github.getComments({
            owner: owner,
            repo: repo,
            id: item.id,
            number: item.number
        });
    }).then(response => {
        return formatter(response, {
            owner,
            repo,
            projectRoot,
            commitSha
        });
    });
};
