(function(){
'use strict';

    angular.module("mainApp", ['ngRoute','ui.bootstrap','ngSanitize'])
    .config(function ($routeProvider){
        $routeProvider.when('/',{
            templateUrl:'./views/whitelist.html',
            controller: 'Whitelist',
            title: 'Home',
            reloadOnSearch: false
        })
        .when('/Whitelist',{
            templateUrl: './views/whitelist.html',
            controller:'Whitelist',
            controllerAs: 'ctrl',
        })
        .when('/BDBA',{
            templateUrl: './views/bdba.html',
        })
        .otherwise({
            redirectTo: '/',
            title:'Home',
            resolve:{
                title:function(){
                    console.log('m12')
                }
            }
        })
    })
    .run(['$rootScope', '$location', function($rootScope, $location){
        $rootScope.APIBaseURL = 'http://127.0.0.1'
        $rootScope.$on('$locationChangeStart',function(event,next,current) {
            if (next != undefined && next.split('#!/')[1] != '' && next.split('#!/')[1] != undefined) {
                $rootScope.currentUrl = next.split('#!/')[1]
                console.log($rootScope.currentUrl)
            }
        })
    }])
   
})()