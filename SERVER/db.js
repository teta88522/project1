const oracledb = require('oracledb'); // oracle db 접속을 위한 드라이버 모듈 불러옴

// 결과물 설정:db에서 데이터 가져올때 배열이 아닌 객체(key:value) 형태로 받겠따
oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT

// 비동기 함수: db 접속은 시간이 걸리는 작업 -> 즉 기다리지 않고 실행하기 위해 async 사용
async function getConnection(){
  // 실제로 db 접속 시도 그 연결권(session)을 반환
  return await oracledb.getConnection({ //위쪽 대문자 c가 다름 완전히 다른 함수
    user: 'scott', 
    password: 'tiger',
    connectString:`192.168.0.46:1521/xe` // DB 주소(IP:포트/서비스이름)

  });
}
// module.exports: 이 함수와 객체를 다른 파일(app.js 등)에서 가져다 쓸수 있도록 내보냄
module.exports = {getConnection, oracledb};
