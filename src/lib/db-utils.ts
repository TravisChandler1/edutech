import pool from './db';

// Re-export the pool for direct use
export { pool };

export const db = {
  // Community queries
  async findApprovedCommunities() {
    const result = await pool.query(
      `SELECT c.*, 
              u.name as creator_name,
              u.email as creator_email,
              COUNT(DISTINCT m.user_id) as member_count
       FROM communities c
       JOIN users u ON c.creator_id = u.id
       LEFT JOIN community_members m ON c.id = m.community_id
       WHERE c.is_approved = true
       GROUP BY c.id, u.id
       ORDER BY c.created_at DESC`
    );
    return result.rows;
  },

  async createCommunity(data: {
    name: string;
    description: string;
    creatorId: string;
    category: string;
  }) {
    const result = await pool.query(
      `INSERT INTO communities (name, description, creator_id, category, is_approved)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [data.name, data.description, data.creatorId, data.category, false]
    );
    return result.rows[0];
  },

  async findCommunityById(id: string) {
    const result = await pool.query(
      `SELECT c.*, 
              u.name as creator_name,
              COUNT(m.user_id) as member_count
       FROM communities c
       LEFT JOIN users u ON c.creator_id = u.id
       LEFT JOIN community_members m ON c.id = m.community_id
       WHERE c.id = $1
       GROUP BY c.id, u.id`,
      [id]
    );
    return result.rows[0];
  },

  async findPendingCommunities() {
    const result = await pool.query(
      `SELECT c.*, u.name as creator_name
       FROM communities c
       JOIN users u ON c.creator_id = u.id
       WHERE c.is_approved = false
       ORDER BY c.created_at ASC`
    );
    return result.rows;
  },

  async approveCommunity(id: string, approvedById: string) {
    const result = await pool.query(
      `UPDATE communities 
       SET is_approved = true, 
           approved_by = $1, 
           approved_at = NOW()
       WHERE id = $2
       RETURNING *`,
      [approvedById, id]
    );
    return result.rows[0];
  },

  async deleteCommunity(id: string) {
    await pool.query('DELETE FROM communities WHERE id = $1', [id]);
  },

  // User-community relationships
  async addCommunityMember(communityId: string, userId: string) {
    await pool.query(
      `INSERT INTO community_members (community_id, user_id)
       VALUES ($1, $2)
       ON CONFLICT (community_id, user_id) DO NOTHING`,
      [communityId, userId]
    );
  },

  async removeCommunityMember(communityId: string, userId: string) {
    await pool.query(
      'DELETE FROM community_members WHERE community_id = $1 AND user_id = $2',
      [communityId, userId]
    );
  },

  // Ebook queries
  async findEbooks(filters: {
    userId: string;  // Make userId required
    category?: string;
    language?: string;
    search?: string;
  }) {
    let query = `
      SELECT e.*, 
             EXISTS(
               SELECT 1 FROM user_saved_books usb 
               WHERE usb.ebook_id = e.id AND usb.user_id = $1
             ) as is_saved
      FROM ebooks e
      WHERE 1=1
    `;
    const params: any[] = [filters.userId];
    let paramIndex = 2;

    if (filters.category) {
      query += ` AND e.category = $${paramIndex++}`;
      params.push(filters.category);
    }

    if (filters.language) {
      query += ` AND e.language = $${paramIndex++}`;
      params.push(filters.language);
    }

    if (filters.search) {
      query += ` AND (
        e.title ILIKE $${paramIndex} OR 
        e.author ILIKE $${paramIndex} OR 
        e.description ILIKE $${paramIndex}
      )`;
      params.push(`%${filters.search}%`);
    }

    query += ' ORDER BY e.created_at DESC';
    
    const result = await pool.query(query, params);
    return result.rows;
  },

  async saveEbookForUser(ebookId: string, userId: string) {
    await pool.query(
      `INSERT INTO user_saved_books (user_id, ebook_id)
       VALUES ($1, $2)
       ON CONFLICT (user_id, ebook_id) DO NOTHING`,
      [userId, ebookId]
    );
  },

  async removeSavedEbook(ebookId: string, userId: string) {
    await pool.query(
      'DELETE FROM user_saved_books WHERE user_id = $1 AND ebook_id = $2',
      [userId, ebookId]
    );
  },

  // Live class queries
  async findLiveClasses(filters: {
    level?: string;
    isLive?: boolean;
    teacherId?: string;
    upcomingOnly?: boolean;
  } = {}) {
    let query = `
      SELECT c.*, 
             u.name as teacher_name,
             COUNT(e.user_id) as enrolled_count
      FROM live_classes c
      JOIN users u ON c.teacher_id = u.id
      LEFT JOIN class_enrollments e ON c.id = e.class_id
      WHERE 1=1
    `;
    const params: any[] = [];
    let paramIndex = 1;

    if (filters.level) {
      query += ` AND c.level = $${paramIndex++}`;
      params.push(filters.level);
    }

    if (filters.isLive !== undefined) {
      query += ` AND c.is_live = $${paramIndex++}`;
      params.push(filters.isLive);
    }

    if (filters.teacherId) {
      query += ` AND c.teacher_id = $${paramIndex++}`;
      params.push(filters.teacherId);
    }

    if (filters.upcomingOnly) {
      query += ` AND c.scheduled_date > NOW()`;
    }

    query += ' GROUP BY c.id, u.id';
    query += ' ORDER BY c.scheduled_date ASC';
    
    const result = await pool.query(query, params);
    return result.rows;
  },

  async enrollInLiveClass(classId: string, userId: string) {
    await pool.query(
      `INSERT INTO class_enrollments (class_id, user_id)
       VALUES ($1, $2)
       ON CONFLICT (class_id, user_id) DO NOTHING`,
      [classId, userId]
    );
  },

  async unenrollFromLiveClass(classId: string, userId: string) {
    await pool.query(
      'DELETE FROM class_enrollments WHERE class_id = $1 AND user_id = $2',
      [classId, userId]
    );
  },

  // Book club queries
  async findBookClubSessions(filters: {
    bookId?: string;
    upcomingOnly?: boolean;
  } = {}) {
    let query = `
      SELECT s.*, 
             u.name as host_name,
             COUNT(p.user_id) as participant_count
      FROM book_club_sessions s
      JOIN users u ON s.host_id = u.id
      LEFT JOIN session_participants p ON s.id = p.session_id
      WHERE 1=1
    `;
    const params: any[] = [];
    let paramIndex = 1;

    if (filters.bookId) {
      query += ` AND s.book_id = $${paramIndex++}`;
      params.push(filters.bookId);
    }

    if (filters.upcomingOnly) {
      query += ` AND s.scheduled_date > NOW()`;
    }

    query += ' GROUP BY s.id, u.id';
    query += ' ORDER BY s.scheduled_date ASC';
    
    const result = await pool.query(query, params);
    return result.rows;
  },

  async addSessionParticipant(sessionId: string, userId: string) {
    await pool.query(
      `INSERT INTO session_participants (session_id, user_id)
       VALUES ($1, $2)
       ON CONFLICT (session_id, user_id) DO NOTHING`,
      [sessionId, userId]
    );
  },

  async removeSessionParticipant(sessionId: string, userId: string) {
    await pool.query(
      'DELETE FROM session_participants WHERE session_id = $1 AND user_id = $2',
      [sessionId, userId]
    );
  },
};

export default db;
