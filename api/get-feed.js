import { db } from '../utils/firebaseAdmin.js';
import { NextResponse } from 'next/server';

/**
 * Handler to retrieve and serve the latest feed from Firestore.
 */
export async function GET(request) {
  try {
    const feedSnapshot = await db.collection('feeds').get();
    const feedContent = feedSnapshot.docs.map(doc => doc.data());

    if (!feedContent.length) {
      throw new Error('Failed to retrieve feed content.');
    }

    return new NextResponse(JSON.stringify(feedContent), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error retrieving feed:', error.message);
    return NextResponse.json(
      { message: `Failed to retrieve feed: ${error.message}` },
      { status: 500 }
    );
  }
}