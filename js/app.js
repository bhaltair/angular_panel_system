// 获取应用程序
angular.module('myApp', ['ui.router'])

.config(function($stateProvider,$urlRouterProvider){
    $stateProvider
        .state('home',{
            url:'/home',
            templateUrl: "views/home.html",
            controller : function($scope,$interval,$http,$rootScope){                
                // 更新天气
            $http
                .jsonp('http://api.jirengu.com/weather.php?callback=JSON_CALLBACK')
                .success(function(res){
                    if(res && res.error === 0 ){
                        $scope.weatherData = res.results[0].weather_data;
                    
                        // 保存pm25指数
                        // console.log(res)
                    }
                })

            }
        })

        .state('login',{
            url:'/login',
            templateUrl:'views/login.html',
            controller: function($scope,$http,$rootScope,$location,$httpParamSerializerJQLike){
                $scope.goToLogin = function(){
                //     $http
                //         .post('aphp/login.php',$scope.user)
                //         .success(function(res){
                //             if(res && res.errno === 0 && res.data){
                //                 $rootScope.username = res.data.username;
                //                 // $location.path('/home')
                //             }
                //         })
						$http({
							url: 'aphp/login.php',
							method: 'POST',
							data: $httpParamSerializerJQLike($scope.user),
							headers: {
							'Content-Type': 'application/x-www-form-urlencoded'
							}
						}).success(function(res){
							if(res && res.errno === 0){
								// console.log('登录成功')
								$rootScope.username = res.data.username;
								$location.path('/home')
								$scope.passwordError = false
								
							}else if(res && res.errno === 1) {
								$scope.passwordError = true
							}
						})					
                }
            }
        })
        // 用户模块路由 列表页 详情页 创建页
        .state('userlist', {
            url: '/userlist/:pageNum', 		// 进入列表页，我们要知道是第几页
            templateUrl: 'views/user/list.html',
            controller: 'userListCtrl'
        })
        .state('userdetail', {
            url: '/userdetail/:userId', 	// 进入详情页，我们要知道查看的是哪个用户
            templateUrl: 'views/user/detail.html',
            controller: 'userDetailCtrl'
        })
        .state('usercreate', {
            url: '/usercreate',
            templateUrl: 'views/user/create.html',
            controller: 'userCreateCtrl'
        })
        // 新闻模块路由 列表页 详情页 创建页
        .state('newslist', {
            url: '/newslist/:pageNum',
            templateUrl: 'views/news/list.html',
            controller: 'newsListCtrl'
        })
        .state('newsDetail', {
            url: '/newsdetail/:newsId',
            templateUrl: 'views/news/detail.html',
            controller: 'newsDetailCtrl'
        })
        .state('newsCreate', {
            url: '/newscreate',
            templateUrl: 'views/news/create.html',
            controller: 'newsCreateCtrl'
        })
        // 定义默认路由 => 首页
        $urlRouterProvider
            .otherwise('/home')        
})


// 封装一个服务检测登录
.service('checkLogin', function ($rootScope, $location,$http) {
	this.check = function () {
		// 判断用户是否登录过，只需要判断根作用域下是否有userName信息
        $http.get('action/checklogin.php')
            .success(function(res){
                if(res && res.errno === 0 && !res.data){
                    $location.path('/login')
                }else if (res && res.errno == 0 && res.data) {
                    $rootScope.username = res.data.username
                }
            })
	}
})

.controller('headerCtrl',function($scope,$http,$location,$rootScope,checkLogin,$interval){
    checkLogin.check();
    // 更新时间
    $interval(function(){
        $scope.date = new Date();
    },1000)    
})

.controller('navCtl',function($scope){
	// 定义导航数据
	$scope.list = [
		// 用户模块
		{
			// 定义模块名称
			title: '用户模块',
			// 定义子模块
			childList: [
				{
					subTitle: '用户列表',		// 表示子模块title
					link: '#/userlist/1'		// 子模块链接
				},
				{
					subTitle: '创建用户',
					link: '#/usercreate'
				}
			]
		},
		// 新闻模块
		{
			title: '新闻模块',
			childList: [
				{
					subTitle: '新闻列表',
					link: '#/newslist/1'
				},
				{
					subTitle: '创建新闻',
					link: '#/newscreate'
				}
			]
		}
	]    

})


