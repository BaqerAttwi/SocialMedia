import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './HomePage.css';
import NavBar from '../NavBar/Nav';

const HomePage = () => {
  const [posts, setPosts] = useState([]);
  const [message, setMessage] = useState('');
  const [expandedPosts, setExpandedPosts] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [friendStatuses, setFriendStatuses] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          console.error('No token found');
          return;
        }

        const response = await axios.get('http://localhost:8800/routes/getallpostsF', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        const postsWithUsernames = await Promise.all(
          response.data.map(async (post) => {
            const usernameResponse = await axios.get(`http://localhost:8800/routes/getusernameF/${post.user_id}`, {
              headers: {
                Authorization: `Bearer ${token}`
              }
            });
            return {
              ...post,
              username: usernameResponse.data.username
            };
          })
        );

        setPosts(postsWithUsernames);
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };

    fetchPosts();
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No token found');
        return;
      }

      const response = await axios.get(`http://localhost:8800/routes/searchusersF?query=${searchQuery}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setSearchResults(response.data);
    } catch (error) {
      console.error('Error searching users:', error);
    }
  };

  const addFriend = async (friendId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No token found');
        return;
      }

      const response = await axios.post(
        'http://localhost:8800/routes/addfriendF',
        { friend_id: friendId },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setMessage(response.data.message);
      fetchFriendStatus(friendId);  // Fetch the updated friend status
    } catch (error) {
      console.error('Error sending friend request:', error);
    }
  };

  const fetchFriendStatus = async (friendId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No token found');
        return;
      }

      const response = await axios.get(`http://localhost:8800/routes/friendstatusF/${friendId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setFriendStatuses(prevStatuses => ({
        ...prevStatuses,
        [friendId]: response.data.status
      }));
    } catch (error) {
      console.error('Error fetching friend status:', error);
    }
  };

  const toggleReadMore = (postId) => {
    setExpandedPosts(prevState => ({
      ...prevState,
      [postId]: !prevState[postId]
    }));
  };

  const handleUserClick = (userId) => {
    navigate(`../UserProfile/${userId}`);
  };

  return (
    <div className="Global-container">
      <NavBar />
      <div className="search-out">
        <form onSubmit={handleSearch}>
          <input
            className="Seach"
            type="text"
            placeholder="Search for users"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button type="submit">Search</button>
        </form>
        <ul className="search-results">
          {searchResults.map((user) => (
            <li className="TextSeacrh" key={user.id} onClick={() => handleUserClick(user.id)}>
              <div className="alignitemssearch">
                <img src={`../../Images/Profile/${user.profileurl}`} alt="Profile" className="Search-profile-image" />
                <p>{user.username}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <h2>Posts</h2>
      {posts.length === 0 ? (
   <Link to={`../GlobalPage`} className="post-link">     <h1>Go to  Global page Global page to add friends and keep track of their posts</h1></Link>
      ) : (
        <ul className="post-list">
          {posts.map((post) => (
            <li key={post.id} className="post-item">
              <div className='Align-p-n-a'>
                <div className="username-container" onClick={() => handleUserClick(post.user_id)}>
                  <img src={`../../Images/Profile/${post.profileurl}`} alt="Profile" className="Search-profile-image" />
                  <p className="post-username">{post.username}</p>
                </div>
              </div>
              <Link to={`/PostDetail/${post.id}`} className="post-link">
                <img className="post-image" src={`../../Images/Posts/${post.image}`} alt={post.description} />
              </Link>
              <div className={`post-description ${expandedPosts[post.id] ? 'expanded' : ''}`}>
                {post.description}
              </div>
              <button className="read-more-button" onClick={() => toggleReadMore(post.id)}>
                {expandedPosts[post.id] ? 'Read Less' : 'Read More'}
              </button>
              <div className='likecomment'>
                <p style={{ paddingRight: '1vw' }}>Likes: {post.likes}</p>
                <p>Comments: {post.comments}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default HomePage;
