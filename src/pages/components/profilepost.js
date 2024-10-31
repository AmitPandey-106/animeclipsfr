import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/authcontext';
import Fullscreen from './fullscreen';
import styles from '@/styles/profile.module.css'
import Image from 'next/image';

export default function ProfilePost() {
    const [posts, setPosts] = useState([]);
    const [postvideo, setPostVideo] = useState([]);
    const [loading, setLoading] = useState(true);
    const { authuser, authadmin } = useContext(AuthContext); // Fetches the logged-in user data
    const [activePostId, setActivePostId] = useState(null);

    useEffect(() => {
        // Check if authuser exists and has an id
        if (!authuser || !authuser.id) return;
    
        const fetchPost = async () => {
            const token = localStorage.getItem('token');
    
            if (token) {
                try {
                    const res = await fetch(`http://localhost:8000/api/user-post/${authadmin.id}`, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${token}`,
                        }
                    });
    
                    const data = await res.json();
                    if (res.status === 200) {
                        console.log(data);
                        setPosts(data.images || []);
                        setPostVideo(data.videos || []);
                        console.log(data.videos);
                    } else {
                        console.error('Error fetching posts:', data.error);
                    }
                } catch (error) {
                    console.error('Error:', error);
                } finally {
                    setLoading(false);
                }
            }
        };
    
        fetchPost();
    }, [authuser, authadmin.id]); // Added dependencies here
     // Add authuser to the dependency array

    if (loading) {
        return <div>Loading...</div>;
    }
    const toggleshow = (postId) => {
        setActivePostId((prevId) => (prevId === postId ? null : postId)); // Close if already open
    };

    // Function to delete an image post
    const deleteImage = async (imageId) => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const res = await fetch(`http://localhost:8000/post-image/delete/${imageId}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                });

                const data = await res.json();
                if (res.status === 200 && data.success) {
                    console.log('Image deleted successfully');
                    // Optionally, refresh the list of posts
                    setPosts((prevPosts) => prevPosts.filter((post) => post._id !== imageId));
                } else {
                    console.error('Error deleting image:', data.message);
                }
            } catch (error) {
                console.error('Error:', error);
            }
        } else {
            console.log("token is missing")
        }
    };

    // Function to delete a video post
    const deleteVideo = async (videoId) => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const res = await fetch(`http://localhost:8000/post-video/delete/${videoId}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                });

                const data = await res.json();
                if (res.status === 200 && data.success) {
                    console.log('Video deleted successfully');
                    // Optionally, refresh the list of posts
                    setPostVideo((prevVideos) => prevVideos.filter((video) => video._id !== videoId));
                } else {
                    console.error('Error deleting video:', data.message);
                }
            } catch (error) {
                console.error('Error:', error);
            }
        } else {
            console.log("token is missing")
        }
    };

    return (
        <div className={styles.profile_container}>
            <h1>Profile</h1>
            <hr></hr>
            <h1>UserName : {authadmin?.Full_name}</h1>
            {/* <h1>UserName : {authadmin.id}</h1> */}
            <>
                <h2 style={{}}>Images</h2>
                <hr style={{ marginBottom: '10px' }}></hr>
                <div className={styles.image_grid}>

                    {posts.length > 0 ? (
                        posts.map((post) => (
                            <div key={post._id} className={styles.image_wrapper}>
                                <div className={styles}>
                                    <span
                                        className={styles}
                                        onClick={() => deleteImage(post._id)}
                                    >
                                        X
                                    </span>
                                </div>

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
                                    />
                                )}
                            </div>
                        ))
                    ) : (
                        <p className={styles.no_posts}>No posts available.</p>
                    )}
                </div>
            </>
            <h1>Videos</h1>
            <hr></hr>
            <div className={styles.videos_container}>
                {postvideo.length > 0 ? (
                    postvideo.map((post) => (
                        <div key={post._id} className={styles.video_item}>
                            <div className={styles.delete_div}>
                                <span
                                    className={styles.delete}
                                    onClick={() => deleteVideo(post._id)}
                                >
                                    X
                                </span>
                            </div>

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
