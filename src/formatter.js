// MIT © 2017 azu
"use strict";
const wrapQuote = (body) => {
    return body;
};

/**
 * @param {object} comment
 * @param {object} options
 * @returns {string}
 * @see https://developer.github.com/v3/pulls/comments/#list-comments-on-a-pull-request
 */
export const format = (comment, options) => {
    // "diff_hunk": "@@ -16,33 +16,40 @@ public class Connection : IConnection...",
    const [all, firstLine] = comment.diff_hunk.match(/-(\d+)/);
    const lineNumber = parseInt(firstLine, 10) - 1;
    return `@ ${options.projectRoot}${comment.path}:${lineNumber + comment.original_position}:1
${wrapQuote(comment.body.trim())}`
};