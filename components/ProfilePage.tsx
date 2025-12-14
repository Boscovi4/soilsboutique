import React, { useState, useRef } from 'react';
import { UserProfile } from '../types';

interface ProfilePageProps {
  user: UserProfile;
  onSave: (updatedUser: UserProfile) => void;
  onLogout: () => void;
  onBack: () => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({ user, onSave, onLogout, onBack }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<UserProfile>(user);
  const [passwordData, setPasswordData] = useState({ current: '', new: '', confirm: '' });
  const [activeTab, setActiveTab] = useState<'info' | 'settings'>('info');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePreferenceChange = (key: keyof UserProfile['preferences'], value: any) => {
    setFormData(prev => ({
      ...prev,
      preferences: { ...prev.preferences, [key]: value }
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, avatarUrl: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    // Basic validation
    if (!formData.fullName.trim() || !formData.username.trim()) {
      alert("Name and Username are required.");
      return;
    }
    onSave(formData);
    setIsEditing(false);
  };

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordData.new !== passwordData.confirm) {
      alert("New passwords do not match.");
      return;
    }
    // Mock API call
    alert("Password updated successfully!");
    setPasswordData({ current: '', new: '', confirm: '' });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-background-dark pb-24 animate-in fade-in slide-in-from-bottom-4 duration-300">
      {/* Header / Nav */}
      <div className="bg-white dark:bg-card-dark sticky top-0 z-10 px-4 py-3 shadow-sm flex items-center justify-between">
        <button onClick={onBack} className="p-2 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
          <span className="material-icons">arrow_back</span>
        </button>
        <h1 className="text-lg font-bold">My Profile</h1>
        <button onClick={onLogout} className="text-red-500 text-sm font-medium hover:bg-red-50 px-3 py-1 rounded-full transition-colors">
          Logout
        </button>
      </div>

      <div className="max-w-2xl mx-auto p-4 space-y-6">
        
        {/* Profile Header Card */}
        <div className="bg-white dark:bg-card-dark rounded-2xl shadow-sm p-6 flex flex-col items-center relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-r from-primary/80 to-secondary/80 z-0"></div>
          
          <div className="relative z-10 mt-8 mb-4 group">
             <div className="w-28 h-28 rounded-full border-4 border-white dark:border-card-dark shadow-md overflow-hidden bg-gray-200">
               {formData.avatarUrl ? (
                 <img src={formData.avatarUrl} alt="Profile" className="w-full h-full object-cover" />
               ) : (
                 <div className="w-full h-full flex items-center justify-center bg-gray-300 text-gray-500">
                   <span className="material-icons text-5xl">person</span>
                 </div>
               )}
             </div>
             {isEditing && (
               <button 
                 onClick={() => fileInputRef.current?.click()}
                 className="absolute bottom-1 right-1 bg-secondary text-white p-2 rounded-full shadow-lg hover:scale-110 transition-transform"
               >
                 <span className="material-icons text-sm">photo_camera</span>
               </button>
             )}
             <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />
          </div>

          <div className="text-center z-10">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{user.fullName}</h2>
            <p className="text-gray-500 dark:text-gray-400">@{user.username}</p>
            <span className="inline-block mt-2 px-3 py-0.5 bg-primary/10 text-primary text-xs font-bold rounded-full uppercase tracking-wider">
              {user.role}
            </span>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex bg-white dark:bg-card-dark rounded-xl p-1 shadow-sm">
          <button 
            onClick={() => setActiveTab('info')}
            className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-all ${activeTab === 'info' ? 'bg-gray-100 dark:bg-gray-700 text-primary shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Personal Info
          </button>
          <button 
             onClick={() => setActiveTab('settings')}
             className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-all ${activeTab === 'settings' ? 'bg-gray-100 dark:bg-gray-700 text-primary shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Settings
          </button>
        </div>

        {/* Content Area */}
        {activeTab === 'info' ? (
          <div className="bg-white dark:bg-card-dark rounded-xl shadow-sm p-6 space-y-4">
             <div className="flex justify-between items-center mb-2">
               <h3 className="font-bold text-lg">Details</h3>
               {!isEditing ? (
                 <button onClick={() => setIsEditing(true)} className="text-primary font-medium text-sm flex items-center gap-1">
                   <span className="material-icons text-sm">edit</span> Edit
                 </button>
               ) : (
                 <div className="flex gap-2">
                   <button onClick={() => { setIsEditing(false); setFormData(user); }} className="text-gray-500 text-sm font-medium">Cancel</button>
                   <button onClick={handleSave} className="text-primary text-sm font-bold">Save</button>
                 </div>
               )}
             </div>

             <div className="grid gap-4">
               <div>
                 <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Full Name</label>
                 <input 
                   type="text" 
                   name="fullName"
                   disabled={!isEditing}
                   value={formData.fullName}
                   onChange={handleInputChange}
                   className="w-full p-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none disabled:opacity-60 disabled:cursor-not-allowed"
                 />
               </div>
               
               <div>
                 <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Username</label>
                 <div className="relative">
                    <span className="absolute left-3 top-2.5 text-gray-400">@</span>
                    <input 
                      type="text" 
                      name="username"
                      disabled={!isEditing}
                      value={formData.username}
                      onChange={handleInputChange}
                      className="w-full pl-7 p-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none disabled:opacity-60 disabled:cursor-not-allowed"
                    />
                 </div>
               </div>

               <div>
                 <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Email (Read Only)</label>
                 <input 
                   type="email" 
                   value={formData.email}
                   disabled
                   className="w-full p-2.5 bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-500 cursor-not-allowed"
                 />
               </div>
             </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Preferences */}
            <div className="bg-white dark:bg-card-dark rounded-xl shadow-sm p-6">
              <h3 className="font-bold text-lg mb-4">Preferences</h3>
              
              <div className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-800">
                <div className="flex items-center gap-3">
                  <span className="material-icons text-gray-400">notifications</span>
                  <span>Push Notifications</span>
                </div>
                <button 
                  onClick={() => handlePreferenceChange('notifications', !formData.preferences.notifications)}
                  className={`w-11 h-6 rounded-full relative transition-colors ${formData.preferences.notifications ? 'bg-primary' : 'bg-gray-300'}`}
                >
                  <span className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${formData.preferences.notifications ? 'left-6' : 'left-1'}`} />
                </button>
              </div>

              <div className="flex items-center justify-between py-3">
                <div className="flex items-center gap-3">
                  <span className="material-icons text-gray-400">language</span>
                  <span>Language</span>
                </div>
                <select 
                  value={formData.preferences.language}
                  onChange={(e) => handlePreferenceChange('language', e.target.value)}
                  className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm p-1.5 outline-none"
                >
                  <option value="en">English</option>
                  <option value="tetum">Tetum</option>
                  <option value="pt">Português</option>
                </select>
              </div>
              
               {/* Save button for preferences only appears if changes are made to preferences via state sync, 
                   but for simplicity we auto-save preferences or add a button. 
                   Here we'll use the main Save logic or a specific button if needed. 
                   Let's add a specific save for this section or rely on the parent 'onSave' being called immediately for switches.
                   For this demo, let's add a manual Save Settings button to be explicit.
               */}
               <button 
                 onClick={() => onSave(formData)}
                 className="mt-4 w-full py-2 bg-secondary text-white rounded-lg font-medium text-sm hover:opacity-90 transition-opacity"
               >
                 Save Preferences
               </button>
            </div>

            {/* Change Password */}
            <div className="bg-white dark:bg-card-dark rounded-xl shadow-sm p-6">
              <h3 className="font-bold text-lg mb-4 text-gray-900 dark:text-white">Change Password</h3>
              <form onSubmit={handlePasswordChange} className="space-y-3">
                <input 
                  type="password"
                  placeholder="Current Password"
                  value={passwordData.current}
                  onChange={e => setPasswordData({...passwordData, current: e.target.value})}
                  className="w-full p-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm outline-none focus:border-primary"
                />
                <input 
                  type="password"
                  placeholder="New Password"
                  value={passwordData.new}
                  onChange={e => setPasswordData({...passwordData, new: e.target.value})}
                  className="w-full p-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm outline-none focus:border-primary"
                />
                <input 
                  type="password"
                  placeholder="Confirm New Password"
                  value={passwordData.confirm}
                  onChange={e => setPasswordData({...passwordData, confirm: e.target.value})}
                  className="w-full p-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm outline-none focus:border-primary"
                />
                <button 
                  type="submit" 
                  disabled={!passwordData.current || !passwordData.new}
                  className="w-full py-2 bg-gray-800 dark:bg-gray-700 text-white rounded-lg font-medium text-sm hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  Update Password
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};