const fs = require('fs')

function index(directory, data, remove) {
  let files = fs.readdirSync(directory)
  files.forEach(file => {
    if(fs.lstatSync(directory+'/'+file).isDirectory()) {
      index(directory+'/'+file, data, remove)
    } else {
      data.push({file: file, directory: directory.replace(remove,''), time: fs.statSync(directory+'/'+file).mtime})
    }
  })
}

let data = [];
index('sync', data, 'sync')
console.log(data)
fs.writeFile('sync/files.json', JSON.stringify(data), err => {
  if(err) throw err
})