// 用户列表
.controller('userListCtrl', function ($scope,$http,$stateParams,checkLogin) {

    checkLogin.check();

	// 获取页面
	// 将num保存在作用域
	$scope.num = $stateParams.pageNum;
	// 为$socpe添加列表数据，数据需要有请求
	$http
		.get('aphp/showuserlist.php?pageNum=' + $scope.num)
		// 监听回调函数
		.success(function (res) {
            // console.log(res)
			// 如果返回成功，将数据保存在list变量中
			if (res && res.errno === 0) {
				$scope.list = res.data;
			}
		})    
})
// 用户详情
.controller('userDetailCtrl', function ($scope,$http,$stateParams,checkLogin) {
    checkLogin.check();
    
	$http
		.get('aphp/userdetail.php?userId=' + $stateParams.userId)
		// 监听回调函数
		.success(function (res) {
			// 如果数据请求成功，将数据保存下来
			if (res && res.errno === 0) {
				// 将数据保存在作用域的user变量中
				$scope.user = res.data[0]
			}
		})    
})
// 创建用户
.controller('userCreateCtrl', function ($http,$scope,$location,checkLogin,$httpParamSerializerJQLike) {

    checkLogin.check();
    
    $scope.submitUser = function(){
		// 老师这个方法有问题，post的不是form-data 而是什么request payload
        // $http
        //     .post('aphp/createuser.php', $scope.user )
        //     .success(function(res){
		// 		console.log(res)
        //         if(res && res.errno === 0){
        //             $location.path('/userlist/1')
        //         }else {
        //             // alert('提交失败')
        //         }
        //     })

		// 序列化对象
		$http({
			url: 'aphp/createuser.php',
			method: 'POST',
			data: $httpParamSerializerJQLike($scope.user),
			headers: {
			'Content-Type': 'application/x-www-form-urlencoded'
			}
		}).success(function(res){
			// console.log(res)
			if(res && res.errno === 0){
				alert('创建成功');
				$location.path('/userlist/1');
			}else {
				alert('提交失败');
			}
		})		
    }
})
// 新闻列表
.controller('newsListCtrl', function ($scope,$location,checkLogin,$stateParams,$http) {
	checkLogin.check();
	// 请求数据渲染页面
	$scope.num = $stateParams.pageNum;
	// 根据页码请求数据
	$http
		.get('aphp/newslist.php?pageNum=' + $scope.num)
		// 监听回调
		.success(function (res) {
			// 如果请求成功
			if (res && res.errno === 0) {
				// 将数据存储
				$scope.list = res.data;
			}
		})    
})
// 新闻详情
.controller('newsDetailCtrl', function ($scope,$location,checkLogin,$stateParams,$http) {
	checkLogin.check();
	// 获取新闻id
	var id = $stateParams.newsId;
	// 请求数据
	$http
		.get('aphp/newsdetail.php?id=' + id)
		// 监听回调
		.success(function (res) {
			// 如果数据返回成功，我们存储数据
			if (res && res.errno === 0) {
				// 将data保存news变量中
				$scope.news = res.data[0];
			}
		})    
})
// 创建新闻
.controller('newsCreateCtrl', function ($scope,$location,checkLogin,$stateParams,$http,$httpParamSerializerJQLike) {
	// 检测登录
	checkLogin.check();
	// 定义提交事件
	$scope.submitNews = function () {
		// 适配时间
		$scope.newsData.date = new Date().getTime();
		// 发送数据
		// $http
		// 	.post('action/createnews.php', $scope.newsData)
		// 	// 监听回调函数
		// 	.success(function (res) {
		// 		// 如果返回成功，我们进入新闻列表页，
		// 		if (res && res.errno === 0) {
		// 			$location.path('/newslist/1')
		// 		}
		// 	})

		// 序列化对象
		$http({
			url: 'aphp/createnews.php',
			method: 'POST',
			data: $httpParamSerializerJQLike($scope.newsData),
			headers: {
			'Content-Type': 'application/x-www-form-urlencoded'
			}
		}).success(function(res){
			// console.log(res)
			if(res && res.errno === 0){
				alert('创建成功');
				$location.path('/newslist/1');
			}else {
				alert('提交失败');
			}
		})			
	}    
})