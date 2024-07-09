import React, { useState } from 'react';
import axios from 'axios';

const App = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [accountId, setAccountId] = useState('');
  const [accountLinkUrl, setAccountLinkUrl] = useState('');

  const handleSignup = async () => {
    try {
      const response = await axios.post('http://localhost:3000/create-connected-account', {
        first_name: firstName,
        last_name: lastName,
        email: email,
        business_name: businessName,
      });
      setAccountId(response.data.accountId);
    } catch (error) {
      console.error('Error creating connected account:', error);
    }
  };

  const handleCreateAccountLink = async () => {
    try {
      const response = await axios.post('http://localhost:3000/create-account-link', {
        accountId: accountId,
      });
      setAccountLinkUrl(response.data.url);
    } catch (error) {
      console.error('Error creating account link:', error);
    }
  };

  return (
    <div>
      <h1>Sign Up</h1>
      <input
        type="text"
        placeholder="First Name"
        value={firstName}
        onChange={(e) => setFirstName(e.target.value)}
      />
      <input
        type="text"
        placeholder="Last Name"
        value={lastName}
        onChange={(e) => setLastName(e.target.value)}
      />
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="text"
        placeholder="Business Name"
        value={businessName}
        onChange={(e) => setBusinessName(e.target.value)}
      />
      <button onClick={handleSignup}>Create Connected Account</button>

      {accountId && (
        <div>
          <p>Account ID: {accountId}</p>
          <button onClick={handleCreateAccountLink}>Create Account Link</button>
        </div>
      )}

      {accountLinkUrl && (
        <div>
          <a href={accountLinkUrl} target="_blank" rel="noopener noreferrer">
            Complete Onboarding
          </a>
        </div>
      )}
    </div>
  );
};

export default App;
