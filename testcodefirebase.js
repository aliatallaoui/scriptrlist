// Initialize Firebase
const firebaseConfig = {
    apiKey: "AIzaSyCnQ5wyjeqC3q1HCpP3YzNeBJfJRYlQnZg",
    authDomain: "rlist-63d21.firebaseapp.com",
    databaseURL: "https://rlist-63d21-default-rtdb.firebaseio.com",
    projectId: "rlist-63d21",
    storageBucket: "rlist-63d21.appspot.com",
    messagingSenderId: "416208685684",
    appId: "1:416208685684:web:9c673e48473a89905b9f21",
    measurementId: "G-6364B76KFR"
  };
  
  firebase.initializeApp(firebaseConfig);
  
  // Get the Firebase Auth instance
  const auth = firebase.auth();
  
  // Function to handle phone number verification
  const verifyPhoneNumber = () => {
    const phoneNumber = "0558139753"; // Replace with the phone number you want to verify
  
    const appVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container');
  
    // Send verification code to the user's phone number
    auth
      .signInWithPhoneNumber(phoneNumber, appVerifier)
      .then((confirmationResult) => {
        // SMS verification code sent successfully
        const verificationCode = window.prompt('Please enter the verification code sent to your phone number');
  
        // Verify the code entered by the user
        confirmationResult
          .confirm(verificationCode)
          .then((result) => {
            // Phone number authentication is successful
            console.log(result.user);
          })
          .catch((error) => {
            // Verification code entered is invalid
            console.error(error);
          });
      })
      .catch((error) => {
        // Unable to send verification code
        console.error(error);
      });
  };
  
  // Call the phone number verification function
  verifyPhoneNumber();
  