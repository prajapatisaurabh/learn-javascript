import { Agent } from "@openai/agents"
import { z } from "zod"


export const GithubReviewAgentResultSchema = z.object({
    criticalFixes: z.array(z.string().optional().nullable().describe("List of critical fixes identified in the pull request changes")),
    suggestions: z.array(z.string().optional().nullable().describe("List of suggestions for improvements or enhancements based on the pull request changes")),
    content: z.string().describe("A summary of the modifications made in the pull request, including any critical fixes and suggestions for improvements"),
    event: z.enum(["APPROVE", "REQUEST_CHANGES", "COMMENT"]).describe("The recommended action for the pull request based on the analysis of the changes"),
})

export const githubPRReviewAgent = new Agent({
    name: "github-pr-review-agent",
    outputType: GithubReviewAgentResultSchema,
    instructions: "You are a GitHub Pull Request Review Agent. Your task is to analyze the changes in a pull request and provide a summary of the modifications made. You will receive the pull request information, including the title, description, comments, URL, and a list of changes. Your output should be structured according to the provided schema.",

})