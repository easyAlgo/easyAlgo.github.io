var sys = require('sys')

var exec = require('child_process').exec;
var fs = require('fs');

function install(pack, callback) {
	exec('npm list -g ' + pack, function(error, stdout, stderr){
		if (error) {
			console.log('installation du package ' + pack);
			exec('npm install -g ' + pack,callback);
		} else {
			callback();
		}
	});
}

function buildLessOfHtml(file) {
	fs.readFile(file, 'utf8', function (err,data) {
		if (err) {
			return console.log(err);
		}
		console.log('building ' + file);
		
		var dirs = file.split('/');
		dirs.pop();
		var directory = dirs.join('/');
			
		var regex = /<link.*href="(.*)\.less".*\/>/g;
		var match = undefined;
		var newFile = data;
		while (match = regex.exec(data)) {
			// get file
			var cssFile = match[1];
			var captured = match[0];
			
			buildLess(directory+'/'+cssFile+'.less');
			// remove captured by css file
			newFile = newFile.replace(captured, '<link rel="stylesheet" type="text/css" href="'+cssFile+'.css"/>');
		}
		
		// check for less librairie
		var lessRegex = /<.*less\/dist\/less.*\.js.*>/;
		match = lessRegex.exec(data);
		if (match) {
			newFile = newFile.replace(match[0], '');
		}
		// rewrite the file
		fs.writeFileSync(file, newFile); 
		console.log('file ' + file + ' all less builded.');
	});
}

function buildLess(file) {
	var fileWithoutExt = file.substring(0, file.lastIndexOf('.'));
	console.log('remove ' + file);
	exec('rm ' + fileWithoutExt + '.css', function() {
		console.log('build ' + fileWithoutExt + '.less');
		exec('lessc -x ' + fileWithoutExt + '.less > ' + fileWithoutExt + '.css', function(){
			console.log(file + ' compiled');
			exec('rm ' + fileWithoutExt + '.less');
		});
	});
}

function minify(directory) {
	var files = fs.readdirSync(directory);
    for(var i in files){
        if (!files.hasOwnProperty(i)) continue;
        var name = directory+'/'+files[i];
        if (fs.statSync(name).isDirectory()){
            minify(name);
        } else {
            console.log('minify ' + name);
			exec('uglifyjs -c --overwrite ' + name);
        }
    }
}

function removeNoProd(file, callback) {	
	console.log('remove //$nodeProd on ' + file);
	fs.readFile(file, 'utf8', function (err,data) {
	  if (err) {
		return console.log(err);
	  }
	  
	  // remove all //$noProd line
	  var noProdIndex = data.indexOf('//$noProd');
	  while (noProdIndex >= 0) {
		  var startLine = data.lastIndexOf('\n',noProdIndex);
		  var endLine = data.indexOf('\n',noProdIndex);
		  data = data.substring(0, startLine) + data.substring(endLine);
		  noProdIndex = data.indexOf('//$noProd');
	  }
	  // update file
	  fs.writeFileSync(file, data); 
	  console.log('//$nodeProd removed on ' + file);
	  callback();
	});	
}


install('less', function(){buildLessOfHtml('views/index.html')});

removeNoProd('javascripts/main.js', function(){
	install('uglify-js@1', function(){minify('javascripts')});
});

