var ECS = require('./ECS').ECS;
var ecs = new ECS('your_accessKeyId', 'your_accessKeySecret');
ecs.describeRegions(function(json){
	console.log(json)
});