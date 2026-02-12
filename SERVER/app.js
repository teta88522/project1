const express = require('express');                 // Express를 사용하여 브라우저에서 접속 할 수 있는 문 만들기
const session = require('express-session')
const {getConnection,oracledb}  = require('./db')   // 메인 파일 상단에서 require를 사용해 DB 파일을 변수에 담으세요.
const app = express() ;                             //express 객체를 생성 (서버 앱의 본체)
const port = 3000;                                  // 서버가 사용할 포트 번호(사용자가 들어오는 곳)

const cors = require('cors'); //cors 영역 처리       // cors 모듈 불러오기 

app.use(cors());                                    //보안상 데이터를 주고받기 위해 걸리는거 허용


app.use(express.json());                            // 미들웨어 설정: 클라이언트가 보낸 JSON 형식의 데이터를 서버가 읽을 수 있게 변환해줌

app.use(session({                                   //세션 장착(서버가 기억력을 가짐)
  secret : 'mySecretKey',
  resave : false,
  saveUninitialized:true
}))

//--------------------------------------------------------------------------------------------------// 여기 까지 모듈 환경설정

// 라우팅: 사용자가 브라우저 주소창에 '/' (메인 주소)를 입력하고 들어왔을 때 실행할 일

// 시작 화면 
app.get("/player/:page", async (req, res) => {
  const page = req.params.page;
  const conn = await getConnection();
  const { metaData, rows } = await conn.execute(
    `select *
from players
order by ID
offset (:page -1) * 10 rows fetch next 10 rows only`,
{page}
  );
  const countResult = await conn.execute(
    'select COUNT(*) AS CNT FROM PLAYERS'
  )

  const totalCount = countResult.rows[0].CNT
  console.log(totalCount)
  res.json({
    rows : rows,
    total: totalCount
  });
});

// 선수 생성하기
app.post("/player_insert", async(req,res) => {
  const {NAME,TEAM,POSITION,GOALS,ASSIST} = req.body         // req.body(html에서 입력받은 값들) 변수명과 key값이 같은곳으로 자동 배정됨 
  // console.log(req.body);
  const conn = await getConnection();
  const result = await conn.execute(
    `insert into players (ID,NAME,TEAM,POSITION,GOALS,ASSIST)
    values((SELECT NVL(MAX(ID),0) +1 FROM players),
    :NAME,
    :TEAM,
    :POSITION,
    :GOALS,
    :ASSIST)
    returning ID into :INO`,

    { //여기가 입력창이라 생각하면 됨 여기 값이 위에 입력되어야 하는 부분에 접속 
      INO : {dir: oracledb.BIND_OUT, type: oracledb.NUMBER}, // 서버 -> 오라클이 아닌 오라클에서 서버로 데이터를 꺼내오겠다는 뜻
      NAME : NAME,
      TEAM : TEAM,
      POSITION:POSITION,
      GOALS:GOALS,
      ASSIST:ASSIST
  },
  {autoCommit:true},  // 자동으로 커밋하기 
  );
  // 정상적으로 이루어지면 결과값 넘기기
  if (result.rowsAffected){
    res.json({retCode:'OK',
      ID : result.outBinds.INO[0],
      NAME : NAME,                 //맨위에 req.body 해놓은 것들 어찌보면 다시 리턴?
      TEAM : TEAM,
      POSITION : POSITION,
      GOALS : GOALS ,
      ASSIST : ASSIST 
    },
  );
}
  else{
    res.json({retCode: "NG"});
    }
  }
);


// 글삭제.
app.get("/player_delete/:INO", async (req, res) => {
  // console.log(req.params.INO); // req.params 속성.
  const conn = await getConnection();
  const result = await conn.execute(
    `DELETE FROM players WHERE ID = :INO`,
    { INO: req.params.INO },
    { autoCommit: true },
  );
  // 정상삭제되면 OK, 삭제못하면 NG
  if (result.rowsAffected) {
    res.json({ retCode: "OK" }); // { "retCode": "OK" }
  } else {
    res.json({ retCode: "NG" });
  }
});

// 선택한 팀 조회
app.get("/select_team/:team", async(req,res) =>{
  const conn = await getConnection();
  const result = await conn.execute(
    `select * 
    from players
    where team = :team`,
    {team : req.params.team},
    {autoCommit : true}
  );
  // console.log(result)
  if (result.rows.length > 0){
    res.json({retCode:'OK',
              rows : result.rows  
    },
  );
}
  else{
    res.json({retCode: "NG"});
    }
  }
)





