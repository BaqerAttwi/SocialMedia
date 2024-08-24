import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import NavBar from '../NavBar/Nav';
import { Link } from 'react-router-dom';
import './UserProfile.css'; // Import the CSS file

const UserProfile = () => {
  const { userId } = useParams();
  const [message, setMessage] = useState('');
  const [friendStatus, setFriendStatus] = useState('');
  const [userDetails, setUserDetails] = useState(null);
  const [userPosts, setUserPosts] = useState([]);

  const fetchFriendStatus = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No token found');
        return;
      }

      const response = await axios.get(`http://localhost:8800/routes/friendstatus/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const status = response.data.status;
      setFriendStatus(status);

      if (status === "Friend request with status 'accepted' already exists") {
        setMessage("You are friends");
      } else if (status === "Friend request message: Friend request with status 'pending' already exists") {
        setMessage("Request already exists, waiting to be accepted");
      } else {
        setMessage("Friend request sent");
      }
    } catch (error) {
      console.error('Error fetching friend status:', error);
    }
  };

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          console.error('No token found');
          return;
        }

        const userDetailsResponse = await axios.get(`http://localhost:8800/routes/getuserdetails/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        setUserDetails(userDetailsResponse.data);

        const userPostsResponse = await axios.get(`http://localhost:8800/routes/getuserposts/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setUserPosts(userPostsResponse.data);
      } catch (error) {
        console.error('Error fetching user details:', error);
      }
    };

    fetchUserDetails();
    fetchFriendStatus();
  }, [userId]);

  if (!userDetails) {
    return <div>Loading...</div>;
  }

  const addFriend = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No token found');
        return;
      }

      const response = await axios.post(
        'http://localhost:8800/routes/addfriend',
        { friend_id: userId },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setMessage(response.data.message);
      await fetchFriendStatus();
    } catch (error) {
      console.error('Error sending friend request:', error);
    }
  };

  const toggleReadMore = (postId) => {
    setUserPosts(userPosts.map(post =>
      post.id === postId ? { ...post, expanded: !post.expanded } : post
    ));
  };

  return (
    <div className="UserProfile-container">
      <NavBar />
      <h2>{userDetails.username}'s Profile</h2>
      <button onClick={addFriend} className='button-46'>
        ADD friend: {message} : {friendStatus}
      </button>
      <div className="user-details">
        <p>Total Likes: {userDetails.totalLikes}</p>
        <p>Total Friends: {userDetails.totalFriends}</p>
      </div>
      <h3>Posts</h3>
      <ul className="post-list">
        {userPosts.map((post) => (
          <Link key={post.id} to={`/PostDetail/${post.id}`} className="post-link">
            <li key={post.id} className="post-item">
              <img className="post-image" src={`../../Images/Posts/${post.image}`} alt={post.description} />
              <div className={`post-description ${post.expanded ? '' : 'expanded'}`}>
                {post.description}
                {!post.expanded && (
                  <button className="read-more-button" onClick={() => toggleReadMore(post.id)}>
                    Read More
                  </button>
                )}
              </div>
              <div>
                <p>Likes: {post.likes}</p>
                <p>Comments: {post.comments}</p>
              </div>
            </li>
          </Link>
        ))}
      </ul>
    </div>
  );
};

export default UserProfile;
