## aliyun-ecs
Aliyun [ECS](http://dev.aliyun.com/read.php?tid=41) SDK for nodejs

## 开始使用
1 安装

    npm install aliyun-ecs

2 使用

	//引入模块
	var ECS = require('aliyun-ecs');
	var ecs = new ECS('your AccessKeyId', 'your AccessKeySecret');
	//列出所有节点信息
	ecs.describeRegions(function(json){
		console.log(json)
	});

## API功能列表
待添加

<!-- 
__列出所有节点信息__

* 方法

describeRegions

* 参数

无


__列出所有节点信息__
-->