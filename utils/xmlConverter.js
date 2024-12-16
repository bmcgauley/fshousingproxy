import { parseStringPromise } from 'xml2js';

/**
 * Converts XML string to JSON object.
 * @param {string} xml - The XML string to convert.
 * @returns {Object} - The resulting JSON object.
 */
export async function convertXmlToJson(xml) {
  try {
    const result = await parseStringPromise(xml);
    return result;
  } catch (error) {
    console.error('Error converting XML to JSON:', error.message);
    return null;
  }
} 