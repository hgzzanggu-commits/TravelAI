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
// HTML 요소
// ========================================

const generateBtn = document.getElementById("generateBtn");
const result = document.getElementById("result");
const savedTrips = document.getElementById("savedTrips");


// ========================================
// 페이지 시작
// ========================================

loadTrips();


// ========================================
// AI 여행 계획 생성
// ========================================

generateBtn.addEventListener("click", async () => {

  const destination =
    document.getElementById("destination").value.trim();

  const nights =
    Number(document.getElementById("nights").value);

  const people =
    Number(document.getElementById("people").value);

  const style =
    document.getElementById("style").value;

  const budget =
    Number(document.getElementById("budget").value);


  // 입력값 확인
  if (!destination) {
    result.innerHTML = `
      <p>📍 여행지를 입력해주세요.</p>
    `;
    return;
  }

  if (!budget || budget <= 0) {
    result.innerHTML = `
      <p>💰 예상 예산을 입력해주세요.</p>
    `;
    return;
  }


  try {

    generateBtn.disabled = true;

    result.innerHTML = `
      <p>🤖 ${destination} 여행 계획을 만드는 중...</p>
      <p>잠시만 기다려주세요.</p>
    `;


    // ========================================
    // Gemini Edge Function 호출
    // ========================================

    const { data, error } =
      await supabaseClient.functions.invoke(
        "generate-trip",
        {
          body: {
            destination,
            nights,
            people,
            style,
            budget
          }
        }
      );


    if (error) {
      throw new Error(
        `AI 여행 계획 생성 실패: ${error.message}`
      );
    }


    if (!data || !data.trip) {
      throw new Error(
        "AI 여행 계획 결과를 받지 못했습니다."
      );
    }


    const trip = data.trip;


    // ========================================
    // AI 결과 화면 표시
    // ========================================

    renderTrip(trip, {
      destination,
      nights,
      people,
      style,
      budget
    });


    // ========================================
    // Supabase DB 저장
    // ========================================

    const totalEstimate =
      getTotalEstimate(trip);

    const { error: dbError } =
      await supabaseClient
        .from("trips")
        .insert({
          destination: destination,
          nights: nights,
          people: people,
          style: style,
          budget: budget,
          total_estimate: totalEstimate,
          itinerary: trip.itinerary || [],
          packing_list: trip.packingList || [],
          travel_tips: trip.tips || []
        });


    if (dbError) {
      throw new Error(
        `여행 계획 저장 실패: ${dbError.message}`
      );
    }


    // 저장된 여행 목록 새로 불러오기
    await loadTrips();


  } catch (error) {

    console.error(error);

    result.innerHTML = `
      <p>❌ ${error.message}</p>
    `;

  } finally {

    generateBtn.disabled = false;

  }

});


// ========================================
// 여행 계획 화면 출력
// ========================================

