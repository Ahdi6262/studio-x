
# Database Schema for HEX THE ADD HUB

This document outlines the proposed database schema for the various features of the HEX THE ADD HUB application.

## 1. Authentication & Users

### `users`
Stores information about registered users.
- `id`: UUID (Primary Key)
- `name`: VARCHAR(255)
- `email`: VARCHAR(255) (Unique, Indexed)
- `password_hash`: VARCHAR(255) (For traditional email/password login)
- `avatar_url`: VARCHAR(2048) (Optional, URL to avatar image - can be data URI or link to stored file)
- `created_at`: TIMESTAMP (Default: CURRENT_TIMESTAMP)
- `updated_at`: TIMESTAMP (Default: CURRENT_TIMESTAMP)

### `auth_providers`
Stores information about third-party authentication providers linked to a user (e.g., Google, GitHub, Metamask).
- `id`: UUID (Primary Key)
- `user_id`: UUID (Foreign Key to `users.id`, Indexed)
- `provider_name`: VARCHAR(50) (e.g., 'google', 'github', 'metamask_wallet')
- `provider_user_id`: VARCHAR(255) (User's ID from the provider, Indexed)
- `access_token_encrypted`: TEXT (Optional, for OAuth providers)
- `refresh_token_encrypted`: TEXT (Optional, for OAuth providers)
- `metadata`: JSONB (Optional, for storing extra provider-specific data like wallet chain_id for Metamask)
- `created_at`: TIMESTAMP (Default: CURRENT_TIMESTAMP)
- `updated_at`: TIMESTAMP (Default: CURRENT_TIMESTAMP)
- *Constraint*: Unique (`user_id`, `provider_name`)

### `user_wallets`
Explicitly stores user's blockchain wallet addresses if needed beyond basic auth_providers.
- `id`: UUID (Primary Key)
- `user_id`: UUID (Foreign Key to `users.id`, Indexed)
- `address`: VARCHAR(42) (Blockchain address, Unique, Indexed)
- `chain_id`: INTEGER (e.g., 1 for Ethereum Mainnet, 137 for Polygon)
- `is_primary`: BOOLEAN (Default: false)
- `linked_at`: TIMESTAMP (Default: CURRENT_TIMESTAMP)

## 2. Portfolios (Projects)

### `projects`
Stores details about user-created projects.
- `id`: UUID (Primary Key)
- `user_id`: UUID (Foreign Key to `users.id` - author, Indexed)
- `title`: VARCHAR(255)
- `description`: TEXT
- `long_description`: TEXT (Optional)
- `image_url`: VARCHAR(2048)
- `project_link`: VARCHAR(2048) (Optional, URL to live project or repository)
- `published_date`: DATE
- `status`: VARCHAR(20) (e.g., 'draft', 'published', 'archived', Default: 'draft')
- `created_at`: TIMESTAMP (Default: CURRENT_TIMESTAMP)
- `updated_at`: TIMESTAMP (Default: CURRENT_TIMESTAMP)

### `project_tags` (Junction Table)
Links projects to tags.
- `project_id`: UUID (Foreign Key to `projects.id`)
- `tag_id`: UUID (Foreign Key to a global `tags` table, or use `tag_name` if tags are simpler)
- *Primary Key*: (`project_id`, `tag_id`)

## 3. Courses

### `courses`
Stores information about available courses.
- `id`: UUID (Primary Key)
- `instructor_id`: UUID (Foreign Key to `users.id`, Indexed)
- `title`: VARCHAR(255)
- `slug`: VARCHAR(255) (Unique, Indexed, for SEO-friendly URLs)
- `description`: TEXT
- `long_description`: TEXT (Optional, for detailed course page)
- `image_url`: VARCHAR(2048)
- `price_amount`: DECIMAL(10, 2) (Nullable, if 'Free')
- `price_currency`: VARCHAR(3) (e.g., 'USD', Nullable)
- `is_free`: BOOLEAN (Default: false)
- `category`: VARCHAR(100) (Indexed)
- `level`: VARCHAR(50) (e.g., 'Beginner', 'Intermediate', 'Advanced', Indexed)
- `duration_text`: VARCHAR(100) (e.g., "6 weeks", "Approx 20 hours")
- `lessons_count`: INTEGER
- `status`: VARCHAR(20) (e.g., 'draft', 'published', 'archived', Default: 'draft')
- `created_at`: TIMESTAMP (Default: CURRENT_TIMESTAMP)
- `updated_at`: TIMESTAMP (Default: CURRENT_TIMESTAMP)

### `course_modules`
Organizes course content into modules.
- `id`: UUID (Primary Key)
- `course_id`: UUID (Foreign Key to `courses.id`, Indexed)
- `title`: VARCHAR(255)
- `order_index`: INTEGER (For sequencing modules)
- `created_at`: TIMESTAMP (Default: CURRENT_TIMESTAMP)
- `updated_at`: TIMESTAMP (Default: CURRENT_TIMESTAMP)

### `course_lessons`
Individual lessons within a module.
- `id`: UUID (Primary Key)
- `module_id`: UUID (Foreign Key to `course_modules.id`, Indexed)
- `title`: VARCHAR(255)
- `content_type`: VARCHAR(50) (e.g., 'video', 'text', 'quiz', 'assignment')
- `content_data`: JSONB (Stores video URL, text content, quiz structure, etc.)
- `order_index`: INTEGER (For sequencing lessons within a module)
- `estimated_duration_minutes`: INTEGER (Optional)
- `created_at`: TIMESTAMP (Default: CURRENT_TIMESTAMP)
- `updated_at`: TIMESTAMP (Default: CURRENT_TIMESTAMP)

### `course_enrollments`
Tracks user enrollment and progress in courses.
- `id`: UUID (Primary Key)
- `user_id`: UUID (Foreign Key to `users.id`, Indexed)
- `course_id`: UUID (Foreign Key to `courses.id`, Indexed)
- `enrolled_at`: TIMESTAMP (Default: CURRENT_TIMESTAMP)
- `progress_percentage`: INTEGER (0-100, Default: 0)
- `completed_at`: TIMESTAMP (Nullable)
- `last_accessed_lesson_id`: UUID (Foreign Key to `course_lessons.id`, Nullable)
- *Constraint*: Unique (`user_id`, `course_id`)

### `course_ratings`
Stores user ratings and reviews for courses.
- `id`: UUID (Primary Key)
- `user_id`: UUID (Foreign Key to `users.id`, Indexed)
- `course_id`: UUID (Foreign Key to `courses.id`, Indexed)
- `rating`: INTEGER (1-5)
- `comment`: TEXT (Optional)
- `created_at`: TIMESTAMP (Default: CURRENT_TIMESTAMP)
- `updated_at`: TIMESTAMP (Default: CURRENT_TIMESTAMP)
- *Constraint*: Unique (`user_id`, `course_id`)

## 4. Leaderboard

### `user_points`
Stores aggregated points for users.
- `user_id`: UUID (Foreign Key to `users.id`, Primary Key)
- `total_points`: BIGINT (Default: 0)
- `monthly_points`: INTEGER (Default: 0, reset periodically)
- `weekly_points`: INTEGER (Default: 0, reset periodically)
- `last_updated_at`: TIMESTAMP (Default: CURRENT_TIMESTAMP)

### `user_achievements`
Tracks achievements unlocked by users.
- `id`: UUID (Primary Key)
- `user_id`: UUID (Foreign Key to `users.id`, Indexed)
- `achievement_key`: VARCHAR(100) (e.g., 'top_contributor', 'course_completed_blockchain_intro', Indexed)
- `achieved_at`: TIMESTAMP (Default: CURRENT_TIMESTAMP)
- `metadata`: JSONB (Optional, for achievement-specific data)
- *Constraint*: Unique (`user_id`, `achievement_key`)

### `achievement_definitions`
Defines available achievements.
- `key`: VARCHAR(100) (Primary Key)
- `name`: VARCHAR(255)
- `description`: TEXT
- `icon_url`: VARCHAR(2048) (Optional)
- `points_value`: INTEGER (Optional, points awarded for this achievement)

## 5. Blog (Future Feature)

### `blog_posts`
- `id`: UUID (Primary Key)
- `author_id`: UUID (Foreign Key to `users.id`, Indexed)
- `title`: VARCHAR(255)
- `slug`: VARCHAR(255) (Unique, Indexed)
- `content_markdown`: TEXT
- `content_html`: TEXT (Generated from markdown)
- `excerpt`: TEXT (Optional)
- `cover_image_url`: VARCHAR(2048) (Optional)
- `status`: VARCHAR(20) (e.g., 'draft', 'published', 'archived', Default: 'draft')
- `published_at`: TIMESTAMP (Nullable)
- `created_at`: TIMESTAMP (Default: CURRENT_TIMESTAMP)
- `updated_at`: TIMESTAMP (Default: CURRENT_TIMESTAMP)

### `blog_post_tags` (Junction Table)
- `post_id`: UUID (Foreign Key to `blog_posts.id`)
- `tag_id`: UUID (Foreign Key to `tags.id`)
- *Primary Key*: (`post_id`, `tag_id`)

## 6. Events (If custom events beyond Google Calendar are needed)

### `platform_events`
- `id`: UUID (Primary Key)
- `title`: VARCHAR(255)
- `description`: TEXT
- `start_datetime`: TIMESTAMP WITH TIME ZONE
- `end_datetime`: TIMESTAMP WITH TIME ZONE
- `location_text`: VARCHAR(255) (Optional, e.g., "Online via Zoom")
- `location_url`: VARCHAR(2048) (Optional)
- `organizer_id`: UUID (Foreign Key to `users.id`, Nullable)
- `category`: VARCHAR(100) (Optional)
- `created_at`: TIMESTAMP (Default: CURRENT_TIMESTAMP)
- `updated_at`: TIMESTAMP (Default: CURRENT_TIMESTAMP)

## 7. Life Tracking

### `life_tracker_settings`
Stores user-specific settings for the life tracking feature.
- `user_id`: UUID (Foreign Key to `users.id`, Primary Key)
- `birth_date`: DATE (Not null)
- `life_expectancy_years`: INTEGER (Not null, Min: 20, Max: 120)
- `enable_notifications`: BOOLEAN (Default: false)
- `timezone`: VARCHAR(100) (Optional, IANA timezone name)
- `updated_at`: TIMESTAMP (Default: CURRENT_TIMESTAMP)

### `life_events` (Optional future expansion)
Allows users to mark significant weeks or events in their life calendar.
- `id`: UUID (Primary Key)
- `user_id`: UUID (Foreign Key to `users.id`, Indexed)
- `week_index`: INTEGER (0-based index from birthDate)
- `year_number`: INTEGER (Year of life, e.g., 1st year, 25th year)
- `title`: VARCHAR(255) (Optional)
- `description`: TEXT (Optional)
- `event_type_color`: VARCHAR(7) (Optional, hex color for custom event highlight)
- `created_at`: TIMESTAMP (Default: CURRENT_TIMESTAMP)

## 8. "My Knowledge" (University/Academic Data)

### `knowledge_domains`
Top-level domains for "My Knowledge", e.g., "IIT Delhi", "Quantitative Finance".
- `id`: UUID (Primary Key)
- `user_id`: UUID (Foreign Key to `users.id`)
- `title`: VARCHAR(255)
- `slug`: VARCHAR(255)
- `description`: TEXT (Optional)
- `icon_name`: VARCHAR(50) (Optional, for Lucide icon or similar)
- `order_index`: INTEGER
- *Constraint*: Unique (`user_id`, `slug`)

### `knowledge_sub_domains`
Sub-categories within a domain, e.g., "Academics" under "IIT Delhi", or "Machine Learning" under "AI".
- `id`: UUID (Primary Key)
- `domain_id`: UUID (Foreign Key to `knowledge_domains.id`)
- `title`: VARCHAR(255)
- `slug`: VARCHAR(255)
- `description`: TEXT (Optional)
- `icon_name`: VARCHAR(50) (Optional)
- `order_index`: INTEGER
- `resource_type`: VARCHAR(50) (e.g., 'course_listing', 'book_collection', 'resource_page')
- *Constraint*: Unique (`domain_id`, `slug`)

### `knowledge_items`
Individual pieces of knowledge, like courses, books. (General purpose or can be specialized)
- `id`: UUID (Primary Key)
- `sub_domain_id`: UUID (Foreign Key to `knowledge_sub_domains.id`)
- `item_type`: VARCHAR(50) (e.g., 'course_category', 'course', 'book', 'lecture_series_link')
- `title`: VARCHAR(255)
- `data`: JSONB (Stores specific data like course list, book details, links)
- `order_index`: INTEGER

*Note on IIT Delhi courses:* The current UI has specific structures for IIT Delhi courses (Institute Core, Departmental, Minor, etc.). This could be modeled with `knowledge_items` where `item_type` is 'course_category' and `data` contains the list of courses with their credits and details, or have dedicated tables if this structure is very rigid and frequently queried.

Example for `knowledge_items.data` where `item_type` is 'course_category_iitd':
```json
{
  "category_title": "Institute Core: Basic Sciences",
  "icon": "BookOpen",
  "iconLetter": "B",
  "description": "Fundamental scientific principles for engineers.",
  "totalCredits": "24",
  "courses": [
    { "id": "bs1", "name": "CML101 Introduction to Chemistry", "credits": "4" },
    // ... other courses
  ]
}
```

## 9. General Purpose Tables

### `tags`
A global table for tags that can be used across different features (projects, blog posts, etc.).
- `id`: UUID (Primary Key)
- `name`: VARCHAR(100) (Unique, Indexed)
- `slug`: VARCHAR(100) (Unique, Indexed)
- `description`: TEXT (Optional)
- `created_at`: TIMESTAMP (Default: CURRENT_TIMESTAMP)

---

This schema is a starting point and can be further refined based on specific query patterns, performance needs, and feature evolution. Normalization and denormalization trade-offs should be considered during implementation.
Using a UUID for primary keys is generally a good practice for distributed systems and to avoid ID collisions if data is merged from different sources. Timestamps help in tracking data changes.
Consider using an ORM (Object-Relational Mapper) like Prisma or TypeORM to manage database interactions and migrations in a Next.js application.

```