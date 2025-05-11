
# Database Schema for HEX THE ADD HUB

This document outlines the database schema for the HEX THE ADD HUB application. It includes the original Firestore schema and a proposed MySQL relational schema.

## Original Firestore Schema (NoSQL)

(Existing Firestore schema content remains here...)

### `users` (Firestore Collection)
Stores additional user profile information beyond what Firebase Auth provides directly. Document ID is the Firebase Auth `uid`.
- `uid`: STRING (Primary Key - Firebase Auth UID)
- `name`: STRING (User's display name)
- `email`: STRING (Indexed, from Firebase Auth)
- `avatar_url`: STRING (Optional, URL to avatar image - can be Firebase Storage link)
- `bio`: STRING (Optional, user's biography, max 500 chars)
- `dashboard_layout_preferences`: MAP (Optional, stores user's dashboard widget layout and visibility)
- `web3_wallets`: ARRAY of MAPS (Optional, stores linked Web3 wallet addresses)
  - `address`: STRING (Wallet address, unique within the array for this user)
  - `chain_id`: STRING
  - `linked_at`: TIMESTAMP
  - `is_primary`: BOOLEAN
- `auth_providers_linked`: ARRAY of MAPS
  - `provider_name`: STRING
  - `provider_user_id`: STRING
- `created_at`: TIMESTAMP
- `updated_at`: TIMESTAMP

(Rest of the Firestore schema definitions...)

## Proposed MySQL Schema (SQL - Relational)

This is a proposed relational schema for MySQL. Data types, constraints, and indexes should be reviewed and refined.

### `users` Table
- `uid`: VARCHAR(255) PRIMARY KEY (Matches Firebase Auth UID)
- `name`: VARCHAR(255)
- `email`: VARCHAR(255) UNIQUE NOT NULL
- `avatar_url`: VARCHAR(2048)
- `bio`: TEXT
- `dashboard_layout_preferences`: JSON
- `created_at`: TIMESTAMP DEFAULT CURRENT_TIMESTAMP
- `updated_at`: TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP

### `user_auth_providers` Table
- `id`: INT AUTO_INCREMENT PRIMARY KEY
- `user_uid`: VARCHAR(255) NOT NULL
- `provider_name`: VARCHAR(50) NOT NULL  -- e.g., 'google.com', 'github.com', 'password'
- `provider_user_id`: VARCHAR(255) NOT NULL
- `created_at`: TIMESTAMP DEFAULT CURRENT_TIMESTAMP
- FOREIGN KEY (`user_uid`) REFERENCES `users`(`uid`) ON DELETE CASCADE
- UNIQUE KEY `idx_user_provider` (`user_uid`, `provider_name`)

### `web3_wallets` Table
- `id`: INT AUTO_INCREMENT PRIMARY KEY
- `user_uid`: VARCHAR(255) NOT NULL
- `address`: VARCHAR(42) NOT NULL           -- Ethereum address length
- `chain_id`: VARCHAR(50) NOT NULL
- `linked_at`: TIMESTAMP DEFAULT CURRENT_TIMESTAMP
- `is_primary`: BOOLEAN DEFAULT FALSE
- FOREIGN KEY (`user_uid`) REFERENCES `users`(`uid`) ON DELETE CASCADE
- UNIQUE KEY `idx_user_wallet_address_chain` (`user_uid`, `address`, `chain_id`)

### `projects` Table
- `id`: VARCHAR(255) PRIMARY KEY  -- Or INT AUTO_INCREMENT if preferred, use UUIDs for IDs
- `user_uid`: VARCHAR(255) NOT NULL
- `title`: VARCHAR(255) NOT NULL
- `slug`: VARCHAR(255) UNIQUE
- `description`: TEXT
- `long_description`: LONGTEXT
- `image_url`: VARCHAR(2048)
- `project_link`: VARCHAR(2048)
- `status`: ENUM('draft', 'published', 'archived') DEFAULT 'draft'
- `published_at`: TIMESTAMP NULL
- `created_at`: TIMESTAMP DEFAULT CURRENT_TIMESTAMP
- `updated_at`: TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
- FOREIGN KEY (`user_uid`) REFERENCES `users`(`uid`)

### `project_gallery_images` Table
- `id`: INT AUTO_INCREMENT PRIMARY KEY
- `project_id`: VARCHAR(255) NOT NULL
- `image_url`: VARCHAR(2048) NOT NULL
- `order_index`: INT DEFAULT 0
- FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`) ON DELETE CASCADE

### `project_tags` Table (Many-to-Many relationship between projects and tags)
- `project_id`: VARCHAR(255) NOT NULL
- `tag_id`: INT NOT NULL
- PRIMARY KEY (`project_id`, `tag_id`)
- FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`) ON DELETE CASCADE
- FOREIGN KEY (`tag_id`) REFERENCES `tags`(`id`) ON DELETE CASCADE

### `tags` Table
- `id`: INT AUTO_INCREMENT PRIMARY KEY
- `name`: VARCHAR(100) UNIQUE NOT NULL
- `created_at`: TIMESTAMP DEFAULT CURRENT_TIMESTAMP

### `courses` Table
- `id`: VARCHAR(255) PRIMARY KEY -- Or INT AUTO_INCREMENT
- `instructor_uid`: VARCHAR(255) NOT NULL
- `title`: VARCHAR(255) NOT NULL
- `slug`: VARCHAR(255) UNIQUE
- `description`: TEXT
- `long_description`: LONGTEXT
- `cover_image_url`: VARCHAR(2048)
- `promo_video_url`: VARCHAR(2048)
- `price_amount`: DECIMAL(10, 2)  -- Store amount in main currency unit (e.g., 49.99)
- `price_currency`: VARCHAR(10)   -- e.g., 'USD', 'ETH'
- `is_free`: BOOLEAN DEFAULT FALSE
- `category`: VARCHAR(100)
- `level`: ENUM('Beginner', 'Intermediate', 'Advanced')
- `duration_text`: VARCHAR(100)
- `lessons_count`: INT DEFAULT 0
- `status`: ENUM('draft', 'published', 'archived') DEFAULT 'draft'
- `published_at`: TIMESTAMP NULL
- `learning_objectives`: JSON  -- Store as JSON array of strings
- `target_audience`: TEXT
- `created_at`: TIMESTAMP DEFAULT CURRENT_TIMESTAMP
- `updated_at`: TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
- FOREIGN KEY (`instructor_uid`) REFERENCES `users`(`uid`)

### `course_modules` Table
- `id`: VARCHAR(255) PRIMARY KEY -- Or INT AUTO_INCREMENT
- `course_id`: VARCHAR(255) NOT NULL
- `title`: VARCHAR(255) NOT NULL
- `description`: TEXT
- `order_index`: INT DEFAULT 0
- `created_at`: TIMESTAMP DEFAULT CURRENT_TIMESTAMP
- `updated_at`: TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
- FOREIGN KEY (`course_id`) REFERENCES `courses`(`id`) ON DELETE CASCADE

### `course_lessons` Table
- `id`: VARCHAR(255) PRIMARY KEY -- Or INT AUTO_INCREMENT
- `module_id`: VARCHAR(255) NOT NULL
- `course_id`: VARCHAR(255) NOT NULL -- Denormalized for easier querying, or join through modules
- `title`: VARCHAR(255) NOT NULL
- `content_type`: ENUM('video', 'text', 'quiz', 'assignment', 'external_link') NOT NULL
- `content_data`: JSON -- Store video URL, text content, quiz structure, etc.
- `order_index`: INT DEFAULT 0
- `estimated_duration_minutes`: INT
- `is_previewable`: BOOLEAN DEFAULT FALSE
- `created_at`: TIMESTAMP DEFAULT CURRENT_TIMESTAMP
- `updated_at`: TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
- FOREIGN KEY (`module_id`) REFERENCES `course_modules`(`id`) ON DELETE CASCADE
- FOREIGN KEY (`course_id`) REFERENCES `courses`(`id`) ON DELETE CASCADE

### `course_enrollments` Table
- `id`: VARCHAR(255) PRIMARY KEY -- Or INT AUTO_INCREMENT, or composite (user_uid, course_id)
- `user_uid`: VARCHAR(255) NOT NULL
- `course_id`: VARCHAR(255) NOT NULL
- `enrolled_at`: TIMESTAMP DEFAULT CURRENT_TIMESTAMP
- `payment_id`: VARCHAR(255) -- Link to a payments table
- `progress_percentage`: TINYINT UNSIGNED DEFAULT 0
- `completed_at`: TIMESTAMP NULL
- `certificate_nft_tx_hash`: VARCHAR(255)
- `certificate_pdf_url`: VARCHAR(2048)
- FOREIGN KEY (`user_uid`) REFERENCES `users`(`uid`) ON DELETE CASCADE
- FOREIGN KEY (`course_id`) REFERENCES `courses`(`id`) ON DELETE CASCADE
- UNIQUE KEY `idx_user_course_enrollment` (`user_uid`, `course_id`)

### `completed_lessons` Table (Many-to-Many for lesson completion tracking)
- `enrollment_id`: VARCHAR(255) NOT NULL -- Or (user_uid, course_id)
- `lesson_id`: VARCHAR(255) NOT NULL
- `completed_at`: TIMESTAMP DEFAULT CURRENT_TIMESTAMP
- PRIMARY KEY (`enrollment_id`, `lesson_id`)
- FOREIGN KEY (`enrollment_id`) REFERENCES `course_enrollments`(`id`) ON DELETE CASCADE
- FOREIGN KEY (`lesson_id`) REFERENCES `course_lessons`(`id`) ON DELETE CASCADE

### `course_ratings` Table
- `id`: VARCHAR(255) PRIMARY KEY
- `user_uid`: VARCHAR(255) NOT NULL
- `course_id`: VARCHAR(255) NOT NULL
- `rating`: TINYINT UNSIGNED NOT NULL CHECK (`rating` BETWEEN 1 AND 5)
- `comment`: TEXT
- `created_at`: TIMESTAMP DEFAULT CURRENT_TIMESTAMP
- `updated_at`: TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
- FOREIGN KEY (`user_uid`) REFERENCES `users`(`uid`) ON DELETE CASCADE
- FOREIGN KEY (`course_id`) REFERENCES `courses`(`id`) ON DELETE CASCADE
- UNIQUE KEY `idx_user_course_rating` (`user_uid`, `course_id`)

### `user_points` Table
- `user_uid`: VARCHAR(255) PRIMARY KEY
- `total_points`: INT DEFAULT 0
- `monthly_points`: INT DEFAULT 0
- `weekly_points`: INT DEFAULT 0
- `rank_all_time`: INT NULL
- `rank_monthly`: INT NULL
- `rank_weekly`: INT NULL
- `last_point_activity_at`: TIMESTAMP NULL
- `last_updated_at`: TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
- FOREIGN KEY (`user_uid`) REFERENCES `users`(`uid`) ON DELETE CASCADE

### `achievement_definitions` Table
- `id`: VARCHAR(50) PRIMARY KEY -- e.g., 'COURSE_COMPLETION_MASTER'
- `name`: VARCHAR(255) NOT NULL
- `description`: TEXT
- `icon_name`: VARCHAR(100)
- `points_value`: INT DEFAULT 0
- `criteria`: JSON -- e.g., { "type": "course_completions", "count": 5 }
- `category`: VARCHAR(100)
- `created_at`: TIMESTAMP DEFAULT CURRENT_TIMESTAMP

### `user_achievements` Table
- `id`: VARCHAR(255) PRIMARY KEY
- `user_uid`: VARCHAR(255) NOT NULL
- `achievement_id`: VARCHAR(50) NOT NULL
- `achieved_at`: TIMESTAMP DEFAULT CURRENT_TIMESTAMP
- `metadata`: JSON -- e.g., { "course_id": "xyz" }
- FOREIGN KEY (`user_uid`) REFERENCES `users`(`uid`) ON DELETE CASCADE
- FOREIGN KEY (`achievement_id`) REFERENCES `achievement_definitions`(`id`) ON DELETE CASCADE
- UNIQUE KEY `idx_user_achievement` (`user_uid`, `achievement_id`)

### `user_activity_events` Table
- `id`: VARCHAR(255) PRIMARY KEY
- `user_uid`: VARCHAR(255) NOT NULL
- `event_type`: VARCHAR(100) NOT NULL
- `event_data`: JSON
- `timestamp`: TIMESTAMP DEFAULT CURRENT_TIMESTAMP
- `points_earned`: INT DEFAULT 0
- FOREIGN KEY (`user_uid`) REFERENCES `users`(`uid`)

### `blog_posts` Table
- `id`: VARCHAR(255) PRIMARY KEY
- `author_uid`: VARCHAR(255) NOT NULL
- `title`: VARCHAR(255) NOT NULL
- `slug`: VARCHAR(255) UNIQUE
- `excerpt`: TEXT
- `content_markdown`: LONGTEXT
- `cover_image_url`: VARCHAR(2048)
- `status`: ENUM('draft', 'published', 'archived') DEFAULT 'draft'
- `published_at`: TIMESTAMP NULL
- `category`: VARCHAR(100)
- `view_count`: INT DEFAULT 0
- `like_count`: INT DEFAULT 0
- `created_at`: TIMESTAMP DEFAULT CURRENT_TIMESTAMP
- `updated_at`: TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
- FOREIGN KEY (`author_uid`) REFERENCES `users`(`uid`)

### `blog_post_tags` Table
- `blog_post_id`: VARCHAR(255) NOT NULL
- `tag_id`: INT NOT NULL
- PRIMARY KEY (`blog_post_id`, `tag_id`)
- FOREIGN KEY (`blog_post_id`) REFERENCES `blog_posts`(`id`) ON DELETE CASCADE
- FOREIGN KEY (`tag_id`) REFERENCES `tags`(`id`) ON DELETE CASCADE

---
This MySQL schema is a starting point. You'll need to:
- Choose appropriate primary key strategies (auto-incrementing integers vs. UUIDs).
- Define more specific data types (e.g., for lengths of VARCHARs).
- Add necessary indexes for performance based on your query patterns.
- Consider constraints like NOT NULL, UNIQUE more thoroughly.
- Plan for handling relationships (e.g., tags, gallery images) using join tables.
