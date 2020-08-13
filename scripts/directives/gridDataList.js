(function () {
    'use strict';
    angular.module('mainApp')
	.directive("gridDataList",function($sce,$compile){
		return {
			restrict: "EA",
			templateUrl: './views/directives/grid-data-list.html',
			scope: {
                gridDataConfig: "=",
                currentItem: "="
            },
            link: function(scope, element, attrs) {
                scope.currentPage = 1;
                scope.maxPage = undefined;
                scope.filterData = [];
                scope.currentPageData = [];
                scope.totalItems = 0;
                scope.columns = []
                scope.itemsPerPage = 10;
                scope.showSelectCol = angular.isDefined(attrs.showSelectCol) ? scope.$parent.$eval(attrs.showSelectCol) : false;

                var defaultSortCol = angular.isDefined(attrs.defaultSortCol) ? scope.$parent.$eval(attrs.defaultSortCol) : 0;
                var currentSortCol = undefined;

                scope.selectItem = function(item) {
                    scope.currentItem = item
                }

                scope.dataFilter = function() {
                    //console.log(scope.columns);
                    scope.filterData.length = 0;
                    for (var i=0,len=scope.gridDataConfig.data.length; i<len; i++) {
                        var item = scope.gridDataConfig.data[i],fltRes = true;
                        //console.log(item)
                        for (var j=0,jlen=scope.columns.length; j<jlen; j++) {
                            var col = scope.columns[j]
                            //console.log(col)
                            if (col.filter != "" && col.filter != undefined && 
                            item[col.columnName].toString().toLowerCase().indexOf(col.filter.toLowerCase()) == -1) {
                                fltRes = false;
                                break;
                            }
                        }
                        //console.log(fltRes)
                        if (fltRes) {scope.filterData.push(item)}
                    }
                    scope.totalItems = scope.filterData.length
                    scope.totalItems = scope.filterData.length
                    scope.maxPage = Math.ceil(scope.totalItems/scope.itemsPerPage)
                    scope.currentPage = 1;
                    scope.dataSort( (currentSortCol == undefined) ? scope.columns[defaultSortCol]:currentSortCol,false)
                }

                scope.dataSort = function(sortColumn,changeSortType) {
                    //console.log(sortColumn)
                    if (changeSortType) {
                        sortColumn.sort = !sortColumn.sort
                        currentSortCol = sortColumn
                    }
                    if (sortColumn.sort) {
                        scope.filterData.sort(function(a,b) {
                            if (a[sortColumn.columnName] != undefined && 
                                a[sortColumn.columnName].toString().search(/\d{2}:\d{2}:\d{2} GMT/i) < 0 && 
                                a[sortColumn.columnName] > b[sortColumn.columnName]) {
                                return -1; 
                            }
                            if (a[sortColumn.columnName] != undefined && 
                                a[sortColumn.columnName].toString().search(/\d{2}:\d{2}:\d{2} GMT/i) < 0 && 
                                a[sortColumn.columnName] < b[sortColumn.columnName]) {
                                return 1; 
                            }
                            if (a[sortColumn.columnName] != undefined && 
                                a[sortColumn.columnName].toString().search(/\d{2}:\d{2}:\d{2} GMT/i) > 0 && 
                                scope.localDate(a[sortColumn.columnName]) > scope.localDate(b[sortColumn.columnName])) {
                                return -1; 
                            }
                            if (a[sortColumn.columnName] != undefined && 
                                a[sortColumn.columnName].toString().search(/\d{2}:\d{2}:\d{2} GMT/i) > 0 && 
                                scope.localDate(a[sortColumn.columnName]) < scope.localDate(b[sortColumn.columnName])) {
                                return 1; 
                            }
                            return 0
                        })
                    } else {
                        scope.filterData.sort(function(a,b) {
                            if (a[sortColumn.columnName] != undefined && 
                                a[sortColumn.columnName].toString().search(/\d{2}:\d{2}:\d{2} GMT/i) < 0 && 
                                a[sortColumn.columnName] > b[sortColumn.columnName]) {
                                return 1; 
                            }
                            if (a[sortColumn.columnName] != undefined && 
                                a[sortColumn.columnName].toString().search(/\d{2}:\d{2}:\d{2} GMT/i) < 0 && 
                                a[sortColumn.columnName] < b[sortColumn.columnName]) {
                                return -1; 
                            }
                            if (a[sortColumn.columnName] != undefined && 
                                a[sortColumn.columnName].toString().search(/\d{2}:\d{2}:\d{2} GMT/i) > 0 && 
                                scope.localDate(a[sortColumn.columnName]) > scope.localDate(b[sortColumn.columnName])) {
                                return 1; 
                            }
                            if (a[sortColumn.columnName] != undefined && 
                                a[sortColumn.columnName].toString().search(/\d{2}:\d{2}:\d{2} GMT/i) > 0 && 
                                scope.localDate(a[sortColumn.columnName]) < scope.localDate(b[sortColumn.columnName])) {
                                return -1; 
                            }
                            return 0
                        })
                    }
                    scope.changeCurrentPageData(scope.currentPage)
                }

                scope.changeCurrentPageData = function(pageVal) {
                    //console.log(pageVal)
                    scope.currentPageData = scope.filterData.slice(scope.itemsPerPage*(pageVal-1),scope.itemsPerPage*pageVal)
                    scope.maxPage = Math.ceil(scope.totalItems/scope.itemsPerPage)
                }

                scope.convert = function(n){
                    return $sce.trustAsHtml(n);
                    //return $compile($sce.trustAsHtml(n))
                }

                scope.localDate = function(utcdate) {
                    if (utcdate == undefined || utcdate.toString().search(/\d{2}:\d{2}:\d{2}\.\d{6}/i) < 0) {
                        return utcdate
                    } else {
                        //return moment.parseZone(utcdate).local().format('YYYY-MM-DD HH:mm:ss.SSSSSS')
                        return moment.utc(utcdate).local().format('YYYY-MM-DD HH:mm:ss.')+utcdate.substr(-6, 6)
                    }
                }

                scope.$watch('gridDataConfig',function(newValue,oldValue) {
                    //console.log(scope.gridDataConfig)
                    if (scope.gridDataConfig != undefined && scope.gridDataConfig.data != undefined) {
                        if (scope.columns.length == 0) {
                            scope.columns = JSON.parse(JSON.stringify(scope.gridDataConfig.columns))
                        }
                        scope.dataFilter()
                    }
                })

                scope.$watch('currentPage',function(newValue,oldValue) {
                    scope.changeCurrentPageData(scope.currentPage)
                })
            }
		};
	});
})()