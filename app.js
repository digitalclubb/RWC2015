(function() {
	'use strict';

	var app = angular.module('rwc', [ 'ngRoute', 'angular.filter' ]);

	// ngRoute to apply page and partial routing
	app.config(['$routeProvider', function( $routeProvider ) {
		
		$routeProvider
		.when('/teams', {
            templateUrl : 'team-list.html',
            controller  : 'Teams'
        })
		.when('/team/:teamId', {
			templateUrl: 'team-detail.html',
			controller: 'Squad'
		})
		.when('/fixtures', {
            templateUrl : 'fixtures.html',
            controller  : 'Matches'
        })
        .when('/pools', {
            templateUrl : 'pools.html',
            controller  : 'Matches'
        })
		.otherwise({
			redirectTo: '/teams'
		});

	}]);

	// Service to handle all JSONP calls for data
	app.factory('DataService', function( $http ){

		var data = {};

		data.getTeams = function() {
			return $http({
				method: 'JSONP',
				url: 'http://cmsapi.pulselive.com/rugby/event/1238/teams?callback=JSON_CALLBACK'
			});
		};

		data.getSchedule = function() {
			return $http({
				method: 'JSONP',
				url: 'http://cmsapi.pulselive.com/rugby/event/1238/schedule?callback=JSON_CALLBACK'
			});
		};

		data.getMatch = function( matchId ) {
			return $http({
				method: 'JSONP',
				url: 'https://cmsapi.pulselive.com/rugby/match/' + matchId + '?callback=JSON_CALLBACK'
			});
		};

		data.getSquad = function( squadId ) {
			return $http({
				method: 'JSONP',
				url: 'http://cmsapi.pulselive.com/rugby/event/1238/squad/' + squadId + '?callback=JSON_CALLBACK'
			});
		}

		return data;

	});

	// Grab Team related data and assign vars
	app.controller('Teams', function($scope, DataService){
		$scope.teams = [];
		DataService.getTeams().success(function(response) {
	        $scope.teams = response.teams;
	    });
	});
	app.controller('Squad', function($scope, $routeParams, DataService){
		$scope.players = [];
		DataService.getSquad( $routeParams.teamId ).success(function(response) {
			$scope.team = response.team.name;
	        $scope.players = response.players;
	    });
	});


	// Grab Schedule related data and assign vars
	app.controller('Matches', function($scope, DataService){
		$scope.matches = [];
		DataService.getSchedule().success(function(response) {
	        $scope.matches = response.matches;
	    });
	});

	// Used for Tabbed Element functionality
	app.controller('TabController', function( $scope ){

		$scope.tabs = [
			{ url : '#/teams', label : 'Teams' },
			{ url : '#/fixtures', label : 'Fixtures' },
			{ url : '#/pools', label : 'Pools' }
		]; 

		$scope.tab = $scope.tabs[0];

		$scope.setTab = function(tab){
			$scope.tab = tab;
		};

		$scope.tabClass = function(tab){
			if ($scope.tab == tab) {
				return 'active';
			} else {
				return '';
			}
		};

	});

	// Encode names to lowercase and hyphenated for URL friendly
	app.filter('urlencode',function() {
	    return function(input) {
	        if (input) {
	            return input.toLowerCase().replace(/\s+/g, '-');    
	        }
	    }
	});

})();