var sys = require('sys')

var exec = require('child_process').exec;
var fs = require('fs');

function build() {
	console.log('remove bootstrap.css');
	exec('rm styles/less/bootstrap_extended/bootstrap.css', function() {
		console.log('build bootstrap.less');
		exec('lessc styles/less/bootstrap_extended/bootstrap.less > styles/less/bootstrap_extended/bootstrap.css', function(){
			console.log('bootstrap.less compiled');
		});
	});
	console.log('update main.js');
	fs.readFile('javascripts/main.js', 'utf8', function (err,data) {
	  // TODO chercher tous les //$noPord et suppression des lignes noProd
	  if (err) {
		return console.log(err);
	  }
	  console.log(data);
	});
}

exec('npm list -g less', function(error, stdout, stderr){
	if (error) {
		console.log('installation du compilateur less');
		exec('npm install -g less',build);
	} else {
		build();
	}
});
