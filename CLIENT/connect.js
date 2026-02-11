// 모달버튼
let modal = document.querySelector('.modal')
let modal_btn_down = document.querySelector('#down')
let modal_btn_up = document.querySelector('#up')
let id = document.querySelector('#alt_id')

const removeBoard = (e) => {
  const tr = e.target.parentElement.parentElement; // 삭제버튼기준 tr선택.
  const INO = tr.children[0].innerText; // 글번호.

  fetch("http://localhost:3000/player_delete/" + INO)
    .then((resp) => resp.json())
    .then((data) => {
      // console.log(data);
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
const modal_load = (e) => {

  const tr = e.target.parentElement.parentElement; // 삭제버튼기준 tr선택.
  const INO = tr.children[0].innerText; // 글번호.

    fetch('http://localhost:3000/select_player/' + INO)
  .then((resp) => resp.json())
  .then((data) => {
    // console.log(data.NAME)
    document.querySelector('#alt_id').value = INO;
    document.querySelector('#alt_name').value = data.NAME;
    document.querySelector('#alt_team').value = data.TEAM;
    document.querySelector('#alt_position').value = data.POSITION;
    document.querySelector('#alt_goals').value = data.GOALS;
    document.querySelector('#alt_assist').value = data.ASSIST;
  
  })



}


function makeRow(elem = {}){
  const tr = document.createElement("tr");

  //이미지 띄우기
  const imagePath = "img/" + elem.NAME + ".png"; 
  tr.dataset.img = imagePath;

  for (let prop of ["ID","NAME","TEAM","POSITION","GOALS","ASSIST"]){
    const td = document.createElement('td');
    td.innerHTML = elem[prop];
    tr.appendChild(td)
  }
    // td,button 시작.
  const td = document.createElement("td");
  const btn = document.createElement("button");
  btn.innerHTML = "삭제";
  td.setAttribute('id','blue')
  td.appendChild(btn);
  tr.appendChild(td);
  const td2 = document.createElement("td");
  td2.setAttribute('id','red')
  const btn2 = document.createElement("button");
  btn2.innerHTML = "수정";
  td2.appendChild(btn2)
  tr.appendChild(td2)

  // btn에 이벤트 등록.
  btn.addEventListener("click", removeBoard);
  btn2.addEventListener('click',change)

  // [추가 2] tr에 마우스를 올렸을 때 (Hover) -> 이미지 변경
  tr.addEventListener("mouseover", function() {
    const mainPhoto = document.getElementById("photo"); // 상단 큰 이미지 태그
    mainPhoto.src = this.dataset.img; // 미리 심어둔 주소로 교체
  });

  // [추가 3] tr에서 마우스가 떠났을 때 (Out) -> 기본 이미지(ars.png)로 복구
  tr.addEventListener("mouseout", function() {
    const mainPhoto = document.getElementById("photo");
    mainPhoto.src = "img/리그.png"; // 기본 이미지 경로
  });
  return tr;

  
}



function change(e){
  modal.style.display = "flex"
  modal_load(e)
}


modal_btn_down.addEventListener('click',function(){
  modal.style.display = 'none'
})

modal_btn_up.addEventListener('click',change_player)


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
    // console.log(data);
    if(data.retCode == 'OK'){
    table = document.querySelectorAll('#player_List tr')
    // console.log(table)
    for (let i of table){
      let row = i.children[0].innerText
      console.log(row)
      if(row == ID){
        i.children[1].innerText = document.querySelector('#alt_name').value;
        i.children[2].innerText = document.querySelector('#alt_team').value;
        i.children[3].innerText = document.querySelector('#alt_position').value;
        i.children[4].innerText = document.querySelector('#alt_goals').value;
        i.children[5].innerText = document.querySelector('#alt_assist').value;
        modal.style.display ='none';
        break;
      }
    }
    }
    else{
      alert('오류 발생')
    }
  })
    .catch((err) => {
      console.log(err);
    });

}

// 이미지 선택시 아이디값 갖오기
function select_team(teamName){
  console.log(teamName)
fetch('http://localhost:3000/select_team/'+ teamName)
.then((resp) => resp.json())
.then((data) => {
  console.log(data)
  // console.log(data.NAME)
  if(data.retCode == 'OK'){
  document.querySelector('#player_List').innerHTML = ''
  data.rows.forEach(ele => {
  document.querySelector('#player_List').append(makeRow(ele))
  })
    }
  else if(data.ROWS == null){
  alert('선수가 없습니다')
        }
  else{
      alter('오류 발생')
    }
      })
      .catch((err) => {
      console.log(err);
  });

  
}

    fetch(`http://localhost:3000/player/1`)
    .then((res) => res.json())
    .then((data) => {
      data.forEach((elem) => {
        // console.log(elem)
        const tr = makeRow(elem);
document.querySelector("tbody").appendChild(tr);
      });
    });



    function insertPlayer(){
      fetch(`http://localhost:3000/player_insert`,{
        method:"post",
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
        NAME : document.querySelector('#NAME').value,
        TEAM : document.querySelector('#TEAM').value,
        POSITION : document.querySelector('#POSITION').value,
        GOALS : document.querySelector('#GOALS').value,
        ASSIST : document.querySelector('#ASSIST').value  
        }),
      })
      .then((res) => res.json())
      .then((data) => {
        // console.log(data)
        if(data.retCode == 'OK'){
          let tr = makeRow(data);
          // console.log(tr)
          document.querySelector('#player_List').appendChild(tr),

        // 빈 값 만들기
        document.querySelector('#NAME').value = '',
        document.querySelector('#TEAM').value = '',
        document.querySelector('#POSITION').value = '',
        document.querySelector('#GOALS').value = '',
        document.querySelector('#ASSIST').value =''   
    }
        else{
          alert('hi')
        }
      })
      .catch((err) => console.log(err));
    }
    
    


