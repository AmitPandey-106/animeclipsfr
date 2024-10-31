import { useEffect, useState } from 'react';
import Fullscreen from './fullscreen';
import { useContext } from 'react';
import { AuthContext } from '../context/authcontext';
import styles from '@/styles/images.module.css'
import Image from 'next/image';

export default function Images() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activePostId, setActivePostId] = useState(null);
    const {isAuthenticated} = useContext(AuthContext)

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const res = await fetch('http://localhost:8000/all-post/image', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                const data = await res.json();
                if (res.status === 200 && data.success) {
                    // Reverse order so the latest images appear first
                    setPosts(data.post_data.reverse());
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

    const addNewPost = (newPost) => {
        // Add new post to the beginning of the array to make it appear first
        setPosts((prevPosts) => [newPost, ...prevPosts]);
    };

    const downloadImage = async (imageUrl, title) => {
        try {
            const response = await fetch(imageUrl);
            if (!response.ok) throw new Error('Network response was not ok');

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = title || 'download';
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Error downloading the image:', error);
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    const toggleshow = (postId) => {
        setActivePostId((prevId) => (prevId === postId ? null : postId));
    };

    return (
        <div className={styles.all_images_container}>
            <h1 className={styles.title}>All Images</h1>
            <hr className={styles.divider} />
            <div className={styles.image_grid}>
                {posts.length > 0 ? (
                    posts.map((post) => (
                        <div key={post._id} className={styles.image_wrapper}>
                            {post.image && (
                                <Image
                                    src={post.image}
                                    onClick={() => toggleshow(post._id)}
                                    alt={post.title}
                                    className={styles.image}
                                />
                            )}
                            {activePostId === post._id && (
                                <Fullscreen
                                    post={post}
                                    image={post.image}
                                    toggleshow={toggleshow}
                                    downloadImage={downloadImage}
                                    isAuthenticated= {isAuthenticated}
                                />
                            )}
                            <button
                                onClick={() => downloadImage(post.image, post.title)}
                                className={styles.download_button}
                            >
                                Download Image
                            </button>
                        </div>
                    ))
                ) : (
                    <p className={styles.no_posts}>No posts available.</p>
                )}
            </div>
        </div>
    )
}
