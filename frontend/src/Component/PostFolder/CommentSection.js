
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CommentSection = ({ postId }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          console.error('No token found');
          return;
        }

        const response = await axios.get(`http://localhost:8800/routes/getcomments/${postId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setComments(response.data);
      } catch (error) {
        console.error('Error fetching comments:', error);
      }
    };

    fetchComments(); // Call fetchComments function when component mounts
  }, [postId]);

  const addComment = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No token found');
        return;
      }

      const response = await axios.post(
        'http://localhost:8800/routes/addcomment',
        { post_id: postId, description: newComment },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      console.log('Comment added successfully:', response.data.message);
      // Refresh comments after adding new comment
      fetchComments();
      // Clear input field
      setNewComment('');
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  return (
    <div className="comment-section">
      <h4>Comments</h4>
      <ul className="comment-list">
        {comments.map((comment) => (
          <li key={comment.id} className="comment-item">
            <p>{comment.username}: {comment.description}</p>
          </li>
        ))}
      </ul>
      <div className="add-comment">
        <input
          type="text"
          placeholder="Add a comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
        />
        <button onClick={addComment}>Add</button>
      </div>
    </div>
  );
};

export default CommentSection;