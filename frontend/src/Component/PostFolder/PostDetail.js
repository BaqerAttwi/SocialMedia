import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './PostDetail.css';
import NavBar from '../NavBar/Nav';

const PostDetail = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [showComments, setShowComments] = useState(false);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [commentCount, setCommentCount] = useState(0);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          console.error('No token found');
          return;
        }

        const postResponse = await axios.get(`http://localhost:8800/routes/getpost/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setPost(postResponse.data);

        const commentsResponse = await axios.get(`http://localhost:8800/routes/getcomments/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setComments(commentsResponse.data);

        const likeCountResponse = await axios.get(`http://localhost:8800/routes/getlikecount/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setLikeCount(likeCountResponse.data.count);

        const commentCountResponse = await axios.get(`http://localhost:8800/routes/getcommentcount/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setCommentCount(commentCountResponse.data.count);

        const likeResponse = await axios.post(
          `http://localhost:8800/routes/checklike`,
          {
            post_id: id
          },
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
        setLiked(likeResponse.data.liked);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [id]);

  const handleToggleLike = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No token found');
        return;
      }

      const response = await axios.post(
        `http://localhost:8800/routes/togglelike`,
        {
          post_id: id
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (response.data.message === 'Like added successfully') {
        setLiked(true);
        setLikeCount(likeCount + 1);
      } else if (response.data.message === 'Like removed successfully') {
        setLiked(false);
        setLikeCount(likeCount - 1);
      }
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  const handleAddComment = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No token found');
        return;
      }

      const response = await axios.post(
        `http://localhost:8800/routes/addcomment`,
        {
          post_id: id,
          description: newComment
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setComments([...comments, response.data]);
      setNewComment('');
      setCommentCount(commentCount + 1);
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const toggleComments = () => {
    setShowComments(!showComments);
  };

  const toggleDescription = () => {
    setIsDescriptionExpanded(!isDescriptionExpanded);
  };

  if (!post) {
    return <div>Loading...</div>;
  }

  const addFriend = async (friendId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No token found');
        return;
      }

      await axios.post(
        'http://localhost:8800/routes/addfriend',
        { friend_id: friendId },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      console.log('Friend request sent successfully');
    } catch (error) {
      console.error('Error sending friend request:', error);
    }
  };

  return (
    <>
      <NavBar />
      <div className="post-container">
        <div className="post-header">
          <div className="header-content">
            <img src={`../../Images/Profile/${post.profileurl}`} alt="Profile" className="profile-image" />
            <h2>{post.username}</h2>
            <img src={`../../Images/Icons/Add.png`} alt="Add Friend" className="add-friend-icon" onClick={() => addFriend(post.user_id)} />
          </div>
        </div>
        <div className="post-content">
          <img className="post-detail-image" src={`../../Images/Posts/${post.image}`} alt={post.description} />
          <p className={`Text-d ${isDescriptionExpanded ? 'expanded' : ''}`}>{post.description}</p>
          <div className="read-more-container">
            <button className="read-more-button" onClick={toggleDescription}>
              {isDescriptionExpanded ? 'Read Less' : 'Read More'}
            </button>
          </div>
        </div>
        <div className="post-actions">
          <button onClick={handleToggleLike} className='Button-p-G'>
            {liked ? 'Unlike' : 'Like'}
            <span className="like-count">{likeCount}</span>
          </button>
          <button onClick={toggleComments} className='Button-p-G'>
            {showComments ? 'Hide Comments' : 'Show Comments'}
            <span className="comment-count">{commentCount}</span>
          </button>
        </div>
        {showComments && (
          <div className="comment-container">
            <ul className="comment-list">
              {comments.map((comment) => (
                <li key={comment.id} className="comment-item">
                  <p>
                    <strong>{comment.username}: </strong>
                    {comment.description}
                  </p>
                </li>
              ))}
            </ul>
            <div className="add-comment-container">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add a comment"
              ></textarea>
              <button onClick={handleAddComment}>Add Comment</button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default PostDetail;
