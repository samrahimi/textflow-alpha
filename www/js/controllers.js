angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout, $http) {
  

  //When the main view is loaded, get the available contexts 
  //and the user's preferred contexts from the server. 
  //Ya I know, $JS_GLOBALS would probably get me kicked out of Comp Sci 101


  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});

})
.controller('SettingsCtrl', function($scope){
    $scope.data= {
      context_id: $JS_GLOBALS.current_context.id || 'business'
    }

    $scope.contexts = $JS_GLOBALS.contexts

    //This gets called when user taps an item in the list of contexts
    $scope.onContextChanged = function(id) {
      $JS_GLOBALS.current_context_id = id
      $JS_GLOBALS.current_context = $JS_GLOBALS.contexts.filter
      (x => x.id == $JS_GLOBALS.current_context_id)[0]      
      console.log("New Context")
      console.log(JSON.stringify( $JS_GLOBALS.current_context, null, 2))
      //TODO: create a profile for each user (anonymouse / cookie based) and 
      //save tne results to mass storage / DB
    }
})
.controller('LabCtrl', function($scope, $ionicLoading, $http) {  

    $scope.loadConfig = function() {
      $http.get('/user/config/user').then(function successCallback(response) {
            $JS_GLOBALS.contexts = response.data.contexts
            $JS_GLOBALS.current_context_id = response.data.preferred_context_id
            $JS_GLOBALS.current_context = $JS_GLOBALS.contexts.filter
            (x => x.id == $JS_GLOBALS.current_context_id)[0]
            $scope.Context = $JS_GLOBALS.current_context.title
      });
    }

  $scope.Message = "";
  $scope.Ruleset="";
  $scope.PlaceHolderCSS = "";
  $scope.Context = "Loading...";
  $scope.showLoader = function() {$ionicLoading.show()}
  $scope.hideLoader = function() {$ionicLoading.hide()}

  //Load context from server if not already cached in the browser
  //$JS_GLOBALS is an app-wide cache.
  $scope.$on('$ionicView.enter', function(e) {
    if (!$JS_GLOBALS.current_context) {
      $scope.loadConfig()
    } else {
      $scope.Context = $JS_GLOBALS.current_context.title
    }
    //Reset the UI
    if ($scope.Graph) {$scope.Graph.remove()}
    $scope.PlaceHolderCSS = "display:block" 
    $scope.Summary = ""
    $scope.CTAText = ""
  })

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
          $JS_GLOBALS.results = response.data //For details view

          $ionicLoading.hide()
          $scope.PlaceHolderCSS = "display:none" //hacky hacky hacky
          $scope.Summary = response.data.advice.title
          $scope.Advice = response.data.advice.advice
          $scope.NormalizedScore = parseInt(response.data.aggregate_score)
          $scope.CTAText  = "Tap the circle above to see detailed results"
          var opts = {
            percent: $scope.NormalizedScore, 
            size: 150, 
            lineWidth:15, 
            rotate: 20,
            lineColor: response.data.advice.suggested_color
          }
          $scope.Graph = new CircleGraph(opts, document.getElementById('graph'))
          $scope.Graph.render() //Woohoo. Componentized a spaghetti script found on PasteBin.
      }, function errorCallback(response) {
          $ionicLoading.hide()
          console.log("Error posting to /messages")
      });

  }
})
.controller('DetailsCtrl', function($scope) {
  
    $scope.search = function(rawScores, query) {
      var results = []
      for (var r in rawScores) {
          if (rawScores[r].category == query) 
            results.push(rawScores[r])
      }
      return results
    }

    $scope.$on('$ionicView.enter', function(e) {
          if ($scope.Graph) {$scope.Graph.remove()}

          $scope.advice = $JS_GLOBALS.results.advice
          $scope.emotions = $scope.search($JS_GLOBALS.results.raw_scores, "Emotion Tone")
          $scope.big5 =   $scope.search($JS_GLOBALS.results.raw_scores, "Social Tone")
          $scope.NormalizedScore = parseInt($JS_GLOBALS.results.aggregate_score)
          var opts = {
            percent: $scope.NormalizedScore, 
            size: 150, 
            lineWidth:15, 
            rotate: 20,
            lineColor: $JS_GLOBALS.results.advice.suggested_color
          }
          $scope.Graph = new CircleGraph(opts, document.getElementById('graph2'))
          $scope.Graph.render() //Woohoo. Componentized a spaghetti script found on PasteBin.
    })
})