// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('ideaalCatering', ['ionic', 'ionizer-wooshop.controllers', 'ionizer-wooshop.services', 'common.services'])

.run(function($ionicPlatform) {
    //localStorage.clear();
    $ionicPlatform.ready(function() {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        }
        if (window.StatusBar) {
            // org.apache.cordova.statusbar required
            StatusBar.styleLightContent();
        }
    });
})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

    .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/menu.html',
    controller: 'AppCtrl'
  })

  .state('app.search', {
    url: '/search',
    views: {
      'menuContent': {
        templateUrl: 'templates/search.html'
      }
    }
  })

    .state('app.pakketen', {
      url: '/pakketen',
      views: {
        'menuContent': {
          templateUrl: 'templates/pakketen.html',
          controller: 'BrowseCtrl'
        }
      }
    })

    .state('app.drinken', {
      url: '/drinken',
      views: {
        'menuContent': {
          templateUrl: 'templates/drinken.html',
          controller: 'BrowseCtrl'
        }
      }
    })

    .state('app.welcome', {
      url: '/welcome',
      views: {
        'menuContent': {
          templateUrl: 'templates/welcome.html',
          controller: 'BrowseCtrl'
        }
      }
    })


    .state('app.zelfcombineren', {
      url: '/zelfcombineren',
      views: {
        'menuContent': {
          templateUrl: 'templates/zelf-combineren.html',
          controller: 'BrowseCtrl'
        }
      }
    })

    .state('app.grouppakketen', {
      url: '/grouppakketen',
      views: {
        'menuContent': {
          templateUrl: 'templates/group-pakketen.html',
          controller: 'BrowseCtrl'
        }
      }
    })

    .state('app.drankarrangement', {
      url: '/drankarrangement',
      views: {
        'menuContent': {
          templateUrl: 'templates/drankarrangement.html',
          controller: 'BrowseCtrl'
        }
      }
    })

  .state('app.verhuurproducten', {
      url: '/verhuurproducten',
      views: {
        'menuContent': {
          templateUrl: 'templates/verhuurproducten.html',
          controller: 'BrowseCtrl'
        }
      }
    })

    .state('app.bbq-planner', {
      url: '/bbq-planner',
      views: {
        'menuContent': {
          templateUrl: 'templates/bbq-planner.html',
          controller: 'BbqPlannerCtrl'
        }
      }
    })

  .state('app.single', {
    url: '/playlists/:playlistId',
    views: {
      'menuContent': {
        templateUrl: 'templates/playlist.html',
      }
    }
  });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/welcome');
});
