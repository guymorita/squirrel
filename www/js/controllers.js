'use strict';

/* Controllers */

function LoginCtrl($scope, navSvc, $resource, userService){
  $scope.slidePage = function (path,type) {
    navSvc.slidePage(path,type);
  };
  $scope.username = '';
  $scope.password = '';
  $scope.fetch = function(){
    var Users = $resource('http://oaktree.nodejitsu.com/user/');
    var User = $resource('http://oaktree.nodejitsu.com/user/login/:username/:password');
    User.get({username:$scope.username, password:$scope.password}, function success(u, getResHeaders){
      console.log('u', u);
      userService.setUser(u);
      var users = Users.get({}, function(users){
        console.log('users', users);
        userService.setAllUsers(users);
      });

      $scope.slidePage('/newmessage');
    }, function error(u){
      console.log('err u', u);
    });
  };
}

function SignUpCtrl($scope, navSvc, $resource, userService){
  $scope.slidePage = function (path,type) {
    navSvc.slidePage(path,type);
  };
  $scope.username = '';
  $scope.password = '';
  $scope.fetch = function(){
    var Users = $resource('http://oaktree.nodejitsu.com/user/');
    var User = $resource('http://oaktree.nodejitsu.com/user/new/:username/:password');
    User.get({username:$scope.username, password:$scope.password}, function(u, getResHeaders){
      console.log('u', u);
      userService.setUser(u);
      var users = Users.get({}, function(users){
        console.log('users', users);
        userService.setAllUsers(users);
      });
      $scope.slidePage('/newmessage');
    }, function error(u){
      console.log('err u', u);
    });
  };
}

function FriendsListCtrl($scope, $filter, navSvc, $resource, userService, hatchService, $http){
  $scope.slidePage = function (path,type) {
    navSvc.slidePage(path,type);
  };
  $scope.updateFriendList = function(){
    _.each(userService.currentUser.friends, function(userObj, key){
      userObj['checked'] = false;
    });
    $scope.friends = userService.currentUser.friends;
  };
  $scope.allUsers = userService.allUsers;
  $scope.selectedFriends = $filter('filter')($scope.friends, {checked:true});
  var receiverIds = [];
  $scope.send = function(){
    // build the object
    hatchService.set('sender_id', userService.currentUser._id);
    _.each($filter('filter')($scope.friends, {checked:true}), function(value){
      receiverIds.push(value._id);
    });
    hatchService.set('receiver_ids', receiverIds);
    console.log('hatch', hatchService.hatchObject);
    $http.post('http://oaktree.nodejitsu.com/message/', hatchService.hatchObject)
      .success(function(data, status, headers, config){
        console.log('data', data);
      }).error(function(data, status){
        console.log('err data', data);
        console.log('err status', status);
      });
  };
}

function InboxCtrl($scope, $filter, navSvc, $resource, userService){
  $scope.slidePage = function (path,type) {
    navSvc.slidePage(path,type);
  };
  $scope.messages = userService.allMessages;
  $scope.getMessages = function(){
    var Messages = $resource('http://oaktree.nodejitsu.com/message/retrieve/:user_id/', {}, { 'rec': {method: 'GET', isArray: true } });
    Messages.get({user_id:userService.currentUser._id}, function success(u, getResHeaders){
      console.log('retrieving messages for user_id', userService.currentUser._id, u);
      userService.setMessages(u);
      $scope.messages = u;
    }, function error(err, getRes){
      console.log('err', err);
      console.log('getRes', getRes);
    });
  }
}

function messageRead($scope, navSvc, userService){
  $scope.message = userService.allMessages[userService.currentRead];

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
    hatchService.set('title', $scope.title);
    hatchService.set('content', $scope.content);
    hatchService.set('hidden', $scope.hidden);
    navSvc.slidePage(path);
  };
}

var newPinCtrl = function($scope, navSvc, $rootScope, hatchService) {
  $scope.slidePage = function (path,type) {
    navSvc.slidePage(path,type);
    $('#map').remove();
  };

  $scope.latlng = {}
  var markerCreated = false;
  var newMap = new Map();

  $scope.onMapClick = function(e) {
    if (!markerCreated){
      var marker = new L.marker(e.latlng);
      marker.addTo(newMap.map)
        .dragging.enable()
       $scope.latlng = {
          lat: e.latlng.lat,
          lng: e.latlng.lng
       }
      hatchService.set('latlng', $scope.latlng);
      marker.on('dragend', function(e){
        $scope.latlng = {
          lat: e.target._latlng.lat,
          lng: e.target._latlng.lng
        }
      hatchService.set('latlng', $scope.latlng);
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


function ContactsCtrl($scope, userService, $resource) {
    $scope.allUsers = userService.allUsers;
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
    };
    $scope.addUser = function(userSend){
      var addUser = $resource('http://oaktree.nodejitsu.com/user/invite/:sender_id/:receiver_id');
      addUser.get({sender_id: userService.currentUser._id, receiver_id: userSend._id}, function(u, getResHeaders){
        console.log('u', u);
      });
    };
};

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



