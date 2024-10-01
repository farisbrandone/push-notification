importScripts(
    "https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js"
  );
  importScripts(
    "https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js"
  );

  (function (self) {
    let messaging;
  
    const firebaseConfig = {
        apiKey: "AIzaSyBqHomX-GSUzQOf9j6g3G4HNGTlQPtySdk",
        authDomain: "un-truc-de-jesus-carte.firebaseapp.com",
        projectId: "un-truc-de-jesus-carte",
        storageBucket: "un-truc-de-jesus-carte.appspot.com",
        messagingSenderId: "255170124059",
        appId: "1:255170124059:web:9b7818ec3f7e5b127b9bbe",
        measurementId: "G-E7R22DLZ61",
    };
  
    firebase.initializeApp(firebaseConfig);
    messaging = firebase.messaging();
   const  PREFIX ="PAPA"
   

    self.addEventListener('install', (event)=>{
        self.skipWaiting();
        /**n'attent pas que les autres process
         * soit stopé, stop l'est toi meme
      
         */
        /** pour que le nouveau worker remplace 
         * l'ancien tout de suite */
     /**considérer l'installation terminer que lorsque cidessous est terminer */
        event.waitUntil((async ()=>{
             /**mise en cache de la page offline */
             const cache = await caches.open(PREFIX)
             /**met en cache la reponse de la requetes /offline */
            
        })()
    
    )
    
        console.log(`${PREFIX} Install`)
    })

    self.addEventListener('activate', (event)=>{
      /**lorsque tu t'active tu doit automatiquement
       * prendre le controle de la page
       */
       clients.claim();
  
  
       /**vider les autres caches avnt moi */
       event.waitUntil((async ()=>{
             /**récupération des clé associer au cache */
             const keys = await caches.keys()
     await Promise.all( keys.map((key)=>{
      if (!key.includes(PREFIX)){
          return caches.delete(key)
      }
     }))   
     
      console.log(`${PREFIX} Active`);
  })()
       )
  })


    self.addEventListener("push", async function (event) {
        const message = event.data.json();
        console.log({message})
        console.log({premier:"first console"})
        messaging.onBackgroundMessage(async (payload) => {
            console.log(payload)
          const {
            notification: { title, body, actionUrl, icon },
          } = payload;
         
          console.log({ title, body, actionUrl, icon })
          const notificationOptions = {
            body,
            icon,
            data: {
              actionUrl,
            },
          };
    
          const promiseChain = new Promise((resolve) => {
            self.registration
              .showNotification(title, notificationOptions)
              .then(() => resolve());
          });
    
          event.waitUntil(promiseChain);
        });
      });

      self.addEventListener("notificationclick", (event) => {
        const { notification } = event;
        const {
          data: { actionUrl },
        } = notification;
    
        event.notification.close();
    
        event.waitUntil(
          clients
            .matchAll({ type: "window", includeUncontrolled: true })
            .then((clientsArr) => {
              // If a Window tab matching the targeted URL already exists, focus that;
              const hadWindowToFocus = clientsArr.some((windowClient) => {
               if( windowClient.url === actionUrl){
                console.log("django")
                windowClient.focus()
                return true
               }
              });
    
              // Otherwise, open a new tab to the applicable URL and focus it.
              if (!hadWindowToFocus) {
                return clients.openWindow(actionUrl);
              }
            })
        );
      });


  })(self);


 