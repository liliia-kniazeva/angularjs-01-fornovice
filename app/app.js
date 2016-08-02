(function() {
    "use strict";

    angular
        .module("todoApp", [])
		.run(runApp)
        .value("model", {
            user: "Vitaliy",
            userPhoto: "./images/VZ.jpg" //,
            //items: [
            //    {"action": "Estimate...", "done": false},
            //    {"action": "Create...", "done": false},
            //    {"action": "Edit...", "done": true},
            //    {"action": "Delete...", "done": false}
            //] 
        })
        .controller("Todo", Todo)
		.filter("checkedItems", checkedItems)
		.directive("taskList", taskList)
		.directive("pageHeader", pageHeader);
	
	function runApp($http, model){
		$http
			.get("todo.json")
			.success(function(data){
				model.items = data;
			});
	}
	
    function Todo($scope, model){
        $scope.todo = model;
		$scope.showComplete = true;
		$scope.addNewItem = addNewItem;
		$scope.incompleteCount = incompleteCount;
		$scope.removeItem = removeItem;
		$scope.removeAllCompletedItems = removeAllCompletedItems;
		$scope.warningLevel = warningLevel;
		
		function addNewItem(items, newItem) {
			if (newItem && newItem.action) {
				items.push({
				action: newItem.action,
				done: false
				});
				
				newItem.action = "";
			}
		}
		
		function removeItem(items, itemToRemove){
			if (itemToRemove) {				
				angular.forEach(items, function(item){
					if (item.action == itemToRemove.action) {
						items.splice(items.indexOf(item), 1);
					}
				});				
				
				itemToRemove.action = "";
			}
		}
		
		function removeAllCompletedItems(items){
			for(var i = items.length-1; i >= 0;i--) {
				if (items[i].done) {
					items.splice(i, 1);
				}
			}			
		}
		
		function incompleteCount(items){
			var count = 0;
			angular.forEach(items, function(item){
				if (!item.done) count++;
			});
			
			return count;
		}
		
		function warningLevel(items){
			return incompleteCount(items) < 3 ? "label-success" : "label-warning";
		}
    }
	
	//filter
	function checkedItems(){
		return function(items, showComplete){
			var resArr = [];
			
			if (angular.isArray(items)) {
				angular.forEach(items, function(item) {
					if (item.done === false || showComplete === true) {
						resArr.push(item);
					}
				});
				return resArr;
			} else {
				return items;
			}
		}
	}
	
	//directives
	function taskList(){
		return {
			resrtict: "A",
			templateUrl: "table.html"
		};
	}
	
	function pageHeader(){
		return {
			resrtict: "A",
			templateUrl: "page-header.html"
		};
	}

})();