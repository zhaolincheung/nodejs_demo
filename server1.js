    var http = require("http");
    var url = require("url");   
    var fs = require('fs');
    var path = require('path');
    var root = '/home/zhaolianxiang1/test_nodejs'; //定义文件的根目录

    function start(route, handle) {
        function onRequest(request, response) {
            var pathname = url.parse(request.url).pathname;
            console.log("Request for " + pathname + " received.");
           
            //获取文件的后缀名
            var ext = path.extname(pathname);
            switch (ext) {
                case '.html':
                case '.css':
                case '.js':
                    var realpath = root + pathname;
                    //判断请求的文件是否存在
                    path.exists(realpath, function (exists) {
                        if (exists) {
                            //存在的话，读取文件
                            fs.readFile('.' + request.url, 'utf-8', function (err, data) {
                                if (err) throw err;
                                response.writeHead(200, {
                                    "Content-Type" : {
                                        ".html": "text/html",
                                        ".css" : "text/css",
                                        ".js"  : "application/javascript",
                                    }[ext]
                                });
                                response.write(data);
                                response.end();
                            });
                        } else {//请求的文件不存在
                            response.writeHead(404, {"Content-Type" : "text/html"});
                            response.end("<h1>404 Not Found</h1>");
                        }
                    });
                    break;
                default://其他请求进行路由
                    route(handle, pathname, response);           
            }            
        } 
        
        http.createServer(onRequest).listen(65535);
        console.log('Server has started.');
    } 
    
    exports.start = start; 
   
