function getCookie(cookie) {
  for(const item of document.cookie.split(';')) {
    if(item.startsWith(cookie)) {
        return item.substring(item.indexOf('=')+1)
    }
  }
}

function toggleDark() {
  document.cookie = `dark=${document.body.toggleAttribute('dark')};`
}

darkmode.addEventListener('click', toggleDark)
if(getCookie('dark')=='true') toggleDark()
