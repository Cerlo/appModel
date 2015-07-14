var app = angular.module('starter.controllers', [])
//TODO-Change 


app.controller('DashCtrl', function($scope, $rootScope, $ionicUser, $ionicPush, $cordovaDevice, $window) {


    /* ------------------------------
  =============================================

    > PouchDB
      ----> Permet de commencer la synchro

  =============================================
  ------------------------------ */
  localDB.sync(remoteDB, {live: true});
  localDBCo.sync(remoteDBCo, {live: true});
  // Enum values
  $scope.eventTitle = "Prochain évènement";
  $scope.eventDescription = "Description de l\'évènement";
  $currentDate = new Date() / 1000;
  $nextEventDate =  0;
    
    /* ------------------------------
      > Get company values
    ------------------------------ */
    //TODO-Change the id by the id of the document
    localDBCo.get(globalCoID, {include_docs : true}).then(function (result) {
      $scope.coHomeName = result.title_co;
      $scope.coHomeDescription = result.description_co;
    }).catch(function (err) {
      console.log(err);
    });

// Identifies a user with the Ionic User service
  $scope.identifyUser = function() {
    console.log('Ionic User: Identifying with Ionic User service');
     uuid = $cordovaDevice.getUUID();
    var user = $ionicUser.get();
    if(!user.user_id) {
      // Set your user_id here, or generate a random one.
      user.user_id = uuid;
    };

    // Add some metadata to your user object.
    angular.extend(user, {
      name: 'Remy',
      bio: 'I come from planet Ion'
    });

    // Identify your user with the Ionic User Service
    $ionicUser.identify(user).then(function(){
      $scope.identified = true;
      //alert('Identified user ' + user.name + '\n ID ' + user.user_id);

    });

  };

  // Android device token?
  $rootScope.$on('$cordovaPush:tokenReceived', function(event, data) {
    //alert("Successfully registered token " + data.token);
    console.log('Got token', data.token, data.platform);
    window.localStorage.pushToken = data.token;
  });

  $scope.pushRegister = function() {
    console.log('Ionic Push: Registering user');

    // Register with the Ionic Push service.  All parameters are optional.
    $ionicPush.register({
      canShowAlert: true, //Should new pushes show an alert on your screen?
      canSetBadge: true, //Should new pushes be allowed to update app icon badges?
      canPlaySound: true, //Should notifications be allowed to play a sound?
      canRunActionsOnWake: true, // Whether to run auto actions outside the app,
      onNotification: function(notification) {
        // Handle new push notifications here
        // console.log(notification);
        return true;
      }
    }).then(function(deviceToken) {
      //Save the device token, if necessary
      $loginService.setDeviceToken(deviceToken)
    });
  };


  /* ------------------------------
    > Get all doccuments from Events db
  ------------------------------ */
  localDB.allDocs({include_docs : true}).then(function (result) {
      $tempVar = {
                id : "",
                title : "",
                date : "",
                description : "",
                duration : "",
                temps : "" 
                };


      /* ------------------------------
        > Browse result 
          to find the lower value
      ------------------------------ */
      for (var i = 0; i < result.rows.length; i++) {

        if(result.rows[i].doc.title && result.rows[i].doc.date && result.rows[i].doc.duration){

          splitFullDate =  result.rows[i].doc.date.split(" ");
          //alert(splitFullDate[0] + "-" + splitFullDate[1]);
          /* -----------------------------
            > splitDate format 
                  [0] = Days 
                  [1] = Month
                  [2] = Years

            > splitHours format
                  [0] = Hours
                  [1] = Min
          ------------------------------ */ 
          splitDate = splitFullDate[0].split("/");
          splitHours = splitFullDate[1].split("h");

          /* ------------------------------ 
            > getTime ind Date() parameters don't forget to replace
            "splitDate[1]"" by "splitDate[1]-1"
          ------------------------------ */
          getTime  = new Date(splitDate[2],splitDate[1]-1,splitDate[0],splitHours[0],splitHours[1]).getTime() / 1000;
          
          // Apply the duration of the event
          getTime = getTime + (result.rows[i].doc.duration*3600);
          //alert(getTime);
          
          $scope.nextEventDate = getTime;

            // Test if gettime is inferior than current date
            if ($scope.nextEventDate > $currentDate) {
              // If tempVar.temps is empty it get the getTime Value 
              if($tempVar.temps == ""){
                $tempVar.temps = getTime;
              }
              if ($scope.nextEventDate <= $tempVar.temps) {

                $tempVar.id = result.rows[i].doc._id;
                $tempVar.title = result.rows[i].doc.title;
                $tempVar.description = result.rows[i].doc.description;
                $tempVar.date = splitDate[0] + "/"+ splitDate[1] + "/"+ splitDate[2] + " à " + splitHours[0] + "h" + splitHours[1];
                $tempVar.duration = result.rows[i].doc.duration;


                // Calcul the difference between now and the next event 
                $tempVar.temps =  getTime;
                
                $scope.eventIsOver = "L\'evenement commence le : " + $tempVar.date;
                  //Informations aubout the Next Event
                $scope.nexteventName = $tempVar.title;
                $scope.nexteventDescription = $tempVar.description;
                $scope.eventDuration = $tempVar.duration + " heures";
                $nextEventDate = $tempVar.temps;
              };
            } else{
                //Informations aubout the Next Event
                $scope.nexteventName = "Pas d\'évènement ";
                $scope.nexteventDescription = "Pas de description d\'évènement ";
                //$scope.eventIsOver = "Pas d\'évènement ";
            };// end of getTime > $currentDate

          //};
        }; //end of result.rows[i].doc.title && result.rows[i].doc.date && result.rows[i].doc.duration
      }; // end of forloop

  /* ------------------------------
  =============================================

    > Gestion du compteur du dash board

  =============================================
  ------------------------------ */

$scope.$apply();
  $subdate = $nextEventDate - $currentDate;
    $(document).ready(function() {
        $('#countdown18').ClassyCountdown({
            theme: "flat-colors-very-wide",
            end: $.now() + $subdate,
          onEndCallback: function() {
            $scope.eventIsOver = "L\'evenement est passé! il n'y a pas d'autres event prevu";
          }
        });
    });
  }).catch(function (err) {
    console.log(err);
  });//end of localDB.alldocs

  /* ------------------------------
  =============================================

    > Rafraichissement de la page

  =============================================
  ------------------------------ */
  $rootScope.doRefresh = function() {
    
    setInterval(function(){
    console.log('Refreshing!');
      //simulate async response

    $window.location.reload(true);

      //Stop the ion-refresher from spinning
    $scope.$broadcast('scroll.refreshComplete');
    
    },500);
      
  };

})


