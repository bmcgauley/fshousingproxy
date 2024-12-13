import { useState } from 'react';

export default function FeedManager() {
  const [updateStatus, setUpdateStatus] = useState('');
  const [feedContent, setFeedContent] = useState('');
  const [error, setError] = useState('');

  /**
   * Handles the feed update process by calling the update-feed API.
   */
  const updateFeed = async () => {
    setUpdateStatus('Updating feed...');
    setError('');
    try {
      const response = await fetch('/api/update-feed', {
        method: 'POST',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Unknown error');
      }

      const data = await response.json();
      setUpdateStatus(`Feed updated successfully: ${data.blobUrl}`);
    } catch (err) {
      console.error('Error updating feed:', err);
      setError(`Update failed: ${err.message}`);
      setUpdateStatus('');
    }
  };

  /**
   * Handles fetching the latest feed by calling the get-feed API.
   */
  const fetchFeed = async () => {
    setFeedContent('');
    setError('');
    try {
      const response = await fetch('/api/get-feed', {
        method: 'GET',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Unknown error');
      }

      const data = await response.text();
      setFeedContent(data);
    } catch (err) {
      console.error('Error fetching feed:', err);
      setError(`Fetch failed: ${err.message}`);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Feed Manager</h2>
      <button onClick={updateFeed} style={{ marginRight: '10px' }}>
        Update Feed
      </button>
      <button onClick={fetchFeed}>Fetch Latest Feed</button>

      {updateStatus && <p>{updateStatus}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {feedContent && (
        <div style={{ marginTop: '20px' }}>
          <h3>Latest Feed Content:</h3>
          <pre
            style={{
              background: '#f4f4f4',
              padding: '10px',
              borderRadius: '5px',
              maxHeight: '400px',
              overflowY: 'scroll',
            }}
          >
            {feedContent}
          </pre>
        </div>
      )}
    </div>
  );
}
