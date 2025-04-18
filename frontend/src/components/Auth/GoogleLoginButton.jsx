import React from 'react';

const API_BASE_URL = process.env.NODE_ENV === 'development'
  ? 'http://localhost:3000'
  : 'https://diet-maker-d07eb3099e56.herokuapp.com';

const GoogleLoginButton = () => {
  const handleGoogleLogin = () => {

    sessionStorage.setItem('auth_started', new Date().getTime());

    const googleAuthUrl = `${API_BASE_URL}/users/auth/google_oauth2?origin=${encodeURIComponent(window.location.origin)}&ts=${Date.now()}`;

    window.location.href = googleAuthUrl;
  };

  return (
    <button
      onClick={handleGoogleLogin}
      className="google-login-button"
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '10px 15px',
        background: 'white',
        border: '1px solid #ccc',
        borderRadius: '4px',
        fontWeight: 'bold',
        color: '#444',
        cursor: 'pointer',
        width: '100%',
        margin: '10px 0',
        marginLeft: 'auto',
        marginRight: 'auto'
      }}
    >
      <img
        src="https://developers.google.com/identity/images/g-logo.png" 
        alt="Google logo"
        style={{
          width: '18px',
          height: '18px',
          marginRight: '10px'
        }}
      />
      Googleでログイン
    </button>
  );
};

export default GoogleLoginButton;