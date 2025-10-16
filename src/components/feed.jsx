import React, { useState, useEffect } from 'react';

function PublicFeedPage() {
  const [items, setItems] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const pageSize = 12;

  useEffect(() => {
    const fetchData = async () => {
      const url = `https://gaon.api.techind.co/api/social/publicFeed?pageNo=${currentPage}&pageSize=${pageSize}&slug=velapur-solapur-solapur-maharashtra`;

      setLoading(true);
      setError(null);

      try {
        const response = await fetch(url);

        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

        const data = await response.json();
        console.log('Full API response:', data);

        if (data.status === 1 && data.data?.feedDetails) {
          setItems(data.data.feedDetails);
          setTotalPages(Math.ceil(data.data.count / pageSize));
        } else {
          setItems([]);
          setError('API returned invalid data.');
        }
      } catch (err) {
        setItems([]);
        setError(err.message || 'Failed to fetch data.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentPage]);

  const handlePageChange = (page) => setCurrentPage(page);

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Public Feed for Velapur, Solapur, Maharashtra</h1>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {!loading && !error && (
        <>
          <ul style={{ listStyleType: 'none', padding: 0 }}>
            {items.length > 0 ? (
              items.map(({ title, description }, index) => (
                <li
                  key={index}
                  style={{
                    border: '1px solid #ddd',
                    padding: '10px',
                    margin: '5px 0',
                    backgroundColor: '#f9f9f9',
                    borderRadius: '5px',
                  }}
                >
                  <h3>{title || 'No title'}</h3>
                  <p>{description || 'No description'}</p>
                </li>
              ))
            ) : (
              <li>No items found.</li>
            )}
          </ul>

          <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'center', flexWrap: 'wrap' }}>
            {currentPage > 1 && (
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                style={{ margin: '0 5px', padding: '5px 10px', cursor: 'pointer' }}
              >
                Previous
              </button>
            )}

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                disabled={page === currentPage}
                style={{
                  margin: '0 5px',
                  padding: '5px 10px',
                  cursor: 'pointer',
                  backgroundColor: page === currentPage ? '#ccc' : '#fff',
                }}
              >
                {page}
              </button>
            ))}

            {currentPage < totalPages && (
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                style={{ margin: '0 5px', padding: '5px 10px', cursor: 'pointer' }}
              >
                Next
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default PublicFeedPage;

