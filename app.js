//ecs加密
var crypto = require('crypto');
var request = require('request');
//key & secret
var accessKeyId = 'your key';
var accessKeySecret = 'your secret';
function percentEncode(str){
	var res = encodeURIComponent(str);
	res = res.replace(/\+/g, '%20');
	res = res.replace(/\*/g, '%2A');
	res = res.replace(/%7E/g, '~');
	return res;
}
//签名
function getSignature(params, secret){
	var keys = Object.keys(params).sort();
	var _keys = [];
	for( var i = 0, len = keys.length; i < len; i ++){
		_keys.push(percentEncode(keys[i]) + '=' + percentEncode(params[keys[i]]));
	}
	var queryString = _keys.join('&');
	var stringToSign = 'GET&%2F&' + percentEncode(queryString);
	//console.log(stringToSign, '---stringToSign')
	var hmac = crypto.createHmac('sha1', secret + '&');
	hmac.update(stringToSign);
	return hmac.digest('base64');
}
//配置信息
var config = {
	Format: 'JSON',
	Version: '2013-01-10',
	AccessKeyId: accessKeyId,
	SignatureVersion: '1.0',
	SignatureMethod: 'HMAC-SHA1'
};
//请求
function doRequest(params, callback){
	var data = {};
	for(var i in config){
		data[i] = config[i];
	}
	data['SignatureNonce'] = Math.random().toString(36).substring(2);
	data['TimeStamp'] = new Date().toISOString();
	for(var j in params){
		data[j] = params[j];
	}
	data['Signature'] = getSignature(data, accessKeySecret);
	var paramString = [];
	for(var p in data){
		paramString.push(p + '=' + data[p]);
	}
	sign = paramString.join('&');
	//console.log(sign);
	request('http://ecs.aliyuncs.com/?' + sign, function(err, response, body){
		//console.log(body)
		callback.call(null, err, response, body);
	})
}


