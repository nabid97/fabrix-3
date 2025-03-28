import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { AlertCircle, CheckCircle, User, Shield, Settings, CreditCard } from 'lucide-react';

/**
 * @typedef {Object} UserProfile
 * @property {string} name
 * @property {string} email
 * @property {string} username
 * @property {string} [phone]
 * @property {string} [address]
 */

// Add this function at the top, outside the component

/**
 * Format any phone number to E.164 format required by AWS Cognito
 * @param {string} phoneNumber - The phone number to format
 * @returns {string|undefined} - Formatted phone number or undefined if empty
 */
const formatPhoneNumber = (phoneNumber) => {
  if (!phoneNumber || phoneNumber.trim() === '') return undefined;
  
  // Clean up the number - remove spaces, dashes, parentheses, etc.
  const cleaned = phoneNumber.replace(/[^\d+]/g, '');
  
  // If it already starts with +, assume it's in international format
  if (cleaned.startsWith('+')) return cleaned;
  
  // Otherwise add + prefix (user is responsible for including country code)
  return `+${cleaned}`;
};

const AccountPage = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState(null);
  const [message, setMessage] = useState(null);

  const { currentUser, isAuthenticated, logout, updateUserAttributes } = useAuth();
  const navigate = useNavigate();

  // Add this near the top of your component
  useEffect(() => {
    if (isAuthenticated && currentUser === null) {
      console.error("User is authenticated but currentUser is null");
      setMessage({
        type: 'error',
        text: 'Unable to load user data. Please try signing in again.'
      });
      // Optional: Force re-login
      // logout();
      // navigate('/login?redirect=/account');
    }
  }, [isAuthenticated, currentUser]);

  // Update the fetchUserProfile function with this implementation

