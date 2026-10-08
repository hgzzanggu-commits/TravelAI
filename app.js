const generateBtn = document.getElementById("generateBtn");
const result = document.getElementById("result");

generateBtn.addEventListener("click", () => {
  const destination = document.getElementById("destination").value;
  const nights = document.getElementById("nights").value;
  const people = document.getElementById("people").value;
  const style = document.getElementById("style").value;
  const budget = document.getElementById("budget").value;

  if (!destination) {
    result.textContent = "여행지를 입력해주세요.";
    return;
  }

  if (!budget) {
    result.textContent = "예상 예산을 입력해주세요.";
    return;
  }

  result.innerHTML = `
    <h3>✈️ ${destination}</h3>
    <p>여행 기간: ${nights}박 ${Number(nights) + 1}일</p>
    <p>여행 인원: ${people}명</p>
    <p>여행 스타일: ${style}</p>
    <p>예상 예산: ${Number(budget).toLocaleString()}만원</p>

    <hr>

    <p>
      🤖 AI 여행 계획 기능은 다음 단계에서 연결합니다.
    </p>
  `;
});
