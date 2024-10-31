import React from 'react';
import styles from '@/styles/screen.module.css'
import Image from 'next/image';

export default function Fullscreen({ post, toggleshow, downloadImage, isAuthenticated }) {
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
                    <Image src={post.image} alt={post.title} className={styles.responsive_image} />
                </div>
                <div className={styles.details}>
                    <h2>{post.title}</h2>
                    <p>{post.description || "No description available."}</p>
                    <button onClick={() => downloadImage(post.image, post.title)} className={styles.download_button}>
                        Download Image
                    </button>
                </div>
            </div>
        </div>
    );
}
