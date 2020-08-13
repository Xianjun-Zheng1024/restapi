(function(){
'use strict';
	angular.module('mainApp')
		   .controller('Whitelist',_whitelist)

	function _whitelist($rootScope,$scope,$interval,whitelistApi){
		_whitelist.$inject = ['$rootScope','$scope','$interval','whitelistApi']
		var ctrl = $scope
		ctrl.gridDataConfig = {}
		ctrl.currentItem = undefined
        
		ctrl.jobColumns = [{columnName:'name',displayName:'Projects',sort:1,filter:"",show:true},
                {columnName:'expired',displayName:'Expired',sort:2,filter:"",show:true},
                {columnName:'blacklist',displayName:'Blacklist',sort:2,filter:"",show:true},
                {columnName:'conditional',displayName:'Conditional',sort:2,filter:"",show:true},
                {columnName:'invalid',displayName:'Invalid',sort:2,filter:"",show:true},
                {columnName:'whitelist',displayName:'Whitelist',sort:2,filter:"",show:true}]
        
		function getList() {
            whitelistApi.getProducts().then(function(response){
                var allData = response.data
                console.log(allData)
                var tmpItem = undefined;
                for(var j = 0,len=allData.length; j < len; j++) {
                    tmpItem = allData[j]
                }
                ctrl.gridDataConfig={data:allData,columns:ctrl.jobColumns}
            },function(error){
				console.log('false')
			})
        }
        
        var timer = $interval(
            function() {
                getList();
            },1*1000);

        $scope.$on(
            "$destroy",
            function() {
                $interval.cancel( timer );
            }
        );
	}
})()
