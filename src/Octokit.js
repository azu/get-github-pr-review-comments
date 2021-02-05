// MIT © 2021 vbouchet31
"use strict";
const { Octokit } = require("@octokit/rest");

export default class OctokitClient {
    constructor(token) {
        this.octokit = new Octokit({
            auth: token,
            timeZone: "Europe/Amsterdam",
            baseUrl: "https://api.github.com",
            request: {
                timeout: 5000
            }
        });
    }

    /**
     *
     * @param {string} owner
     * @param {string} repo
     * @param {string} number
     * @returns {Promise<{data:Object}>}
     */
    getComments({ owner, repo, number }) {
        return this.octokit.paginate("GET /repos/{owner}/{repo}/pulls/{number}/comments", {
            owner: owner,
            repo: repo,
            number: number
        });
    }

    _createRepoString({ owner, repo }) {
        return `${owner}/${repo}`;
    }
}
