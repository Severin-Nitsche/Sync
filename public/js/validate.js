async function validate() {
  let user = document.querySelector('#user').value;
  let pwd = document.querySelector('#password').value;
  let options = {
    method: 'POST',
    headers: {
      user,
      pwd
    }
  }
  let answer = await fetch('/login',options)
  if(answer.redirected) {
    location.replace(answer.url)
  }
}
