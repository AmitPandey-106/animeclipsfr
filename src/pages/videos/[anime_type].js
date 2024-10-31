import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import styles from '@/styles/anime_type.module.css'

const AnimeVideos = () => {
    const router = useRouter();
    const { anime_type } = router.query; // Get anime_type from the route  
    const [videos, setVideos] = useState([]);  
    const [loading, setLoading] = useState(true);  
    const [downloading, setDownloading] = useState(false); // State for download status

    // Function to handle video download
    const downloadVideo = async (videoUrl, title) => {
        setDownloading(true); // Set downloading to true when starting download
        try {
            const response = await fetch(videoUrl);
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
            console.error('Error downloading the video:', error);
        } finally {
            setDownloading(false); // Reset downloading to false after download is complete
        }
    };

    useEffect(() => {
        if (anime_type) {
            const fetchVideos = async () => {
                try {
                    // Include the anime_type in the fetch request
                    const response = await fetch(`https://animeclipsbr.onrender.com/all-posts/videos?anime_type=${anime_type}`);
                    const data = await response.json();

                    // Check the structure of the returned data
                    if (data.success) {
                        // Set videos directly as they are already filtered by the backend
                        setVideos(data.video_data); // Assuming video_data contains the array of videos
                    } else {
                        console.error('Failed to fetch videos:', data.message);
                    }
                } catch (error) {
                    console.error('Error fetching videos:', error);
                } finally {
                    setLoading(false);
                }
            };
            fetchVideos();
        }
    }, [anime_type]);

    console.log(videos, "videos");

    if (loading) return <div>Loading...</div>;

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Videos for {anime_type}</h1>
            <div className={styles.videoContainer}>
                {videos.length > 0 ? (
                    videos
                        .filter(video => video.anime_type === anime_type) // Filter based on anime_type
                        .map(video => (
                            <div key={video._id} className={styles.videoItem}>
                                <h2>{video.title}</h2>
                                <video controls className={styles.videoPlayer} src={video.video}></video>
                                {downloading && <p>Downloading... Please wait.</p>} {/* Downloading indicator */}
                                <button
                                    onClick={() => downloadVideo(video.video, video.title)}
                                    className={styles.download_button}
                                >
                                    Download Video
                                </button>
                            </div>
                        ))
                ) : (
                    <p>No videos available for this anime type.</p>
                )}
            </div>
        </div>
    ); 
}; 
 
export default AnimeVideos; 
