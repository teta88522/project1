//변수 선언


function login(){
  const id = document.querySelector('#login_id').value
  const pw = document.querySelector('#login_pw').value
  fetch('http://localhost:3000/login',{
    method : 'POST',
    headers : { 'Content-Type': 'application/json'},
    body : JSON.stringify({
      ID: id,
      PW : pw
        })
    })
    .then(res => res.json())
    .then(data => {
      console.log(data.retCode)
      if (data.retCode == 'OK'){
        alert('환영합니다');
        location.href = 'index.html'; // 로그인 성공시 이동할 화면
      }
      else {
        alert(data.msg);
      }
    })
}

function create_id(){
  const name = document.querySelector('#login_name').value
  const id = document.querySelector('#login_id').value
  const pw = document.querySelector('#login_pw').value
  fetch(`http://localhost:3000/create_id`,{
    method : 'POST',
    headers : { 'Content-Type' : 'application/json'},
    body : JSON.stringify({
      NAME : name,
      ID : id,
      PW : pw,
      })
    }
  )
  .then(res => res.json())
  .then(data => {
    if(data.retCode == true){
      alert('회원가입이 완료되었습니다')
    }
    else{
      alert(data.msg);
    }
  })
}