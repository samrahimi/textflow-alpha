angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/context-picker.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeSettings = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.openSettings = function() {
    $scope.modal.show();
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);

    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function() {
      $scope.closeLogin();
    }, 1000);
  };
})
.controller('SettingsCtrl', function($scope){
    $scope.data= {
      context_name:'Dating &amp; Relationships'
    }

    //TODO: Get thee to a database! And same with the rules.json
    $scope.contexts = [
        {
        id:'dating.self',
        title: 'Dating &amp; Relationships'
        },
        {
          id:'business.general',
          title: 'Business Communications'
        }    
      ]
})
.controller('LabCtrl', function($scope, $ionicLoading, $http) {
  $scope.Message = "";
  $scope.Ruleset="";
  $scope.PlaceHolderCSS = "";
  $scope.showLoader = function() {$ionicLoading.show()}
  $scope.hideLoader = function() {$ionicLoading.hide()}
  $scope.evaluate=function() {
    $ionicLoading.show()
    $http.post('/messages', 
      {
          message:this.Message,
          context: {
            ruleset_id: 'business.general',
            algorithm: 'jung'
          }
      }).then(function successCallback(response) {
          $ionicLoading.hide()
          $scope.PlaceHolderCSS = "display:none" //hacky hacky hacky
          $scope.Summary = response.data.advice.title
          $scope.Advice = response.data.advice.advice
          $scope.NormalizedScore = parseInt(response.data.aggregate_score)
          var opts = {
            percent: $scope.NormalizedScore, 
            size: 150, 
            lineWidth:15, 
            rotate: 20,
            lineColor: response.data.advice.suggested_color
          }
          var graph = new CircleGraph(opts, document.getElementById('graph'))
          graph.render() //Woohoo. Componentized a spaghetti script found on PasteBin.
      }, function errorCallback(response) {
          $ionicLoading.hide()
          console.log("Error posting to /messages")
      });

  }
})