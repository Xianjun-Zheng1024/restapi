(function(){
	'use strict';

	angular.module('mainApp')
	.factory('whitelistApi',whitelistApi)

	whitelistApi.$inject = ['$rootScope','$http','$q']
	
	function whitelistApi($rootScope,$http,$q){
        
		var getProducts = function() {
            var deferred = $q.defer()
            $http({
				method:'GET',
				url:$rootScope.APIBaseURL+'/rest/whitelist/projects/',
				withCredentials: true}
			).then(function(data){
                console.log(data)
                deferred.resolve(data)
            },function(error){
                console.log(error)
                deferred.reject(error)
            })
            return deferred.promise;
        }
		
		var getProjects =function(id) {
            var deferred = $q.defer()
            $http({
				method:'GET',
				url:$rootScope.APIBaseURL+'/rest/whitelist/project/'+id+'/',
				withCredentials: true
			}).then(function(data){
                console.log(data)
                deferred.resolve(data)
            },function(error){
                console.log(error)
                deferred.reject(error)
            })
            return deferred.promise;
		}
		
		return {
			getProducts:getProducts,
			getProjects:getProjects
		}
	}
})()
