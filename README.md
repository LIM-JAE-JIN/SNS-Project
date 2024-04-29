# 📝 소개

- **프로젝트명** : SNS 소셜 서비스
- **기간** : 2024년 3월 25일 ~ 2024년 4월 26일
- **주제** : 인기있는 SNS 중 하나인 인스타그램의 주요 기능을 기반으로 NestJS 및 개발 숙련도 증진을 위해 진행한 개인 프로젝트.
<br>

# ⚒ 기술 스택

<br>

<div dir="auto">
<img src="https://img.shields.io/badge/postgreSQL-4479A1?style=for-the-badge&logo=postgreSQL&logoColor=white">
<img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=Node.js&logoColor=white">
<img src="https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=NestJS&logoColor=white">
<img src="https://img.shields.io/badge/Typeorm-262627?style=for-the-badge&logo=Typeorm&logoColor=white">
<img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=TypeScript&logoColor=white">
<img src="https://img.shields.io/badge/Web Socket-010101?style=for-the-badge&logo=socketdotio&logoColor=white">
<img src="https://img.shields.io/badge/multer-4479A1?style=for-the-badge&logo=multer&logoColor=white">
<img src="https://img.shields.io/badge/rxjs-fef?style=for-the-badge&logo=rxjs&logoColor=white">
<img src="https://img.shields.io/badge/Git-F05032?style=for-the-badge&logo=Git&logoColor=white">
<img src="https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=GitHub&logoColor=white">
<img src="https://img.shields.io/badge/Postman-181717?style=for-the-badge&logo=Postman&logoColor=white">
<img src="https://img.shields.io/badge/PgAdmin-181717?style=for-the-badge&logo=Pgadmin&logoColor=white">
</div>

<br>

# 📒 ERD

[https://dbdiagram.io/d/Final_Project_HappyMoney-658a371b89dea6279988f566](https://dbdiagram.io/d/SNS-Project-662f1ef65b24a634d0075441)

<br>

## 환경변수

`.env` 파일 생성 후 아래 내용 입력 (env-keys.const.ts 파일 참조)

```
PROTOCOL= http
HOST= localhost:3000
DB_HOST= DB 엔드포인트 주소
DB_PORT= DB 포트번호
DB_USERNAME= 사용자 명
DB_PASSWORD= 비밀번호
DB_DATABASE= DB 이름
HASH_ROUNDS= 로그인 비밀번호 해시 생성 강도
JWT_SECRET= JWT 생성 및 검증 키
```

## 실행 방법

```sh
yarn install
yarn start:dev
```
