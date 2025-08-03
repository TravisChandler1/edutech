import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query');

    if (!query || query.trim().length < 2) {
      return NextResponse.json({
        success: false,
        error: 'Search query must be at least 2 characters'
      });
    }

    // Search for users by name or email
    // Only return users who have a paid plan (not Novice/Free)
    const searchQuery = `
      SELECT 
        id, name, email, selected_plan, role, created_at
      FROM users 
      WHERE 
        (LOWER(name) LIKE LOWER($1) OR LOWER(email) LIKE LOWER($1))
        AND selected_plan IS NOT NULL 
        AND selected_plan != 'Novice'
        AND status = 'active'
      ORDER BY 
        CASE 
          WHEN LOWER(name) LIKE LOWER($2) THEN 1
          WHEN LOWER(email) LIKE LOWER($2) THEN 2
          ELSE 3
        END,
        name ASC
      LIMIT 20
    `;

    const searchTerm = `%${query.trim()}%`;
    const exactTerm = `${query.trim()}%`;

    const result = await pool.query(searchQuery, [searchTerm, exactTerm]);
    
    const users = result.rows.map(row => ({
      id: row.id,
      name: row.name,
      email: row.email,
      selectedPlan: row.selected_plan,
      role: row.role,
      createdAt: row.created_at
    }));

    return NextResponse.json({
      success: true,
      users
    });

  } catch (error) {
    console.error('User search API error:', error);
    
    // Return fallback empty results if database issues
    return NextResponse.json({
      success: true,
      users: []
    });
  }
}
