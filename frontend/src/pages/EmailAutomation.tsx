// src/pages/EmailAutomation.tsx
import { useState } from 'react';

export default function EmailAutomation() {
  const [emailText, setEmailText] = useState('');
  const [category, setCategory] = useState('');

  const handleSubmit = async () => {
    const response = await fetch('http://127.0.0.1:8000/categorize-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email_text: emailText }),
    });
    const data = await response.json();
    setCategory(data.category);
  };

  return (
    <div> 
      <textarea
        value={emailText}
        onChange={(e) => setEmailText(e.target.value)}
      />
      <button onClick={handleSubmit}>Categorize Email</button>
      {category && <p>Category: {category}</p>}
    </div>
  );
}