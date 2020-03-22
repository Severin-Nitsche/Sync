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

function remove(file, directory) {
  files.forEach((item) => {
    if(item.file == file && item.directory == directory) {
      files.splice(item,1)
    }
  })
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
