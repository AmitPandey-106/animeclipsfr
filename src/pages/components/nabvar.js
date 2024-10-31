import Link from 'next/link';
import { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { AuthContext } from '../../context/authcontext';

export default function Navbar() {
  const { isAuthenticated, signOut, authuser, isAuthAdmin } = useContext(AuthContext);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState({ videos: [], images: [] });
  const router = useRouter();

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  // New function to handle sign out and refresh the page
  const handleSignOut = () => {
    signOut(); // Call the original signOut function
    router.reload(); // Refresh the page after logging out
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchTerm) {
      console.log('Anime type is required for search.');
      return;
    }

    try {
      const [resVideo, resImage] = await Promise.all([
        fetch(`https://animeclipsbr.onrender.com/api/searchmedia?anime_type=${searchTerm}&type=video`),
        fetch(`https://animeclipsbr.onrender.com/api/searchmedia?anime_type=${searchTerm}&type=image`)
      ]);

      if (!resVideo.ok) {
        const errorText = await resVideo.text();
        console.error('Video search error:', errorText);
      }

      if (!resImage.ok) {
        const errorText = await resImage.text();
        console.error('Image search error:', errorText);
      }

      const videos = resVideo.ok ? await resVideo.json() : [];
      const images = resImage.ok ? await resImage.json() : [];

      setSearchResults({ videos, images });

      router.push({
        pathname: '/components/searchvideo',
        query: { anime_type: searchTerm },
      });
    } catch (error) {
      console.error('Search error:', error);
    }
  };

  useEffect(() => {
    if (authuser) {
      // console.log(authuser.name)
    }
  }, [authuser]);

  return (
    <>
      {/* Desktop Navbar */}
      <nav className="desktop-navbar">
        <div className="logo">
          <Link href="/">AnimeClip</Link>
        </div>
        <div className="search-container">
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button onClick={handleSearch}>Search</button>
        </div>
        <ul className="nav-links">
          {isAuthAdmin ? (
            <>
              <li><Link href="/">Home</Link></li>
              <li><Link href="/components/images">Images</Link></li>
              <li><Link href="/components/videos">Videos</Link></li>
              <li><Link href="/components/posts">Posts</Link></li>
              <li><Link href="/components/about">About</Link></li>
              <li><Link href="/components/profilepost">Profile</Link></li>
              <button onClick={handleSignOut}>Logout</button>
            </>
          ) : isAuthenticated ? (
            <>
              <li><Link href="/">Home</Link></li>
              <li><Link href="/components/images">Images</Link></li>
              <li><Link href="/components/videos">Videos</Link></li>
              <li><Link href="/components/about">About</Link></li>
              <li><Link href="/components/profilepost">Profile</Link></li>
              <button onClick={handleSignOut}>Logout</button>
            </>
          ) : (
            <>
              <li><Link href="/">Home</Link></li>
              <li><Link href="/components/images">Images</Link></li>
              <li><Link href="/components/videos">Videos</Link></li>
              <li><Link href="/components/about">About</Link></li>
              <li><Link href="/auth/signup">Signup</Link></li>
              <li><Link href="/auth/signin">Signin</Link></li>
            </>
          )}
        </ul>
      </nav>

      {/* Mobile Navbar */}
      <nav className="mobile-navbar">
        <div className="logo">
          <Link href="/">AnimeClip</Link>
        </div>
        <div className="search-container">
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button onClick={handleSearch}>Search</button>
        </div>
        <div className="hamburger" onClick={toggleMenu}>
          &#9776; {/* Hamburger icon */}
        </div>

        {/* Sidebar Menu for mobile */}
        <div className={`sidebar ${menuOpen ? 'open' : ''}`}>
          <button className="close-btn" onClick={closeMenu}>×</button>
          <ul className="nav-links">
            {isAuthAdmin ? (
              <>
                <li onClick={closeMenu}><Link href="/">Home</Link></li>
                <li onClick={closeMenu}><Link href="/components/images">Images</Link></li>
                <li onClick={closeMenu}><Link href="/components/videos">Videos</Link></li>
                <li onClick={closeMenu}><Link href="/components/posts">Posts</Link></li>
                <li onClick={closeMenu}><Link href="/components/about">About</Link></li>
                <li onClick={closeMenu}><Link href="/components/profilepost">Profile</Link></li>
                <button onClick={handleSignOut}>Logout</button>
              </>
            ) : isAuthenticated ? (
              <>
                <li onClick={closeMenu}><Link href="/">Home</Link></li>
                <li onClick={closeMenu}><Link href="/components/images">Images</Link></li>
                <li onClick={closeMenu}><Link href="/components/videos">Videos</Link></li>
                <li onClick={closeMenu}><Link href="/components/about">About</Link></li>
                <li onClick={closeMenu}><Link href="/components/profilepost">Profile</Link></li>
                <button onClick={handleSignOut}>Logout</button>
              </>
            ) : (
              <>
                <li onClick={closeMenu}><Link href="/">Home</Link></li>
                <li onClick={closeMenu}><Link href="/components/images">Images</Link></li>
                <li onClick={closeMenu}><Link href="/components/videos">Videos</Link></li>
                <li onClick={closeMenu}><Link href="/components/about">About</Link></li>
                <li onClick={closeMenu}><Link href="/auth/signup">Signup</Link></li>
                <li onClick={closeMenu}><Link href="/auth/signin">Signin</Link></li>
              </>
            )}
          </ul>
        </div>
      </nav>
    </>
  );
}
