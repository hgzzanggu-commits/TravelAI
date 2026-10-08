<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">

  <title>TravelAI</title>

  <link rel="stylesheet" href="style.css">
</head>

<body>

  <main class="container">

    <header class="header">
      <h1>✈️ TravelAI</h1>
      <p>AI와 함께 나만의 여행 계획을 만들어보세요.</p>
    </header>


    <!-- 여행 계획 입력 -->
    <section class="travel-form">

      <h2>🌍 여행 계획 만들기</h2>

      <div class="form-group">
        <label for="destination">여행지</label>

        <input
          type="text"
          id="destination"
          placeholder="예: 일본 오사카"
        >
      </div>


      <div class="form-row">

        <div class="form-group">
          <label for="nights">숙박</label>

          <select id="nights">
            <option value="1">1박 2일</option>
            <option value="2">2박 3일</option>
            <option value="3" selected>3박 4일</option>
            <option value="4">4박 5일</option>
            <option value="5">5박 6일</option>
            <option value="6">6박 7일</option>
          </select>
        </div>


        <div class="form-group">
          <label for="people">여행 인원</label>

          <select id="people">
            <option value="1">1명</option>
            <option value="2" selected>2명</option>
            <option value="3">3명</option>
            <option value="4">4명</option>
            <option value="5">5명</option>
            <option value="6">6명</option>
          </select>
        </div>

      </div>


      <div class="form-group">
        <label for="style">여행 스타일</label>

        <select id="style">

          <option value="관광 중심">
            🏛️ 관광 중심
          </option>

          <option value="맛집 중심">
            🍜 맛집 중심
          </option>

          <option value="쇼핑 중심">
            🛍️ 쇼핑 중심
          </option>

          <option value="휴양 중심">
            🏖️ 휴양 중심
          </option>

          <option value="자연 중심">
            🌳 자연 중심
          </option>

          <option value="역사·문화 중심">
            🏯 역사·문화 중심
          </option>

        </select>
      </div>


      <div class="form-group">

        <label for="budget">
          예상 예산
        </label>

        <div class="budget-input">

          <input
            type="number"
            id="budget"
            placeholder="예: 100"
            min="0"
          >

          <span>만원</span>

        </div>

      </div>


      <button id="generateBtn">
        ✨ AI 여행 계획 만들기
      </button>

    </section>


    <!-- AI 결과 -->
    <section class="result-section">

      <h2>🗺️ 여행 계획</h2>

      <div id="result">
        여행 정보를 입력하고
        <br>
        AI 여행 계획을 만들어보세요.
      </div>

    </section>


    <!-- 저장된 여행 -->
    <section class="saved-section">

      <h2>📚 내 여행 계획</h2>

      <div id="savedTrips">
        아직 저장된 여행 계획이 없습니다.
      </div>

    </section>

  </main>


  <script src="app.js"></script>

</body>
</html>
