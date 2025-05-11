
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
    const { address, chain_id, is_primary } = body;

    if (!address || !chain_id) {
      return NextResponse.json({ message: 'Wallet address and chain_id are required' }, { status: 400 });
    }

    // Check if this wallet is already linked to this user
    const existingLink = await query<any[]>(
      'SELECT id FROM web3_wallets WHERE user_uid = ? AND address = ? AND chain_id = ?',
      [userId, address, chain_id]
    );

    if (existingLink.length > 0) {
      // Wallet already linked, maybe update is_primary if needed
      if (is_primary !== undefined) {
        // If setting this as primary, ensure no other wallet is primary for this user
        if (is_primary) {
          await query('UPDATE web3_wallets SET is_primary = false WHERE user_uid = ? AND address != ?', [userId, address]);
        }
        await query('UPDATE web3_wallets SET is_primary = ? WHERE id = ?', [!!is_primary, existingLink[0].id]);
      }
    } else {
      // New wallet link
      if (is_primary) {
         // If setting this as primary, ensure no other wallet is primary for this user
        await query('UPDATE web3_wallets SET is_primary = false WHERE user_uid = ?', [userId]);
      }
      await query<any>(
        'INSERT INTO web3_wallets (user_uid, address, chain_id, is_primary, linked_at) VALUES (?, ?, ?, ?, ?)',
        [userId, address, chain_id, !!is_primary, new Date()]
      );
    }

    // Fetch the updated user profile to return
    const users = await query<UserData[]>(
      `SELECT uid, name, email, avatar_url, bio, dashboard_layout_preferences, created_at, updated_at FROM users WHERE uid = ?`,
      [userId]
    );
    if (users.length === 0) {
      return NextResponse.json({ message: 'User not found after linking wallet' }, { status: 404 });
    }
    const user = users[0];
    const authProviders = await query<any[]>( `SELECT provider_name, provider_user_id FROM user_auth_providers WHERE user_uid = ?`, [userId]);
    user.auth_providers_linked = authProviders;
    const web3Wallets = await query<any[]>( `SELECT address, chain_id, linked_at, is_primary FROM web3_wallets WHERE user_uid = ?`, [userId]);
    user.web3_wallets = web3Wallets;

    return NextResponse.json(user, { status: 200 });

  } catch (error: any) {
    console.error(`API Error linking wallet for user ${userId}:`, error);
    if (error.code === 'ER_DUP_ENTRY') {
        return NextResponse.json({ message: 'This wallet is already linked to this user on the specified chain.', error: error.message }, { status: 409 });
    }
    return NextResponse.json({ message: 'Failed to link wallet', error: error.message }, { status: 500 });
  }
}
