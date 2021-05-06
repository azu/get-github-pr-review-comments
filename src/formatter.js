"use strict";
// MIT © 2017 azu
const path = require("path");
const wrapQuote = body => {
    return body;
};

const rawFormatter = (comment, options) => {
    // "diff_hunk": "@@ -16,33 +16,40 @@ public class Connection : IConnection...",
    const [all, firstLine] = comment.diff_hunk.match(/-(\d+)/);
    const lineNumber = parseInt(firstLine, 10) - 1 + comment.original_position;
    const filePath = path.join(options.projectRoot, comment.path);
    const reviewURL = `${comment.html_url.replace(/#.*$/, "#pullrequestreview-")}${comment.pull_request_review_id}`;
    const body = wrapQuote(comment.body.trim());
    return {
        file_path: filePath,
        line_number: lineNumber,
        review_url: reviewURL,
        body: body
    };
};

/**
 * @param {object|undefined} comments
 * @param {object} options
 * @returns {string}
 * @see https://developer.github.com/v3/pulls/comments/#list-comments-on-a-pull-request
 */
const jsonFormatter = (comments, options) => {
    if (!comments || (comments && !Array.isArray(comments))) {
        return "{}"; // no comments
    }
    const formatData = comments.map(data => {
        return rawFormatter(data, options);
    });
    return JSON.stringify(formatData, null, "  ");
};

/**
 * @param {object|undefined} comments
 * @param {object} options
 * @returns {string}
 * @see https://developer.github.com/v3/pulls/comments/#list-comments-on-a-pull-request
 */
const defaultFormatter = (comments, options) => {
    if (!comments || (comments && !Array.isArray(comments))) {
        return "No comments";
    }
    const formatData = comments.map(data => {
        const js = rawFormatter(data, options);
        return `@ ${js.file_path}:${js.line_number}:1
★ ${js.review_url}
${js.body}`;
    });
    return formatData.join("\n----\n");
};

/**
 * @param {string} formatFlag
 * @returns {object}
 */
export const getFormatter = formatFlag => {
    if (formatFlag === "json") {
        return jsonFormatter;
    }
    return defaultFormatter;
};
