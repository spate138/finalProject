import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../supabaseClient';

const Post = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState('');
  const [isEditingPost, setIsEditingPost] = useState(false);
  const [updatedPostContent, setUpdatedPostContent] = useState('');

  useEffect(() => {
    fetchPost();
    fetchComments();
  }, [id]); // Add `id` as a dependency to re-fetch when the post ID changes

  const fetchPost = async () => {
    const { data, error } = await supabase.from('posts').select('*').eq('id', id).single();
    if (error) console.error(error);
    else {
      setPost(data);
      setUpdatedPostContent(data.context); // Set the initial content for editing
    }
  };

  const fetchComments = async () => {
    const { data, error } = await supabase.from('comments').select('*').eq('post_id', id);
    if (error) console.error(error);
    else setComments(data);
  };

  const addComment = async () => {
    const { error } = await supabase.from('comments').insert([{ post_id: id, content: comment }]);
    if (error) console.error(error);
    else {
      fetchComments();
      setComment('');
    }
  };

  const deletePost = async () => {
    try {
      const { error: deleteCommentsError } = await supabase
        .from('comments')
        .delete()
        .eq('post_id', id);
      if (deleteCommentsError) {
        console.error("Error deleting comments: ", deleteCommentsError.message);
        alert("Failed to delete the comments. Check the console for details.");
        return;
      }

      const { error: deletePostError } = await supabase.from('posts').delete().eq('id', id);
      if (deletePostError) {
        console.error("Error deleting post: ", deletePostError.message);
        alert("Failed to delete the post. Check the console for details.");
      } else {
        alert('Post deleted successfully!');
        window.location.href = '/'; // Redirect to home or posts list
      }
    } catch (error) {
      console.error("Unexpected error: ", error);
      alert("An unexpected error occurred.");
    }
  };

  const updatePost = async () => {
    try {
      const { error } = await supabase
        .from('posts')
        .update({ context: updatedPostContent })
        .eq('id', id);

      if (error) {
        console.error("Error updating post: ", error.message);
        alert("Failed to update the post. Check the console for details.");
      } else {
        setIsEditingPost(false); // Exit edit mode
        fetchPost(); // Fetch updated post to reflect changes
        alert('Post updated successfully!');
      }
    } catch (error) {
      console.error("Unexpected error: ", error);
      alert("An unexpected error occurred.");
    }
  };

  const upvotePost = async () => {
    const { error } = await supabase
      .from('posts')
      .update({ upvotes: post.upvotes + 1 })
      .eq('id', id);
    if (error) console.error(error);
    else fetchPost();
  };

  return post ? (
    <div style={styles.container}>
      <div style={styles.postCard}>
        <p style={styles.timestamp}>Posted {new Date(post.created_at).toLocaleString()}</p>
        <h2 style={styles.title}>{post.title}</h2>
        {isEditingPost ? (
          <div style={{ marginBottom: '20px' }}>
            <textarea
              value={updatedPostContent}
              onChange={(e) => setUpdatedPostContent(e.target.value)}
              style={styles.editTextarea}
            />
            <button onClick={updatePost} style={styles.saveButton}>
              Save
            </button>
            <button
              onClick={() => setIsEditingPost(false)}
              style={styles.cancelEditButton}
            >
              Cancel
            </button>
          </div>
        ) : (
          <p style={styles.context}>{post.context}</p>
        )}
        {post.image_url && <img src={post.image_url} alt={post.title} style={styles.image} />}
        <div style={styles.upvoteContainer}>
          <button onClick={upvotePost} style={styles.upvoteButton}>
            👍 Upvote ({post.upvotes})
          </button>
          <button onClick={() => setIsEditingPost(true)} style={styles.editButton}>
            ✏️ Edit Post
          </button>
          <button onClick={deletePost} style={styles.deleteButton}>
            🗑️ Delete Post
          </button>
        </div>
        <h3 style={styles.commentHeader}>Comments</h3>
        <ul style={styles.commentList}>
          {comments.map((c) => (
            <li key={c.id} style={styles.commentItem}>
              - {c.content}
            </li>
          ))}
        </ul>
        <textarea
          placeholder="Leave a comment..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          style={styles.commentInput}
        />
        <button onClick={addComment} style={styles.addCommentButton}>
          Add Comment
        </button>
      </div>
    </div>
  ) : (
    <p>Loading...</p>
  );
};

const styles = {
  container: {
    maxWidth: '800px',
    margin: '50px auto',
    padding: '20px',
    textAlign: 'center',
  },
  postCard: {
    backgroundColor: 'white',
    border: '1px solid #ddd',
    borderRadius: '8px',
    padding: '20px',
    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
    textAlign: 'left',
  },
  timestamp: {
    color: '#888',
    fontSize: '14px',
    marginBottom: '10px',
  },
  title: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#333',
    marginBottom: '10px',
  },
  context: {
    fontSize: '16px',
    color: '#555',
    marginBottom: '20px',
  },
  editTextarea: {
    width: '100%',
    padding: '10px',
    fontSize: '16px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    marginBottom: '10px',
  },
  image: {
    width: '100%',
    height: 'auto',
    borderRadius: '8px',
    marginBottom: '20px',
  },
  upvoteContainer: {
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginBottom: '20px',
  },
  upvoteButton: {
    backgroundColor: '#4caf50',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    padding: '10px 20px',
    cursor: 'pointer',
    marginRight: '10px',
  },
  editButton: {
    backgroundColor: '#ffeb3b',
    color: 'black',
    border: 'none',
    borderRadius: '4px',
    padding: '10px 20px',
    cursor: 'pointer',
    marginRight: '10px',
  },
  deleteButton: {
    backgroundColor: '#e53935',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    padding: '10px 20px',
    cursor: 'pointer',
  },
  saveButton: {
    backgroundColor: '#4caf50',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    padding: '10px 20px',
    cursor: 'pointer',
    marginRight: '10px',
  },
  cancelEditButton: {
    backgroundColor: '#e53935',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    padding: '10px 20px',
    cursor: 'pointer',
  },
  commentHeader: {
    fontSize: '20px',
    fontWeight: 'bold',
    marginBottom: '10px',
  },
  commentList: {
    listStyle: 'none',
    padding: 0,
    marginBottom: '20px',
  },
  commentItem: {
    backgroundColor: '#f9f9f9',
    padding: '10px',
    borderRadius: '4px',
    marginBottom: '10px',
    fontSize: '14px',
  },
  commentInput: {
    width: '100%',
    padding: '10px',
    fontSize: '16px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    marginBottom: '10px',
  },
  addCommentButton: {
    backgroundColor: '#4caf50',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    padding: '10px 20px',
    cursor: 'pointer',
  },
};

export default Post;