function renderTrip(trip, info) {

  const summary =
    trip.summary || "AI가 생성한 여행 계획입니다.";


  const itinerary =
    Array.isArray(trip.itinerary)
      ? trip.itinerary
      : [];


  const costs =
    trip.estimatedCosts || {};


  const packingList =
    Array.isArray(trip.packingList)
      ? trip.packingList
      : [];


  const tips =
    Array.isArray(trip.tips)
      ? trip.tips
      : [];


  result.innerHTML = `

    <div class="trip-card">

      <h3>✈️ ${info.destination}</h3>

      <p>
        <strong>여행 기간:</strong>
        ${info.nights}박 ${info.nights + 1}일
      </p>

      <p>
        <strong>여행 인원:</strong>
        ${info.people}명
      </p>

      <p>
        <strong>여행 스타일:</strong>
        ${info.style}
      </p>

      <p>
        <strong>예산:</strong>
        ${info.budget.toLocaleString()}만원
      </p>

      <hr>

      <h3>📝 여행 요약</h3>

      <p>
        ${summary}
      </p>

    </div>


    <!-- 일정 -->

    <div class="trip-card">

      <h3>📅 날짜별 일정</h3>

      ${
        itinerary.length > 0
          ? itinerary.map((day, index) => `

              <div class="day-card">

                <h3>
                  DAY ${day.day || index + 1}
                </h3>

                ${
                  day.title
                    ? `<h4>${day.title}</h4>`
                    : ""
                }

                ${
                  Array.isArray(day.activities)
                    ? `
                      ${day.activities
                        .map(
                          (activity) => `
                            <p>
                              <strong>
                                ${activity.time || ""}
                              </strong>
                              ${
                                activity.place
                                  ? ` ${activity.place}`
                                  : ""
                              }
                            </p>

                            ${
                              activity.description
                                ? `
                                  <p>
                                    ${activity.description}
                                  </p>
                                `
                                : ""
                            }
                          `
                        )
                        .join("")}
                    `
                    : `
                      <p>
                        ${typeof day === "string" ? day : ""}
                      </p>
                    `
                }

              </div>

            `).join("")
          : `
            <p>
              AI 일정 정보를 불러오지 못했습니다.
            </p>
          `
      }

    </div>


    <!-- 예상 경비 -->

    <div class="trip-card">

      <h3>💰 예상 여행 경비</h3>

      ${renderCost("✈️ 항공권", costs.airfare)}
      ${renderCost("🏨 숙박", costs.hotel)}
      ${renderCost("🍜 식비", costs.food)}
      ${renderCost("🚇 교통", costs.transport)}
      ${renderCost("🎫 관광·입장료", costs.attractions)}
      ${renderCost("🛍️ 쇼핑", costs.shopping)}
      ${renderCost("💵 기타", costs.other)}

      ${
        costs.total
          ? `
            <hr>

            <h3>
              총 예상 비용:
              ${costs.total}
            </h3>
          `
          : ""
      }

    </div>


    <!-- 준비물 -->

    <div class="trip-card">

      <h3>🎒 준비물</h3>

      ${
        packingList.length > 0
          ? `
            <ul>
              ${packingList
                .map(
                  (item) => `<li>${item}</li>`
                )
                .join("")}
            </ul>
          `
          : `
            <p>
              추천 준비물이 없습니다.
            </p>
          `
      }

    </div>


    <!-- 여행 팁 -->

    <div class="trip-card">

      <h3>💡 여행 팁</h3>

      ${
        tips.length > 0
          ? `
            <ul>
              ${tips
                .map(
                  (tip) => `<li>${tip}</li>`
                )
                .join("")}
            </ul>
          `
          : `
            <p>
              여행 팁이 없습니다.
            </p>
          `
      }

    </div>

  `;
}


// ========================================
// 경비 한 줄 표시
// ========================================

function renderCost(label, value) {

  if (
    value === undefined ||
    value === null ||
    value === ""
  ) {
    return "";
  }

  return `
    <p>
      <strong>${label}</strong>
      ${value}
    </p>
  `;
}


// ========================================
// 총 예상 비용 가져오기
// ========================================

function getTotalEstimate(trip) {

  if (
    trip.estimatedCosts &&
    trip.estimatedCosts.total
  ) {
    return String(
      trip.estimatedCosts.total
    );
  }

  if (trip.totalEstimate) {
    return String(
      trip.totalEstimate
    );
  }

  return "AI 예상 비용";
}


// ========================================
// 저장된 여행 목록 불러오기
// ========================================

async function loadTrips() {

  const { data, error } =
    await supabaseClient
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


  if (!data || data.length === 0) {

    savedTrips.innerHTML = `
      <p>
        아직 저장된 여행 계획이 없습니다.
      </p>
    `;

    return;
  }


  savedTrips.innerHTML = `

    ${data.map((trip) => `

      <div class="trip-card">

        <h3>
          ✈️ ${trip.destination}
        </h3>

        <p>
          ${trip.nights}박
          ${Number(trip.nights) + 1}일
        </p>

        <p>
          👥 ${trip.people}명
        </p>

        <p>
          🌍 ${trip.style}
        </p>

        <p>
          💰 예산:
          ${Number(trip.budget).toLocaleString()}만원
        </p>

        ${
          trip.total_estimate
            ? `
              <p>
                예상 비용:
                ${trip.total_estimate}
              </p>
            `
            : ""
        }

      </div>

    `).join("")}

  `;
}
