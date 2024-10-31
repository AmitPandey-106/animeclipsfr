import { useEffect, useState } from 'react';
import styles from '@/styles/images.module.css'

export default function Videos() {
    const [postvideo, setPostVideo] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const res = await fetch('http://localhost:8000/all-posts/videos', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                const data = await res.json();
                if (res.status === 200 && data.success) {
                    console.log(data.video_data);
                    setPostVideo(data.video_data);
                } else {
                    console.error('Error fetching posts:', data.message);
                }
            } catch (error) {
                console.error('Error:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchPost();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    // Function to handle video download
    const downloadVideo = async (videoUrl, title) => {
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
            console.error('Error downloading the image:', error);
        }
    };

    return (
        <div className={styles.videos_container}>
            <h1>All Videos</h1>
            <hr></hr>
            <div className={styles.container}>
                {postvideo.length > 0 ? (
                    postvideo.map((post) => (
                        <div key={post._id} className={styles.video_item}>
                            {post.video && (
                                <div className={styles.video_wrapper}>
                                    <a href={post.video} target="_blank" rel="noopener noreferrer">
                                        <video
                                            src={post.video}
                                            alt={post.title}
                                            className={styles.post_video}
                                            controls
                                        />
                                    </a>

                                    <button
                                        onClick={() => downloadVideo(post.video, post.title)}
                                        className={styles.download_button}
                                    >
                                        Download Video
                                    </button>
                                </div>
                            )}
                        </div>
                    ))
                ) : (
                    <p className={styles.no_posts}>No posts available.</p>
                )}
            </div>
        </div>
    );
}
