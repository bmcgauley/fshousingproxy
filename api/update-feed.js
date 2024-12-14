import fetch from 'node-fetch';
import { NextResponse } from 'next/server';
import { db } from '../utils/firebase';
import { collection, addDoc, Timestamp } from "firebase/firestore";

/**
 * Handler to upload the latest feed.xml to Firestore.
 * Generates a unique URL with a hash suffix.
 */
export async function POST(request) {
  try {
    console.log('Fetching feed from https://fscollegian.com/feed/...');

    const response = await fetch('https://fscollegian.com/feed/');

    if (!response.ok) {
      throw new Error(`Failed to fetch feed: ${response.statusText}`);
    }

    const feedData = await response.text();
    const feedJson = convertXmlToJson(feedData); // Implement this function if needed
    const FEEDS_COLLECTION = 'feeds';

    console.log(`Storing feed in Firestore...`);
    const blob = await addDoc(collection(db, FEEDS_COLLECTION), {
      content: feedJson,
      timestamp: Timestamp.fromDate(new Date())
    });

    console.log('Feed stored successfully in Firestore:', blob.id);

    return NextResponse.json({
      message: 'Feed updated successfully',
      blobId: blob.id,
    });
  } catch (error) {
    console.error('Error updating feed:', error.message);
    return NextResponse.json(
      { message: `Failed to update feed: ${error.message}` },
      { status: 500 }
    );
  }
}

export const blobID = blob.id;

// Optionally, implement XML to JSON conversion
function convertXmlToJson(xml) {
  // Implement XML parsing logic or use a library like xml2js
  return xml; // Placeholder: store XML as string if preferred
}