
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
  lastAccessed: z.string().datetime().optional(),
});

const UserProjectActivitySchema = z.object({
  projectId: z.string(),
  title: z.string(),
  tags: z.array(z.string()),
  role: z.string().optional(), // e.g., 'creator', 'contributor'
  lastContribution: z.string().datetime().optional(),
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
  recentActivityEvents: z.array(z.object({ type: z.string(), data: z.any(), timestamp: z.string().datetime() })).optional().describe('Recent generic activity events for the user.'),
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
  // Potentially add a section for "why these recommendations" explanation from the AI
  explanation: z.string().optional().describe('An overall explanation from the AI about how these recommendations were generated.'),
});
export type DashboardRecommendationsOutput = z.infer<typeof DashboardRecommendationsOutputSchema>;


// This is a placeholder function. In a real application, you would fetch actual user data.
async function getMockUserInput(userId: string): Promise<DashboardRecommendationsInput> {
  return {
    userId,
    enrolledCourses: [
      { courseId: '1', title: 'Introduction to Solidity Programming', category: 'Blockchain', progress: 75, lastAccessed: new Date().toISOString() },
      { courseId: '2', title: 'Advanced Next.js for Web3 Developers', category: 'Web Development', progress: 40 },
    ],
    createdProjects: [
      { projectId: '1', title: 'Decentralized Art Marketplace', tags: ['NFT', 'Marketplace', 'Solidity'], role: 'creator' },
    ],
    communityEngagement: { forumPosts: 5, commentsMade: 12 },
    leaderboardRank: 2,
    achievements: ['Top Contributor', 'Early Adopter'],
    recentActivityEvents: [
        { type: 'lesson_completed', data: { courseId: '1', lessonTitle: 'Smart Contract Basics' }, timestamp: new Date().toISOString() }
    ]
  };
}


export async function getDashboardRecommendations(input: DashboardRecommendationsInput): Promise<DashboardRecommendationsOutput> {
  // In a real app, you might call:
  // return dashboardRecommendationsFlow(input);

  // For now, returning mock data or a simple message
  console.log("getDashboardRecommendations called with input:", input);
  // This function would normally call the Genkit flow.
  // For this placeholder, we'll return some mock recommendations.
  return {
    recommendations: [
      { type: 'course', itemId: '3', title: 'NFT Art Creation Masterclass', reason: 'Expand your NFT skills.', link: '/courses/3', relevanceScore: 0.8 },
      { type: 'project', itemId: 'new-defi', title: 'Contribute to a new DeFi Project', reason: 'Leverage your Solidity knowledge.', link: '/projects/explore/defi', relevanceScore: 0.7 },
      { type: 'user_to_connect', itemId: 'user-charlie', title: 'Connect with Charlie Crypto', reason: 'Shares interest in Web3 Social Media.', link: '/profile/charlie-crypto', relevanceScore: 0.6 },
      { type: 'feature_tip', title: 'Explore Life Tracking', description: 'Visualize your journey with our new Life Tracking feature!', link: '/life-tracking', relevanceScore: 0.9}
    ],
    explanation: "These recommendations are based on your recent activity and interests. (Mock explanation)",
  };
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

    const { output } = await dashboardRecommendationsPrompt(input);
    if (!output) {
        // Handle cases where the prompt might not return an output, e.g., due to safety filters or errors.
        return { recommendations: [], explanation: "Could not generate recommendations at this time." };
    }
    return output;
  }
);

// Helper for Handlebars template (if needed, though Genkit typically handles JSON stringification)
// z.custom((val) => JSON.stringify(val)) can be used in schema for complex objects if direct stringification is an issue
// However, for the prompt, directly embedding properties is usually fine.
// If you need to stringify in the prompt itself, it's better to pre-process it into the input.
// Handlebars.registerHelper('jsonStringify', function(context) {
//   return JSON.stringify(context);
// });
