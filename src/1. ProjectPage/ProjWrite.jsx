import InputButton from '../images/plusIcon.png';
import React, { useEffect, useState, useRef } from 'react';
import previousMonth from '../images/arrow-left.png';
import nextMonth from '../images/arrow-right.png'
import './ProjWrite.css';
import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebase"; // Assuming you have Firebase configured in a `firebase.js` file


function ProjWrite() {
  const [techStacks, setTechStacks] = useState(['']);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [startDate, setStartDate] = useState(null); // 시작일
  const [endDate, setEndDate] = useState(null); // 종료일
  const [isSelectingStartDate, setIsSelectingStartDate] = useState(true);
  const [isCalendarVisible, setIsCalendarVisible] = useState(false); // 캘린더 표시 여부 상태

  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedTracks, setSelectedTracks] = useState([]);


  const [projectData, setProjectData] = useState({
    name: "",
    category: "",
    creatorId: "",
    description: "",
    eligibility: "",
    salary: 0,
    status: "open",
    projectPoster: "",
    techStack: [],
    tracks: [],
    deadLine: [],

    applicantsId: [],
    participantsId: []
  });


  // 입력 값 변경 핸들러
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProjectData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const currentDate = new Date();
     // 🔹 localStorage에서 데이터 가져오기

    // 🔹 localStorage에서 user 데이터 가져오기
    const storedUser = localStorage.getItem("user");
    
    let userData;
    try {
      userData = JSON.parse(storedUser);
    } catch (error) {
      console.error("로컬스토리지 JSON 파싱 오류:", error);
      alert("로그인 정보를 가져오는 중 오류가 발생했습니다.");
      return;
    }




    try {
      // Firestore에 저장할 데이터
      const newProject = {
        ...projectData,
        category: selectedCategory, // 라디오 버튼 선택 값
        tracks: selectedTracks, // 체크박스 선택 값
        techStack: techStacks, // 기술 스택 배열
        deadLine: startDate && endDate ? [formatDate(startDate), formatDate(endDate)] : [], // 모집 기한 배열
        creatorId: userData.uid, // uid 값 저장 
        applicantsId: [], // 빈 배열 저장
        participantsId: [], // 빈 배열 저장
        createdAt: currentDate // 현재 시간 추가
      };

      // Firestore에 데이터 추가
      const docRef = await addDoc(collection(db, "projects"), newProject);
      console.log("프로젝트 생성됨, 문서 ID: ", docRef.id);
      alert("프로젝트 공고가 성공적으로 생성되었습니다!");

      // 입력 필드 초기화
      setProjectData({
        name: "",
        category: "",
        description: "",
        eligibility: "",
        salary: 0,
        status: "open",
        projectPoster: "",
        techStack: [],
        tracks: [],
        deadLine: "",
        creatorId: "",
        applicantsId: [],
        participantsId: []
      });

      setSelectedCategory("");
      setSelectedTracks([]);
      setTechStacks([""]);
      setStartDate(null);
      setEndDate(null);
    } catch (error) {
      console.error("프로젝트 추가 중 오류 발생: ", error);
      alert("프로젝트 생성 중 오류가 발생했습니다.");
    }
  };




  // 카테고리 라디오버튼 핸들러
  const handleRadioChange = (event) => {
    setSelectedCategory(event.target.value);
  };

  // 트랙 카테고리 체크박스 핸들러
  const handleCheckboxChange = (event) => {
    const { value, checked } = event.target;
    if (checked) {
      // 선택된 카테고리를 배열에 추가
      setSelectedTracks([...selectedTracks, value]);
      // 기존 배열이 아닌 카테고리를 선택할 때마다 ... 을 사용해 새로운 배열을 만들어 상태 설정
    } else {
      // 선택을 해제하면 배열에서 제거
      setSelectedTracks(selectedTracks.filter(category => category !== value));
    }
  };


  // input 추가하는 함수
  const addInput = () => {
    setTechStacks([...techStacks, '']); // 새로운 빈 input 추가
  };

  // input 값 변경 처리 함수
  const handleInputChange = (index, value) => {
    const newTechStacks = [...techStacks];
    newTechStacks[index] = value;
    setTechStacks(newTechStacks); // 변경된 값을 상태에 저장
  };




  // 캘린더 관련 로직
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDayOfMonth = new Date(year, month, 1);
  const startDay = new Date(firstDayOfMonth);
  startDay.setDate(1 - firstDayOfMonth.getDay());

  const lastDayOfMonth = new Date(year, month + 1, 0);
  const endDay = new Date(lastDayOfMonth);
  endDay.setDate(lastDayOfMonth.getDate() + (6 - lastDayOfMonth.getDay()));

  // 주 단위로 날짜 그룹화
  const groupDatesByWeek = (startDay, endDay) => {
    const weeks = [];
    let currentWeek = [];
    let currentDate = new Date(startDay);

    while (currentDate <= endDay) {
      currentWeek.push(new Date(currentDate));
      if (currentWeek.length === 7 || currentDate.getDay() === 6) {
        weeks.push(currentWeek);
        currentWeek = [];
      }
      currentDate.setDate(currentDate.getDate() + 1);
    }

    if (currentWeek.length > 0) {
      weeks.push(currentWeek);
    }

    return weeks;
  };

  const handlePrevMonth = () => {
    const prevMonth = new Date(currentDate);
    prevMonth.setMonth(currentDate.getMonth() - 1);
    setCurrentDate(prevMonth);
  };

  const handleNextMonth = () => {
    const nextMonth = new Date(currentDate);
    nextMonth.setMonth(currentDate.getMonth() + 1);
    setCurrentDate(nextMonth);
  };

  // 날짜를 YYYY-MM-DD 형식으로 변환
  const formatDate = (date) => {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  };

  // 시작일을 클릭했을 때 캘린더 토글
  const handleStartDateSelection = () => {
    setIsSelectingStartDate(true); // 시작일 선택 모드
    setIsCalendarVisible((prev) => !prev);  // 캘린더 토글
  };

  // 종료일을 클릭했을 때 캘린더 토글
  const handleEndDateSelection = () => {
    setIsSelectingStartDate(false); // 종료일 선택 모드
    setIsCalendarVisible((prev) => !prev);  // 캘린더 토글
  };


  // 날짜 클릭 시
  const handleDateClick = (date) => {
    if (isSelectingStartDate) {
      // 시작일 선택
      if (startDate && date.toDateString() === startDate.toDateString()) {
        setStartDate(null); // 시작일자 취소
      } else {
        setStartDate(date); // 새로운 시작일 설정
        if (endDate && date > endDate) {
          setEndDate(null); // 종료일이 시작일 이전일 때 종료일 취소
        }
      }
    } else {
      // 종료일 선택
      if (endDate && date.toDateString() === endDate.toDateString()) {
        setEndDate(null); // 종료일자 취소
      } else if (startDate && date >= startDate) {
        setEndDate(date); // 시작일 이후로 종료일 설정
      }
    }
  };

  //애니메이션
      const slides = [
          { color: "#000000", text: "LIKELION 13기 모집중", target: "#" },
          { color: "#000000", text: "1팀 장준익 유광렬 정서우", target: "#" },
          { color: "#000000", text: "강승진 강사님 화이팅", target: "#" },
          { color: "#000000", text: "삼육대 컴공 4학년 화이팅", target: "#" },
          { color: "#000000", text: "개발자 커뮤니티 WAD!", target: "#" },
          { color: "#000000", text: "챌 서폿 잼띵이 구독!!", target: "#" },
          { color: "#000000", text: "PEETING은 최고야!", target: "#" },
      ];
      const [animate, setAnimate] = useState(true);
      const onStop = () => setAnimate(false);
      const onRun = () => setAnimate(true);

  return (
    <div className="ProjWrite-Container">
      <div className="ProjWrite-Header">
        <div className="ProjWrite-Header-Left">
          <div className="ProjWrite-Header-Left-Logo"><span>P</span>-eeting</div>
        </div>
        <div className="ProjWrite-Header-Right">
          <div className="ProjWrite-Header-Right-ProMatch">프로젝트 매칭</div>
          <div className="ProjWrite-Header-Right-FreeMatch">프리랜서 매칭</div>
          <div className="ProjWrite-Header-Right-MyProject">마이 프로젝트</div>
          <div className="ProjWrite-Header-Right-LoginButton">로그인</div>
        </div>
      </div>

      <div className='ProjWrite-Body'>
        <div className='ProjWrite-Body-Title-Box'>
          <div className='ProjWrite-Body-Title'>프로젝트 공고 작성</div>
        </div>
        <div className='ProjWrite-Body-MainBox'>
          <input className='ProjWrite-Body-MainBox-Title' type="text" placeholder='프로젝트명을 작성해주세요.'
            name='name' value={projectData.name} onChange={handleChange} required />
          <div className='ProjWrite-Body-MainBox-ContentBox'>
            <p className='ProjWrite-Body-ContentBox-Title'>프로젝트 카테고리</p>
            <div className='ProjWrite-ContentBox-Container'>
              <div className='ProjWrite-Category-Culture'>
                <input
                  className="ProjWrite-Category-radio"
                  type="radio"
                  name="projwrite-category"
                  value="문화 · 스포츠"
                  checked={selectedCategory === "문화 · 스포츠"}
                  onChange={handleRadioChange}
                /> 문화 · 스포츠
              </div>
              <div className="ProjWrite-Category-Finance">
                <input
                  className="ProjWrite-Category-radio"
                  type="radio"
                  name="projwrite-category"
                  value="금융 · 보험"
                  checked={selectedCategory === "금융 · 보험"}
                  onChange={handleRadioChange}
                /> 금융 · 보험
              </div>
              <div className="ProjWrite-Category-Medical">
                <input
                  className="ProjWrite-Category-radio"
                  type="radio"
                  name="projwrite-category"
                  value="의료 서비스"
                  checked={selectedCategory === "의료 서비스"}
                  onChange={handleRadioChange}
                /> 의료 서비스
              </div>
              <div className="ProjWrite-Category-Building">
                <input
                  className="ProjWrite-Category-radio"
                  type="radio"
                  name="projwrite-category"
                  value="건설 · 건축"
                  checked={selectedCategory === "건설 · 건축"}
                  onChange={handleRadioChange}
                /> 건설 · 건축
              </div>
            </div>
            <p className='ProjWrite-Body-ContentBox-Title'>모집 트랙</p>
            <div className='ProjWrite-ContentBox-Container'>
              <div className='ProjWrite-Tracks-Back'>
                <input
                  className="ProjWrite-Tracks-radio"
                  type="checkbox"
                  name="projwrite-tracks"
                  value="BE 개발자"
                  checked={selectedTracks.includes("BE 개발자")}
                  onChange={handleCheckboxChange}
                /> BE 개발자
              </div>
              <div className='ProjWrite-Tracks-Front'>
                <input
                  className="ProjWrite-Tracks-radio"
                  type="checkbox"
                  name="projwrite-tracks"
                  value="FE 개발자"
                  checked={selectedTracks.includes("FE 개발자")}
                  onChange={handleCheckboxChange}
                /> FE 개발자
              </div>
              <div className='ProjWrite-Tracks-PM'>
                <input
                  className="ProjWrite-Tracks-radio"
                  type="checkbox"
                  name="projwrite-tracks"
                  value="PM"
                  checked={selectedTracks.includes("PM")}
                  onChange={handleCheckboxChange}
                /> PM
              </div>
              <div className='ProjWrite-Tracks-Design'>
                <input
                  className="ProjWrite-Tracks-radio"
                  type="checkbox"
                  name="projwrite-tracks"
                  value="디자이너"
                  checked={selectedTracks.includes("디자이너")}
                  onChange={handleCheckboxChange}
                /> 디자이너
              </div>
            </div>
            <div className='ProjWrite-ContentBox-LimitSalary'>
              <div className='ProjWrite-ContentBox-Limit'>
                <div className='Limit-title'>
                  <p className='ProjWrite-Body-ContentBox-Title'>모집 기한</p>
                </div>
                <div className='Limit-content'>
                  <div className='ProjWrite-LimitBox1' placeholder='YYYY-MM-DD' onClick={handleStartDateSelection} >{startDate ? formatDate(startDate) : ''}</div>
                  <div className='LimitBox-Text'>~</div>
                  <div className='ProjWrite-LimitBox2' placeholder='YYYY-MM-DD' onClick={handleEndDateSelection}>{endDate ? formatDate(endDate) : ''}</div>
                </div>
                {isCalendarVisible && (
                  <div className="calendar-dropdown">
                    <div className="calendar-header">
                      <img src={previousMonth} alt="previous" className='calendar-nav' onClick={handlePrevMonth} />

                      <span>
                        {year}년  {month + 1}월
                      </span>
                      <img src={nextMonth} alt="next" className='calendar-nav' onClick={handleNextMonth} />
                    </div>
                    <div className="calendar-body">
                      <div className="calendar-weekday">
                        {["일", "월", "화", "수", "목", "금", "토"].map((day, i) => (
                          <div key={i} className={`calendar-day-day-header ${i === 0 ? "sunday" : ""} ${i === 6 ? "saturday" : ""}`}>
                            {day}
                          </div>
                        ))}
                      </div>
                      {groupDatesByWeek(startDay, endDay).map((week, index) => (
                        <div key={index} className="calendar-week">
                          {week.map((date, i) => {
                            const dayOfWeek = date.getDay(); // 0 = 일요일, 6 = 토요일
                            const isSelected = (startDate && date.toDateString() === startDate.toDateString()) || (endDate && date.toDateString() === endDate.toDateString());
                            return (
                              <div
                                key={i}
                                className={`calendar-day 
                                                    ${date.getMonth() === month ? "current-month" : "other-month"} 
                                                    ${dayOfWeek === 0 ? "sunday" : ""} 
                                                    ${dayOfWeek === 6 ? "saturday" : ""}
                                                    ${isSelected ? "selected" : ""}  
                                                `}
                                onClick={() => handleDateClick(date)} // 날짜 클릭 시 handleDateClick 실행
                              >
                                {date.getDate()}
                              </div>
                            );
                          })}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <div className='ProjWrite-ContentBox-Salary'>
                <p className='ProjWrite-Body-ContentBox-Title'>수당</p>
                <div className='Salary-Input-Box'>
                  <input
                    type="text" placeholder='금액 입력' className='Salary-Input'
                    value={projectData.salary} onChange={handleChange}
                    name='salary'
                  />
                  <span className='Salary-Text'>만원</span>
                </div>
              </div>
            </div>

            <div className='ProjWrite-ContentBox-TargetTech'>
              <div className='ProjWrite-ContentBox-Target'>
                <p className='ProjWrite-Body-ContentBox-Title'>지원 대상</p>
                <div className='ProjWrite-Target-Content' >
                  <textarea
                    name="eligibility" className='Target-Text' placeholder='내용을 입력하세요.'
                    value={projectData.eligibility} onChange={handleChange}
                  ></textarea>
                </div>
              </div>
              <div className='ProjWrite-Body-ContentBox-Tech'>
                <p className='ProjWrite-Body-ContentBox-Title'>기술 스택</p>
                <div className='ProjWrite-Tech-Content' >
                  {techStacks.map((stack, index) => (
                    <div>
                      <input
                        key={index}
                        type="text"
                        value={stack}
                        placeholder="필요한 기술 스택을 작성해주세요."
                        onChange={(e) => handleInputChange(index, e.target.value)}
                        className='ProjWrite-Tech-Input'
                      />
                    </div>
                  ))}
                  <div onClick={addInput} className='ProjWrite-AddButton'>
                    <img src={InputButton} alt="inputbutton" className='Tech-Input-Button' />
                  </div>
                </div>

              </div>

            </div>

            <div className='ProjWrite-ContentBox-Projdetail'>
              <p className='ProjWrite-Body-ContentBox-Title'>프로젝트 설명</p>
              <div className='ProjWrite-Prjdetail-Content'>
                <textarea
                  name="description" className='Project-Detail-Content' placeholder='내용을 입력하세요.'
                  value={projectData.description} onChange={handleChange}
                ></textarea>
              </div>
            </div>

            <div className='Create-Project'>
              <div className='Create-Project-Content'></div>
              <button className='Create-Button' onClick={handleSubmit}>작성 완료</button>
            </div>
          </div>
        </div>
      </div>
      <div className="AdSlide">
        <div className="slide_container">
          <ul
            className="slide_wrapper"
            onMouseEnter={onStop}
            onMouseLeave={onRun}
          >
            <div
              className={"slide original".concat(
                animate ? "" : " stop"
              )}
            >
              {slides.map((s, i) => (
                <li
                  key={i}
                  className={i % 2 === 0 ? "big" : "small"}
                >
                  <div
                    className="item"
                    style={{ background: s.color }}
                  >
                    <span className="slide-text">{s.text}</span>
                  </div>
                </li>
              ))}
            </div>
            <div
              className={"slide clone".concat(animate ? "" : " stop")}
            >
              {slides.map((s, i) => (
                <li
                  key={i}
                  className={i % 2 === 0 ? "big" : "small"}
                >
                  <div
                    className="item"
                    style={{ background: s.color }}
                  >
                    <span className="slide-text">{s.text}</span>
                  </div>
                </li>
              ))}
            </div>
          </ul>
        </div>
      </div>
    </div>
  );
}
export default ProjWrite;