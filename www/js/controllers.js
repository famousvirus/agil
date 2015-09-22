angular.module('ionizer-wooshop.controllers', ['ionizer-wooshop.services'])

.controller('AppCtrl', function($scope, dataService, $localstorage, $timeout, $ionicLoading) {

    $scope.shouldAnimate = false;
    console.log($localstorage.getObject('cart'));
    $scope.cartItems = $localstorage.getArray('cart');
    

    //$localstorage.destroy('purchaseHistory');
    $scope.purchaseHistory = $localstorage.getArray('purchaseHistory');

    $scope.grand = !angular.isArray($localstorage.getArray('grand')) ? $localstorage.getArray('grand') : {
        "Total": 0,
        "Weight": 0,
        "Shipping": 0
    }
    

    $scope.intoCart = function(item) {

        $ionicLoading.show({
            template: 'Item Added to Cart'
        });
        $timeout(function() {
            $ionicLoading.hide();
        }, 1300);

        $scope.shouldAnimate = true;

        $timeout(function() {
            $scope.shouldAnimate = false;
        }, 3000);

        $scope.cartItems.push(item);
        $localstorage.setObject('cart', $scope.cartItems);
        console.log($scope.cartItems);
    }

    $scope.destoryCart = function(item) {
        $scope.cartItems = [];
        $localstorage.destroy('cart');
    }

})

.controller('BrowseCtrl', function($scope, dataService, $ionicLoading, $localstorage) {
   var recache = false;      
    
    if (!$localstorage.getObject('All').length) {
        recache = true;
    }
    
    if (recache) {
    $ionicLoading.show({
    templateUrl:"templates/loading.html" 
    });
    dataService.getItems().then(function(returnData) {
    console.log(returnData);
    $scope.products = returnData.products;
    $localstorage.setObject('All', returnData.products);
    $ionicLoading.hide();
        });
    } else {
    $scope.products = $localstorage.getObject('All');
    }
})
    


.controller('BrowseDetailsCtrl', function($scope, $state, $localstorage) {
    var ID = $state.params.productID;
    var products = $localstorage.getObject('All');
    $scope.products = products.filter(function( obj ) {
    return obj.id == ID});
    $scope.list = [];
    $scope.number = 1;
    $scope.submit = function() {
        if ($scope.number) {
        $scope.list.push(this.number);
        $localstorage.destroy('quantity');
        $scope.products[0].quantity  = $scope.list[0];
        $localstorage.setObject('quantity',                         $scope.products[0].quantity);
        }
    }
    
        $scope.addQuantity = function(product) {
            ++$scope.number;
        }

    $scope.subtractQuantity = function(product) {
        if ($scope.number == 0) {
            $scope.number = 0;
        } else {
            --$scope.number;
        }
    }
})

.controller('CheckoutCtrl', function($scope, $stateParams, dataService, $localstorage, $ionicScrollDelegate, $state, $ionicLoading) {

    $scope.formNotValid = false;

    if (!angular.isArray($localstorage.getArray('formCheckout'))) {
        $scope.formCheckout = $localstorage.getObject('formCheckout');
        console.log($scope.formCheckout)
    } else {
        console.log('no checkout data yet!')
        $scope.formCheckout = {
            "billing_address": {
                "first_name": "",
                "last_name": "",
                "address_1": "",
                "address_2": "",
                "city": "",
                "state": "",
                "postcode": "",
                "country": "",
                "email": "",
                "phone": "",
                "company": ""
            },
            "sameAddress": true,
            "shipping_address": {
                "first_name": "",
                "last_name": "",
                "address_1": "",
                "address_2": "",
                "city": "",
                "state": "",
                "postcode": "",
                "country": ""
            },
            "shipping_note": ""
        };
    }

    // Saving each Key Stroke into localStorage
    $scope.saveForm = function() {
        $localstorage.setObject('formCheckout', $scope.formCheckout)
    }

    // To calculate the Shipping Cost and Grand Total
    $scope.saveShipping = function() {

        $scope.grand.Shipping = $scope.grand.Weight * $scope.JNE[$scope.formCheckout.billing_address.province][$scope.formCheckout.billing_address.kota][$scope.formCheckout.billing_address.kecamatan][$scope.formCheckout.shipping_type].harga
        $localstorage.setObject('grand', $scope.grand)
        console.log($scope.grand)
        $scope.saveForm()
    }

    // What happens when the "Same As Billing" Radio Button is pressed
    $scope.actionShipping = function() {
        $ionicScrollDelegate.resize();
        console.log('actionShipping run')
        if ($scope.formCheckout.sameAddress) {
            $scope.formCheckout.shipping_address = angular.copy($scope.formCheckout.billing_address);
        }
    }

    // Happens when the Complete Button is pressed
    $scope.complete = function(form) {
        if (form.$valid) {
        $ionicLoading.show({
        templateUrl:"templates/Loading.html"
        })
        dataService.sendOrder($scope.cartItems, $scope.formCheckout, $scope.grand).then(
                function(returnData) {
                    console.log(returnData);
                    $scope.purchaseHistory.push(returnData);
          $localstorage.setObject('purchaseHistory', $scope.purchaseHistory);
                    $scope.destoryCart();
                    $state.go('tab.thanks');
                })
        $ionicLoading.hide()
        } else {
            console.log('Form is not Valid');
            $scope.formNotValid = true;
            $ionicScrollDelegate.scrollTop();
        }
    }
    

    // Helper to get the Object Size
    $scope.sizeOf = function(obj) {
        return Object.keys(obj).length;
    };

})