app.controller('EventsCtrl', function($scope, Events, $ionicPopup, PouchDBListener) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  $scope.evtArray = [];
    /* ------------------------------
    =============================================

      > PouchDB
        ----> Ajoute le contenu de evtArray (base de données)
        ----> var.champsBDD -> accèe à la donnée

    =============================================
    ------------------------------ */
    $scope.$on('add', function(event, evt) {
      if (globalCoID != evt._id) {
        $scope.evtArray.push(evt);
      };
    });
    $scope.$on('delete', function(event, id) {
        for(var i = 0; i < $scope.evtArray.length; i++) {
            if($scope.evtArray[i]._id === id) {
                $scope.evtArray.splice(i, 1);
            }
        }
    });


})


app.controller('EvtDetailCtrl', function($scope, $stateParams) {

    /* ------------------------------
      > Fonctionnement: 
          get(id, inclureLesInfoDuDoc)....{
          Traitement liés à ce doc
          }
    ------------------------------ */
  localDB.get($stateParams.evtId, {include_docs : true}).then(function (result) {
    //alert(result.title);
    $scope.title = result.title;
    $scope.type = result.type;
    $scope.date = result.date;
    $scope.description = result.description;
    $scope.duration = result.duration;

  }).catch(function (err) {
    console.log(err);
  });
})


app.controller('ContactCtrl', function($scope) {

  /* ------------------------------
    > Get company values
  ------------------------------ */
  //TODO-Change the id of the compani document by the new
  localDBCo.get(globalCoID, {include_docs : true}).then(function (result) {
      $scope.coName = result.title_co;
      $scope.coDescription = result.description_co;
      $scope.coAddress = result.address_co;
      $scope.coEMail = result.mail_co;
      $scope.coSocial = result.social_co;
      $scope.coTel = result.tel_co;
      //refresh the scope
      $scope.$apply();
  }).catch(function (err) {
    console.log(err);
  });


})

app.controller('AccountCtrl', function($scope, PouchDBListener, $rootScope, $ionicUser, $ionicPush, $window) {


  localDB.sync(remoteDB, {live: true});
  localDBCo.sync(remoteDBCo, {live: true});
    $scope.myError;
    $scope.myVar = false;
    $scope.myOpVar = true;
    $scope.addValue = true;
    $scope.coHideForm = true;
    $scope.addEventForm = true;
    $scope.delEventForm = true;

  /* ------------------------------
  =============================================

    > Hide elements

  =============================================
  ------------------------------ */
    $scope.toggle = function() {
        $scope.myVar = !$scope.myVar;
        $scope.myOpVar = !$scope.myOpVar;
    };
    $scope.reset =  function(){
      $scope.myVar = !$scope.myVar;
    };
      /* ------------------------------
      =============================================

        > Connexion

      =============================================
      ------------------------------ */
    $scope.connect = function (username, password) {

      // simulate  connexion
      if(/*username == "test" && password == "01"*/true){
        $scope.toggle();
        $scope.myError = "Connection avec succes";
      }
      else{
        $scope.myError = "Les information ne correspondent pas";
      };

    };


    /* ------------------------------
      =============================================

        > Create an event

      =============================================
      ------------------------------ */
    $scope.createEvent = function(evtTitle, evtDescription, evtDate, evtHour, evtMin, evtDuration) {

      evtDate = evtDate + " " + evtHour + "h" + evtMin;
      localDB.post({
            type: "event",
            title: evtTitle,
            date: evtDate,
            description : evtDescription,
            duration: evtDuration
        }).then(function (response) {
          $scope.myDataAdded = "L\'evenement a correctement ete ajoute";
          //Syncro the bdd
          localDB.sync(remoteDB, {live: true});
          $scope.evtTitle = "";
          $scope.evtDescription = "";
          $scope.evtDate = "";
          $scope.evtHour = "";
          $scope.evtMin = "";
          $scope.evtDuration = "";
          $scope.addEventForm = !$scope.addEventForm;
        }).catch(function (err) {
          console.log(err);
        });
    };

    $scope.addEvent = function(){
        //$scope.create();

          $scope.addEventForm = !$scope.addEventForm;
          // editValue
        if (!$scope.coHideForm == true) {
          $scope.coHideForm = !$scope.coHideForm;
        };
        if ($scope.delEventForm == false) {
          $scope.delEventForm = !$scope.delEventForm;
        };
    };


      /* ------------------------------
      =============================================

        > Del an event

      =============================================
      ------------------------------ */
      /* ------------------------------
    =============================================

      > List all the event

    =============================================
    ------------------------------ */
    $scope.evtArray = [];
    localDB.allDocs({include_docs: true}).then(function (result) {

        $scope.evtArray = result.rows;
    }).catch(function (err) {
      console.log(err);
    });

    $scope.delEventFormHide = function() {

        $scope.delEventForm = !$scope.delEventForm;
        if (!$scope.coHideForm == true) {
          $scope.coHideForm = !$scope.coHideForm;
        };
        if (!$scope.addEventForm == true) {
          $scope.addEventForm = !$scope.addEventForm;
        };
    };
    $scope.delEvent = function(id, titleToDel){

      var deleteUser = $window.confirm('Etes vous sur de vouloir supprimer l\'evenment? "'+ titleToDel + '" ?');
      if (deleteUser) {
        localDB.get(id).then(function(doc) {
          return localDB.remove(doc._id, doc._rev);
        }).then(function (result) {
          //refresh the view
          alert("Suppression de l'élément portant l'id : "+ result.id);
          $window.location.reload(true);
          $scope.delEventForm = !$scope.delEventForm;
          localDB.sync(remoteDB, {live: true});
        }).catch(function (err) {
          console.log(err);
        });
      };
    };


    /* ------------------------------
      =============================================

        > Modify Company

      =============================================
      ------------------------------ */
    /* ------------------------------
      > Get company values
    ------------------------------ */
    //TODO-Change the id of the compani document by the new
    localDBCo.get(globalCoID, {include_docs : true}).then(function (result) {
        $scope.coDelAddress = result.address_co;
        $scope.coDelEMail = result.mail_co;
        $scope.coDelSocial = result.social_co;
        $scope.coDelTel = result.tel_co;
        $scope.coDelName = result.title_co;
        $scope.coDelDescription = result.description_co;
    }).catch(function (err) {
      console.log(err);
    });

    // editValue
    $scope.editCompanyInfos = function(){
        $scope.coHideForm = !$scope.coHideForm;

        if (!$scope.addEventForm == true) {
          $scope.addEventForm = !$scope.addEventForm;
        };
        if ($scope.delEventForm == false) {
        $scope.delEventForm = !$scope.delEventForm;
        };
    };
    $scope.saveEditedValues = function(coDelName, coDelDescription, coDelAddress, coDelTel, coDelEMail, coDelSocial){
      /* ------------------------------
      =============================================

        > Update company's infos

      =============================================
      ------------------------------ */
      // TODO-Change the id by the id of the document
      localDBCo.upsert(globalCoID, function (doc) {
        doc.title_co = coDelName;
        doc.description_co = coDelDescription;
        doc.address_co = coDelAddress;
        doc.mail_co = coDelEMail;
        doc.tel_co = coDelTel;
        return doc;
      }).then(function (res) {
      }).catch(function (err) {
        console.log(err);
      });
        $scope.coHideForm = !$scope.coHideForm;
        $scope.myDataCoEdited = "Modification des informations de l\'entreprise : OK";
        localDBCo.sync(remoteDBCo, {live: true});
    };
});
