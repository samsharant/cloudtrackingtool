import React, { useEffect, useState } from 'react';

function ConfirmEmailPage() {
  const [secondsRemaining, setSecondsRemaining] = useState(7); // Start with 7 seconds

  useEffect(() => {
    // Set a timeout to redirect the 7 seconds
    const timeoutId = setInterval(() => {
      if (secondsRemaining > 0) {
        setSecondsRemaining(secondsRemaining - 1);
      } 
      else
        window.location.replace("/login"); 
    }, 1000); 

    // Clean up the timeout when the component unmounts
    return () => {
      clearTimeout(timeoutId);
    };
  }, [secondsRemaining]);

  return (
    <div>
      <h1>Please verify your email address</h1>
      <p>We sent a verification email to your email address.</p>
      {secondsRemaining > 0 && (
          <p>Redirecting in {secondsRemaining} seconds...</p>
        )}
    </div>
  );
}

export default ConfirmEmailPage;
