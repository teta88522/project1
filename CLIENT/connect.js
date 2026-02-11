const removeBoard = (e) => {
  const tr = e.target.parentElement.parentElement; // 삭제버튼기준 tr선택.
  const INO = tr.children[0].innerText; // 글번호.

  fetch("http://localhost:3000/player_delete/" + INO)
    .then((resp) => resp.json())
    .then((data) => {
      console.log(data);
      if (data.retCode == "OK") {
        // 화면에서 row 삭제.
        tr.remove();
      } else {
        alert("처리중 예외 발생.");
      }
    })
    .catch((err) => {
      console.log(err);
    });
    
};

// 수정할 선수 불러오기 
function modal_load(){
const INO = tr.children[0].innerText; // 글번호.
  fetch('http://localhost:3000/select_player/' + INO)
  .then((resp) => resp.json())
  .then((data) => {
    // console.log(data.NAME)
    document.querySelector('#alt_name').value = data.NAME;
    document.querySelector('#alt_team').value = data.TEAM;
    document.querySelector('#alt_position').value = data.POSITION;
    document.querySelector('#alt_goals').value = data.GOALS;
    document.querySelector('#alt_assist').value = data.ASSIST;
  })
}


// 수정하기 
function change_player(){
  const ID = document.querySelector('#alt_id').value;
  fetch('http://localhost:3000/player_update/'+ID,{
    method : 'post',
    headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
      NAME : document.querySelector('#alt_name').value,
      TEAM : document.querySelector('#alt_team').value,
      POSITION : document.querySelector('#alt_position').value,
      GOALS : document.querySelector('#alt_goals').value,
      ASSIST : document.querySelector('#alt_assist').value  
    }),
  })
  .then((res) => res.json())
  .then((data) => {
    console.log(data);
  })

}





function makeRow(elem = {}){
  const tr = document.createElement("tr");
  for (let prop of ["ID","NAME","TEAM","POSITION","GOALS","ASSIST"]){
    const td = document.createElement('td');
    td.innerHTML = elem[prop];
    tr.appendChild(td)
  }
    // td,button 시작.
  const td = document.createElement("td");
  const btn = document.createElement("button");
  btn.innerHTML = "삭제";
  td.appendChild(btn);
  tr.appendChild(td);
  const td2 = document.createElement("td");
  const btn2 = document.createElement("button");
  btn2.innerHTML = "수정";
  td2.appendChild(btn2)
  tr.appendChild(td2)

  // btn에 이벤트 등록.
  btn.addEventListener("click", removeBoard);
  btn2.addEventListener('click',change)
  return tr;

  
}

// 모달버튼
modal = document.querySelector('.modal')
modal_btn = document.querySelector('.modal-open')
modal_btn_down = document.querySelector('#down')
modal_btn_up = document.querySelector('#up')

id = document.querySelector('#alt_id')

modal_btn.addEventListener('click',change)

function change(){
  modal.style.display = "flex"
  modal_load()
}


modal_btn_down.addEventListener('click',function(){
  modal.style.display = 'none'
})

modal_btn_up.addEventListener('click',change_player)

id.addEventListener('keypress',enter)



function enter(event){
  if (event.key === 'Enter'){
  event.preventDefault()
  modal_load()
}
}

