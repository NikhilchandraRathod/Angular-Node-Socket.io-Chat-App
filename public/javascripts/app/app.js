
angular.module("ChatApp", [
    "ngRoute",
    "ngAnimate",
    "ChatApp.Controllers", 
    "ChatApp.Directives",
    "ChatApp.Services",
    "ChatApp.Filters"
]).config(
    ["$routeProvider", 
     "$locationProvider",
        function($routeProvider, $locationProvider){
            
            $routeProvider.when("/newchat",{
                templateUrl: "/login",
                controller: "LoginCtrl"
            });
            
            $routeProvider.when("/Chat",{
                templateUrl: "/startchat",
                controller: "ChatCtrl"
            });
            
            $routeProvider.otherwise({
                redirectTo: "/newchat"
            });
            
            $locationProvider.html5Mode(true);
        }
    ]
).run([
    "$rootScope",
    function($rootScope){
        $rootScope.currentUser = "";
        $rootScope.users = [];
        $rootScope.chats = [];
        $rootScope.$safeApply = function(scope, fn){
            fn = fn || function (){};
            if(scope.$$phase){
                fn();
            }else{
                scope.$apply(fn);
            }
        };
        
        
    }
]);


angular.module("ChatApp.Controllers", []);
angular.module("ChatApp.Directives", []);
angular.module("ChatApp.Services", []);
angular.module("ChatApp.Filters", []);
