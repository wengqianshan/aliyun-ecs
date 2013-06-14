## Aliyun ECS SDK for nodejs

### 使用方法

	//引入SDK文件
	var ECS = require('./ECS').ECS;
	var ecs = new ECS('your AccessKeyId', 'your AccessKeySecret');
	//列出所有节点信息
	ecs.describeRegions(function(json){
		console.log(json)
	});

### 备注
> 依赖request模块: 
> npm install request