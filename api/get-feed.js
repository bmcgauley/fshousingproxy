import { db } from '../utils/firebase';
import { NextResponse } from 'next/server';
import { collection, getDocs } from "firebase/firestore";

/**
 * Handler to retrieve and serve the latest feed.xml from Vercel Blob.
 */
export async function GET(request) {
  try {
    const feedCollection = collection(db, 'feeds');
    const feedSnapshot = await getDocs(feedCollection);
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