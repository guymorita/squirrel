'use strict';

/* Controllers */

function LoginCtrl($scope, navSvc, $resource, userService){
  $scope.slidePage = function (path,type) {
    navSvc.slidePage(path,type);
  };
  $scope.username = '';
  $scope.password = '';
  $scope.fetch = function(){
    var User = $resource('http://0.0.0.0\\:8080/user/login/:username/:password');
    var user = User.get({username:$scope.username, password:$scope.password}, function(u, getResHeaders){
      console.log('u', u);
      userService.setUser(u);
      $scope.slidePage('/newmessage');
    });
  };
}

function SignUpCtrl($scope, navSvc, $resource, userService){
  console.log($resource)
  $scope.slidePage = function (path,type) {
    navSvc.slidePage(path,type);
  };
  $scope.username = '';
  $scope.password = '';
  $scope.fetch = function(){
    var User = $resource('http://0.0.0.0\\:8080/user/new/:username/:password');
    var user = User.get({username:$scope.username, password:$scope.password}, function(u, getResHeaders){
      console.log('u', u);
      userService.setUser(u);
      $scope.slidePage('/newmessage');
    });
  };
}

function HomeCtrl($scope,navSvc,$rootScope, userService) {
    $rootScope.showSettings = false;
    $scope.user = userService.currentUser;
    $scope.slidePage = function (path,type) {
        $('#map').remove();
        navSvc.slidePage(path,type);
    };
    $scope.back = function () {
        navSvc.back();
    };
    $scope.changeSettings = function () {
        $rootScope.showSettings = true;
    };
    $scope.closeOverlay = function () {
        $rootScope.showSettings = false;
    };
}

function NewMessage($scope, navSvc, userService, hatchService){
  $scope.title = '';
  $scope.content = '';
  $scope.hidden = false;
  $scope.next = function(path){
    hatchService.set['title'] = $scope.title;
    hatchService.set['content'] = $scope.content;
    hatchService.set['hidden'] = $scope.hidden;
    navSvc.slidePage(path);
  }
}

var newPinCtrl = function($scope, navSvc, $rootScope, hatchService) {
  $scope.slidePage = function (path,type) {
    navSvc.slidePage(path,type);
    $('#map').remove();
  };

  $scope.locationObj = {}
  var markerCreated = false;
  var newMap = new Map();

  $scope.onMapClick = function(e) {
    if (!markerCreated){
      var marker = new L.marker(e.latlng);
      marker.addTo(newMap.map)
        .dragging.enable()
       $scope.locationObj = {
        latlng: {
          lat: e.latlng.lat,
          lng: e.latlng.lng
        }
       }
      hatchService.set['locationObj'] = $scope.locationObj;
      marker.on('dragend', function(e){
        $scope.locationObj = {
          latlng: {
            lat: e.target._latlng.lat,
            lng: e.target._latlng.lng
          }
        }
      hatchService.set['locationObj'] = $scope.locationObj;
      });
      markerCreated = true;
    }  
  }
  newMap.map.on('click', $scope.onMapClick);
};

var showPinsCtrl = function($scope,navSvc,$rootScope) {
  $scope.slidePage = function (path,type) {
    $('#map').remove();
    navSvc.slidePage(path,type);
  };

  var pinMap = new Map();

  var test = {
    0: {
      _id: 0,
      latlng: {
        lat: 37.75599059794776,
        lng: -122.41307973861694
      },
      message: 'helllooo'    
    },
    1: {
      _id: 1,
      latlng: {
        lat: 37.75398870275125,
        lng: -122.40359544754028
      },
      message: 'shalom'
    },
    2: {
      _id: 2,
      latlng: {
        lat: 37.75656740515542,
        lng: -122.40295171737671
      },
      message: 'wazzza'
    }
  }

  var myLocationCreated = false;
  var circle;
  var onLocationFound = function(e) {
    if (myLocationCreated){
      $(circle._container).remove()
    }
    myLocationCreated = true;
    var radius = 50;
    circle = L.circle(e.latlng, radius).addTo(pinMap.map);
  }

  pinMap.map.on('locationfound', onLocationFound);

  setInterval(function(){
    pinMap.map.locate({setView: false});
  }, 3000);

  for (var pin in test) {
    var testmarker = new L.marker(test[pin].latlng);
    testmarker.addTo(pinMap.map);
    testmarker.bindPopup(test[pin].message);
  }
};

function NotificationCtrl($scope) {
    $scope.alertNotify = function() {
        navigator.notification.alert("Sample Alert",function() {console.log("Alert success")},"My Alert","Close");
    };

    $scope.beepNotify = function() {
        navigator.notification.beep(1);
    };

    $scope.vibrateNotify = function() {
        navigator.notification.vibrate(3000);
    };

    $scope.confirmNotify = function() {
        navigator.notification.confirm("My Confirmation",function(){console.log("Confirm Success")},"Are you sure?",["Ok","Cancel"]);
    };
}

function GeolocationCtrl($scope,navSvc,$rootScope) {
    navigator.geolocation.getCurrentPosition(function(position) {
        $scope.position=position;
        $scope.$apply();
        },function(e) { console.log("Error retrieving position " + e.code + " " + e.message) });

    $scope.back = function () {
        navSvc.back();
    };
}

function DeviceCtrl($scope) {
    $scope.device = device;
}

function ContactsCtrl($scope) {
    $scope.find = function() {
        $scope.contacts = [];
        var options = new ContactFindOptions();
        //options.filter=""; //returns all results
        options.filter=$scope.searchTxt;
        options.multiple=true;
        var fields = ["displayName", "name", "phoneNumbers"];
        navigator.contacts.find(fields,function(contacts) {
            $scope.contacts=contacts;
            $scope.$apply();
        },function(e){console.log("Error finding contacts " + e.code)},options);
    }
}

function CameraCtrl($scope) {
    $scope.takePic = function() {
        var options =   {
            quality: 50,
            destinationType: Camera.DestinationType.DATA_URL,
            sourceType: 1,      // 0:Photo Library, 1=Camera, 2=Saved Photo Album
            encodingType: 0     // 0=JPG 1=PNG
        }
        // Take picture using device camera and retrieve image as base64-encoded string
        navigator.camera.getPicture(onSuccess,onFail,options);
    }
    var onSuccess = function(imageData) {
        console.log("On Success! ");
        $scope.picData = "data:image/jpeg;base64," +imageData;
        $scope.$apply();
    };
    var onFail = function(e) {
        console.log("On fail " + e);
    };
}



