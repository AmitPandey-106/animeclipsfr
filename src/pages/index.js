import Head from "next/head";
import Image from "next/image";
import styles from "@/styles/Home.module.css";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function Home() {
    const [posts, setPosts] = useState([]);
    const [allanime, setAllAnime] = useState([]);
    const [postvideo, setPostVideo] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchallanime = async () => {
            try {
                const res = await fetch('https://animeclipsbr.onrender.com/all-post/image', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                const data = await res.json();
                if (res.status === 200 && data.success) {
                    // console.log(data.post_data);
                    setAllAnime(data.post_data)
                } else {
                    console.error('Error fetching posts:', data.message);
                }
            } catch (error) {
                console.error('Error:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchallanime();
    }, []);
    useEffect(() => {
        const fetchPost = async () => {
            try {
                const res = await fetch('https://animeclipsbr.onrender.com/all-post/image', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                const data = await res.json();
                if (res.status === 200 && data.success) {
                    // console.log(data.post_data);
                    setPosts(data.post_data.reverse())
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

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const res = await fetch('https://animeclipsbr.onrender.com/all-posts/videos', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                const data = await res.json();
                if (res.status === 200 && data.success) {
                    // console.log(data.video_data);
                    setPostVideo(data.video_data.reverse());
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
            a.download = title || 'download'; // Set a default name for the download
            document.body.appendChild(a);
            a.click(); // Trigger the download
            a.remove(); // Clean up the DOM
            window.URL.revokeObjectURL(url); // Free up memory
        } catch (error) {
            console.error('Error downloading the image:', error);
        }
    };
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

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <>
            <div className={styles.container}>
                <div className={styles.image_div}>
                    <h1 className={styles.h1}>
                            Anime <span className={styles.click_here}>-- click Anime</span>
                    </h1>
                    <hr className={styles.hr} />
                    <div className={styles.image_container}>
                        {allanime.length > 0 ? (
                            allanime.slice(0, 8).map((post) => (
                                <Link
                                    key={post._id}
                                    href={`/videos/${post.anime_type}`} // Dynamic link based on anime_type
                                    passHref
                                >
                                    <div className={styles.image_item}>
                                        {post.image && (
                                            <div className={styles.image_wrapper}>
                                                <Image
                                                    src={post.image}
                                                    alt={post.title}
                                                    className={styles.post_image}
                                                />
                                                <div className={styles.anime_type}>{post.anime_type}</div>
                                            </div>
                                        )}
                                    </div>
                                </Link>
                            ))
                        ) : (
                            <p>No posts available.</p>
                        )}
                    </div>
                </div>
                <div className={styles.image_div}>
                    <h1 className={styles.h1}>
                        <Link href={`/components/images`}>
                            Popular Images <span className={styles.click_here}>-- click here</span>
                        </Link>
                    </h1>
                    <hr className={styles.hr} />
                    <div className={styles.image_container}>
                        {posts.length > 0 ? (
                            posts.slice(0, 8).map((post) => (
                                <div key={post._id} className={styles.image_item}>
                                    {post.image && (
                                        <div className={styles.image_wrapper}>
                                            <span
                                                className="material-symbols-outlined download-icon" style={{ position: 'absolute', right: '0', top: '0', cursor: 'pointer' }}
                                                onClick={() => downloadImage(post.image, post.title)}
                                            >
                                                download
                                            </span>
                                            <Image
                                                src={post.image}
                                                alt={post.title}
                                                className={styles.post_image}
                                            />
                                        </div>
                                    )}
                                </div>
                            ))
                        ) : (
                            <p>No posts available.</p>
                        )}
                    </div>
                </div>

                <div className={styles.video_div}>
                    <h1 className={styles.h1}>
                        <Link href={`/components/videos`}>
                            Popular Anime Videos <span className={styles.click_here}>-- click here</span>
                        </Link>
                    </h1>
                    <hr className={styles.hr} />
                    <div className={styles.video_container}>
                        {postvideo.length > 0 ? (
                            postvideo.slice(0, 10).map((post) => (
                                <div key={post._id} className={styles.video_item}>
                                    <span
                                        className="material-symbols-outlined download-icon" style={{ position: 'absolute', right: '0', top: '0', cursor: 'pointer' }}
                                        onClick={() => downloadVideo(post.video, post.title)}
                                    >
                                        download
                                    </span>
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
                            <p>No posts available.</p>
                        )}
                    </div>
                </div>
            </div>

            <footer className={styles.footer}>
                <div className={styles.container}>
                    <p className={styles.copyright}>© 2024 Infinity.technology. All rights reserved.</p>
                </div>
            </footer>
        </>
    );
}
