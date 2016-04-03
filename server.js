///Require Modules
var http = require('http');
var url = require('url')
var path = require('path')
var fs = require('fs')


///Array of Mime Types
var mimeTypes = {
  "html" : "text/html",
  "jpeg" : "image/jpeg",
  "jpg"  : "image/jpeg",
  "png"  : "image/png",
  "js"   : "text/javascript",
  "css"  : "text/css"
}

///Create Server
http.createServer( function(req, res){
  var uri = url.parse(req.url).pathname
  var fileName = path.join(process.cwd(), unescape(uri))   ///returns current working directory of process
  console.log('Loading' + uri)
  var stats

  try{
    stats = fs.lstatSync(fileName);   ///look for fileName
  } catch(e){                            ///If file isn't found, send 404
    res.writeHead(404, {'Content-type': 'text/plain'})
    res.write('404 Not Found/n')
    res.end()
    return
  }

  ///Check if file/directory and server if it is in directory
  if(stats.isFile()){
    var mimeType = mimeTypes[path.extname(fileName).split(".").reverse()[0]]   ///gets file path
    res.writeHead(200, {"Content-type": mimeType})

    var fileStream = fs.createReadStream(fileName);
    fileStream.pipe(res)
  } else if(stats.isDirectory()){
    res.writeHead(302, {
          "Location": 'index.html'
    })
    res.end()
  } else{
    res.writeHead(500, {'Content-type': 'text/plain'})
    res.write('500 Internal Error/n')
    res.end()
  }


}).listen(4000)
