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
  td2.appendChild(btn2);
  tr.appendChild(td2);

  // btn에 이벤트 등록.
  btn.addEventListener("click", removeBoard);
  return tr;

  
}