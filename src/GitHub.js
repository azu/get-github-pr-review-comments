// MIT © 2017 azu
"use strict";
const GitHubApi = require("github");
export default class GitHubClient {
    constructor(token) {
        this.github = new GitHubApi({
            debug: false,
            protocol: "https",
            followRedirects: false, // default: true; there's currently an issue with non-get redirects, so allow ability to disable follow-redirects
            timeout: 5000
        });
        this.github.authenticate({
            type: "oauth",
            token: token
        });
    }

    /**
     *
     * @param {string} owner
     * @param {string} repo
     * @param {string} commitSha
     * @returns {Promise<{data:Object}>}
     */
    getPR({ owner, repo, commitSha }) {
        const repoPath = this._createRepoString({ owner, repo });
        return this.github.search.issues({
            q: `repo:${repoPath} type:pr ${commitSha}`
        });
    }

    /**
     * @param {string} owner
     * @param {string} repo
     * @param {number} number
     * @param {number} id
     * @returns {Promise<{data:Object}>}
     */
    getComments({ owner, repo, number, id }) {
        return this.github.pullRequests.getComments({ owner, repo, number, id });
    }

    _createRepoString({ owner, repo }) {
        return `${owner}/${repo}`;
    }
}
