import { useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import Uploadpost from './uploadpost';
import styles from '@/styles/posts.module.css';

export default function Videopost() {
    const [title, setTitle] = useState('');
    const [animeTpye, setAnimeType] = useState('');
    const [description, setDescription] = useState('');
    const [video, setVideo] = useState(null);
    const [loading, setLoading] = useState(false); // State for loading status

    const handleVideoChange = (e) => {
        loadFile(e);
        setVideo(e.target.files[0]);
    };

    const uploadVideo = async () => {
        if (!video) return null;

        const formData = new FormData();
        formData.append('file', video);
        formData.append('upload_preset', 'animevidimage'); // Update with your Cloudinary video preset

        const res = await fetch('https://api.cloudinary.com/v1_1/dbpd5ykzl/video/upload', {
            method: 'POST',
            body: formData,
        });

        const data = await res.json();
        return data.secure_url;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');

        if (token) {
            const decoded = jwtDecode(token);
            const userId = decoded.sub || decoded.id || decoded.userId;

            setLoading(true); // Set loading to true when starting upload
            const videoUrl = await uploadVideo();
            setLoading(false); // Set loading to false after upload is complete

            if (!videoUrl) {
                alert('Video upload failed');
                return;
            }

            const postData = { title, video: videoUrl, userId: userId, anime_type: animeTpye, des: description };

            const res = await fetch('https://animeclipsbr.onrender.com/post/video', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(postData),
            });

            const data = await res.json(); // Await res.json to properly parse the response
            if (res.status === 201) { // Use res.status to check status
                alert('Post created successfully!');
                console.log(data.post);
                // Reset the form
                setTitle('');
                setVideo(null);
                setAnimeType('');
                setDescription('');
            } else {
                alert(`Error: ${data.error || "An unexpected error occurred"}`);
            }
        } else {
            console.log("Token is missing");
        }
    };

    const loadFile = (event) => {
        var output = document.getElementById('output');
        output.src = URL.createObjectURL(event.target.files[0]);
        output.onload = function () {
            URL.revokeObjectURL(output.src);
        };
    };

    return (
        <Uploadpost>
            <div>
                <h1>Video Post</h1>
                <div className={styles.main_div}>
                    <video id='output' className={styles.image} style={{ width: '500px' }} controls />
                </div>
                <form className={styles.form} onSubmit={handleSubmit}>
                    <input
                        className={styles.input}
                        type="file"
                        accept="video/*"
                        onChange={handleVideoChange}
                        required
                    />
                    <input
                        className={styles.input}
                        type="text"
                        placeholder="Title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                    <input
                        className={styles.input}
                        type="text"
                        placeholder="Anime Name"
                        value={animeTpye}
                        onChange={(e) => setAnimeType(e.target.value)}
                        required
                    />
                    <textarea
                        className={styles.input}
                        placeholder="Description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                    <button className={styles.button} type="submit" disabled={loading}>
                        {loading ? 'Creating Post...' : 'Create Post'}
                    </button>
                </form>
                {loading && <p>Uploading... Please wait.</p>} {/* Loading indicator */}
            </div>
        </Uploadpost>
    );
}
