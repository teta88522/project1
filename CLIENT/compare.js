// [1] 페이지가 열리자마자 선수 목록을 가져옵니다.
window.onload = async function() {
    await loadPlayerList();
};

// 목록 채우기 함수
async function loadPlayerList() {
    try {
        const res = await fetch('http://localhost:3000/compare_list'); 
        const json = await res.json();

        if (json.retCode === "OK") {
            const players = json.data; 
            const select1 = document.getElementById('p1-select');
            const select2 = document.getElementById('p2-select');

            players.forEach(player => {
                // 왼쪽, 오른쪽 드롭다운에 똑같이 옵션 추가
                const option1 = document.createElement('option');
                option1.value = player.NAME; 
                option1.text = player.NAME;
                select1.appendChild(option1);

                const option2 = document.createElement('option');
                option2.value = player.NAME;
                option2.text = player.NAME;
                select2.appendChild(option2);
            });
        }
    } catch (err) {
        console.error("목록 로딩 실패:", err);
    }
}

// [2] 비교하기 버튼 누르면 실행되는 함수
async function comparePlayers() {
    const p1Name = document.getElementById('p1-select').value;
    const p2Name = document.getElementById('p2-select').value;

    // 유효성 검사
    if (p1Name === "" || p2Name === "") {
        alert("두 선수를 모두 선택해주세요!");
        return;
    }
    if (p1Name === p2Name) {
        alert("서로 다른 선수를 선택해주세요!");
        return;
    }

    try {
        // 서버에 데이터 요청
        const res = await fetch(`http://localhost:3000/compare/data?p1=${p1Name}&p2=${p2Name}`);
        const json = await res.json();

        if (json.retCode === "NG") {
            alert(json.msg); return;
        }

        const data = json.data; 
        
        // 데이터 매칭 (순서가 섞일 수 있으므로 이름으로 찾음)
        const player1 = data.find(p => p.NAME === p1Name) || data[0];
        const player2 = data.find(p => p.NAME !== player1.NAME) || data[1];

        // 1. 카드 보여주기
        document.getElementById('comparison-card').style.display = 'flex';

        // 2. 화면에 정보 뿌리기
        renderPlayer(1, player1);
        renderPlayer(2, player2);

        // 3. 스탯 그래프 업데이트
        updateStat('goal', player1.GOALS, player2.GOALS);
        updateStat('assist', player1.ASSIST, player2.ASSIST);
        
        // 4. 종합 승자 배지 (골+어시 합계)
        const total1 = player1.GOALS + player1.ASSIST;
        const total2 = player2.GOALS + player2.ASSIST;
        
        document.getElementById('badge-1').style.display = total1 >= total2 ? 'block' : 'none';
        document.getElementById('badge-2').style.display = total2 >= total1 ? 'block' : 'none';

    } catch (err) {
        console.error(err);
        alert("오류 발생!");
    }
}

// 화면 그리기 도우미 함수
function renderPlayer(num, data) {
    document.getElementById(`name-${num}`).innerText = data.NAME;
    document.getElementById(`team-${num}`).innerText = data.TEAM;
    document.getElementById(`stadium-${num}`).innerText = data.STADIUM || "경기장 정보 없음"; // JOIN 결과!
    
    // 이미지 처리
    const imgPath = `img/${data.NAME}.png`;
    const imgTag = document.getElementById(`img-${num}`);
    imgTag.src = imgPath;
    imgTag.onerror = function() { this.src = 'img/리그.png'; }; // 이미지 없으면 기본값
}

// 그래프 그리기 도우미 함수
function updateStat(type, val1, val2) {
    // 숫자 넣기
    document.getElementById(`${type}-1`).innerText = val1;
    document.getElementById(`${type}-2`).innerText = val2;

    // 퍼센트 계산
    const total = val1 + val2;
    // 0으로 나누기 방지
    const p1Percent = total === 0 ? 50 : (val1 / total) * 100;
    const p2Percent = total === 0 ? 50 : (val2 / total) * 100;

    // 바 길이 조절
    document.getElementById(`${type}-bar-1`).style.width = `${p1Percent}%`;
    document.getElementById(`${type}-bar-2`).style.width = `${p2Percent}%`;

    // 진 쪽(점수 낮은 쪽) 색상 어둡게 처리
    const bar1 = document.getElementById(`${type}-bar-1`);
    const bar2 = document.getElementById(`${type}-bar-2`);
    
    bar1.classList.remove('loser');
    bar2.classList.remove('loser');

    if (val1 < val2) bar1.classList.add('loser');
    if (val2 < val1) bar2.classList.add('loser');
}