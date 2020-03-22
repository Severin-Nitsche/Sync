const fs = require('fs');
const express = require('express');
const fileUpload = require('express-fileUpload');
const session = require('express-session');
const versioning = require('./versioning.js');
const app = express();
const sync = 'sync/'
app.listen(3000, () => console.log('listening @3000'));
app.use(express.static('public'));
app.use(fileUpload());
app.use(session({
  secret: 'shuidute803jisxik',
  resave: false,
  saveUninitialized: true
}));

function authenticate(user, password) {
  return user == 'Severin' && password == 'Password';
}

function element(file, folder) {
  folder = folder.split(':').join('/'); //folder in the form of foo/bar
  let dir = folder.endsWith(':')?folder:folder+':'; //folder in the form of foo:bar:
  let res;
  if(fs.lstatSync(folder+'/'+file).isDirectory()) {
    res = '<p><button onclick=update("'+dir+file+'")>'+file+'</button></p>';
  } else {
    res = '<p>'+file+'</p>';
  }
  res += '<button onclick="del(\''+file+'\')">delete</button>'
  return res;
}

function error(err, response) {
  if(err) {
    response.status(500);
  }
}

app.post('/upload', (request, response) => {

  if(!authenticate(request.session.user, request.session.pwd)) {
    response.writeHead(302,{'Location':'/login'})
    reponse.end()
    return
  }

  let file = request.files.filepond;
  let dir = request.header('dir');
  dir = dir + (dir.endsWith('/')?'':'/');

  if (!fs.existsSync(sync+dir)){
      fs.mkdirSync(sync+dir, {recursive: true});
  }

  file.mv(sync+dir+file.name, (err) => error(err, response));
  versioning.add(file.name, dir);
  response.end();
});

app.get('/files/:directory', (request, response) => {

  if(!authenticate(request.session.user, request.session.pwd)) {
    response.writeHead(302,{'Location':'/login'})
    response.end()
    return
  }

  let folder = request.params.directory;
  folder = folder.split(':').join('/');
  if(!fs.existsSync(folder)){
    response.end();
    return;
  }
  let res = ''
  let files = fs.readdirSync(folder);
  files.forEach(file => {
    res += element(file,request.params.directory);
  });
  response.send(res);
  response.end();
});

app.delete('/delete/:path', (request,response) => {

  if(!authenticate(request.session.user, request.session.pwd)) {
    response.writeHead(302,{'Location':'/login'})
    reponse.end()
    return
  }

  let path = request.params.path;
  console.log(path)

  if(!path.startsWith('sync')) {
    response.status(403).send();
    return;
  }

  path = path.split(':').join('/');
  console.log(path)
  if(fs.lstatSync(path).isDirectory()) {
    fs.rmdir(path,(err) => error(err, response));
  } else {
    fs.unlink(path,(err) => error(err, response));
  }
  let f = path.substring(path.lastIndexOf('/')+1);
  let d = path.substring(4,path.lastIndexOf('/')+1);
  console.log(f)
  console.log(d)
  versioning.remove(f,d)
  response.end();
});

app.post('/login', (request,response) => {
  let user = request.header('user');
  let pwd = request.header('pwd');
  if(authenticate(user, pwd)) {
    response.writeHead(302,{'Location':'/'});
    request.session.user = user;
    request.session.pwd = pwd;
  }
  response.end();
});

app.get('/download/:path', (request,response) => {
  let path = request.params.path.split(':').join('/');
  if(!path.startsWith('sync')) {
    response.status(403).send();
    return;
  }
  response.download(path);
});
