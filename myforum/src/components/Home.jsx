import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('created_at');

  useEffect(() => {
    const fetchPosts = async () => {
      let { data, error } = await supabase
        .from('posts')
        .select('*')
        .order(sortBy, { ascending: sortBy === 'created_at' });

      if (error) console.error(error);
      else setPosts(data);
    };

    fetchPosts();
  }, [sortBy]);

  const filteredPosts = posts.filter((post) =>
    post.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>

      {/* Search bar */}
      <div style={{ marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="Search posts by title..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            width: '100%',
            padding: '10px',
            fontSize: '16px',
            border: '1px solid #ddd',
            borderRadius: '4px',
            marginBottom: '10px',
          }}
        />
      </div>

      {/* Sorting buttons */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'flex-start',
          alignItems: 'center',
          gap: '10px',
          marginBottom: '20px',
        }}
      >
        <p style={{ margin: 0, fontWeight: 'bold' }}>Order by:</p>
        <button
          onClick={() => setSortBy('created_at')}
          style={{
            padding: '8px 15px',
            border: '1px solid #ccc',
            backgroundColor: sortBy === 'created_at' ? '#4caf50' : 'white',
            color: sortBy === 'created_at' ? 'white' : 'black',
            borderRadius: '5px',
            cursor: 'pointer',
          }}
        >
          Newest
        </button>
        <button
          onClick={() => setSortBy('upvotes')}
          style={{
            padding: '8px 15px',
            border: '1px solid #ccc',
            backgroundColor: sortBy === 'upvotes' ? '#4caf50' : 'white',
            color: sortBy === 'upvotes' ? 'white' : 'black',
            borderRadius: '5px',
            cursor: 'pointer',
          }}
        >
          Most Popular
        </button>
      </div>

      {/* Post list */}
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {filteredPosts.map((post) => (
          <li
            key={post.id}
            style={{
              backgroundColor: 'white',
              border: '1px solid #ddd',
              borderRadius: '8px',
              marginBottom: '20px',
              padding: '15px',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
            }}
          >
            <p style={{ color: '#888', margin: '0 0 5px' }}>
              Posted {new Date(post.created_at).toLocaleString()}
            </p>
            <a
              href={`/post/${post.id}`}
              style={{
                color: '#333',
                fontSize: '20px',
                fontWeight: 'bold',
                textDecoration: 'none',
              }}
            >
              {post.title}
            </a>
            <p style={{ margin: '10px 0 0', color: '#555' }}>{post.upvotes} upvotes</p>
          </li>
        ))}
        {filteredPosts.length === 0 && (
          <p style={{ textAlign: 'center', color: '#888', marginTop: '20px' }}>
            No posts found.
          </p>
        )}
      </ul>
    </div>
  );
};

export default Home;
