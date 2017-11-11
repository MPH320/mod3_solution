(function (){
	'use strict';
	
	angular.module('NarrowItDownApp', [])
	.controller('NarrowItDownController', NarrowItDownController )
	.service('MenuSearchService', MenuSearchService)
	.directive('foundItems', FoundItemsDirective);
	
  function FoundItemsDirective() {
    var ddo = {
      templateUrl: 'foundItems.html',
      scope: {
        found: '<',
        onRemove: '&'
      },
      controller: FoundItemsDirectiveController,
      controllerAs: 'list',
      bindToController: true
    };
    return ddo;
  }
	
	  function FoundItemsDirectiveController() {
    var list = this;

    list.isEmpty = function() {
      return list.found != undefined && list.found.length === 0;
    }
  }
	
	NarrowItDownController .$inject = ['MenuSearchService'];
	
	function NarrowItDownController (MenuSearchService){
		var narrower = this;
		narrower.searchTerm = "";
		
		narrower.getList = function() {
      if (narrower.searchTerm === "") {
        narrower.found = [];
        return;
      }
      var promise = MenuSearchService.getMatchedMenuItems(narrower.searchTerm);
      promise.then(function(response) {
        narrower.found = response;
      })
      .catch(function(error) {
        console.log("Something went wrong", error);
      });
    };
		
		narrower.removeItem = function (itemIndex) {
			console.log("'this' is: ", this);
			narrower.found.splice(itemIndex, 1);
  	};
		
	};
	
	MenuSearchService.$inject = ['$http']
	
	function MenuSearchService($http) {
		var service = this;
		
		service.getMatchedMenuItems = function(searchTerm) {
			return $http({
				method:'GET',
				url:("https://davids-restaurant.herokuapp.com/menu_items.json")
			}).then(function (result){
				
				var foundItems = result.data.menu_items;

        for (var i = 0; i < foundItems.length; i++) {
          // if this item does not contain search term
          if (foundItems[i].name.toLowerCase().indexOf(searchTerm) === -1) {
            foundItems.splice(i, 1); // remove it from foundItems
          }
        }

        return foundItems;
	
			});
			
		}
		
	}
	

	
})();