.controller('CartCtrl', function($scope, $state, $ionicModal, $localstorage) {
    $scope.storeData = function() {
        $localstorage.setObject('cart', $scope.cartItems);
        console.log($scope.cartItems)
    }
    
    $scope.deleteProduct = function(deleteMe) {
        $scope.cartItems.splice(deleteMe, 1);

        if ($scope.cartItems.length) {
            for (var i = 0; i < $scope.cartItems.length; i++) {
                $scope.getTotal($scope.cartItems[i]);
            };
        } else {
            $scope.grand.Total = 0;
            $localstorage.setObject('cart', $scope.cartItems);
            $localstorage.setObject('grand', $scope.grand)
        }

    }

    $scope.addQuantity = function(product) {
        if (angular.isUndefined(product.quantity)) {
            product.quantity = 1;
        } else {
            ++product.quantity;
        }

        for (var i = 0; i < $scope.cartItems.length; i++) {
            $scope.getTotal($scope.cartItems[i]);
        };
    }

    $scope.subtractQuantity = function(product) {
        if (angular.isUndefined(product.quantity) || product.quantity == 0) {
            product.quantity = 0;
        } else {
            --product.quantity;
        }

        for (var i = 0; i < $scope.cartItems.length; i++) {
            $scope.getTotal($scope.cartItems[i]);
        };
    }
    


    $scope.getTotal = function(product) {

        var mystring = "";
        var total = 0;
        var weight = 0;
        var quan = $localstorage.getObject ('quantity');


        if (angular.isUndefined(product.quantity)) {
            product.quantity = quan;
        } 

                
        product.total = product.price * product.quantity;

        $scope.grand.Total = 0;
        $scope.grand.Shipping = 0;

        for (i in $scope.cartItems) {

        $scope.grand.Total +=   $scope.cartItems[i].total;

        }

        $localstorage.setObject('cart', $scope.cartItems);
        $localstorage.setObject('grand', $scope.grand)
    }

    $ionicModal.fromTemplateUrl('my-modal.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(modal) {
        $scope.modal = modal;
    });
    $scope.openModal = function(product) {
        $scope.currentProduct = product;
        $scope.modal.show();
    };
    $scope.closeModal = function() {
        $scope.modal.hide();
    };
    //Cleanup the modal when we're done with it!
    $scope.$on('$destroy', function() {
        $scope.modal.remove();
    });
    // Execute action on hide modal
    $scope.$on('modal.hidden', function() {
        // Execute action
    });
    // Execute action on remove modal
    $scope.$on('modal.removed', function() {
        // Execute action
    });

    $scope.toCheckout = function() {
        $state.go('tab.checkout');
    }
})

.controller('ThanksCtrl', function($scope) {

    $scope.currentHistory = $scope.purchaseHistory.length - 1;

})

.controller('AccountCtrl', function($scope) {
    console.log($scope.purchaseHistory);
})

.controller('HistoryCtrl', function($scope, $stateParams) {
    console.log($scope.purchaseHistory);

    $scope.currentHistory = $stateParams.historyId;

});
