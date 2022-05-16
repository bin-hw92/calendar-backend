# calendar-backend
### 개요
혼자서 진행해보는 사이드 프로젝트 -> 책을 통해 배운 React를 응용해서 달력 할 일 공유 사이트 개발 중
- 개발 시작일 4월 27일 (실제 개발 일수 7일)
- 추후 계속 업그레이드 예정 
- 아직 호스팅 서버를 안 정해서 오픈은 X
- 프론트단 관련 소스 -> https://github.com/bin-hw92/calendar-frontend

### 할 일 공유 달력 서버(백엔드 기술)
- Koa 사용
- MongoDB 사용

### 프론트단 기술(calendar-frontend 프로젝트 내용)
  - React 사용
  - Redux-saga 사용
  - css 사용 반응형 웹으로 개발


### 현재 기능 및 앞으로 구현 내용
  - [x] 달력 화면 구현, 반응형으로
  - [x] 해당 날짜에 할 일 등록
  - [x] 여러 날짜에 걸쳐 등록 시 화면에 줄로 표시
  - [x] 라벨 기능 추가
  - [x] 오늘 버튼 추가
  - [x] 할 일 공유용 게시판 추가
  - [x] 게시판 입장 시 달력화면으로 이동 
  - [x] 게시판 비밀번호 기능 
    - [ ] 게시판 수정 및 삭제 기능 추가 예정 (삭제 시 해당 게시판에 적은 할 일 다 삭제) 

---------------------------------------------------------------------------------------------------------------------------------------------
### 화면 UI

#### 로그인 화면
![Screenshot 2022-05-12 at 17 37 09](https://user-images.githubusercontent.com/45866008/168028805-826bed67-daa7-4b00-a0a2-134ae4c4b8ff.jpg)

#### 달력 목록화면
![Screenshot 2022-05-13 at 12 31 43](https://user-images.githubusercontent.com/45866008/168206030-8885050b-669d-4ccd-ba04-33e43c0b3ba1.jpg)

#### 달력 목록화면(Loading)
![Screenshot 2022-05-13 at 12 32 08](https://user-images.githubusercontent.com/45866008/168206036-14c8d196-71cf-4653-bb21-2992b2695d53.jpg)

#### 할 일 등록화면
![Screenshot 2022-05-12 at 17 35 33](https://user-images.githubusercontent.com/45866008/168028777-b34678ae-8d1e-4b10-8dec-e2bb40bd063d.jpg)

#### 할 일 목록화면
![Screenshot 2022-05-12 at 17 36 20](https://user-images.githubusercontent.com/45866008/168028788-061b8d3a-cc59-4d65-8fa4-6334adaa9020.jpg)

#### 할 일 목록화면(Loading)
![Screenshot 2022-05-12 at 17 36 46](https://user-images.githubusercontent.com/45866008/168028793-fa8d8d01-e308-4e90-87ca-e8a7c99115ec.jpg)


#### 사용 영상
https://user-images.githubusercontent.com/45866008/168208289-5dd56bd7-1552-465f-b4a4-289ac910c0b2.mp4


#### 22-05-16 추가사항
- 게시판 등록화면 추가
- 비밀번호 입력 시 달력화면으로 입장
![Screenshot 2022-05-16 at 18 58 27](https://user-images.githubusercontent.com/45866008/168568550-849ed49d-8126-4a94-a448-3dc6b181f2f6.jpg)
![Screenshot 2022-05-16 at 18 58 46](https://user-images.githubusercontent.com/45866008/168568557-8983301a-5b74-4f51-8a2d-ea9444088412.jpg)
![Screenshot 2022-05-16 at 18 57 19](https://user-images.githubusercontent.com/45866008/168568537-97f58bf8-b803-4d4c-ab59-ebe97d6822ae.jpg)
![Screenshot 2022-05-16 at 18 58 12](https://user-images.githubusercontent.com/45866008/168568546-ece5f509-8215-4b8d-b7f0-5a2f31447b6e.jpg)


