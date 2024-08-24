import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import './PostDetail.css';
import NavBar from '../NavBar/Nav';
import UpdateForm from '../Register/EditProfile';
import './Profile.css';
import UserPosts from './FetchUserPost';

const PostService = () => {
  const [posts, setPosts] = useState([]);
  const [userProfile, setUserProfile] = useState(null);
  const [friendRequests, setFriendRequests] = useState([]);

  const fetchFriendRequests = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No token found');
        return;
      }

      const response = await axios.get('http://localhost:8800/routes/friendrequests', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setFriendRequests(response.data.friendRequests);
    } catch (error) {
      console.error('Error fetching friend requests:', error);
    }
  }, []);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          console.error('No token found');
          return;
        }

        const response = await axios.get('http://localhost:8800/routes/getposts', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        const updatedPosts = response.data.map(post => ({
          ...post,
          image: `../../Images/Posts/${post.image}`
        }));

        setPosts(updatedPosts);
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };

    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          console.error('No token found');
          return;
        }

        const response = await axios.get('http://localhost:8800/routes/profile', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        setUserProfile(response.data.user);
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };

    fetchPosts();
    fetchUserProfile();
    fetchFriendRequests();
  }, [fetchFriendRequests]);

  const handleAcceptRequest = async (requestId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No token found');
        return;
      }

      await axios.post(
        'http://localhost:8800/routes/acceptfriendrequest',
        { requestId },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      fetchFriendRequests();
    } catch (error) {
      console.error('Error accepting friend request:', error);
    }
  };

  const handleRejectRequest = async (requestId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No token found');
        return;
      }

      await axios.post(
        'http://localhost:8800/routes/rejectfriendrequest',
        { requestId },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      fetchFriendRequests();
    } catch (error) {
      console.error('Error rejecting friend request:', error);
    }
  };

  return (
    <>
      <NavBar className="left" />
      <div className="post-container">
        <h2>User Profile</h2>
        <div className="post-content">
          <div className="profile-container">
            {userProfile && userProfile.profileurl && (
              <img src={`../../Images/Profile/${userProfile.profileurl}`} alt="Profile" className="profile-image" />
            )}
            <UpdateForm />
          </div>
          <div className="friend-requests">
            <h2>Friend Requests</h2>
            <ul>
              {friendRequests.map((request) => (
                <li key={request.id}>
                  <p>{request.username} sent you a friend request.</p>
                  <button onClick={() => handleAcceptRequest(request.id)}>Accept</button>
                  <button onClick={() => handleRejectRequest(request.id)}>Reject</button>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <h2>Posts</h2>
        <div className="post-list-User">
          
          <UserPosts />
        </div>
      </div>
    </>
  );
};

export default PostService;
