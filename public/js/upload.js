function options() {
  let dir = directory.value;
  return {
    allowRevert: false,
    server: {
      url: '/upload',
      process: {
        headers: {
          dir: `${dir}`
        }
      }
    }
  }
}

function update(value) {
  directory.value = value.split(':').join('/').replace('sync/','');
  load();
}

function del(file) {
  let path = 'sync:';
  if(directory.value != '') {
    path += directory.value.split('/').join(':')+':';
  }
  console.log(`/delete/${path}${file}`);
  fetch(`/delete/${path}${file}`,{method: 'DELETE'});
  load();
}

function load() {
  document.querySelector('#files').innerHTML = '';
  fetch('/files/sync:'+directory.value.split('/').join(':')).then((res) => {if(res.redirected) location.replace(res.url); res.body.getReader().read().then((s)=>{let string='';for(let i=0; i<s.value.length; i++){string+=String.fromCharCode(s.value[i]);}document.querySelector('#files').innerHTML=string;})});
}

directory.addEventListener('change',() =>{
  load();
  FilePond.setOptions(options());
});

load();
FilePond.setOptions(options());

const inputElement = document.querySelector('input[type="file"]');
const pond = FilePond.create( inputElement );
