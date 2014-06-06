'use strict';

angular.module('f1App')
    .controller('MainCtrl', function ($scope, $http) {

        $scope.today = new Date();
        $scope.baseurl = 'http://ergast.com/api/f1/';

        $http({method: 'get', url: 'f1.json'}).success(function(data) {
            $scope.lookup = data;
        });

        $http({method: 'get', url: $scope.baseurl + 'current.json'}).success(function(data) {
            $scope.season = data.MRData.RaceTable;
            for(var i in $scope.season.Races) {
                if($scope.season.Races.hasOwnProperty(i)) {
                    var race = $scope.season.Races[i];
                    if(race.date !== undefined) {
                        $scope.season.Races[i]['results'] = Date.parse(race.date) < $scope.today;
                        $scope.season.Races[i]['dt'] = race.date + 'T' + race.time;
                    }
                }
            }
          });

      })

    .controller('ResultsCtrl', function ($scope, $http, $routeParams) {

        $scope.baseurl = 'http://ergast.com/api/f1/';
        $scope.sort = 'position'
        var numbers = [
            'position', 
            'number',
            'points',
            'grid',
            'laps',
            'millis',
            'rank',
            'lap',
            'speed',
        ];

        $http({method: 'get', url: 'f1.json'}).success(function(data) {
            $scope.lookup = data;
        });


        $http({method: 'get', url: $scope.baseurl + 'current/circuits/' + $routeParams.circuitId + '/results.json'}).success(function(data) {
            $scope.results = data.MRData.RaceTable.Races[0];
            angular.forEach($scope.results.Results, function(result) {
                for(var i in result) {
                    if(result.hasOwnProperty(i) && numbers.indexOf(i) !== -1) {
                        result[i] = parseInt(result[i], 10);
                    }
                }
            });
          });
      })
    
    .controller('DriverCtrl', function ($scope, $http) {

        $scope.baseurl = 'http://ergast.com/api/f1/current/';

        $http({method: 'get', url: 'f1.json'}).success(function(data) {
            $scope.lookup = data;
        });

        $http({method: 'get', url: $scope.baseurl + 'driverStandings.json'}).success(function(data) {
            $scope.standings = data.MRData.StandingsTable.StandingsLists[0].DriverStandings;
            console.log(scope.standings);
          });
      })

    .controller('ConstructorCtrl', function ($scope, $http) {

        $scope.baseurl = 'http://ergast.com/api/f1/current/';

        $http({method: 'get', url: 'f1.json'}).success(function(data) {
            $scope.lookup = data;
        });

        $http({method: 'get', url: $scope.baseurl + 'constructorStandings.json'}).success(function(data) {
            $scope.standings = data.MRData.StandingsTable.StandingsLists[0].ConstructorStandings;
          });

      });

angular.module('f1Filters', [])
    .filter('helmet', function() {
        return function(driver, $scope) {
            return $scope.lookup.url + $scope.lookup.helmet.replace('{driver_id}', $scope.lookup.ids.drivers[driver]);
        };
      })
    .filter('profile', function() {
        return function(driver, $scope) {
            return $scope.lookup.url + $scope.lookup.profile.replace('{driver_id}', $scope.lookup.ids.drivers[driver]);
        };
      })
    .filter('portrait', function() {
        return function(driver, $scope) {
            return $scope.lookup.url + $scope.lookup.portrait.replace('{driver_id}', $scope.lookup.ids.drivers[driver]);
        };
      });
