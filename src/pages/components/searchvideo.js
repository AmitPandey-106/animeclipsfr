import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Image from 'next/image';

export default function SearchResults() {
  const router = useRouter();
  const { anime_type } = router.query; // Get anime type from query parameters
  const [searchResults, setSearchResults] = useState([]); // State to hold search results
  const [mediaType, setMediaType] = useState(''); // State to hold media type (image or video)

  useEffect(() => {
    if (anime_type && mediaType) { // Ensure both anime_type and mediaType are defined
      fetch(`http://localhost:8000/api/searchmedia?anime_type=${anime_type}&type=${mediaType}`)
        .then((res) => {
          if (!res.ok) {
            throw new Error('Network response was not ok');
          }
          return res.json();
        })
        .then((data) => {
          // Set the search results from the fetched data
          setSearchResults(data);
        })
        .catch((error) => console.error('Error fetching search results:', error));
    }
  }, [anime_type, mediaType]); // Trigger fetch when either anime_type or mediaType changes

  const downloadMedia = async (mediaUrl, title) => {
    try {
      const response = await fetch(mediaUrl);
      if (!response.ok) throw new Error('Network response was not ok');

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = title || 'download'; // Set a default name for the download
      document.body.appendChild(a);
      a.click(); // Trigger the download
      a.remove(); // Clean up the DOM
      window.URL.revokeObjectURL(url); // Free up memory
    } catch (error) {
      console.error('Error downloading the media:', error);
    }
  };

  return (
    <div className="container">
      <h1>Search Results for {anime_type}</h1>
      <div className="media-type-selector">
        <button onClick={() => setMediaType('video')}>Videos</button>
        <button onClick={() => setMediaType('image')}>Images</button>
      </div>
      {searchResults.length > 0 ? ( // Check if there are search results
        <div className="grid">
          {searchResults.map((result) => (
            <div key={result._id} className="media-card">
              {mediaType === 'video' ? ( // If media type is 'video'
                <>
                  <a href={result.video} target="_blank" rel="noopener noreferrer">
                    <video
                      src={result.video}
                      alt={result.title}
                      controls
                      className="media-player"
                    />
                  </a>
                  <h2>{result.title}</h2>
                  <p>{result.description}</p>
                  <p>{result.anime_type}</p>
                  <button
                    onClick={() => downloadMedia(result.video, result.title)} // Download video
                    className="download_button"
                  >
                    Download Video
                  </button>
                </>
              ) : mediaType === 'image' ? ( // If media type is 'image'
                <>
                  <Image
                    src={result.image} // Assuming the image URL is stored in 'image'
                    alt={result.title}
                    className="media-image"
                  />
                  <h2>{result.title}</h2>
                  <p>{result.description}</p>
                  <p>{result.anime_type}</p>
                  <button
                    onClick={() => downloadMedia(result.image, result.title)} // Download image
                    className="download_button"
                  >
                    Download Image
                  </button>
                </>
              ) : null}
            </div>
          ))}
        </div>
      ) : (
        <p>No results found.</p> // Display message if no results
      )}
      <style jsx>{`
        .container {
          padding: 1rem;
        }
        h1 {
          text-align: center;
          margin-bottom: 1rem;
        }
        .media-type-selector {
          display: flex;
          justify-content: center;
          margin-bottom: 1rem;
        }
        .media-type-selector button {
          margin: 0 10px;
          padding: 10px 20px;
          cursor: pointer;
          border: 1px solid #ddd;
          border-radius: 5px;
          background-color: Red;
          transition: background-color 0.3s;
        }
        .media-type-selector button:hover {
          background-color: #e0e0e0;
        }
        .grid {
          display: grid;
          gap: 1.5rem;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        }
        .media-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 1rem;
          border: 1px solid #ddd;
          border-radius: 8px;
          box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
        }
        .media-player, .media-image {
          width: 100%;
          max-width: 100%;
          height: auto;
          border-radius: 8px;
        }
        h2 {
          font-size: 1.25rem;
          margin: 0.5rem 0;
        }
        p {
          color: #666;
        }
        @media (min-width: 768px) {
          .grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }
        @media (min-width: 1024px) {
          .grid {
            grid-template-columns: repeat(4, 1fr);
          }
        }
        @media (min-width: 1280px) {
          .grid {
            grid-template-columns: repeat(5, 1fr);
          }
        }
      `}</style>
    </div>
  );
}
