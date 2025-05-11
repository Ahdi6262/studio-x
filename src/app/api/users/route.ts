
import { NextResponse, type NextRequest } from 'next/server';
import { query } from '@/lib/mysql';
import type { UserData } from '@/contexts/auth-context'; // Assuming UserData structure

interface NewUserAPIPayload {
  uid: string;
  email: string | null;
  name: string | null;
  avatar_url?: string | null;
  auth_providers_linked?: Array<{ provider_name: string; provider_user_id: string; }>;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as NewUserAPIPayload;
    const { uid, email, name, avatar_url, auth_providers_linked } = body;

    if (!uid || !email) {
      return NextResponse.json({ message: 'UID and Email are required' }, { status: 400 });
    }

    // Check if user already exists
    const existingUser = await query<UserData[]>('SELECT uid FROM users WHERE uid = ? OR email = ?', [uid, email]);
    if (existingUser.length > 0) {
      // If user exists, perhaps fetch and return existing data or handle as an update/merge?
      // For now, let's assume POST is for creation and return conflict if exists by UID.
      // If it exists by email but different UID, that's a more complex conflict.
      if (existingUser.find(u => u.uid === uid)) {
          return NextResponse.json({ message: 'User with this UID already exists' }, { status: 409 });
      }
      // Handle case where email exists with different UID if necessary.
    }
    
    const userData: any = {
        uid,
        email,
        name: name || email, // Default name to email if not provided
        avatar_url: avatar_url || null,
        bio: null, // Default bio
        dashboard_layout_preferences: null, // Default layout
        created_at: new Date(),
        updated_at: new Date(),
    };

    const result = await query<any>('INSERT INTO users SET ?', [userData]);

    if (result.affectedRows === 0) {
      throw new Error('Failed to insert user into database.');
    }

    // If auth_providers_linked are provided, insert them
    if (auth_providers_linked && auth_providers_linked.length > 0) {
        for (const provider of auth_providers_linked) {
            await query('INSERT INTO user_auth_providers (user_uid, provider_name, provider_user_id) VALUES (?, ?, ?)', 
            [uid, provider.provider_name, provider.provider_user_id]);
        }
    }
    
    // Fetch the newly created user to return complete data
    const users = await query<UserData[]>(
      `SELECT uid, name, email, avatar_url, bio, dashboard_layout_preferences, created_at, updated_at FROM users WHERE uid = ?`,
      [uid]
    );
    const createdUser = users[0];
    createdUser.auth_providers_linked = auth_providers_linked || [];
    createdUser.web3_wallets = [];


    return NextResponse.json(createdUser, { status: 201 });

  } catch (error: any) {
    console.error('API Error creating user:', error);
    // Check for duplicate entry errors specifically if possible (e.g., ER_DUP_ENTRY for MySQL)
    if (error.code === 'ER_DUP_ENTRY') {
        return NextResponse.json({ message: 'User with this email or UID already exists.', error: error.message }, { status: 409 });
    }
    return NextResponse.json({ message: 'Failed to create user', error: error.message }, { status: 500 });
  }
}