const fetchUserProfile = async () => {
  setIsLoading(true);
  try {
    // Import Auth directly - this provides more reliable access to user data
    const { Auth } = await import('@aws-amplify/auth');
    
    // Get user directly from Auth API rather than context
    const user = await Auth.currentAuthenticatedUser();
    console.log("User from Auth.currentAuthenticatedUser():", user);
    
    // Create profile using direct access to Auth user data
    const userProfile = {
      name: user.attributes?.name || '',
      email: user.attributes?.email || '',
      username: user.username || '',
      phone: user.attributes?.phone_number || '',
      address: user.attributes?.address || ''
    };
    
    console.log("Profile constructed from direct Auth call:", userProfile);
    
    // Update state with profile data
    setProfile(userProfile);
    setEditedProfile(userProfile);
  } catch (error) {
    console.error('Error fetching user profile directly from Auth:', error);
    
    // Fallback to the old method if direct Auth access fails
    try {
      console.log("Falling back to context user data:", currentUser);
      
      // Try multiple potential paths for attributes
      let attributes = {};
        
      if (currentUser?.attributes) {
        attributes = currentUser.attributes;
      } else if (currentUser?.signInUserSession?.idToken?.payload) {
        attributes = currentUser.signInUserSession.idToken.payload;
      } else {
        attributes = currentUser || {};
      }
      
      // Create profile with fallback options
      const fallbackProfile = {
        name: attributes.name || '',
        email: attributes.email || '',
        username: currentUser?.username || attributes['cognito:username'] || '',
        phone: attributes.phone_number || '',
        address: attributes.address || ''
      };
      
      // Update state if we have minimal data
      if (fallbackProfile.email || fallbackProfile.username) {
        setProfile(fallbackProfile);
        setEditedProfile(fallbackProfile);
      } else {
        throw new Error("Could not extract profile data from any available source");
      }
    } catch (fallbackError) {
      setMessage({
        type: 'error',
        text: 'Failed to load profile information. Please use the "Force Fetch" button below.'
      });
    }
  } finally {
    setIsLoading(false);
  }
};

  // Call fetchUserProfile on component mount or when dependencies change
  useEffect(() => {
    fetchUserProfile();
  }, [isAuthenticated, currentUser, navigate]);
  // Handle profile update
  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    if (!editedProfile) return;

    // Add this check before setIsLoading(true) in handleProfileUpdate
    if (editedProfile.phone && !editedProfile.phone.includes('+')) {
      setMessage({
        type: 'error',
        text: 'Please include country code with + prefix in your phone number (e.g., +1xxxxxxxxxx)'
      });
      return;
    }

    setIsLoading(true);
    setMessage(null);

    try {
      // Prepare user attributes - only include non-empty ones
      const attributes = {};
      
      // Include name if provided
      if (editedProfile.name?.trim()) {
        attributes.name = editedProfile.name.trim();
      }
      
      // Format phone number if provided
      if (editedProfile.phone?.trim()) {
        const formattedPhone = formatPhoneNumber(editedProfile.phone);
        if (formattedPhone) {
          attributes.phone_number = formattedPhone;
        }
      }
      
      // Include address if provided
      if (editedProfile.address?.trim()) {
        attributes.address = editedProfile.address.trim();
      }

      // Update user attributes in Cognito
      await updateUserAttributes(attributes);

      // Update local profile state with formatted phone
      const updatedProfile = {
        ...editedProfile,
        phone: attributes.phone_number || editedProfile.phone || ''
      };
      
      setProfile(updatedProfile);
      setEditedProfile(updatedProfile);
      
      setIsEditing(false);
      setMessage({
        type: 'success',
        text: 'Profile updated successfully!'
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      
      // Provide specific guidance for phone number errors
      if (error.message?.includes('phone') || error.message?.includes('number format')) {
        setMessage({
          type: 'error',
          text: 'Phone number format error: Make sure to include the country code with a + prefix'
        });
      } else {
        setMessage({
          type: 'error',
          text: error.message || 'Failed to update profile. Please try again.'
        });
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle password change
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setMessage({
        type: 'error',
        text: 'New passwords do not match'
      });
      return;
    }

    setIsLoading(true);
    setMessage(null);

    try {
      // Change password in Cognito
      await currentUser?.changePassword(oldPassword, newPassword);
      
      // Reset form
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
      
      setMessage({
        type: 'success',
        text: 'Password changed successfully!'
      });
    } catch (error) {
      console.error('Error changing password:', error);
      setMessage({
        type: 'error',
        text: error.message || 'Failed to change password. Please check your current password and try again.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle account deletion
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');

  const handleDeleteAccount = async () => {
    if (deleteConfirmText !== currentUser?.username) {
      setMessage({
        type: 'error',
        text: 'Username confirmation does not match'
      });
      return;
    }

    setIsLoading(true);
    setMessage(null);

    try {
      // Delete user account
      await currentUser?.deleteUser();
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Error deleting account:', error);
      setMessage({
        type: 'error',
        text: error.message || 'Failed to delete account. Please try again.'
      });
      setIsLoading(false);
    }
  };

  if (isLoading && !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="spinner animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white shadow-md rounded-xl overflow-hidden">
          <div className="md:flex">
            {/* Sidebar */}
            <div className="bg-gray-50 p-6 md:w-64">
              <h2 className="text-xl font-bold text-gray-800 mb-6">Account</h2>
              <nav className="space-y-1">
                <button 
                  onClick={() => setActiveTab('profile')}
                  className={`flex items-center px-3 py-2 w-full text-left rounded-md ${activeTab === 'profile' ? 'bg-teal-50 text-teal-700' : 'text-gray-700 hover:bg-gray-100'}`}
                >
                  <User className="mr-3 h-5 w-5" />
                  <span>Profile</span>
                </button>
                <button 
                  onClick={() => setActiveTab('security')}
                  className={`flex items-center px-3 py-2 w-full text-left rounded-md ${activeTab === 'security' ? 'bg-teal-50 text-teal-700' : 'text-gray-700 hover:bg-gray-100'}`}
                >
                  <Shield className="mr-3 h-5 w-5" />
                  <span>Security</span>
                </button>
                <button 
                  onClick={() => setActiveTab('preferences')}
                  className={`flex items-center px-3 py-2 w-full text-left rounded-md ${activeTab === 'preferences' ? 'bg-teal-50 text-teal-700' : 'text-gray-700 hover:bg-gray-100'}`}
                >
                  <Settings className="mr-3 h-5 w-5" />
                  <span>Preferences</span>
                </button>
                <button 
                  onClick={() => setActiveTab('billing')}
                  className={`flex items-center px-3 py-2 w-full text-left rounded-md ${activeTab === 'billing' ? 'bg-teal-50 text-teal-700' : 'text-gray-700 hover:bg-gray-100'}`}
                >
                  <CreditCard className="mr-3 h-5 w-5" />
                  <span>Billing</span>
                </button>
              </nav>
            </div>

            {/* Main content */}
            <div className="flex-1 p-6">
              {message && (
                <div className={`mb-6 ${message.type === 'success' ? 'bg-green-50 border-green-200 text-green-700' : 'bg-red-50 border-red-200 text-red-700'} px-4 py-3 rounded-lg flex items-start`}>
                  {message.type === 'success' ? (
                    <CheckCircle className="mr-2 h-5 w-5 flex-shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle className="mr-2 h-5 w-5 flex-shrink-0 mt-0.5" />
                  )}
                  <span>{message.text}</span>
                </div>
              )}

              {/* Profile Tab */}
              {activeTab === 'profile' && (
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">Profile Information</h2>
                    {!isEditing ? (
                      <button
                        type="button"
                        onClick={() => setIsEditing(true)}
                        className="px-4 py-2 text-sm font-medium text-teal-700 bg-teal-100 rounded-md hover:bg-teal-200"
                      >
                        Edit Profile
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => {
                          setIsEditing(false);
                          setEditedProfile(profile);
                        }}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                      >
                        Cancel
                      </button>
                    )}
                  </div>

                  {isEditing ? (
                    <form onSubmit={handleProfileUpdate} className="space-y-6">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
                        <input
                          type="text"
                          id="name"
                          value={editedProfile?.name || ''}
                          onChange={(e) => setEditedProfile({...editedProfile, name: e.target.value})}
                          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500"
                        />
                      </div>
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
                        <input
                          type="email"
                          id="email"
                          value={editedProfile?.email || ''}
                          disabled
                          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm bg-gray-50"
                        />
                        <p className="mt-1 text-sm text-gray-500">Email cannot be changed directly. Contact support for assistance.</p>
                      </div>
                      <div>
                        <label htmlFor="username" className="block text-sm font-medium text-gray-700">Username</label>
                        <input
                          type="text"
                          id="username"
                          value={editedProfile?.username || ''}
                          disabled
                          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm bg-gray-50"
                        />
                      </div>
                      <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone Number</label>
                        <input
                          type="tel"
                          id="phone"
                          value={editedProfile?.phone || ''}
                          onChange={(e) => setEditedProfile({...editedProfile, phone: e.target.value})}
                          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500"
                          placeholder="Include country code (e.g. +1, +44, +91)"
                        />
                        <p className="mt-1 text-xs text-gray-500">
                          Enter with country code starting with + (e.g., +1 for US, +44 for UK, +91 for India)
                        </p>
                        <div className="mt-2 text-xs text-gray-500 grid grid-cols-2 gap-x-4 gap-y-1">
                          <span>🇺🇸 US: +1xxxxxxxxxx</span>
                          <span>🇬🇧 UK: +44xxxxxxxxxx</span>
                          <span>🇮🇳 India: +91xxxxxxxxxx</span>
                          <span>🇨🇦 Canada: +1xxxxxxxxxx</span>
                          <span>🇦🇺 Australia: +61xxxxxxxxx</span>
                          <span>🇩🇪 Germany: +49xxxxxxxxx</span>
                        </div>
                      </div>
                      <div>
                        <label htmlFor="address" className="block text-sm font-medium text-gray-700">Address</label>
                        <textarea
                          id="address"
                          value={editedProfile?.address || ''}
                          onChange={(e) => setEditedProfile({...editedProfile, address: e.target.value})}
                          rows={3}
                          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500"
                        ></textarea>
                      </div>
                      <div>
                        <button
                          type="submit"
                          disabled={isLoading}
                          className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                        >
                          {isLoading ? 'Saving...' : 'Save Changes'}
                        </button>
                      </div>
                    </form>
                  ) : (
                    <div className="space-y-6">
                      <div className="bg-gray-50 px-4 py-5 rounded-lg">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider">Full Name</h3>
                            <p className="mt-1 text-sm text-gray-900">{profile?.name || 'Not provided'}</p>
                          </div>
                          <div>
                            <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider">Email Address</h3>
                            <p className="mt-1 text-sm text-gray-900" id="user-email-display">
                              {profile?.email || 
                               '—'}
                            </p>
                          </div>
                          <div>
                            <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider">Username</h3>
                            <p className="mt-1 text-sm text-gray-900" id="user-username-display">
                              {profile?.username || 
                               '—'}
                            </p>
                          </div>
                          <div>
                            <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider">Phone Number</h3>
                            <p className="mt-1 text-sm text-gray-900">{profile?.phone || 'Not provided'}</p>
                          </div>
                          <div className="md:col-span-2">
                            <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider">Address</h3>
                            <p className="mt-1 text-sm text-gray-900">{profile?.address || 'Not provided'}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Security Tab */}
              {activeTab === 'security' && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-6">Security Settings</h2>
                  
                  <div className="space-y-8">
                    {/* Change Password */}
                    <div className="bg-gray-50 p-6 rounded-lg">
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Change Password</h3>
                      <form onSubmit={handlePasswordChange} className="space-y-4">
                        <div>
                          <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700">Current Password</label>
                          <input
                            type="password"
                            id="currentPassword"
                            value={oldPassword}
                            onChange={(e) => setOldPassword(e.target.value)}
                            required
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500"
                          />
                        </div>
                        <div>
                          <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">New Password</label>
                          <input
                            type="password"
                            id="newPassword"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500"
                          />
                        </div>
                        <div>
                          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">Confirm New Password</label>
                          <input
                            type="password"
                            id="confirmPassword"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500"
                          />
                        </div>
                        <div>
                          <button
                            type="submit"
                            disabled={isLoading}
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
                          >
                            {isLoading ? 'Updating...' : 'Update Password'}
                          </button>
                        </div>
                      </form>
                    </div>
                    
                    {/* Delete Account */}
                    <div className="bg-red-50 p-6 rounded-lg">
                      <h3 className="text-lg font-medium text-red-900 mb-2">Delete Account</h3>
                      <p className="text-sm text-red-700 mb-4">
                        Once you delete your account, there is no going back. Please be certain.
                      </p>
                      
                      {!showDeleteConfirm ? (
                        <button
                          type="button"
                          onClick={() => setShowDeleteConfirm(true)}
                          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                        >
                          Delete Account
                        </button>
                      ) : (
                        <div className="space-y-4">
                          <p className="text-sm text-red-700">
                            To confirm deletion, please enter your username: <strong>{currentUser?.username}</strong>
                          </p>
                          <input
                            type="text"
                            value={deleteConfirmText}
                            onChange={(e) => setDeleteConfirmText(e.target.value)}
                            className="mt-1 block w-full border-red-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500"
                            placeholder="Enter username to confirm"
                          />
                          <div className="flex space-x-3">
                            <button
                              type="button"
                              onClick={handleDeleteAccount}
                              disabled={isLoading || deleteConfirmText !== currentUser?.username}
                              className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 ${
                                isLoading || deleteConfirmText !== currentUser?.username ? 'opacity-50 cursor-not-allowed' : ''
                              }`}
                            >
                              {isLoading ? 'Processing...' : 'Permanently Delete Account'}
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setShowDeleteConfirm(false);
                                setDeleteConfirmText('');
                              }}
                              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Preferences Tab */}
              {activeTab === 'preferences' && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-6">Preferences</h2>
                  
                  <div className="space-y-6">
                    <div className="bg-gray-50 p-6 rounded-lg">
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Notification Settings</h3>
                      
                      <div className="space-y-4">
                        <div className="flex items-start">
                          <div className="flex items-center h-5">
                            <input
                              id="emailNotifications"
                              name="emailNotifications"
                              type="checkbox"
                              className="focus:ring-teal-500 h-4 w-4 text-teal-600 border-gray-300 rounded"
                              defaultChecked
                            />
                          </div>
                          <div className="ml-3 text-sm">
                            <label htmlFor="emailNotifications" className="font-medium text-gray-700">Email Notifications</label>
                            <p className="text-gray-500">Receive product updates, special offers, and marketing emails</p>
                          </div>
                        </div>
                        
                        <div className="flex items-start">
                          <div className="flex items-center h-5">
                            <input
                              id="orderUpdates"
                              name="orderUpdates"
                              type="checkbox"
                              className="focus:ring-teal-500 h-4 w-4 text-teal-600 border-gray-300 rounded"
                              defaultChecked
                            />
                          </div>
                          <div className="ml-3 text-sm">
                            <label htmlFor="orderUpdates" className="font-medium text-gray-700">Order Updates</label>
                            <p className="text-gray-500">Receive notifications about your order status</p>
                          </div>
                        </div>
                        
                        <div className="flex items-start">
                          <div className="flex items-center h-5">
                            <input
                              id="newProducts"
                              name="newProducts"
                              type="checkbox"
                              className="focus:ring-teal-500 h-4 w-4 text-teal-600 border-gray-300 rounded"
                            />
                          </div>
                          <div className="ml-3 text-sm">
                            <label htmlFor="newProducts" className="font-medium text-gray-700">New Products</label>
                            <p className="text-gray-500">Be the first to know about new product launches</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-6">
                        <button
                          type="button"
                          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
                        >
                          Save Preferences
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Billing Tab */}
              {activeTab === 'billing' && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-6">Billing & Subscription</h2>
                  
                  <div className="bg-gray-50 p-6 rounded-lg mb-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Current Plan</h3>
                    
                    <div className="bg-white p-4 rounded border border-gray-200 mb-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <h4 className="text-lg font-medium text-gray-900">Free Plan</h4>
                          <p className="text-gray-500">Basic features for personal use</p>
                        </div>
                        <span className="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-green-100 text-green-800">
                          Active
                        </span>
                      </div>
                    </div>
                    
                    <button
                      type="button"
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
                    >
                      Upgrade Plan
                    </button>
                  </div>
                  
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Payment Methods</h3>
                    
                    <div className="text-center py-8">
                      <p className="text-gray-500">No payment methods added yet</p>
                      <button
                        type="button"
                        className="mt-4 inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
                      >
                        Add Payment Method
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountPage;