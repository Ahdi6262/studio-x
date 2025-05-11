
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
// Firebase imports are removed as data source changes to MySQL via API
// import { collection, query, where, getDocs, limit, doc, getDoc, orderBy } from "firebase/firestore";
// import { db } from '@/lib/firebase'; 

// Mock data types for user activity - adjust if API response differs
const UserCourseActivitySchema = z.object({
  courseId: z.string(),
  title: z.string(),
  category: z.string().optional(),
  progress: z.number().min(0).max(100),
  lastAccessed: z.string().datetime({ precision: 3 }).optional(),
});

const UserProjectActivitySchema = z.object({
  projectId: z.string(),
  title: z.string(),
  tags: z.array(z.string()).optional(),
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
  recentActivityEvents: z.array(z.object({ type: z.string(), data: z.any(), timestamp: z.string().datetime({ precision: 3 }) }).optional().describe('Recent generic activity events for the user.'),
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


// This function needs to be rewritten to fetch data from your new MySQL backend APIs
// or directly from MySQL if this flow runs in a context with DB access.
async function getUserInputForFlow(userId: string): Promise<DashboardRecommendationsInput> {
  let input: DashboardRecommendationsInput = { userId };

  // Example: Fetching enrolled courses via API
  try {
    const enrollmentsResponse = await fetch(`/api/users/${userId}/enrolled-courses`); // Define this API
    if (enrollmentsResponse.ok) {
      input.enrolledCourses = await enrollmentsResponse.json();
    }
  } catch (e) { console.error("Failed to fetch enrolled courses for recommendations:", e); }

  // Example: Fetching created projects via API
  try {
    const projectsResponse = await fetch(`/api/users/${userId}/projects`); // Define this API
    if (projectsResponse.ok) {
      input.createdProjects = await projectsResponse.json();
    }
  } catch (e) { console.error("Failed to fetch created projects for recommendations:", e); }
  
  // Fetch community engagement (placeholder, needs API)
  input.communityEngagement = { forumPosts: Math.floor(Math.random() * 5), commentsMade: Math.floor(Math.random() * 20) };

  // Fetch recent activity events via API
  try {
    const activityResponse = await fetch(`/api/users/${userId}/activity-events?limit=5`); // Define this API
    if (activityResponse.ok) {
      input.recentActivityEvents = await activityResponse.json();
    }
  } catch (e) { console.error("Failed to fetch activity events for recommendations:", e); }
  
  // Fetch leaderboard rank via API
  try {
    const pointsResponse = await fetch(`/api/users/${userId}/points`); // Define this API
    if (pointsResponse.ok) {
      const pointsData = await pointsResponse.json();
      input.leaderboardRank = pointsData.rank_all_time || Math.floor(Math.random() * 100) + 1; 
    }
  } catch (e) { console.error("Failed to fetch user points for recommendations:", e); }


  // Fetch achievements via API
  try {
    const achievementsResponse = await fetch(`/api/users/${userId}/achievements`); // Define this API
    if (achievementsResponse.ok) {
      // Assuming API returns array of achievement names or objects with name
      input.achievements = (await achievementsResponse.json()).map((ach: any) => ach.name || ach);
    }
  } catch (e) { console.error("Failed to fetch user achievements for recommendations:", e); }

  console.log("Generated user input for recommendations flow (API based):", JSON.stringify(input, null, 2));
  return input;
}

export async function getDashboardRecommendations(userId: string): Promise<DashboardRecommendationsOutput> {
  const userInput = await getUserInputForFlow(userId);
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
{{#if enrolledCourses.length}}
- Enrolled Courses:
  {{#each enrolledCourses}}
  - "{{title}}" ({{category}}): Progress {{progress}}%{{#if lastAccessed}}, Last Accessed: {{lastAccessed}}{{/if}}
  {{/each}}
{{else}}
- No courses enrolled yet.
{{/if}}

{{#if createdProjects.length}}
- Projects:
  {{#each createdProjects}}
  - "{{title}}" (Tags: {{#if tags}}{{#each tags}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}{{else}}N/A{{/if}}){{#if role}}, Role: {{role}}{{/if}}{{#if lastContribution}}, Last Contribution: {{lastContribution}}{{/if}}
  {{/each}}
{{else}}
- No projects created yet.
{{/if}}

{{#if communityEngagement}}
- Community Engagement:
  {{#if communityEngagement.forumPosts}}Forum Posts: {{communityEngagement.forumPosts}}{{else}}No forum posts.{{/if}}
  {{#if communityEngagement.commentsMade}}Comments Made: {{communityEngagement.commentsMade}}{{else}}No comments made.{{/if}}
  {{#if communityEngagement.upvotesGiven}}Upvotes Given: {{communityEngagement.upvotesGiven}}{{else}}No upvotes given.{{/if}}
{{else}}
- No community engagement data.
{{/if}}

{{#if leaderboardRank}}
- Leaderboard Rank: #{{leaderboardRank}}
{{else}}
- Not ranked on leaderboard yet.
{{/if}}

{{#if achievements.length}}
- Achievements: {{#each achievements}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}
{{else}}
- No achievements unlocked yet.
{{/if}}

{{#if recentActivityEvents.length}}
- Recent Activities:
  {{#each recentActivityEvents}}
  - Type: {{type}}, Data: {{jsonStringify data}}, Timestamp: {{timestamp}}
  {{/each}}
{{else}}
- No recent activities recorded.
{{/if}}

Based on this information, generate a diverse list of 3-5 recommendations.
Types of recommendations can include:
- 'course': Suggest a new course or a next step in an existing course.
- 'project': Suggest a project to start, contribute to, or a skill to apply from a project.
- 'user_to_connect': Suggest another user to connect with based on shared interests or skills (use placeholder names if actual users cannot be queried).
- 'community_content': Highlight a relevant forum discussion, blog post, or event (use placeholder titles if actual content cannot be queried).
- 'feature_tip': Suggest exploring a platform feature they might find useful.

For each recommendation:
- Provide a clear 'title'.
- Optionally, an 'itemId' (like course ID, project ID, user ID).
- Optionally, a 'description' for more context.
- Optionally, a 'link' to the relevant page (use placeholder links if needed, e.g., /courses/explore).
- Optionally, a 'reason' explaining why this is recommended for THIS user.
- Optionally, a 'relevanceScore' (0-1).

Prioritize recommendations that are actionable and directly beneficial to the user's growth and engagement on the platform.
Try to provide varied types of recommendations.
If suggesting a course, consider their current progress in other courses or related project skills.
If suggesting a project, align it with their existing skills or learning goals.
If suggesting a user to connect, find users with complementary skills or shared project interests.
If user data is sparse (e.g., new user), provide general recommendations to get started on the platform.

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
    console.log("dashboardRecommendationsFlow called with input:", JSON.stringify(input, null, 2));

    const { output, errors } = await dashboardRecommendationsPrompt(input);

    if (errors && errors.length > 0) {
        console.error("Errors from dashboardRecommendationsPrompt:", errors);
        return { recommendations: [], explanation: `Could not generate recommendations. Errors: ${errors.map(e => e.message).join(', ')}` };
    }

    if (!output) {
        console.warn("dashboardRecommendationsPrompt returned no output.");
        return { recommendations: [], explanation: "Could not generate recommendations at this time (no output from AI)." };
    }
    return output;
  }
);

ai.handlebars.registerHelper('jsonStringify', function(context) {
  try {
    return JSON.stringify(context);
  } catch (e) {
    return "[Unserializable Data]";
  }
});

ai.handlebars.registerHelper('ifNotEmpty', function(array, options) {
  if (array && array.length > 0) {
    return options.fn(this);
  }
  return options.inverse(this);
});
