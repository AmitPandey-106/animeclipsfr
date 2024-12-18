import React from 'react';
import styles from '@/styles/screen.module.css';
import Image from 'next/image';

export default function Fullscreen({ post, toggleshow, downloadImage, isAuthenticated }) {
    // Check if post is defined and has the required properties
    if (!post || !post.image) {
        return (
            <div className={styles.post_overlay}>
                <button className={styles.close_btn} onClick={toggleshow} aria-label="Close">
                    ×
                </button>
                <div className={styles.image_detail}>
                    <p>No post data available.</p> {/* Fallback if post is not available */}
                </div>
            </div>
        );
    }

    return (
        <div className={styles.post_overlay}>
            <button className={styles.close_btn} onClick={toggleshow} aria-label="Close">
                ×
            </button>
            <div className={styles.image_detail}>
                {isAuthenticated && (
                    <span className={styles.delete_icon} aria-label="Delete post">
                        delete
                    </span>
                )}
                <div className={styles.image_div}>
                    <Image src={post.image} alt={post.title || "Image"} className={styles.responsive_image} />
                </div>
                <div className={styles.details}>
                    <h2>{post.title || "Untitled"}</h2>
                    <p>{post.description || "No description available."}</p>
                    <button onClick={() => downloadImage(post.image, post.title)} className={styles.download_button}>
                        Download Image
                    </button>
                </div>
            </div>
        </div>
    );
}
