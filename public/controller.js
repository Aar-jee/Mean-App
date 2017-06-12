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
        $rootScope.token = $cookies.get('token');
        $rootScope.currentuser = $cookies.get('crntuser');
	}
    else{}
});

		app.controller('HomeController',function ($rootScope,$scope,$http,$timeout,$cookies){
			$scope.SumitArraydata = function(){
				$http.post('/conmanRoute',{anydata: $scope.ArraydataModel},
				{headers:{
					'authorization': $rootScope.token
				}}).then(function(){
					GetData();
					$scope.ArraydataModel = '';
					setTimeout(myReloadFunction, 3000);
				});
			};
			$scope.removeData = function(itemToDelete){
				$http.put('/conmanRoute/remove',{x:itemToDelete},
				{headers:{
				'authorization': $rootScope.token
				}}).then(function(){
					GetData();
				});
			};
					
			$scope.removeUser = function(itemToDelete){
				$http.put('/conmanUser/remove',{users:itemToDelete}).then(function(){
					GetData();
					GetUser();
				});
			};

			$scope.signin = function(){
				$http.put('/users/signin',{username: $scope.username, password: $scope.password}) //coming from the ng-model
				.then(
					function(res){
						if(typeof res == 'string')
						{alert(res);}
						else{
					$cookies.put('token',res.data.token);
                    $cookies.put('crntuser',$scope.username);
                     $rootScope.currentuser = $scope.username;
					 $rootScope.token = res.data.token;
					}
				}, function(err){
					alert('bad credentials');
				});
			};

            $scope.Logout = function(){
                 $cookies.remove("crntuser");
				 $cookies.remove("token");
                 $rootScope.currentuser = $cookies.get('crntuser');
				 $rootScope.token = $cookies.get('token');
                 $scope.username ="";
                 $scope.password = "";
			};
			
			function myReloadFunction() {
   			GetData();
			GetUser();
			$timeout(myReloadFunction, 3000);
				}
			function GetData(){
				$http.get('/conmanRoute').then(function(response){
				$scope.Arraydata = response.data;
				return $scope.Arraydata;
			});
		}
		$timeout(myReloadFunction, 3000);
		function GetUser(){
				$http.get('/conmanUser').then(function(response){
				$scope.Userdata = response.data;
				return $scope.Userdata;
			});
		}
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
