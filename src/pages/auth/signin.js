// pages/signin.js
import { useContext, useState } from 'react';
import { useRouter } from 'next/router';
import styles from '@/styles/auth.module.css';
import { AuthContext } from '../context/authcontext';
import { jwtDecode } from 'jwt-decode';
import Link from 'next/link';

export default function SignIn({ initialError }) { // initialError is passed as a prop here
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState(initialError || ''); // set initial error from server-side or empty string
  const [success, setSuccess] = useState('');
  const router = useRouter();
  const {setIsAuthenticated} = useContext(AuthContext)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      const res = await fetch('http://localhost:8000/auth/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.status === 200) {
        setSuccess(data.msg);
        setForm({ email: '', password: '' });
        localStorage.setItem('token', data.token);
        setIsAuthenticated(true)
        router.push('/');
      } else {
        setError(data.err);
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.h1}>Sign In</h1>
      <form className={styles.form} onSubmit={handleSubmit}>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {success && <p style={{ color: 'green' }}>{success}</p>}
        <div className={styles.element}>
          <label className={styles.title}>Email</label>
          <input
            className={styles.input}
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className={styles.element}>
          <label className={styles.title}>Password</label>
          <input
            className={styles.input}
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            required
          />
        </div>
        <button className={styles.button} type="submit">Sign In</button>
        <Link href={"/auth/adminsignin"}>Admin Signin</Link>
      </form>
    </div>
  );
}

// This function is executed on the server before rendering the page
export async function getServerSideProps(context) {
  // Here you can perform server-side logic, like checking for errors or fetching initial data
  return {
    props: {
      initialError: '', // Pass any initial error messages or other data as props
    },
  };
}
