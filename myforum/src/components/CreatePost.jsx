import { useState } from 'react';
import { supabase } from '../supabaseClient';

const CreatePost = () => {
  const [title, setTitle] = useState('');
  const [context, setContext] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  const createPost = async (e) => {
    e.preventDefault(); // Prevent form submission reload

    // Validation: Ensure title is not empty
    if (!title.trim()) {
      alert('Title cannot be empty!');
      return;
    }

    const { error } = await supabase.from('posts').insert([{ title, context, image_url: imageUrl }]);
    if (error) {
      console.error(error);
      alert('Failed to create the post. Please try again.');
    } else {
      alert('Post created successfully!');
      // Clear form after successful submission
      setTitle('');
      setContext('');
      setImageUrl('');
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Create a New Post</h2>
      <form style={styles.form} onSubmit={createPost}>
        <input
          style={styles.input}
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          style={styles.textarea}
          placeholder="Content (Optional)"
          value={context}
          onChange={(e) => setContext(e.target.value)}
        />
        <input
          style={styles.input}
          placeholder="Image URL (Optional)"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
        />
        <button style={styles.button} type="submit">
          Create Post
        </button>
      </form>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '600px',
    margin: '50px auto',
    padding: '20px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    backgroundColor: 'white',
    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
  },
  heading: {
    textAlign: 'center',
    marginBottom: '20px',
    fontSize: '24px',
    color: '#333',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
  },
  input: {
    padding: '10px',
    fontSize: '16px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    outline: 'none',
  },
  textarea: {
    padding: '10px',
    fontSize: '16px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    outline: 'none',
    minHeight: '100px',
  },
  button: {
    padding: '10px 20px',
    fontSize: '16px',
    color: 'white',
    backgroundColor: '#4caf50',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
};

export default CreatePost;
