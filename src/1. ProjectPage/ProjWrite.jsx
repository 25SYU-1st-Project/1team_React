import CheckedIcon from '../images/CheckedIcon.png';
import UncheckedIcon from '../images/UncheckedIcon.png';
import CalendarIcon from '../images/calendar.png';
import InputButton from '../images/InputButton.png';
import React, {  useEffect , useState } from 'react';
import Modal from 'react-modal';
import { IoIosCloseCircle } from "react-icons/io";
import { getDaysInMonth, subMonths, addMonths } from 'date-fns';


import './ProjWrite.css';




      

function ProjWrite() {
    const [techStacks, setTechStacks] = useState(['']);

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

    const [modalOpen, setModalOpen] = useState(false);
    const [currentDate, setCurrentDate] = useState(new Date()); 
     // modal 창 팝업 시 뒤에 배경 scroll 막기
     useEffect(() => {
        modalOpen === true
            ? (document.body.style.overflow = "hidden")
            : (document.body.style.overflow = "unset");
    }, [modalOpen]);

     // modal 창 닫기
     const closeModal = () => {
        setModalOpen(false);
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
        setCurrentDate(new Date(year, month - 1, 1));
    };

    const handleNextMonth = () => {
        setCurrentDate(new Date(year, month + 1, 1));
    };
        

    return (
        
        <div className="ProjWrite-Container">
        <Modal isOpen={modalOpen} className="modal-content" overlayClassName="modal-overlay">
            <div className="modal-close-btn">
                <button type="button" onClick={closeModal}>
                    <IoIosCloseCircle size={30} />
                </button>
            </div>
            <div className="calendar-modal">
            <div className="calendar-header">
                <button onClick={handlePrevMonth} className="calendar-nav">
                {"<"}
                </button>
                <span>
                {year}년 {month + 1}월
                </span>
                <button onClick={handleNextMonth} className="calendar-nav">
                {">"}
                </button>
            </div>
            <div className="calendar-body">
                <div className="calendar-weekday">
                {["일", "월", "화", "수", "목", "금", "토"].map((day, i) => (
                    <div key={i} className="calendar-weekday-item">
                    {day}
                    </div>
                ))}
                </div>
                {groupDatesByWeek(startDay, endDay).map((week, index) => (
                <div key={index} className="calendar-week">
                    {week.map((date, i) => (
                    <div
                        key={i}
                        className={`calendar-day ${
                        date.getMonth() === month ? "current-month" : "other-month"
                        }`}
                    >
                        {date.getDate()}
                    </div>
                    ))}
                </div>
                ))}
                </div>
            </div>
      </Modal>
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
                    <input className='ProjWrite-Body-MainBox-Title' type="text" placeholder='프로젝트명을 작성해주세요.' />
                    <div className='ProjWrite-Body-MainBox-ContentBox'>
                    <p className='ProjWrite-Body-ContentBox-Title'>프로젝트 카테고리</p>
                        <div className='ProjWrite-ContentBox-Container'>
                            <div className='ProjWrite-Category'>
                                <img
                                    src={UncheckedIcon}
                                    alt="culture"
                                    className="category-icon"
                                />
                                <span className='category-text'>문화 · 스포츠</span>
                            </div>
                            <div className='ProjWrite-Category'>
                                <img
                                    src={UncheckedIcon}
                                    alt="fund"
                                    className="category-icon"
                                />
                                <span className='category-text'>금융 · 보험</span>
                            </div>
                            <div className='ProjWrite-Category'>
                                <img
                                    src={UncheckedIcon}
                                    alt="medical"
                                    className="category-icon"
                                />
                                <span className='category-text'>의료 서비스</span>
                            </div>
                            <div className='ProjWrite-Category'>
                                <img
                                    src={UncheckedIcon}
                                    alt="building"
                                    className="category-icon"
                                />
                                <span className='category-text'>건설 · 건축</span>
                            </div>
                        </div>
                        <p className='ProjWrite-Body-ContentBox-Title'>모집 트랙</p>
                        <div className='ProjWrite-ContentBox-Container'>
                            <div className='ProjWrite-Category'>
                                <img
                                    src={UncheckedIcon}
                                    alt="Backend"
                                    className="category-icon"
                                />
                                <span className='category-text'>BE 개발자</span>
                            </div>
                            <div className='ProjWrite-Category'>
                                <img
                                    src={UncheckedIcon}
                                    alt="FrontEnd"
                                    className="category-icon"
                                />
                                <span className='category-text'>FE 개발자</span>
                            </div>
                            <div className='ProjWrite-Category'>
                                <img
                                    src={UncheckedIcon}
                                    alt="PM"
                                    className="category-icon"
                                />
                                <span className='category-text'>PM</span>
                            </div>
                            <div className='ProjWrite-Category'>
                                <img
                                    src={UncheckedIcon}
                                    alt="Designer"
                                    className="category-icon"
                                />
                                <span className='category-text'>디자이너</span>
                            </div>
                        </div>
                        <div className='ProjWrite-ContentBox-LimitSalary'>
                            <div className='ProjWrite-ContentBox-Limit'>
                                <div className='Limit-title'>
                                    <p className='ProjWrite-Body-ContentBox-Title'>모집 기한</p>
                                    <img src={CalendarIcon} alt="calendar" className="calendar-icon" 
                                    onClick={() => {setModalOpen(true);}} />
                                </div>
                                <div className='Limit-content'>
                                    <div className='ProjWrite-LimitBox1' placeholder='YYYY-MM-DD'></div>
                                    <div className='LimitBox-Text'>~</div>
                                    <div className='ProjWrite-LimitBox2' placeholder='YYYY-MM-DD'></div>
                                </div>
                            </div>
                            <div className='ProjWrite-ContentBox-Salary'>
                                <p className='ProjWrite-Body-ContentBox-Title'>수당</p>
                                <div className='Salary-Input-Box'>
                                    <input type="text" placeholder='금액 입력' className='Salary-Input' />
                                    <span className='Salary-Text'>만원</span>
                                </div>
                            </div>
                        </div>

                        <div className='ProjWrite-ContentBox-TargetTech'>
                            <div className='ProjWrite-ContentBox-Target'>
                                <p className='ProjWrite-Body-ContentBox-Title'>지원 대상</p>
                                <div className='ProjWrite-Target-Content' >
                                    <textarea name="Target" className='Target-Text' placeholder='내용을 입력하세요.'></textarea>
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
                                <textarea name="PrjDetail" className='Project-Detail-Content' placeholder='내용을 입력하세요.'></textarea>
                            </div>
                        </div>

                        <div className='Create-Project'>
                            <div className='Create-Project-Content'></div>
                            <button className='Create-Button'>작성 완료</button>
                        </div>
                    </div>

                    
                        
    
                  
                </div>

            </div>
        </div>

     
    );
   

   
}





export default ProjWrite;
