// 변수 선언하기
let modal = document.querySelector('.modal')
let modal_btn_down = document.querySelector('#down')
let modal_btn_up = document.querySelector('#up')
let id = document.querySelector('#alt_id')

// 이벤트 
modal_btn_down.addEventListener('click',function(){
modal.style.display = 'none'
})
modal_btn_up.addEventListener('click',change_player)



//시작화면
loadPage(1);

function loadPage(pageNumber){
  fetch(`http://localhost:3000/player/` + pageNumber)
    .then((res) => res.json())
    .then((data) => {
      const players = data.rows;
      const totalCount = data.total;

      const tbody = document.querySelector('#player_List')
      tbody.innerHTML = '';

      players.forEach((elem) => {
        const tr = makeRow(elem);
        tbody.appendChild(tr);
      });

      renderPagination(totalCount, pageNumber);
    }
  );
}

// 페이징 버튼 생성하기
function renderPagination(totalCount, currentPage){
  const paginationContainer = document.querySelector('#pagination-div')
  paginationContainer.innerHTML = ""; 

  // 총 페이지 수 계산
  const totalPages = Math.ceil(totalCount/10);

  // for문으로 버튼 생성
  for(let i =1 ; i <= totalPages; i++){
    const btn = document.createElement('button');
    btn.innerText = i;

    // 현재 보고 있는 페이지는 색깔 다르게 표시
    if (i == currentPage) {
            btn.style.fontWeight = "bold";
            btn.style.color = "purple";
        }
    // 버튼 클릭 시 해당 페이지 로딩
    btn.addEventListener('click',function(){
      loadPage(i);
    });
    paginationContainer.appendChild(btn)
  }
}



// 선수 생성하기 
function insertPlayer(){
  fetch(`http://localhost:3000/player_insert`,{     // 데이터를 보낼 주소 
    method:"post",                                  // 선수를 입력해야 하기 때문에 post 방식 사용
    headers: {'Content-Type': 'application/json'},  // post는 이런 양식으로 보냄 
    body: JSON.stringify(
                          {
    NAME : document.querySelector('#NAME').value,
    TEAM : document.querySelector('#TEAM').value,
    POSITION : document.querySelector('#POSITION').value,
    GOALS : document.querySelector('#GOALS').value,
    ASSIST : document.querySelector('#ASSIST').value  
      }
    )
  }
)
.then((res) => res.json())                            // 여기 까지가 서버에 데이터 전송 

.then((data) => 
  {
    if(data.retCode == 'OK'){                                // 에러가 나지 않을 경우에만 실행 
    let tr = makeRow(data);                                  // 받는거는 데이터 뿐이기에 그리는 함수 실행 
    document.querySelector('#player_List').appendChild(tr),
    // 빈 값 만들기
    document.querySelector('#NAME').value = '',
    document.querySelector('#TEAM').value = '',
    document.querySelector('#POSITION').value = '',
    document.querySelector('#GOALS').value = '',
    document.querySelector('#ASSIST').value =''   
    }
    else{
    alert('백엔드쪽 문제 발생')
      }
    }
  )
  .catch((err) => console.log(err));                          // 에러가 날 경우 에러를 출력 
}


//테이블에 선수 그리기
function makeRow(elem = {}){                                  // json 형식으로 받기 때문에 {}괄호 
  const tr = document.createElement("tr");

//이미지 띄우기
  const imagePath = "img/" + elem.NAME + ".png"; 
  tr.dataset.img = imagePath;

  for (let prop of ["ID","NAME","TEAM","POSITION","GOALS","ASSIST"]){  //prop에 순서대로 ID -> NAME 이런식으로 들어감 
    const td = document.createElement('td');
    td.innerHTML = elem[prop];
    tr.appendChild(td)
  }
// tr 안에 넣을 것들
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


// 선수 삭제하기 
const removeBoard = (e) => {                       // 무명함수           e는 그냥 파라미터
  const tr = e.target.parentElement.parentElement; // 삭제버튼기준 tr선택. 여기서 target이 버튼을 가르킴 
  const INO = tr.children[0].innerText;            // 글번호.

  fetch("http://localhost:3000/player_delete/" + INO)  // 서버로 삭제할 데이터 전송 
    .then((resp) => resp.json())

    .then((data) => {
      if (data.retCode == "OK") {
        // 화면에서 row 삭제.
        tr.remove();                              // 보이는 화면에서 삭제 
      } 
      else {
        alert("처리중 예외 발생.");
      }
    }
  )
    .catch((err) => {
      console.log(err);
    }
  );  
};

// 모달창 띄우기
function change(e){
  modal.style.display = "flex"
  modal_load(e)
}

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
  
    }
  )
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
  }
)
    .catch((err) => {
      console.log(err);
    }
  );
}

// 이미지 선택시 아이디값 갖오기
function select_team(teamName){
  // console.log(teamName)
fetch('http://localhost:3000/select_team/'+ teamName)
.then((resp) => resp.json())
.then((data) => {
  // console.log(data)
  if(data.retCode == 'OK'){
  document.querySelector('#player_List').innerHTML = ''
  data.rows.forEach(ele => {
  document.querySelector('#player_List').append(makeRow(ele))
    }
  )
}
  else if(data.ROWS == null){
  alert('선수가 없습니다')
        }
  else{
      alter('오류 발생')
        }
      }
    )
      .catch((err) => {
      console.log(err);
    }
  );
}



    
    


