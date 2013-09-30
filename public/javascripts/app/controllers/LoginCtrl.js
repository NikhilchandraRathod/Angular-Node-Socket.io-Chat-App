
angular.module("ChatApp.Controllers")
    .controller("LoginCtrl",[
        "$scope",
        "SocketService",
        "$location",
        "$rootScope",
        function($scope, SocketService, $location, $rootScope){
            $scope.userName = "";
            $scope.nameExist = false;
            $scope.isFocus = true;
            $scope.enterChat = function(){
                SocketService.newUser($scope.userName).then(function(data){
                    if(data.status){
                        $rootScope.currentUser = data.username;
                        $location.path("/Chat");       
                    }else{
                        $scope.nameExist = true;
                    }
                });
            };
        }
    ]);