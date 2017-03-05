// MIT © 2017 azu
"use strict";
const assert = require("assert");
const GH_TOKEN = process.env.GH_TOKEN;
import GitHubAPI from "./GitHub";
import {format} from "./formatter";

/**
 *
 * @param {string} commitSha
 * @param {{
 *  token: string,
 *  projectRoot: string,
 *  repo: string
 * }} flag
 */
module.exports = function(commitSha, flag) {
    const [owner, repo] = flag.repo.split("/");
    assert(owner && repo, "--repo owner/repo");
    const ghToken = GH_TOKEN || flag.token;
    assert(ghToken, "--token xxx or export GH_TOKEN=xxx");
    const projectRoot = flag.projectRoot;
    assert(projectRoot, "--projectRoot /path/to/dir");

    const github = new GitHubAPI(ghToken);
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
        const formatData = response.data.map(data => {
            return format(data, {
                owner,
                repo,
                projectRoot,
                commitSha
            });
        });
        return formatData.join("\n----\n");
    });
};