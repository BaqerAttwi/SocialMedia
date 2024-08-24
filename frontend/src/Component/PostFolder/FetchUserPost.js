import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './UserPosts.css'; // Ensure this is correctly referenced
import { Link } from 'react-router-dom';
const UserPosts = () => {
  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState({});
  const [showComments, setShowComments] = useState({});
  const [expandedPosts, setExpandedPosts] = useState({});

  useEffect(() => {
    const fetchUserPosts = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          console.error('No token found');
          return;
        }

        const response = await axios.get('http://localhost:8800/routes/userposts', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        setPosts(response.data.posts);
      } catch (error) {
        console.error('Error fetching user posts:', error);
      }
    };

    fetchUserPosts();
  }, []);

  const fetchComments = async (postId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:8800/routes/post/${postId}/comments`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setComments(prevComments => ({ ...prevComments, [postId]: response.data }));
      setShowComments(prevShowComments => ({ ...prevShowComments, [postId]: true }));
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  const toggleComments = (postId) => {
    if (showComments[postId]) {
      setShowComments(prevShowComments => ({ ...prevShowComments, [postId]: false }));
    } else {
      if (!comments[postId]) {
        fetchComments(postId);
      } else {
        setShowComments(prevShowComments => ({ ...prevShowComments, [postId]: true }));
      }
    }
  };

  const toggleReadMore = (postId) => {
    setExpandedPosts(prevExpandedPosts => ({ ...prevExpandedPosts, [postId]: !prevExpandedPosts[postId] }));
  };

  return (
    <div className="posts-container">
      {posts.map(post => (
        <div className="post" key={post.id}>
          <h2>{post.title}</h2>
          <div className={`post-description ${expandedPosts[post.id] ? 'expanded' : ''}`}>
          <Link to={`/PostDetail/${post.id}`} className="post-link">
            {post.description}</Link>
          </div> 
          <button className="read-more-button" onClick={() => toggleReadMore(post.id)}>
            {expandedPosts[post.id] ? 'Read Less' : 'Read More'}
          </button>
          <img className="post-image" src={`../../Images/Posts/${post.image}`} alt={post.description} />
          <p className="post-likes">Likes: {post.likes}</p>
          <button className="comments-toggle-button" onClick={() => toggleComments(post.id)}>
            {showComments[post.id] ? 'Hide Comments' : 'Show Comments'} {post.comments}
          </button>
          {showComments[post.id] && (
            <div className="comments-section">
              {comments[post.id] ? comments[post.id].map(comment => (
                <div className="comment" key={comment.id}>
                  <p>{comment.username}: {comment.description}</p>
                </div>
              )) : <p>Loading comments...</p>}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default UserPosts;
