CREATE TABLE members(
    UN varchar2(50) CONSTRAINT mm_un_nn not null,
    ID varchar2(50) CONSTRAINT mm_id_pk primary key,
    pw varchar2(50)
);

INSERT INTO members
values('신재성','wotjd','1234');

select * from players;

ALTER TABLE members
ADD CONSTRAINT mm_un_uq unique(UN);

INSERT INTO members values(:un,:id,:pw);

select COUNT(*) AS CNT FROM PLAYERS;

update players SET ID = 5 WHERE name = '세메뇨';

-- 1. 뉴캐슬 유나이티드 (Newcastle) 선수 3명
INSERT INTO players 
VALUES ((SELECT NVL(MAX(ID),0) +1 FROM players),'알렉산더이삭', '뉴캐슬', '스트라이커', 14, 1);

INSERT INTO players 
VALUES ((SELECT NVL(MAX(ID),0) +1 FROM players),'앤서니고든', '뉴캐슬', '윙어', 8, 7);

INSERT INTO players 
VALUES ((SELECT NVL(MAX(ID),0) +1 FROM players),'하비반스', '뉴캐슬', '윙어', 5, 3);

-- 2. 토트넘 홋스퍼 (Tottenham) 선수 3명
INSERT INTO players  
VALUES ((SELECT NVL(MAX(ID),0) +1 FROM players),'손흥민', '토트넘', '윙어', 15, 9);

INSERT INTO players 
VALUES ((SELECT NVL(MAX(ID),0) +1 FROM players),'히샬리송', '토트넘', '스트라이커', 11, 4);

INSERT INTO players 
VALUES ((SELECT NVL(MAX(ID),0) +1 FROM players),'브레넌존슨', '토트넘', '윙어', 6, 6);

-- 3. 저장 확정 (필수!)
COMMIT;

ALTER TABLE team ADD stadium varchar2(100);
-- 토트넘

UPDATE TEAM SET STADIUM = 'Tottenham Hotspur Stadium' WHERE NAME = '토트넘';

-- 맨시티
UPDATE TEAM SET STADIUM = 'Etihad Stadium' WHERE NAME = '맨시티';

-- 아스날
UPDATE TEAM SET STADIUM = 'Emirates Stadium' WHERE NAME = '아스날';

-- 맨유
UPDATE TEAM SET STADIUM = 'Old Trafford' WHERE NAME = '맨유';

-- 첼시
UPDATE TEAM SET STADIUM = 'Stamford Bridge' WHERE NAME = '첼시';

-- 리버풀
UPDATE TEAM SET STADIUM = 'Anfield' WHERE NAME = '리버풀';

-- 뉴캐슬
UPDATE TEAM SET STADIUM = 'St James Park' WHERE NAME = '뉴캐슬';

-- 아스톤빌라
UPDATE TEAM SET STADIUM = 'Villa Park' WHERE NAME = '아스톤빌라';

select * from team;