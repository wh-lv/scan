const net = require('net');
const ProgressBar = require('progress');

function checkPorts(host, start, end){
	// 返回 Promise
	return new Promise((resolve, reject) => {
		let counts = end - start + 1;
		let ports = [];
		let bar = new ProgressBar('scanning [:bar] :percent :etas', {
			complete: '=',
			width: 100,
			total: counts
		});
		for (let i = start; i <= end; i++) {
			let check = net.connect({
				host: host,
				port: i
			}, () => {
				ports.push(i);
				check.destroy();
			});
			check.on('close', () => {
				counts--;
				bar.tick(1);
				if(counts == 0) {
					if(ports.length){
						resolve(ports);
					} else {
						reject('no port is open');
					}
				}
			});
			check.on('error', err => {
				
			});
		}
	})
}

// 导出端口扫描包装函数、
module.exports = (host, start, end, callback) => {
	if(typeof end === 'function' && callback === undefined){
		callback = end;
		end = start;
	}
	checkPorts(host, start, end).then(ports => {
		callback(ports);
	}).catch(err => {
		console.log(err);
	})
}
