'use strict';


// Declare app level module which depends on filters, and services
var myApp = angular.module('myApp', ['myApp.filters', 'myApp.services', 'myApp.directives','ajoslin.mobile-navigate','ngMobile', 'ngResource'])
    .config(function ($compileProvider){
        $compileProvider.urlSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|tel):/);
    })
    .config(['$httpProvider', function($httpProvider){
        $httpProvider.defaults.useXDomain = true;
        delete $httpProvider.defaults.headers.common['X-Requested-With'];
    }])
    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/view1', {templateUrl: 'partials/notificationView.html'});
        $routeProvider.when('/view3', {templateUrl: 'partials/accelerometerView.html'});
        $routeProvider.when('/view4', {templateUrl: 'partials/deviceInfoView.html'});
        $routeProvider.when('/view7', {templateUrl: 'partials/compassView.html'});

        $routeProvider.when('/loginMain', {templateUrl: 'partials/loginMainView.html', controller: 'HomeCtrl'});
        $routeProvider.when('/login', {templateUrl: 'partials/loginView.html', controller: 'HomeCtrl'});

        $routeProvider.when('/signup', {templateUrl: 'partials/signUpView.html', controller: 'HomeCtrl'});
        $routeProvider.when('/tutorial', {templateUrl: 'partials/tutorialView.html', controller: 'HomeCtrl'});
        $routeProvider.when('/auth', {templateUrl: 'partials/authView.html', controller: 'HomeCtrl'});

        $routeProvider.when('/newmessage', {templateUrl: 'partials/newMessageView.html', controller: 'HomeCtrl'});
        $routeProvider.when('/map', {templateUrl: 'partials/mapView.html', controller: 'HomeCtrl'});

        $routeProvider.when('/home', {templateUrl: 'partials/homeView.html', controller: 'HomeCtrl'});
        $routeProvider.when('/inbox', {templateUrl: 'partials/inboxView.html', controller: 'HomeCtrl'});
        $routeProvider.when('/view2', {templateUrl: 'partials/geolocationView.html', controller: 'GeolocationCtrl'});
        $routeProvider.when('/view5', {templateUrl: 'partials/cameraView.html', controller: 'CameraCtrl'});
        $routeProvider.when('/contacts', {templateUrl: 'partials/contactsView.html', controller: 'ContactsCtrl'});
        $routeProvider.otherwise({redirectTo: '/loginMain'});
  }]);
