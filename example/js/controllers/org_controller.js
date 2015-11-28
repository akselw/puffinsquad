org.fac('search', ['$http', function($http) { 
  return $http.get('js/json/orgunits.json') 
            .success(function(data) { 
              return data; 
            }) 
            .error(function(err) { 
              return err; 
            }); 
}]);


