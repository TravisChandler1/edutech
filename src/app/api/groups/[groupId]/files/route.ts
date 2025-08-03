import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { v4 as uuidv4 } from 'uuid';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export async function POST(
  request: NextRequest,
  { params }: { params: { groupId: string } }
) {
  try {
    const { groupId } = params;
    const formData = await request.formData();
    
    const file = formData.get('file') as File;
    const uploaderId = formData.get('uploaderId') as string;
    const uploaderName = formData.get('uploaderName') as string;
    const description = formData.get('description') as string || '';

    if (!file) {
      return NextResponse.json({
        success: false,
        error: 'No file provided'
      });
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return NextResponse.json({
        success: false,
        error: 'File size exceeds 10MB limit'
      });
    }

    // Generate unique filename
    const fileExtension = file.name.split('.').pop();
    const uniqueFilename = `${uuidv4()}.${fileExtension}`;
    
    // Create upload directory if it doesn't exist
    const uploadDir = join(process.cwd(), 'public', 'uploads', 'groups', groupId);
    await mkdir(uploadDir, { recursive: true });
    
    // Save file to disk
    const filePath = join(uploadDir, uniqueFilename);
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filePath, buffer);

    // Determine file category
    const getFileCategory = (filename: string) => {
      const ext = filename.toLowerCase().split('.').pop();
      if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext || '')) return 'image';
      if (['mp4', 'avi', 'mov', 'wmv'].includes(ext || '')) return 'video';
      if (['mp3', 'wav', 'ogg', 'm4a'].includes(ext || '')) return 'audio';
      if (['pdf', 'doc', 'docx', 'txt', 'rtf'].includes(ext || '')) return 'document';
      return 'other';
    };

    // Save file info to database
    const insertQuery = `
      INSERT INTO group_files (
        group_id, uploader_id, uploader_name, file_name, file_type, 
        file_size, file_url, description, category
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *
    `;

    const fileUrl = `/uploads/groups/${groupId}/${uniqueFilename}`;
    const fileSize = (file.size / 1024 / 1024).toFixed(2) + ' MB';
    const category = getFileCategory(file.name);

    const result = await pool.query(insertQuery, [
      groupId, uploaderId, uploaderName, file.name, file.type,
      fileSize, fileUrl, description, category
    ]);

    const fileRecord = result.rows[0];

    return NextResponse.json({
      success: true,
      file: {
        id: fileRecord.id,
        groupId: fileRecord.group_id,
        uploaderId: fileRecord.uploader_id,
        uploaderName: fileRecord.uploader_name,
        fileName: fileRecord.file_name,
        fileType: fileRecord.file_type,
        fileSize: fileRecord.file_size,
        fileUrl: fileRecord.file_url,
        description: fileRecord.description,
        category: fileRecord.category,
        uploadedAt: fileRecord.uploaded_at,
        downloadCount: fileRecord.download_count
      },
      fileUrl
    });

  } catch (error) {
    console.error('File upload API error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to upload file'
    });
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { groupId: string } }
) {
  try {
    const { groupId } = params;
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');

    let query = `
      SELECT * FROM group_files 
      WHERE group_id = $1
    `;
    const values = [groupId];

    if (category && category !== 'all') {
      query += ` AND category = $2`;
      values.push(category);
    }

    query += ` ORDER BY uploaded_at DESC`;

    const result = await pool.query(query, values);
    
    const files = result.rows.map(row => ({
      id: row.id,
      groupId: row.group_id,
      uploaderId: row.uploader_id,
      uploaderName: row.uploader_name,
      fileName: row.file_name,
      fileType: row.file_type,
      fileSize: row.file_size,
      fileUrl: row.file_url,
      description: row.description,
      category: row.category,
      uploadedAt: row.uploaded_at,
      downloadCount: row.download_count,
      isPublic: row.is_public
    }));

    return NextResponse.json({
      success: true,
      files
    });

  } catch (error) {
    console.error('Get files API error:', error);
    return NextResponse.json({
      success: true,
      files: []
    });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { groupId: string } }
) {
  try {
    const { groupId } = params;
    const { fileId, action } = await request.json();

    if (action === 'increment_download') {
      const updateQuery = `
        UPDATE group_files 
        SET download_count = download_count + 1 
        WHERE id = $1 AND group_id = $2
        RETURNING download_count
      `;

      const result = await pool.query(updateQuery, [fileId, groupId]);

      return NextResponse.json({
        success: true,
        downloadCount: result.rows[0]?.download_count || 0
      });
    }

    return NextResponse.json({
      success: false,
      error: 'Invalid action'
    });

  } catch (error) {
    console.error('Update file API error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to update file'
    });
  }
}
