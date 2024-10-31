import { useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import Uploadpost from './uploadpost';
import styles from '@/styles/posts.module.css';
import Image from 'next/image';

export default function Posts() {
  const [title, setTitle] = useState('');
  const [animeType, setAnimeType] = useState('');
  const [description, setDescription] = useState('');
  const [photo, setPhoto] = useState(null);
  const [loading, setLoading] = useState(false); // State for loading
  const [progress, setProgress] = useState(0); // State for progress

  const handlePhotoChange = (e) => {
    loadFile(e);
    setPhoto(e.target.files[0]); // Store the file locally
  };

  const uploadImage = async () => {
    if (!photo) return null;

    const formData = new FormData();
    formData.append('file', photo);
    formData.append('upload_preset', 'animeimgvideo'); // Replace with your Cloudinary preset

    const res = await fetch('https://api.cloudinary.com/v1_1/dbpd5ykzl/image/upload', {
      method: 'POST',
      body: formData,
    });

    const data = await res.json();
    return data.secure_url; // Return the Cloudinary URL
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    if (token) {
      const decoded = jwtDecode(token);
      const userId = decoded.sub || decoded.id || decoded.userId;

      setLoading(true); // Set loading to true
      setProgress(0); // Reset progress

      // First, upload the image and get the URL
      const photoUrl = await uploadImage();
      console.log(photoUrl);
      const postData = {
        title,
        image: photoUrl,
        userId: userId,
        anime_type: animeType,
        des: description,
      };

      const res = await fetch('https://animeclipsbr.onrender.com/post/image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(postData),
      });

      const data = await res.json(); // Await res.json to properly parse the response
      setLoading(false); // Set loading to false after upload

      if (res.status === 200) { // Use res.status to check status
        alert('Post created successfully!');
        console.log(data.post);
        // Reset the form
        setTitle('');
        setPhoto(null);
        setAnimeType('');
        setDescription('');
      } else {
        alert(`Error: ${data.error || 'An unexpected error occurred'}`);
      }
    } else {
      alert('You are not an authorized user! Please log in first.');
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
        <h1 className='heading'>Image Post</h1>
        <div className={styles.main_div}>
          <Image id='output' src='/defaultimg.jpg' alt='oops' className={styles.image} />
        </div>
        <form className={styles.form} onSubmit={handleSubmit}>
          <input
            className={styles.input}
            type="file"
            accept="image/*"
            onChange={handlePhotoChange}
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
            placeholder="AnimeType"
            value={animeType}
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

        {loading && (
          <div className={styles.progressContainer}>
            <div className={styles.progressBar} style={{ width: `${progress}%` }} />
          </div>
        )}
      </div>
    </Uploadpost>
  );
}
