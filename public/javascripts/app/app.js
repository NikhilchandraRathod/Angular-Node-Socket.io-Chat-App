
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
        
        //For todays date;
        Date.prototype.today = function(){ 
            return ((this.getDate() < 10)?"0":"") + this.getDate() +"/"+(((this.getMonth()+1) < 10)?"0":"") + (this.getMonth()+1) +"/"+ this.getFullYear() 
        };
        
        //For the time now
        Date.prototype.timeNow = function(){
             return ((this.getHours() < 10)?"0":"") + this.getHours() +":"+ ((this.getMinutes() < 10)?"0":"") + this.getMinutes() +":"+ ((this.getSeconds() < 10)?"0":"") + this.getSeconds();
        };
    }
]);


angular.module("ChatApp.Controllers", []);
angular.module("ChatApp.Directives", []);
angular.module("ChatApp.Services", []);
angular.module("ChatApp.Filters", []);
