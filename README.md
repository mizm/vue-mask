# READ ME

### LINE WORKS 메시지

## Vuetify version 2.0^
   - https://vuetifyjs.com/ko/

## Line Works Developer Center
   - https://developers.worksmobile.com/kr/?lang=ko

1. 조직도
   - 조직도를 가져올때 `select * From scott.ZIHR_WORKS_ORG_V` 의 QUERY를 날림
   - ERP MONITOR API를 사용함으로 LINE WORKS 사용자 쿼리의 ID 값을 적어주면 가져옴
   - ERP ZIMON_SQLBOARD의 테이블과 같음
2. 권한
   - 코드 상 `auth`라는 변수에 부서코드가 저장되면 그 부서코드만 보임
   - 상위 부서 ex) 일동제약 "990020" , PI추진 도 추가하면 하위 부서모든 인원이 보임
3. BOT
   - `this.bots` 변수에 [ {title : "?", no : ""}]을 추가하면 됨.
   - DB에서 봇을 관리할 수 있도록 관리자 페이지 및 DB TABLE 추가 필요 
   - 이후 권한과 관련 되어서 필요한 봇만 볼 수 있게 하는 알고리즘 추가 필요
4. 사용자 - 조직도와 동일
   - ERP MONITOR API를 사용함으로 거기 있는 LINE WORKS 사용자 쿼리의 ID를 가져와야함
   - `SELECT EMPNO, HNAME, EMAIL, JIKCHAKNM, DEPT FROM ZIHR_WORKS_EMP_V`
   -  ERP ZIMON_SQLBOARD의 LINE WORKS 사용자 쿼리의 ID



