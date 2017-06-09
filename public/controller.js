var app = angular.module('conman',['ngRoute','ngCookies']);

	app.config(function($routeProvider) {
  $routeProvider
  .when("/", {
    templateUrl : 'home.html',
	controller: 'HomeController'
  })
  .when("/signup", {
    templateUrl : 'signup.html',
	controller: 'SignupController'
  });
});

app.run(function($rootScope,$cookies){
    if($cookies.get('crntuser')){
        //$rootScope.token = $cookies.get('token');
        $rootScope.currentuser = $cookies.get('crntuser');
    }
    else{}
});

		app.controller('HomeController',function ($rootScope,$scope,$http,$timeout,$cookies){
			$scope.SumitArraydata = function(){
				$http.post('/conmanRoute',{anydata:$scope.ArraydataModel}).then(function(){
					GetData();
					$scope.ArraydataModel = '';
					setTimeout(myReloadFunction, 3000);
				});
			};
			$scope.removeData = function(itemToDelete){
				$http.put('/conmanRoute/remove',{x:itemToDelete}).then(function(){
					GetData();
				});
			};

			$scope.signin = function(){
				$http.put('/users/signin',{username: $scope.username, password: $scope.password}) //coming from the ng-model
				.then(function(res){
					console.log(res.data.token);
                    //$cookies.put('token',res.data.token);
                    $cookies.put('crntuser',$scope.username);
                     //$rootScope.token = res.data.token;
                     $rootScope.currentuser = $scope.username;
                   alert('successfully signed in');
				}, function(err){
					alert('bad credentials');
				});
			};

            $scope.Logout = function(){
                 console.log('logout me aaya');
                 $cookies.remove("crntuser");
                 $rootScope.currentuser = $cookies.get('crntuser');
                 $scope.username ="";
                 $scope.password = "";
			};
			
			function myReloadFunction() {
   			GetData();
			$timeout(myReloadFunction, 3000);
				}
			function GetData(){
				$http.get('/conmanRoute').then(function(response){
				$scope.Arraydata = response.data;
				return $scope.Arraydata;
			});
		}
		$timeout(myReloadFunction, 3000);
	});
	
	app.controller('SignupController',function ($scope,$http){
		$scope.submitSignup = function()
		{
			var newUser = {
             username: $scope.user,
			 password : $scope.pass
			};
		
				$http.post('/users',newUser).then(function(){
				alert('success');
				});
			
		}
	});
