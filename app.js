// ========================================
// Supabase 연결
// ========================================

const SUPABASE_URL = "https://noboycdcakjxhzeyhxof.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_99jEZMt2FeiA8yqzpyJnDQ_llf-tU2s";

const supabaseClient = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_PUBLISHABLE_KEY
);


// ========================================
// HTML 요소 가져오기
// ========================================

const generateBtn = document.getElementById("generateBtn");
const result = document.getElementById("result");
const savedTrips = document.getElementById("savedTrips");


// ========================================
// 페이지가 열릴 때 저장된 여행 불러오기
// ========================================

loadTrips();


// ========================================
// 여행 계획 만들기 버튼
// ========================================

generateBtn.addEventListener("click", async () => {

  const destination =
    document.getElementById("destination").value.trim();

  const nights =
    document.getElementById("nights").value;

  const people =
    document.getElementById("people").value;

  const style =
    document.getElementById("style").value;

  const budget =
    document.getElementById("budget").value;


  // 여행지 입력 확인
  if (!destination) {
    result.textContent =
      "여행지를 입력해주세요.";
    return;
  }


  // 예산 입력 확인
  if (!budget) {
    result.textContent =
      "예상 예산을 입력해주세요.";
    return;
  }


  // 입력한 정보 확인
  result.innerHTML = `
    <h3>✈️ ${destination}</h3>

    <p>
      <strong>여행 기간:</strong>
      ${nights}박 ${Number(nights) + 1}일
    </p>

    <p>
      <strong>여행 인원:</strong>
      ${people}명
    </p>

    <p>
      <strong>여행 스타일:</strong>
      ${style}
    </p>

    <p>
      <strong>예상 예산:</strong>
      ${Number(budget).toLocaleString()}만원
    </p>

    <hr>

    <p>
      🤖 AI 여행 계획 기능은
      다음 단계에서 연결합니다.
    </p>
  `;
});


// ========================================
// Supabase에서 저장된 여행 가져오기
// ========================================

async function loadTrips() {

  const { data, error } = await supabaseClient
    .from("trips")
    .select("*")
    .order("created_at", {
      ascending: false
    });


  if (error) {

    console.error(error);

    savedTrips.innerHTML = `
      <p>
        여행 계획을 불러오지 못했습니다.
      </p>
    `;

    return;
  }


  // 저장된 여행이 없는 경우
  if (!data || data.length === 0) {

    savedTrips.innerHTML = `
      <p>
        아직 저장된 여행 계획이 없습니다.
      </p>
    `;

    return;
  }


  // 저장된 여행 표시
  savedTrips.innerHTML = `
    ${data.map((trip) => `

      <div class="trip-card">

        <h3>
          ✈️ ${trip.destination}
        </h3>

        <p>
          여행 기간:
          ${trip.nights}박 ${Number(trip.nights) + 1}일
        </p>

        <p>
          여행 인원:
          ${trip.people}명
        </p>

        <p>
          여행 스타일:
          ${trip.style}
        </p>

        <p>
          예상 예산:
          ${Number(trip.budget).toLocaleString()}만원
        </p>

      </div>

    `).join("")}
  `;
}
