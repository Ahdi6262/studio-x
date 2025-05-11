
'use server';
/**
 * @fileOverview AI flow for generating personalized dashboard recommendations.
 *
 * - getDashboardRecommendations - A function that handles the recommendation generation process.
 * - DashboardRecommendationsInput - The input type for the flow.
 * - DashboardRecommendationsOutput - The return type for the flow.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

// Mock data types for user activity - in a real app, these would be more detailed
const UserCourseActivitySchema = z.object({
  courseId: z.string(),
  title: z.string(),
  category: z.string(),
  progress: z.number().min(0).max(100),
  lastAccessed: z.string().datetime({ precision: 3 }).optional(),
});

const UserProjectActivitySchema = z.object({
  projectId: z.string(),
  title: z.string(),
  tags: z.array(z.string()),
  role: z.string().optional(), // e.g., 'creator', 'contributor'
  lastContribution: z.string().datetime({ precision: 3 }).optional(),
});

const UserCommunityActivitySchema = z.object({
  forumPosts: z.number().optional(),
  commentsMade: z.number().optional(),
  upvotesGiven: z.number().optional(),
});

export const DashboardRecommendationsInputSchema = z.object({
  userId: z.string().describe('The ID of the user for whom to generate recommendations.'),
  enrolledCourses: z.array(UserCourseActivitySchema).optional().describe('List of courses the user is enrolled in.'),
  createdProjects: z.array(UserProjectActivitySchema).optional().describe('List of projects created or contributed to by the user.'),
  communityEngagement: UserCommunityActivitySchema.optional().describe('User engagement metrics in the community.'),
  recentActivityEvents: z.array(z.object({ type: z.string(), data: z.any(), timestamp: z.string().datetime({ precision: 3 }) })).optional().describe('Recent generic activity events for the user.'),
  leaderboardRank: z.number().optional().describe('User\'s current rank on the leaderboard.'),
  achievements: z.array(z.string()).optional().describe('List of achievements unlocked by the user.'),
});
export type DashboardRecommendationsInput = z.infer<typeof DashboardRecommendationsInputSchema>;

const RecommendationItemSchema = z.object({
  type: z.enum(['course', 'project', 'user_to_connect', 'community_content', 'feature_tip']).describe('The type of recommendation.'),
  itemId: z.string().optional().describe('ID of the recommended item (e.g., courseId, projectId, userId).'),
  title: z.string().describe('Title of the recommended item or a summary of the recommendation.'),
  description: z.string().optional().describe('A brief description or rationale for the recommendation.'),
  link: z.string().optional().describe('A direct link to the recommended item.'),
  relevanceScore: z.number().min(0).max(1).optional().describe('A score indicating the relevance of this recommendation (0-1).'),
  reason: z.string().optional().describe('A short human-readable reason for this recommendation.'),
});

export const DashboardRecommendationsOutputSchema = z.object({
  recommendations: z.array(RecommendationItemSchema).describe('A list of personalized recommendations for the user.'),
  explanation: z.string().optional().describe('An overall explanation from the AI about how these recommendations were generated.'),
});
export type DashboardRecommendationsOutput = z.infer<typeof DashboardRecommendationsOutputSchema>;


// This is a placeholder function. In a real application, you would fetch actual user data from Firebase/DB.
// For now, it returns mock data for demonstration purposes.
async function getMockUserInputForFlow(userId: string): Promise<DashboardRecommendationsInput> {
  // Simulate fetching user data related to courses, projects, etc.
  // Replace this with actual database queries in a real app.
  return {
    userId,
    enrolledCourses: [
      { courseId: 'mock-course-1', title: 'Intro to Web3', category: 'Blockchain', progress: 60, lastAccessed: new Date(Date.now() - 86400000 * 2).toISOString() }, // 2 days ago
      { courseId: 'mock-course-2', title: 'AI for Creators', category: 'AI', progress: 25, lastAccessed: new Date(Date.now() - 86400000 * 5).toISOString() }, // 5 days ago
    ],
    createdProjects: [
      { projectId: 'mock-project-1', title: 'My First DApp', tags: ['Solidity', 'React'], role: 'creator', lastContribution: new Date(Date.now() - 86400000 * 7).toISOString() }, // 7 days ago
    ],
    communityEngagement: { forumPosts: 3, commentsMade: 10 },
    leaderboardRank: 15,
    achievements: ['Early Bird', 'First Course Started'],
    recentActivityEvents: [
        { type: 'course_enrollment', data: { courseId: 'mock-course-2', courseTitle: 'AI for Creators' }, timestamp: new Date(Date.now() - 86400000 * 1).toISOString() }, // 1 day ago
        { type: 'project_update', data: { projectId: 'mock-project-1', update: 'Pushed new commit' }, timestamp: new Date(Date.now() - 86400000 * 3).toISOString() } // 3 days ago
    ]
  };
}

export async function getDashboardRecommendations(userId: string): Promise<DashboardRecommendationsOutput> {
  // In a real app, you'd fetch real user data here instead of getMockUserInputForFlow
  const userInput = await getMockUserInputForFlow(userId);
  try {
    const result = await dashboardRecommendationsFlow(userInput);
    return result;
  } catch (error) {
    console.error("Error in getDashboardRecommendations calling flow:", error);
    return {
      recommendations: [],
      explanation: "Could not generate recommendations due to an internal error.",
    };
  }
}

const dashboardRecommendationsPrompt = ai.definePrompt({
  name: 'dashboardRecommendationsPrompt',
  input: { schema: DashboardRecommendationsInputSchema },
  output: { schema: DashboardRecommendationsOutputSchema },
  prompt: `You are an AI assistant for HEX THE ADD HUB, a platform for Web3 creators.
Your goal is to provide personalized and actionable recommendations for the user's dashboard to enhance their experience, learning, and engagement.

User Profile and Activity:
- User ID: {{{userId}}}
{{#if enrolledCourses}}
- Enrolled Courses:
  {{#each enrolledCourses}}
  - "{{title}}" ({{category}}): Progress {{progress}}%{{#if lastAccessed}}, Last Accessed: {{lastAccessed}}{{/if}}
  {{/each}}
{{/if}}
{{#if createdProjects}}
- Projects:
  {{#each createdProjects}}
  - "{{title}}" (Tags: {{#each tags}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}){{#if role}}, Role: {{role}}{{/if}}{{#if lastContribution}}, Last Contribution: {{lastContribution}}{{/if}}
  {{/each}}
{{/if}}
{{#if communityEngagement}}
- Community Engagement:
  {{#if communityEngagement.forumPosts}}Forum Posts: {{communityEngagement.forumPosts}}{{/if}}
  {{#if communityEngagement.commentsMade}}Comments Made: {{communityEngagement.commentsMade}}{{/if}}
  {{#if communityEngagement.upvotesGiven}}Upvotes Given: {{communityEngagement.upvotesGiven}}{{/if}}
{{/if}}
{{#if leaderboardRank}}
- Leaderboard Rank: #{{leaderboardRank}}
{{/if}}
{{#if achievements}}
- Achievements: {{#each achievements}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}
{{/if}}
{{#if recentActivityEvents}}
- Recent Activities:
  {{#each recentActivityEvents}}
  - Type: {{type}}, Data: {{jsonStringify data}}, Timestamp: {{timestamp}}
  {{/each}}
{{/if}}

Based on this information, generate a diverse list of 3-5 recommendations.
Types of recommendations can include:
- 'course': Suggest a new course or a next step in an existing course.
- 'project': Suggest a project to start, contribute to, or a skill to apply from a project.
- 'user_to_connect': Suggest another user to connect with based on shared interests or skills.
- 'community_content': Highlight a relevant forum discussion, blog post, or event.
- 'feature_tip': Suggest exploring a platform feature they might find useful.

For each recommendation:
- Provide a clear 'title'.
- Optionally, an 'itemId' (like course ID, project ID, user ID).
- Optionally, a 'description' for more context.
- Optionally, a 'link' to the relevant page.
- Optionally, a 'reason' explaining why this is recommended for THIS user.
- Optionally, a 'relevanceScore' (0-1).

Prioritize recommendations that are actionable and directly beneficial to the user's growth and engagement on the platform.
Try to provide varied types of recommendations.
If suggesting a course, consider their current progress in other courses or related project skills.
If suggesting a project, align it with their existing skills or learning goals.
If suggesting a user to connect, find users with complementary skills or shared project interests.

Output the recommendations in the specified JSON format.
Also, provide a brief overall 'explanation' of how these recommendations were derived.
`,
});

const dashboardRecommendationsFlow = ai.defineFlow(
  {
    name: 'dashboardRecommendationsFlow',
    inputSchema: DashboardRecommendationsInputSchema,
    outputSchema: DashboardRecommendationsOutputSchema,
  },
  async (input) => {
    // In a real scenario, you might fetch more dynamic data here based on input.userId
    // e.g., query a database for all available courses, projects, users.
    // For now, the prompt assumes it has enough context from the input.

    console.log("dashboardRecommendationsFlow called with input:", JSON.stringify(input, null, 2));

    const { output, errors } = await dashboardRecommendationsPrompt(input);

    if (errors && errors.length > 0) {
        console.error("Errors from dashboardRecommendationsPrompt:", errors);
        // Consider how to handle partial errors or if any error means failure
        // For now, if any error, return empty recommendations
        return { recommendations: [], explanation: `Could not generate recommendations. Errors: ${errors.map(e => e.message).join(', ')}` };
    }

    if (!output) {
        // Handle cases where the prompt might not return an output, e.g., due to safety filters or other issues.
        console.warn("dashboardRecommendationsPrompt returned no output.");
        return { recommendations: [], explanation: "Could not generate recommendations at this time (no output from AI)." };
    }
    return output;
  }
);

// Handlebars helper (if needed for complex objects in prompt)
// genkit may automatically handle basic JSON.stringify, but for explicit control:
ai.handlebars.registerHelper('jsonStringify', function(context) {
  try {
    return JSON.stringify(context);
  } catch (e) {
    return "[Unserializable Data]";
  }
});
