angular.module('ionizer-wooshop.services', ['common.services'])

.factory('dataService', ['$http', '$q', 'APIFunctions', 'utility', '$filter', function($http, $q, APIFunctions, utility, $filter) {

    var baseURL = 'http://bbq.ghighlights.com/barbecue-bestellen/wc-api/v2';

    var callAPI = function() {

        //var returnURL = APIFunctions.makeURL(APICallsettings);

        var deferred = $q.defer();
        var returnData = [];

        $http({
                method: 'GET',
                url: baseURL + '/API.php',
                params: {
                    getCategory: 'all' 
                }
            })
            .success(function(data) {
                deferred.resolve(data);
            })
            .error(function() {
                deferred.reject('There was an error');
            })

        return deferred.promise;
    }

    return {
        getItems: function() {
            var deferred = $q.defer();

            $http({
                    method: 'GET',
                    url: baseURL + '/API.php',
                    params: {
                        getItems: ''
                    }
                })
                .success(function(data) {
                    deferred.resolve(data);
                })
                .error(function() {
                    deferred.reject('There was an error');
                })

            return deferred.promise;
        },
                
        getOrder: function(orderId) {
            var deferred = $q.defer();

            $http({
                    method: 'GET',
                    url: baseURL + '/API.php', 
                    params: {
                        getOrder: ''
                    }
                })
                .success(function(data) {
                    deferred.resolve(data);
                })
                .error(function() {
                    deferred.reject('There was an error');
                })

            return deferred.promise;
        },
            getCountries: function() {
            var deferred = $q.defer();

            $http({
                    method: 'GET',
                    url: baseURL + '/API.php',
                    params: {
                        getCountries: ''
                    }
                })
                .success(function(data) {
                    deferred.resolve(data);
                })
                .error(function() {
                    deferred.reject('There was an error');
                })

            return deferred.promise;
        },
        getBACS: function() {
            var deferred = $q.defer();

            $http({
                    method: 'GET',
                    url: baseURL + '/API.php',
                    params: {
                        getBACS: ''
                    }
                })
                .success(function(data) {
                    deferred.resolve(data);
                })
                .error(function() {
                    deferred.reject('There was an error');
                })

            return deferred.promise;
        },
        sendOrder: function(cart, checkout, grand) {
            var deferred = $q.defer();

            console.log(cart);
            console.log(checkout);

            var billing_address = checkout.billing_address;
            var shipping_address = checkout.sameAddress ? checkout.billing_address : checkout.shipping_address
            var shipping_note = checkout.shipping_note

            var shipping_lines = [{
                "method_id": "free_shipping",
                "method_title": "Free Shipping",
                "total": "0.00"
            }]

            var line_items = []

            for (var i = 0; i < cart.length; i++) {
                line_items.push({
                    "product_id": cart[i].id,
                    "sku": cart[i].sku,
                    "quantity": cart[i].quantity,
                    "subtotal": cart[i].total,
                    "total": cart[i].total,
                    "price": cart[i].price,
                    "featured_src": cart[i].featured_src,
                    "title": cart[i].title,
                    "categories": cart[i].categories
                })
            };

            var postData = {
                "billing_address": angular.toJson(billing_address),
                "shipping_address": angular.toJson(shipping_address),
                "shipping_note": angular.toJson(shipping_note),
                "shipping_lines": angular.toJson(shipping_lines),
                "line_items": angular.toJson(line_items)
            };

            $http({
                    method: 'POST',
                    url: 'http://bbq.ghighlights.com/barbecue-bestellen/wc-api/v2' + '/API2.php', //'http://localhost:81/timurAnginREST' + '/API.php', //baseURL + '/API.php',
                    transformRequest: function(obj) {
                        var str = [];
                        for (var p in obj)
                            str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                        return str.join("&");
                    },
                    params: {
                        createOrder: ''
                    },
                    data: postData,
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                })
                .success(function(data) {
                    deferred.resolve(data);
                })
                .error(function() {
                    deferred.reject('There was an error');
                })

            return deferred.promise;
        }
    }
}])
