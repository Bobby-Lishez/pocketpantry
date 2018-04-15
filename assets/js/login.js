

// Initialize Firebase
var config = {
    apiKey: "AIzaSyDdKJdKWyBww3paQE--cB_cF8SPa-FJn3c",
    authDomain: "kitchenkit-bf8b5.firebaseapp.com",
    databaseURL: "https://kitchenkit-bf8b5.firebaseio.com",
    projectId: "kitchenkit-bf8b5",
    storageBucket: "kitchenkit-bf8b5.appspot.com",
    messagingSenderId: "44047573836"
    };
    firebase.initializeApp(config);
    
    //
    // login/authentication setion of firebase
    //
    //
    //
    
    var uiConfig = {
        signInSuccessUrl: "kitchen.html",
        signInOptions: [
          // Leave the lines as is for the providers you want to offer your users.
          firebase.auth.EmailAuthProvider.PROVIDER_ID
        ],
        // Terms of service url.
        tosUrl: '<your-tos-url>'
      };
    
      // Initialize the FirebaseUI Widget using Firebase.
      var ui = new firebaseui.auth.AuthUI(firebase.auth());
      // The start method will wait until the DOM is loaded.
      ui.start('#firebaseui-auth-container', uiConfig);
    
    
      //Auth Check & User Log
        firebase.auth().onAuthStateChanged(function(user) {
         
         user == user;
    
         console.log('user', 'authStateChanged', user);
       });
    
      // User Signout
         $("#logout").click(function() {
           firebase.auth().signOut().then(function() {
         // Sign-out successful.
           window.location.replace("index.html");
           }).catch(function(error) {
         // An error happened.
           console.log('Logout Error');
           });
        });
    
        
