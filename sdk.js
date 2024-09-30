import {} from  "https://www.gstatic.com/firebasejs/10.13.1/firebase-app.js" ;
// Import `firebase-messaging` at the top
import {
    getMessaging,
    onMessage,
    isSupported,
    getToken,
  } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-messaging.js";
  import { isSupported as isSwSupported } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-messaging-sw.js";
  
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-app.js";

(async function (window) {
    if (!isSupported()) {
        return;
      } else if (!isSwSupported()) {
        return;
      } else if (window.Notification.permission === "denied") {
        return;
      } else {
        console.log({inside: "SDK"})
        const firebaseConfig = {
          // See https://firebase.google.com/docs/web/setup#add-sdks-initialize
          apiKey: "AIzaSyBqHomX-GSUzQOf9j6g3G4HNGTlQPtySdk",
        authDomain: "un-truc-de-jesus-carte.firebaseapp.com",
        projectId: "un-truc-de-jesus-carte",
        storageBucket: "un-truc-de-jesus-carte.appspot.com",
        messagingSenderId: "255170124059",
        appId: "1:255170124059:web:9b7818ec3f7e5b127b9bbe",
        measurementId: "G-E7R22DLZ61",
        };
    
         const app = initializeApp(
          firebaseConfig,
          "Give your APP a name, otherwise it will be '[DEFAULT]'"
        ); 
    
        const messaging = getMessaging(app);
    
        const registerServiceWorker = async () => {
            try {
              const swOptions = {
                type: "classic",
                scope: "/",
              };
        
              const sw = await window.navigator.serviceWorker.register(`/sw.js`, swOptions);
        
              return sw
                .update()
                .then((registration) => {
                  return registration;
                })
                .catch((error) =>
                  console.error("Can not update service worker", error)
                );
            } catch (error) {
              // Oops. Registration was unsucessfull
              console.error("Can not register service worker", error);
            }
          };
    
          const requestPermission = async (messaging) => {
            try {
              const permission = await window.Notification.requestPermission();
        
              if (permission === "granted") {
                const serviceWorkerRegistration = await registerServiceWorker();
        
                return getToken(messaging, {
                  serviceWorkerRegistration,
                  vapidKey: "BMsFehnpoVY7WSEW9Rjffbh8zMFKR_HC7sgGkjM0nE0tKMobiIyMo3t3e4JqRbPxIQeAYqpn-b7mYdhdRSmM1TM",
                })
                  .then((token) => {
                    // Generated a new FCM token for the client
                    // You can send it to server, e.g. fetch('your.server/subscribe', { token });
                    // And store it for further usages (Server, LocalStorage, IndexedDB, ...)
                    // For example:
                    
                    var copyText = document.getElementById("myInput");
                    copyText.innerText=token
                    window.localStorage.setItem("fcm_token", token);
                  })
                  .catch((err) => {
                    console.error("Unable to get FCM Token", err);
                  });
              } else {
                console.error("Unable to grant permission", permission);
              }
            } catch (error) {
              console.error("Unable to request permission", error);
            }
          };
    
          const checkIfTokenIsNotGeneratedBefore = () =>{
          const a =  !window.localStorage.getItem("fcm_token");
            return true;
          }
           
        
         
        
          if (checkIfTokenIsNotGeneratedBefore()) {
            await requestPermission(messaging);
          }
          
          var copyText = document.getElementById("myInput");
          copyText.innerText=window.localStorage.getItem("fcm_token");
         
           function myFunction() {
              navigator.clipboard.writeText(copyText.innerText);
              alert("Le texte à été copier")
            }
            var button =document.querySelector(".monbutton")
            button.addEventListener("click",  ()=>{
                myFunction()
               
            }) 
        
          const showNotification = (payload) => {
            const {
              // It's better to send notifications as Data Message to handle it by your own SDK
              // See https://firebase.google.com/docs/cloud-messaging/concept-options#notifications_and_data_messages
              data: { title, body, actionUrl, icon },
            } = payload;
        
            // See https://developer.mozilla.org/docs/Web/API/Notification
            const notificationOptions = {
              body,
              icon,
            };
            const notification = new window.Notification(title, notificationOptions);
        
            notification.onclick = (event) => {
              event.preventDefault(); // prevent the browser from focusing the Notification's tab
              window.open(actionUrl, "_blank").focus();
            };
          };
        
          // ...
        
          onMessage(messaging, (payload) => {
            showNotification(payload);
          });
      }

     

})(window);