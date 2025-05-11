
import { NextResponse, type NextRequest } from 'next/server';
import { query } from '@/lib/mysql';
import type { UserData } from '@/contexts/auth-context'; // Assuming UserData structure

export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  const userId = params.userId;
  if (!userId) {
    return NextResponse.json({ message: 'User ID is required' }, { status: 400 });
  }

  try {
    const users = await query<UserData[]>(
      `SELECT uid, name, email, avatar_url, bio, dashboard_layout_preferences, created_at, updated_at FROM users WHERE uid = ?`,
      [userId]
    );

    if (users.length === 0) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }
    
    const user = users[0];

    // Fetch linked auth providers
    const authProviders = await query<any[]>(
        `SELECT provider_name, provider_user_id FROM user_auth_providers WHERE user_uid = ?`,
        [userId]
    );
    user.auth_providers_linked = authProviders;

    // Fetch web3 wallets
    const web3Wallets = await query<any[]>(
        `SELECT address, chain_id, linked_at, is_primary FROM web3_wallets WHERE user_uid = ?`,
        [userId]
    );
    user.web3_wallets = web3Wallets;

    return NextResponse.json(user, { status: 200 });
  } catch (error: any) {
    console.error(`API Error fetching user ${userId}:`, error);
    return NextResponse.json({ message: 'Failed to fetch user data', error: error.message }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  const userId = params.userId;
  if (!userId) {
    return NextResponse.json({ message: 'User ID is required' }, { status: 400 });
  }

  try {
    const body = await request.json();
    const { name, bio, dashboard_layout_preferences } = body;

    // Construct update query dynamically based on provided fields
    const updateFields: string[] = [];
    const updateValues: any[] = [];

    if (name !== undefined) {
      updateFields.push('name = ?');
      updateValues.push(name);
    }
    if (bio !== undefined) {
      updateFields.push('bio = ?');
      updateValues.push(bio);
    }
    if (dashboard_layout_preferences !== undefined) {
      updateFields.push('dashboard_layout_preferences = ?');
      updateValues.push(JSON.stringify(dashboard_layout_preferences));
    }
    
    if (updateFields.length === 0) {
        return NextResponse.json({ message: 'No fields to update' }, { status: 400 });
    }

    updateValues.push(new Date()); // For updated_at
    updateValues.push(userId); // For WHERE clause

    const sql = `UPDATE users SET ${updateFields.join(', ')}, updated_at = ? WHERE uid = ?`;
    
    const result = await query<any>(sql, updateValues);

    if (result.affectedRows === 0) {
      return NextResponse.json({ message: 'User not found or no changes made' }, { status: 404 });
    }

    // Fetch the updated user data to return
    const updatedUsers = await query<UserData[]>(
      `SELECT uid, name, email, avatar_url, bio, dashboard_layout_preferences, created_at, updated_at FROM users WHERE uid = ?`,
      [userId]
    );
     const updatedUser = updatedUsers[0];
    // Re-fetch providers and wallets as they are not updated here but should be part of the response
    const authProviders = await query<any[]>( `SELECT provider_name, provider_user_id FROM user_auth_providers WHERE user_uid = ?`, [userId]);
    updatedUser.auth_providers_linked = authProviders;
    const web3Wallets = await query<any[]>( `SELECT address, chain_id, linked_at, is_primary FROM web3_wallets WHERE user_uid = ?`, [userId]);
    updatedUser.web3_wallets = web3Wallets;


    return NextResponse.json(updatedUser, { status: 200 });
  } catch (error: any) {
    console.error(`API Error updating user ${userId}:`, error);
    return NextResponse.json({ message: 'Failed to update user data', error: error.message }, { status: 500 });
  }
}
