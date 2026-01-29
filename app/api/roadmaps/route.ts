import { NextRequest, NextResponse } from 'next/server';
import { readdir, readFile } from 'fs/promises';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

const ROADMAPS_DIR = path.join(process.cwd(), 'data', 'roadmaps');

// GET - List all roadmaps or get a specific one
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    // Ensure directory exists
    await mkdir(ROADMAPS_DIR, { recursive: true });

    if (id) {
      // Get specific roadmap
      const filePath = path.join(ROADMAPS_DIR, `${id}.json`);
      const content = await readFile(filePath, 'utf-8');
      return NextResponse.json(JSON.parse(content));
    }

    // List all roadmaps
    const files = await readdir(ROADMAPS_DIR);
    const roadmaps = await Promise.all(
      files
        .filter((file) => file.endsWith('.json'))
        .map(async (file) => {
          const filePath = path.join(ROADMAPS_DIR, file);
          const content = await readFile(filePath, 'utf-8');
          const data = JSON.parse(content);
          // Return summary data for listing
          return {
            id: data.id,
            title: data.title,
            description: data.description,
            totalNodes: data.totalNodes || data.nodes?.length || 0,
            completedNodes: data.completedNodes || 0,
            createdAt: data.createdAt,
            updatedAt: data.updatedAt,
            isPublic: data.isPublic ?? true,
          };
        })
    );

    return NextResponse.json(roadmaps);
  } catch (error) {
    console.error('Error reading roadmaps:', error);
    return NextResponse.json({ error: 'Error reading roadmaps' }, { status: 500 });
  }
}

// POST - Save a new roadmap
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    if (!data.id || !data.title) {
      return NextResponse.json(
        { error: 'Missing required fields: id and title' },
        { status: 400 }
      );
    }

    // Ensure directory exists
    await mkdir(ROADMAPS_DIR, { recursive: true });

    // Sanitize filename
    const sanitizedId = data.id.replace(/[^a-zA-Z0-9-_]/g, '-');
    const filePath = path.join(ROADMAPS_DIR, `${sanitizedId}.json`);

    // Add timestamps
    const roadmapData = {
      ...data,
      id: sanitizedId,
      updatedAt: new Date().toISOString(),
      createdAt: data.createdAt || new Date().toISOString(),
    };

    await writeFile(filePath, JSON.stringify(roadmapData, null, 2), 'utf-8');

    return NextResponse.json({
      success: true,
      id: sanitizedId,
      message: 'Roadmap saved successfully',
    });
  } catch (error) {
    console.error('Error saving roadmap:', error);
    return NextResponse.json({ error: 'Error saving roadmap' }, { status: 500 });
  }
}

// DELETE - Delete a roadmap
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Missing roadmap id' }, { status: 400 });
    }

    const { unlink } = await import('fs/promises');
    const filePath = path.join(ROADMAPS_DIR, `${id}.json`);
    await unlink(filePath);

    return NextResponse.json({ success: true, message: 'Roadmap deleted' });
  } catch (error) {
    console.error('Error deleting roadmap:', error);
    return NextResponse.json({ error: 'Error deleting roadmap' }, { status: 500 });
  }
}
