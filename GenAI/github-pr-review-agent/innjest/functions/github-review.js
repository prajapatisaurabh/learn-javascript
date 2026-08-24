import { inngest } from "../client.js";

export const githubPullRequestReview = inngest.createFunction(
    {id:"github-pr-review-agent/github-pull-request-review", name: "GitHub Pull Request Review", triggers: [
        inngest.onEvent({
            name: "GitHub Pull Request Review",
            event: "github/pull_request_review",
            version: "0.1.0"
        })
    ]   },
    
    async ({ event, step }) => {
        const { action, pull_request, review } = event.data;
        console.log(`Received a pull request review event: ${action}`);
        console.log(`Pull Request Title: ${pull_request.title}`);
        console.log(`Review State: ${review.state}`);
        console.log(`Review Body: ${review.body}`);
    }
)