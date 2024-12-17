import { db } from '../utils/firebase.js';
import { NextResponse } from 'next/server';
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';

/**
 * Handler to fetch the latest feed from Firestore.
 */
export async function GET(request) {
  try {
    console.log('Fetching latest feed from Firestore...');
    const feedsCol = collection(db, 'feeds');
    const q = query(feedsCol, orderBy('timestamp', 'desc'), limit(1));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return NextResponse.json({ message: 'No feed data available.' });
    }

    const latestFeed = querySnapshot.docs[0].data();

    return NextResponse.json({
      message: 'Feed retrieved successfully',
      data: latestFeed,
    });
  } catch (error) {
    console.error('Error fetching feed:', error.message);
    return NextResponse.json(
      { message: `Failed to fetch feed: ${error.message}` },
      { status: 500 }
    );
  }
}