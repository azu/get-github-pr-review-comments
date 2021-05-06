// MIT © 2017 azu
"use strict";
const assert = require("assert");
const GH_TOKEN = process.env.GH_TOKEN;
import OctokitAPI from "./Octokit";
import { getFormatter } from "./formatter";

/**
 *
 * @param {string} number
 * @param {{
 *  token: string,
 *  projectRoot: string,
 *  repo: string,
 *  format: string
 * }} flag
 */
module.exports = function(number, flag) {
    const [owner, repo] = flag.repo.split("/");
    assert(owner && repo, "--repo owner/repo");
    const token = GH_TOKEN || flag.token;
    assert(token, "--token xxx or export GH_TOKEN=xxx");
    const projectRoot = flag.projectRoot;
    assert(projectRoot, "--projectRoot /path/to/dir");
    const outFormat = flag.format;

    const octokit = new OctokitAPI(token);
    const formatter = getFormatter(outFormat);
    return octokit
        .getComments({
            owner: owner,
            repo: repo,
            number: number
        })
        .then(response => {
            return formatter(response, {
                owner,
                repo,
                projectRoot,
                number
            });
        });
};
