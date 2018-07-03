'use strict'
const mime = require('mime');
const http = require('http');
const path = require('path');
const url  = require('url');
const fs   = require('fs');
var qs =require('querystring');

const MongoClient = require('mongodb').MongoClient
            , assert = require('assert');
var items = [];
const root=__dirname;
var cache={};
//var filePath;
function show(res,req) {
    res.statusCode = 200;
    req=req.setEncoding('utf-8');
    var absPath = "."+ url.parse(req.url).pathname;
    console.log("absPath",absPath);

    var pathroot = path.join(root,url.parse(req.url).pathname);
    if (req.url==='/'){
        var filePath = '/7.2test.html';
        var absPath = "."+ filePath;
        pathroot = path.join(root,filePath);
        serverStatic(res,cache,absPath)
    }   else {
        //filePath = req.url;
        serverStatic(res,cache,absPath)
    }
}

function notFound(res){
    res.statusCode=404;
    res.setHeader('Content-Type','text/plain');
    res.end('Not Found');
}

function badRequest(res){
    res.statusCode = 400;
    res.setHeader('Content-Type','text/plain');
    res.end('Bad Request')
}
function add (req,res){
    
        var body = '';
        req.setEncoding('utf8');
        req.on('data',function(chunk){ body += chunk});
        
        req.on('end',function(){
            console.log("body="+body);
            var obj = qs.parse(body);
            console.log(url.parse(req.url).pathname);
            var aaa=decodeURIComponent(url.parse(req.url).pathname);
            var reg=/[\u4E00-\u9FA5 A-Z a-z 0-9 _ ()（）\- ]+/;
            var bbb=aaa.match(reg);
            
            console.log(aaa);
            console.log(bbb);
            console.log(typeof bbb);
            //console.log(bbb[0])


            //被上面替换items.push(obj.item);
            // Connection URL
            var url1 = 'mongodb://localhost:27017/biask';
            MongoClient.connect(url1,function(err, db) {
            assert.equal(null, err);
            console.log("Connected successfully to server");
            var name=null;
            if (bbb!=null){name=bbb[0]}
            
            //被以上替换var name=items[items.length-1]
            findoneDocuments(db, name,function(docs) {
                items.push(docs);
                res.statusCode = 200;
                req=req.setEncoding('utf-8');
                //console.log(docs[0])
                var doc=JSON.stringify(docs[0]);
                //var doc=(docs[0])
                console.log("docs[0]type="+typeof doc);
                var filepath=url.parse(req.url).pathname;
                sendFile(res,filepath,doc);

                db.close();
                });
            });   
        })
}
var findoneDocuments=function(db,name,callback){
    var collection=db.collection('person_region');
    collection.find( { '_id' : name}).toArray(function(err, docs) {
            assert.equal(err, null);
            console.log("Found the following records");
            callback(docs);           
        });
    }
//==============================================
const server = http.createServer((req,res) =>{

    //if ('/' === req.url) {
        switch (req.method) {
            case 'GET':
            console.log("GET请求到了")
            console.log(url.parse(req.url).pathname);
              show(res,req);
              
              break;
            case 'POST':
              console.log("POST请求到了");
              console.log(url.parse(req.url).pathname);
              add(req,res);
              
              break;
            default :
              badRequest(res);
        }
   // } else {
  //      notFound(res);
  //  }
});
server.listen(8080);

function serverStatic(response,cache,absPath){
    if (cache[absPath]){
        sendFile(response,absPath,cache[absPath]);  
    } else {
        //console.log("absPath="+absPath)
        fs.exists(absPath,function(exists){
            if (exists) {
                fs.readFile(absPath,function(err,data){
                    //console.log("absPath="+absPath)
                    if (err){
                        send404(response);
                    } else {
                        cache[absPath] = data;
                        sendFile(response,absPath,data);
                    }
                })
            } else {
                
                send404 (response);//调用另一个处理函数
            }
        });
    }
}

function sendFile(response,filePath,fileContents){
    
    response.writeHead(200,
    {"Content-Type" : mime.getType(path.basename(filePath))} 
    );
    console.log("mime.getType(path.basename(filePath))"+mime.getType(path.basename(filePath)));
    console.log(fileContents);
    response.end(fileContents);
};

function send404(response){
    response.writeHead(404,{'Content-Type':'text/plain'});
    response.write('error 404 :resource not not not found.');
    response.end();
}






































/*




function serverStatic(response,cache,absPath){
    if (cache[absPath]){
        sendFile(response,absPath,cache[absPath]);  
    } else {
        console.log("absPath="+absPath)
        fs.exists(absPath,function(exists){
            if (exists) {
                fs.readFile(absPath,function(err,data){
                    console.log("absPath="+absPath)
                    if (err){
                        send404(response);
                    } else {
                        cache[absPath] = data;
                        sendFile(response,absPath,data);
                    }
                })
            } else {
                
                send404 (response);//调用另一个处理函数
            }
        });
    }
}

function sendFile(response,filePath,fileContents){
    console.log("path.basename(filePath)= "+path.basename(filePath))
    console.log("filePath= "+filePath)
    console.log("mime.getType(path.basename(filePath))= "+mime.getType(path.basename(filePath)))
    response.writeHead(200,
    {"Content-Type" : mime.getType(path.basename(filePath))} 
    );
    
    response.end(fileContents);
};

function send404(response){
    response.writeHead(404,{'Content-Type':'text/plain'});
    response.write('error 404 :resource not not not found.')
    response.end();
}

const root=__dirname;
var cache={};
var filePath;
const server = http.createServer((req, res) => {

//const myURL =new URL(req.url);
console.log("req.url="+req.url)
  res.statusCode = 200;
  //res.setHeader('Content-Type', 'text/plain');

  req=req.setEncoding('utf-8')
  var pathroot = path.join(root,url.parse(req.url).pathname);


  if (req.url==='/'){
    filePath = '/index.html';
    var absPath = "."+ filePath;
    pathroot = path.join(root,filePath);
    console.log("pathroot= "+pathroot)

    serverStatic(res,cache,absPath)
} else {
    
    console.log(typeof req+"==="+req)  
    console.log(typeof req.url+"====="+req.url)
    console.log(req.method)  
    console.log(req.url);
    console.log(url.parse(req.url))
    console.log("pathroot="+pathroot)
    //filePath = req.url;
}

  //res.end('Hello World!\n');
});

server.listen(port, hostname, () => {
  console.log(`服务器运行在 http://${hostname}:${port}/`);
});
*/