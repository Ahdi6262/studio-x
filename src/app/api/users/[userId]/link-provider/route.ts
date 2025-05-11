
import { NextResponse, type NextRequest } from 'next/server';
import { query } from '@/lib/mysql';
import type { UserData } from '@/contexts/auth-context';


export async function POST(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  const userId = params.userId;
  if (!userId) {
    return NextResponse.json({ message: 'User ID is required' }, { status: 400 });
  }

  try {
    const body = await request.json();
    const { provider_name, provider_user_id } = body;

    if (!provider_name || !provider_user_id) {
      return NextResponse.json({ message: 'provider_name and provider_user_id are required' }, { status: 400 });
    }

    // Check if this provider is already linked
    const existingLink = await query<any[]>(
      'SELECT id FROM user_auth_providers WHERE user_uid = ? AND provider_name = ?',
      [userId, provider_name]
    );

    if (existingLink.length > 0) {
      // Optionally update provider_user_id if it changed, though usually it doesn't
      // For now, just confirm it's linked.
       return NextResponse.json({ message: 'Provider already linked' }, { status: 200 });
    }

    await query<any>(
      'INSERT INTO user_auth_providers (user_uid, provider_name, provider_user_id, created_at) VALUES (?, ?, ?, ?)',
      [userId, provider_name, provider_user_id, new Date()]
    );
    
    // Fetch the updated user profile to return
    const users = await query<UserData[]>(
      `SELECT uid, name, email, avatar_url, bio, dashboard_layout_preferences, created_at, updated_at FROM users WHERE uid = ?`,
      [userId]
    );
    if (users.length === 0) {
      return NextResponse.json({ message: 'User not found after linking provider' }, { status: 404 });
    }
    const user = users[0];
    const authProviders = await query<any[]>( `SELECT provider_name, provider_user_id FROM user_auth_providers WHERE user_uid = ?`, [userId]);
    user.auth_providers_linked = authProviders;
    const web3Wallets = await query<any[]>( `SELECT address, chain_id, linked_at, is_primary FROM web3_wallets WHERE user_uid = ?`, [userId]);
    user.web3_wallets = web3Wallets;

    return NextResponse.json(user, { status: 200 });

  } catch (error: any) {
    console.error(`API Error linking provider for user ${userId}:`, error);
     if (error.code === 'ER_DUP_ENTRY') {
        return NextResponse.json({ message: 'This provider is already linked to this user.', error: error.message }, { status: 409 });
    }
    return NextResponse.json({ message: 'Failed to link provider', error: error.message }, { status: 500 });
  }
}
