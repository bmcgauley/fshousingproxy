import fetch from 'node-fetch';
import { db } from '../utils/firebaseAdmin.js';
import { NextResponse } from 'next/server';
import { convertXmlToJson } from '../utils/xmlConverter.js';

/**
 * Handler to upload the latest feed to Firestore.
 */
export async function POST(request) {
  try {
    console.log('Fetching feed from https://fscollegian.com/feed/...');

    const response = await fetch('https://fscollegian.com/feed/');

    if (!response.ok) {
      throw new Error(`Failed to fetch feed: ${response.statusText}`);
    }

    const feedData = await response.text();
    const feedJson = await convertXmlToJson(feedData);
    const FEEDS_COLLECTION = 'feeds';

    console.log(`Storing feed in Firestore...`);
    const docRef = await db.collection(FEEDS_COLLECTION).add({
      content: feedJson,
      timestamp: new Date()
    });

    console.log('Feed stored successfully in Firestore:', docRef.id);

    return NextResponse.json({
      message: 'Feed updated successfully',
      docId: docRef.id,
    });
  } catch (error) {
    console.error('Error updating feed:', error.message);
    return NextResponse.json(
      { message: `Failed to update feed: ${error.message}` },
      { status: 500 }
    );
  }
}