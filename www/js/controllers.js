angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout) {
  
  //The current context, sent to the server with each message
  $JS_GLOBALS.current_context = {
        id:'dating.self',
        title: 'Social / Dating'
        }
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});

})
.controller('SettingsCtrl', function($scope){
    $scope.data= {
      context_id: $JS_GLOBALS.current_context.id
    }

    //TODO: Get thee to a database! And same with the rules.json
    $scope.contexts = [
        {
        id:'dating.self',
        title: 'Dating / Relationships'
        },
        {
          id:'business.general',
          title: 'Business Communications'
        }    
      ]

    $scope.onChange = function(item) {
      $JS_GLOBALS.current_context = item
      console.log("New Context")
      console.log(JSON.stringify($JS_GLOBALS.current_context, null, 2))
    }
})
.controller('LabCtrl', function($scope, $ionicLoading, $http) {
  $scope.Message = "";
  $scope.Ruleset="";
  $scope.PlaceHolderCSS = "";
  $scope.current_context = $JS_GLOBALS.current_context;
  $scope.showLoader = function() {$ionicLoading.show()}
  $scope.hideLoader = function() {$ionicLoading.hide()}
  $scope.evaluate=function() {
    $ionicLoading.show()
    $http.post('/messages', 
      {
          message:this.Message,
          context: {
            ruleset_id: $JS_GLOBALS.current_context.id,
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