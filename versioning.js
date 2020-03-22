const fs = require('fs')

var files = require('./sync/files.json')

function reload() {
  fs.readFile('sync/files.json',(err, data) => {
    if(err) throw err
    files = JSON.parse(data)
  })
}

function add(file, directory) {
  let succes = false
  files.forEach((item, i) => {
    if(item.file == file && item.directory == directory) {
      item.time = Date.now()
      succes = true
    }
  });

  if(!succes) files.push({file, directory, time: Date.now()})
  serialize()
}

function simplify(dir) {
  if(dir.endsWith('/')) {
    return dir.substring(0,dir.length-1)
  } else {
    return dir
  }
}

function remove(file, directory) {
  files = files.filter((item) => {
    console.log('next item')
    console.log(file)
    console.log(item.file)
    console.log(simplify(item.directory))
    console.log(simplify(directory))
    return !(item.file == file && simplify(item.directory) == simplify(directory))
  })
  console.log(files)
  serialize()
}

function serialize() {
  let data = JSON.stringify(files)
  fs.writeFile('sync/files.json', data, err => {
    if(err) throw err
  })
}

module.exports.reload = reload
module.exports.add = add
module.exports.remove = remove
