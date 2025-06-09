<h1>관심사 기반 모임 앱 서비스</h1>

<img width="530" alt="스크린샷 2024-09-15 오후 3 12 04" src="https://github.com/user-attachments/assets/eefd3cc3-2538-4fac-a838-46d76ce6fa84">


### ❌ 현재 과금으로 인해 서버를 중지한 상태입니다.

<h2><a href="https://mo-gether.site"><img width="50" height="50" alt="스크린샷 2024-09-15 오후 3 30 41" src="https://github.com/user-attachments/assets/678c7a8f-e811-45e4-b338-26cdac47b880"> mo-gether 바로가기</a></h2>

<h2>소개</h2>
모게더(mo-gether)는 비슷한 취미나 관심사를 가진 사람들과 어울릴수 있는 공간을 제공하는 서비스입니다.

<h2>사용 기술(BE)</h2>

- **언어/프레임워크**: Java/Spring Boot
- **데이터베이스(DB)**: MySQL(RDS), Redis(채팅 및 캐싱)
- **인프라**: AWS, Github Actions
- **API 문서화 도구**: Swagger API


<h2>주요 기능</h2>

<h4>모임의 성격에 따른 구분</h4>

- 모임은 일회성 모임(번개), 다회성 모임(소모임)으로 구분되어 있으며, 개수 제한 없이 참여할 수 있습니다.

<h4>모임 생성 및 참여</h4>

- 로그인 한 회원은 누구든 모임을 생성하고, 모임에 참여할 수 있습니다.

- 모임을 생성한 호스트는 참여자를 퇴출시킬 수 있는 권한을 가지고 있습니다. 

<h4>모임 그룹 채팅</h4>

- 모임 생성 시 해당 모임의 그룹 채팅방이 자동으로 생성됩니다.

- 모임 참여/탈퇴 시 채팅방 입장/퇴장도 함께 이루어집니다.

<h4>관심 등록</h4>

- 관심이 있는 모임에 관심(좋아요) 등록을 하고, 마이페이지에서 해당 목록을 확인할 수 있습니다.

<h4>OAuth2 소셜 및 일반 로그인</h4>

- Google/Kakao 소셜 로그인과 id/password 기반 일반 로그인 방식을 모두 제공합니다.

<br>


<h2><a href="https://www.figma.com/design/MmmRYYwWchb3oZYJkQZ2Qb/somoim?node-id=0-1&t=4MEjRCOzUKCHpV8H-1">Figma</a></h2>

<h2><a href="https://dbdiagram.io/d/moim-669612d48b4bb5230e70aa2f">ERD</a></h2>

<img width="700" height="600" alt="ERD image" src="https://github.com/user-attachments/assets/b4181e80-c178-4f3f-afd5-ebc47920e84a">

<h2>🛠 BE infra</h2>
<img width="1047" alt="스크린샷 2024-09-22 오후 8 36 29" src="https://github.com/user-attachments/assets/fea67390-bf99-48f0-83ec-53551917ec8a">
