function toggleDark() {
  document.cookie = document.body.toggleAttribute('dark')?'dark':''
}

darkmode.addEventListener('click', toggleDark)
if(document.cookie == 'dark') toggleDark()
