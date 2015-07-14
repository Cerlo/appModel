// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
var app = angular.module('starter', [
  'ionic',
  'ngCordova',
  'ionic.service.core',
  'ionic.service.push',
  'ionic.service.deploy',
  'starter.controllers',
   'starter.services'])

app.config(['$ionicAppProvider', function($ionicAppProvider, $ionicUser) {
  // Identify app
  $ionicAppProvider.identify({
    // The App ID (from apps.ionic.io) for the server
    app_id: 'My_API_ID',
    // The public API key all services will use for this app
    api_key: 'My_API_KEY',
    // The GCM project number
    gcm_id: 'GCM_ID'
    // Set the app to use development pushes
    //dev_push: true

  });
}])

app.run(function($ionicPlatform, $ionicUser, $cordovaDevice) {
  $ionicPlatform.ready(function() {


    /*uuid = $cordovaDevice.getUUID();
    $ionicUser.identify({
      user_id: uuid,
      name : 'ApplyModel12'
    });*/


    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleLightContent();
    }

    /* ------------------------------
    =============================================

      > PouchDB
        ----> Permet de commencer la synchro

    =============================================
    ------------------------------ */
    localDB.sync(remoteDB, {live: true});
    localDBCo.sync(remoteDBCo, {live: true});
  });
  
})
    /* ------------------------------
    =============================================

      > PouchDB -- Factory
        ----> Permet de verifier les données

    =============================================
    ------------------------------ */
app.factory('PouchDBListener', ['$rootScope', function($rootScope) {
 
    localDB.changes({
        continuous: true,
        onChange: function(change) {
            if (!change.deleted) {
                $rootScope.$apply(function() {
                    localDB.get(change.id, function(err, doc) {
                        $rootScope.$apply(function() {
                            if (err) console.log(err);
                            $rootScope.$broadcast('add', doc);
                        })
                    });
                })
            } else {
                $rootScope.$apply(function() {
                    $rootScope.$broadcast('delete', change.id);
                });
            }
        }
    });
    localDBCo.changes({
        continuous: true,
        onChange: function(change) {
            if (!change.deleted) {
                $rootScope.$apply(function() {
                    localDBCo.get(change.id, function(err, doc) {
                        $rootScope.$apply(function() {
                            if (err) console.log(err);
                            $rootScope.$broadcast('add', doc);
                        })
                    });
                })
            } else {
                $rootScope.$apply(function() {
                    $rootScope.$broadcast('delete', change.id);
                });
            }
        }
    });
 
    return true;
     
}]);
app.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

  // setup an abstract state for the tabs directive
    .state('tab', {
    url: "/tab",
    abstract: true,
    templateUrl: "templates/tabs.html",
  })

  // Each tab has its own nav history stack:

  .state('tab.dash', {
    url: '/dash',
    views: {
      'tab-dash': {
        templateUrl: 'templates/tab-dash.html',
        controller: 'DashCtrl'
      }
    }
  })

  .state('tab.events', {
      url: '/events',
      views: {
        'tab-events': {
          templateUrl: 'templates/tab-events.html',
          controller: 'EventsCtrl'
        }
      }
    })
    .state('tab.evt-detail', {
      url: '/events/:evtId',
      views: {
        'tab-events': {
          templateUrl: 'templates/evt-detail.html',
          controller: 'EvtDetailCtrl'
        }
      }
    })
    
    .state('tab.contact', {
      url: '/contact',
      views: {
        'tab-contact': {
          templateUrl: 'templates/tab-contact.html',
          controller: 'ContactCtrl'
        }
      }
    })

  .state('tab.account', {
    url: '/account',
    views: {
      'tab-account': {
        templateUrl: 'templates/tab-account.html',
        controller: 'AccountCtrl'
      }
    }
  });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/tab/dash');

});

