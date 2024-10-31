import { useState } from 'react';
import styles from '@/styles/auth.module.css';
import { useRouter } from 'next/router';

export default function Signup() {
  const [form, setForm] = useState({ Full_name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter()

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handlesubmit= async(e)=>{
    e.preventDefault();

    // Clear previous errors
    setError('');
    setSuccess('');
    try{
      const res = await fetch('https://animeclipsbr.onrender.com/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if(res.status == 201){
        console.log(data.message)
        setSuccess(data.message);
        setForm({ Full_name:'', email: '', password: '' });
        router.push('/auth/signin')
      }else{
        setError(data.error);
      }
    }catch(error){
      setError('An error occurred. Please try again.');
    }
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.h1}>Sign Up</h1>
      <form className={styles.form} onSubmit={handlesubmit}>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}
      <div className={styles.element}>
          <label className={styles.title}>Name </label>
          <input
            className={styles.input}
            type="text"
            name="Full_name"
            value={form.Full_name}
            onChange={handleChange}
            required
          />
        </div>

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

        <button className={styles.button} type="submit">Sign Up</button>
      </form>
    </div>
  )
}