// 수정할 선수 값 받아오기
app.get("/select_player/:INO",async (req,res) => {
  const conn = await getConnection();
  const result = await conn.execute(
    `SELECT * FROM players WHERE ID = :INO`,
    {INO : req.params.INO},
  );
    if (result.rows.length > 0) {
      const player = result.rows[0];
  
    res.json({ retCode: "OK",
      NAME:player.NAME,
      TEAM : player.TEAM,
      POSITION : player.POSITION,
      GOALS : player.GOALS,
      ASSIST : player.ASSIST


     }); // { "retCode": "OK" }
  } else {
    res.json({ retCode: "NG" });
  }
})

//수정
app.post('/player_update/:ID',async(req,res) =>{
  console.log(req.params); 
  const {NAME,TEAM,POSITION,GOALS,ASSIST} = req.body
  const conn = await getConnection();
  const result = await conn.execute(
    `update players
      set NAME = :NAME
        ,TEAM = :TEAM
          ,POSITION = :POSITION
            ,GOALS = :GOALS
              ,ASSIST = :ASSIST
                WHERE ID = :ID`,
              {ID : req.params.ID,
                NAME : NAME,
                TEAM : TEAM,
                POSITION : POSITION,
                GOALS : GOALS,
                ASSIST : ASSIST
              },
              {autoCommit:true},
  );
  console.log(req.params.ID)
  if (result.rowsAffected) {
    res.json({ retCode: "OK" ,
      ID : req.params.ID,
      NAME : NAME,
      TEAM : TEAM,
      POSITION : POSITION,
      GOALS : GOALS,
      ASSIST : ASSIST      
    }

    ); // { "retCode": "OK" }
  } else {
    res.json({ retCode: "NG" });
  }
})




// 서버 실행: 설정한 포트(3000)에서 대기 시작
app.listen(port, () => {
  console.log('server 실행됨') 
}
);


// ------------------------------------------ 로그인 창 만들기 
app.post('/login',async(req,res) => {
  const{ID,PW} = req.body;
  const conn  = await getConnection();
  const result = await conn.execute(
    `SELECT * FROM members WHERE ID = :id AND pw = :pw`,
      {iD : ID,pw:PW},
      {autoCommit:true}
    );
    if (result.rows.length > 0){
      console.log(ID,PW)
      // 세션에 기록
      req.session.isLogined = true;
      req.session.userName = result.rows[0][0]; // 이름 저장
      req.session.save(() => {                  // 세션 저장후 응답
        res.json({retCode : 'OK', msg: '로그인 성공'});
      });
    }
    else {
      console.log(ID,PW)
      res.json({retCode : 'fail', msg: '아이디 혹은 비밀번호 틀림'});

    }
  }
)


// 회원가입
app.post('/create_id', async(req,res) => {
  const {NAME,ID,PW} = req.body;
  console.log(NAME,ID,PW)
  const conn = await getConnection();
  const result = await conn.execute(
    `INSERT INTO members values(:un,:id,:pw)`,
    {un : NAME, id : ID , pw : PW},
    {autoCommit:true}
  );
  if(result.rowsAffected){
    res.json({retCode : true});
  }
  else{
    res.json({retCode : fail ,msg:'중복된 닉네임 이거나 아이디 입니다'})
    }
  }
)

// ------------------------------------------------------------------------ 선수 비교 창 만들기
app.get('/compare_list',async(req,res) => {          // 드롭 다운 용 선수 이름 가져오기
  const conn = await getConnection()
  const result = await conn.execute(
    `SELECT NAME FROM PLAYERS ORDER BY NAME ASC`
  )
  res.json({retCode:'OK',data:result.rows})
  }
)

// 선수 데이타 가져오기
app.get('/compare/data',async(req,res) =>{
  const {p1,p2} = req.query;
  const conn = await getConnection();
  const result = await conn.execute(
    `SELECT P.NAME, P.TEAM, P.GOALS, P.ASSIST, t.STADIUM
    FROM players p LEFT join team t ON p.team = t.name
    WHERE p.name = :p1 OR p.name = :p2`,
    {p1 : p1, p2 : p2 }
  )
  if(result.rows.length > 0){
    res.json({retCode : 'OK', data : result.rows})
  }
  else{
    res.json({retCode:'NG', msg : '선수를 찾을수 없습니다'})
    }
  }
)

