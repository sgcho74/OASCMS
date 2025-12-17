import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs/promises';

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const file = formData.get('file') as File | null;

        if (!file) {
            return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
        }

        const buffer = Buffer.from(await file.arrayBuffer());
        const filename = file.name.replace(/\s+/g, '_'); // Sanitize filename
        const uniqueName = `${Date.now()}_${filename}`;

        // Save to public/uploads
        // Note: In production Vercel, this won't persist. But for local/VPS it works.
        const uploadDir = path.join(process.cwd(), 'public', 'uploads');

        // Ensure directory exists
        try {
            await fs.access(uploadDir);
        } catch {
            await fs.mkdir(uploadDir, { recursive: true });
        }

        const filePath = path.join(uploadDir, uniqueName);
        await fs.writeFile(filePath, buffer);

        return NextResponse.json({
            success: true,
            url: `/uploads/${uniqueName}`
        });
    } catch (error) {
        console.error('Upload error:', error);
        return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
    }
}
