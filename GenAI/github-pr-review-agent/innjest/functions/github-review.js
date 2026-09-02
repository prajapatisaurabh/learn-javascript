import { inngest } from "../client.js";
import { octokit } from "../../lib/github.js";
import { run } from "@openai/agents"
import { githubPRReviewAgent } from "../../agents/github-pr-review-agents.js"
export const githubPullRequestReview = inngest.createFunction(
    {
        id: "github-pr-review-agent/github-pull-request-review",
        name: "GitHub Pull Request Review",
        triggers: { event: "github/pull_request_review" },
    },
    async ({ event, step }) => {
        const { owner, repo, pull_number } = event.data;

        const pullRequestInfo = await step.run("Get Pull Request Info", async () => {
            const pullRequest = await octokit.pulls.get({
                owner,
                repo,
                pull_number
            });
            return pullRequest.data;
        });

        if (!pullRequestInfo) {
            throw new Error("Pull request not found");
        }

        if (pullRequestInfo.state !== "open") {
            return { message: "Pull request is not open", skip: true, complete: false };
        }


        const changes = await step.run("fetch-changes", async () => {
            const changesResult = await octokit.paginate(octokit.pulls.listFiles, {
                owner,
                repo,
                pull_number,
                per_page: 100,
            });

            return changesResult.map(change => ({
                filename: change.filename,
                status: change.status,
                patch: change.patch,
                additions: change.additions,
                deletions: change.deletions,
                changes: change.changes,
            }));
        });


        if (!changes || changes.length === 0) {
            return { message: "No changes found in the pull request", skip: true, complete: false };
        }

        const analysis = await step.run("ai-analyze-changes", async () => {
            const result = await run(
                githubPRReviewAgent,
                `Pull request title: ${pullRequestInfo.title}\n` +
                `Description: ${pullRequestInfo.body ?? "(none)"}\n` +
                `URL: ${pullRequestInfo.url}\n\n` +
                `Changes:\n${JSON.stringify(changes, null, 2)}`
            );

            return result.finalOutput;
        });


        await step.run("create-review-comment", async () => {
            const reviewComment = await octokit.issues.createComment({
                owner,
                repo,
                issue_number: pull_number,
                commit_id: pullRequestInfo.head.sha,
                event: analysis.event,
                body: `### Automated Review Summary\n\n**Summary of Modifications:**\n${analysis.content}\n\n**Critical Fixes Identified:**\n${analysis.criticalFixes.length > 0 ? analysis.criticalFixes.map(fix => `- ${fix}`).join("\n") : "None"}\n\n**Suggestions for Improvements:**\n${analysis.suggestions.length > 0 ? analysis.suggestions.map(suggestion => `- ${suggestion}`).join("\n") : "None"}`
            });

            return reviewComment.data;
        });

        return {
            id: pullRequestInfo.id,
            title: pullRequestInfo.title,
            description: pullRequestInfo.body,
            comment: pullRequestInfo.comments,
            url: pullRequestInfo.url,
            diff: changes,
            analysis
        };
    }
)