var ECS = {
	//查询可用数据中心
	describeRegions: function(callback){
		doRequest({
			Action: 'DescribeRegions'
		}, function(err, response, body){
			callback.call(null, body);
		})
	},
	//查询Zone信息
	describeZones: function(RegionId, callback){
		doRequest({
			Action: 'DescribeZones',
			RegionId: RegionId
		}, function(err, response, body){
			callback.call(null, body);
		})
	},
	//查询实例状态（查询实例列表）
	describeInstanceStatus: function(RegionId, ZoneId, PageNumber, PageSize, callback){
		doRequest({
			Action: 'DescribeInstanceStatus',
			RegionId: RegionId,
			ZoneId: ZoneId,
			PageNumber: PageNumber || 1,
			PageSize: PageSize || 10
		}, function(err, response, body){
			callback.call(null, body);
		})
	},
	//查询实例信息
	describeInstanceAttribute: function(InstanceId, callback){
		doRequest({
			Action: 'DescribeInstanceAttribute',
			InstanceId: InstanceId
		}, function(err, response, body){
			callback.call(null, body);
		})
	},
	//查看云服务器监控信息
	getMonitorData: function(RegionId, InstanceId, callback){
		doRequest({
			Action: 'GetMonitorData',
			RegionId: RegionId,
			InstanceId: InstanceId
		}, function(err, response, body){
			callback.call(null, body);
		})

	},
	//创建实例
	createInstance: function(RegionId, ImageId, InstanceType, SecurityGroupId, InternetMaxBandwidthIn, InternetMaxBandwidthOut, callback){
		doRequest({
			Action: 'CreateInstance',
			RegionId: RegionId,
			ImageId: ImageId,
			InstanceType: InstanceType,
			SecurityGroupId: SecurityGroupId,
			InternetMaxBandwidthIn: InternetMaxBandwidthIn,
			InternetMaxBandwidthOut: InternetMaxBandwidthOut
		}, function(err, response, body){
			callback.call(null, body);
		})
	},
	//启动实例
	startInstance: function(InstanceId, callback){
		doRequest({
			Action: 'StartInstance',
			InstanceId: InstanceId
		}, function(err, response, body){
			callback.call(null, body);
		})
	},
	//停止实例
	stopInstance: function(InstanceId, callback){
		doRequest({
			Action: 'StopInstance',
			InstanceId: InstanceId
		}, function(err, response, body){
			callback.call(null, body);
		})
	},
	//重启实例
	rebootInstance: function(InstanceId, ForceStop, callback){
		doRequest({
			Action: 'RebootInstance',
			InstanceId: InstanceId,
			ForceStop: ForceStop
		}, function(err, response, body){
			callback.call(null, body);
		})
	},
	//重置实例
	resetInstance: function(InstanceId, ImageId, DiskType, callback){
		doRequest({
			Action: 'ResetInstance',
			InstanceId: InstanceId,
			ImageId: ImageId,
			DiskType: DiskType
		}, function(err, response, body){
			callback.call(null, body);
		})
	},
	//修改实例规格
	modifyInstanceSpec: function(InstanceId, InstanceType, InternetMaxBandwidthOut, InternetMaxBandwidthIn, callback){
		doRequest({
			Action: 'ModifyInstanceSpec',
			InstanceId: InstanceId,
			InstanceType: InstanceType,
			InternetMaxBandwidthOut: InternetMaxBandwidthOut,
			InternetMaxBandwidthIn: InternetMaxBandwidthIn
		}, function(err, response, body){
			callback.call(null, body);
		})
	},
	//修改实例属性
	modifyInstanceAttribute: function(InstanceId, Password, HostName, SecurityGroupId, callback){
		doRequest({
			Action: 'ModifyInstanceAttribute',
			InstanceId: InstanceId,
			Password: Password,
			HostName: HostName,
			SecurityGroupId: SecurityGroupId
		}, function(err, response, body){
			callback.call(null, body);
		})
	},
	//删除实例
	deleteInstance: function(InstanceId, callback){
		doRequest({
			Action: 'DeleteInstance',
			InstanceId: InstanceId
		}, function(err, response, body){
			callback.call(null, body);
		})
	},
	//为实例增加磁盘设备
	addDisk: function(InstanceId, Size, SnapshotId, callback){
		doRequest({
			Action: 'AddDisk',
			InstanceId: InstanceId,
			Size: Size,
			SnapshotId: SnapshotId
		}, function(err, response, body){
			callback.call(null, body);
		})
	},
	//删除磁盘
	deleteDisk: function(InstanceId, DiskId, callback){
		doRequest({
			Action: 'DeleteDisk',
			InstanceId: InstanceId,
			DiskId: DiskId
		}, function(err, response, body){
			callback.call(null, body);
		})
	},
	//查询实例磁盘列表
	describeInstanceDisks: function(InstanceId, callback){
		doRequest({
			Action: 'DescribeInstanceDisks',
			InstanceId: InstanceId
		}, function(err, response, body){
			callback.call(null, body);
		})
	},
	//创建快照
	createSnapshot: function(InstanceId, DiskId, SnapshotName, callback){
		doRequest({
			Action: 'CreateSnapshot',
			InstanceId: InstanceId,
			DiskId: DiskId,
			SnapshotName: SnapshotName
		}, function(err, response, body){
			callback.call(null, body);
		})
	},
	//删除快照
	deleteSnapshot: function(InstanceId, DiskId, SnapshotId, callback){
		doRequest({
			Action: 'DeleteSnapshot',
			InstanceId: InstanceId,
			DiskId: DiskId,
			SnapshotId: SnapshotId
		}, function(err, response, body){
			callback.call(null, body);
		})
	},
	//查询磁盘设备的快照列表
	describeSnapshots: function(InstanceId, DiskId, callback){
		doRequest({
			Action: 'DescribeSnapshots',
			InstanceId: InstanceId,
			DiskId: DiskId
		}, function(err, response, body){
			callback.call(null, body);
		})
	},
	//查询快照详情
	describeSnapshotAttribute: function(RegionId, SnapshotId, callback){
		doRequest({
			Action: 'DescribeSnapshotAttribute',
			RegionId: RegionId,
			SnapshotId: SnapshotId
		}, function(err, response, body){
			callback.call(null, body);
		})
	},
	//回滚快照
	rollbackSnapshot: function(InstanceId, DiskId, SnapshotId, callback){
		doRequest({
			Action: 'RollbackSnapshot',
			InstanceId: InstanceId,
			DiskId: DiskId,
			SnapshotId: SnapshotId
		}, function(err, response, body){
			callback.call(null, body);
		})
	},
	//查询可用镜像
	describeImages: function(RegionId, PageNumber, PageSize, callback){
		doRequest({
			Action: 'DescribeImages',
			RegionId: RegionId,
			PageNumber: PageNumber || 1,
			PageSize: PageSize || 10
		}, function(err, response, body){
			callback.call(null, body);
		})
	},
	//创建自定义镜像
	createImage: function(RegionId, SnapshotId, ImageVersion, Description, Visibility, callback){
		doRequest({
			Action: 'CreateImage',
			RegionId: RegionId,
			SnapshotId: SnapshotId,
			ImageVersion: ImageVersion,
			Description: Description,
			Visibility: Visibility
		}, function(err, response, body){
			callback.call(null, body);
		})
	},
	//删除自定义镜像
	deleteImage: function(RegionId, ImageId, callback){
		doRequest({
			Action: 'DeleteImage',
			RegionId: RegionId,
			ImageId: ImageId
		}, function(err, response, body){
			callback.call(null, body);
		})
	},
	//分配公网IP地址
	allocatePublicIpAddress: function(InstanceId, callback){
		doRequest({
			Action: 'AllocatePublicIpAddress',
			InstanceId: InstanceId
		}, function(err, response, body){
			callback.call(null, body);
		})
	},
	//释放公网IP地址
	releasePublicIpAddress: function(PublicIpAddress, callback){
		doRequest({
			Action: 'ReleasePublicIpAddress',
			PublicIpAddress: PublicIpAddress
		}, function(err, response, body){
			callback.call(null, body);
		})
	},
	//创建安全组
	createSecurityGroup: function(RegionId, Description, callback){
		doRequest({
			Action: 'CreateSecurityGroup',
			RegionId: RegionId,
			Description: Description
		}, function(err, response, body){
			callback.call(null, body);
		})
	},
	//授权安全组权限
	authorizeSecurityGroup: function(SecurityGroupId, RegionId, IpProtocol, PortRange, SourceGroupId, SourceCidrIp, Policy, NicType, callback){
		doRequest({
			Action: 'AuthorizeSecurityGroup',
			RegionId: RegionId,
			SecurityGroupId: SecurityGroupId,
			IpProtocol: IpProtocol,
			PortRange: PortRange,
			SourceGroupId: SourceGroupId,
			SourceCidrIp: SourceCidrIp,
			Policy: Policy,
			NicType: NicType
		}, function(err, response, body){
			callback.call(null, body);
		})
	},
	//查询安全组规则
	describeSecurityGroupAttribute: function(SecurityGroupId, RegionId, NicType, callback){
		doRequest({
			Action: 'DescribeSecurityGroupAttribute',
			SecurityGroupId: SecurityGroupId,
			RegionId: RegionId,
			NicType: NicType
		}, function(err, response, body){
			callback.call(null, body);
		})
	},
	//查询安全组列表
	describeSecurityGroups: function(RegionId, PageNumber, PageSize, callback){
		doRequest({
			Action: 'DescribeSecurityGroups',
			RegionId: RegionId,
			PageNumber: PageNumber || 1,
			PageSize: PageSize || 10
		}, function(err, response, body){
			callback.call(null, body);
		})
	},
	//撤销安全组规则
	revokeSecurityGroup: function(SecurityGroupId, RegionId, IpProtocol, PortRange, SourceGroupId, SourceCidrIp, Policy, NicType, callback){
		doRequest({
			Action: 'RevokeSecurityGroup',
			RegionId: RegionId,
			SecurityGroupId: SecurityGroupId,
			IpProtocol: IpProtocol,
			PortRange: PortRange,
			SourceGroupId: SourceGroupId,
			SourceCidrIp: SourceCidrIp,
			Policy: Policy,
			NicType: NicType
		}, function(err, response, body){
			callback.call(null, body);
		})
	},
	//删除安全组
	deleteSecurityGroup: function(SecurityGroupId, RegionId, callback){
		doRequest({
			Action: 'DeleteSecurityGroup',
			SecurityGroupId: SecurityGroupId,
			RegionId: RegionId
		}, function(err, response, body){
			callback.call(null, body);
		})
	},
	//查看云服务器监控信息
	getMonitorData: function(RegionId, InstanceId, callback){
		doRequest({
			Action: 'GetMonitorData',
			RegionId: RegionId,
			InstanceId: InstanceId
		}, function(err, response, body){
			callback.call(null, body);
		})
	},
	//查询实例资源规格列表
	describeInstanceTypes: function(callback){
		doRequest({
			Action: 'DescribeInstanceTypes'
		}, function(err, response, body){
			callback.call(null, body);
		})
	}
};

/*ECS.describeInstanceAttribute('ATX13041901095527d1205', function(json){
	//console.log(json);
})
ECS.describeInstanceTypes(function(json){
	//console.log(json)
});*/
ECS.describeRegions(function(json){
	console.log(json)
})