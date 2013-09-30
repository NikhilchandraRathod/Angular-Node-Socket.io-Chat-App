
angular.module("ChatApp.Controllers")
    .controller("ChatCtrl",[
        "$scope",
        "SocketService",
        "$rootScope",
        "$timeout",
        "$location",
        function($scope,SocketService, $rootScope, $t, $location){
            $scope.isFocus = true;
            $scope.postMsg = function(){
                SocketService.broadcastMsg($scope.newMsg).then(function(status){
                    $rootScope.$safeApply($scope, function(){
                        $scope.newMsg = "";
                    });
                });
            };
            $scope.privateMsg = function(user){
                $scope.isFocus = false;
                $scope.newMsg = "/P " + user + " ";
                $t(function(){
                    $scope.isFocus = true;
                },0);
            };
            $scope.logout = function(){
                SocketService.logout().then(function(status){
                    if(status){
                        $rootScope.$safeApply($scope, function(){
                            $location.path("/newchat");
                        });
                    }
                });
            };
            
            $rootScope.$watch("chats",function(){
                $('#chat').stop().animate({
                  scrollTop: $("#chat")[0].scrollHeight
                }, 800);
            },true);
        }
    ]);