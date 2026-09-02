import { inngest } from "../client.js";
import { octokit } from "../octokit.js";

export const githubPullRequestReview = inngest.createFunction(
    {
        id: "github-pr-review-agent/github-pull-request-review",
        name: "GitHub Pull Request Review",
        triggers: { event: "github/pull_request_review" },
    },
    async ({ event, step }) => {
        const { action, pull_request, review } = event.data;
        console.log(`Received a pull request review event: ${action}`);
        console.log(`Pull Request Title: ${pull_request.title}`);
        console.log(`Review State: ${review.state}`);
        console.log(`Review Body: ${review.body}`);

        const pullRequest = await octokit.pulls.get({owner: pull_request.base.repo.owner.login, repo: pull_request.base.repo.name, pull_number: pull_request.number});
        console.log(`Pull Request Description: ${pullRequest.data.body}`);


        return { 
            id:  pull_request.id,
            title: pull_request.title,
            description: pullRequest.data.body,
            reviewState: review.state,
            reviewBody: review.body,
            comment: pull_request.data.comments,
            url: pull_request.data.url
         };
    }
)