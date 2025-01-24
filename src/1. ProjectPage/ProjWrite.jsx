import CheckedIcon from '../images/CheckedIcon.png';
import UncheckedIcon from '../images/UncheckedIcon.png';
import CalendarIcon from '../images/calendar.png';
import InputButton from '../images/InputButton.png'
import React, { useState } from 'react';

import "./ProjWrite.css";
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
                                    <img src={CalendarIcon} alt="calendar" className="calendar-icon" />
                                </div>
                                <div className='Limit-content'>
                                    <div className='ProjWrite-LimitBox1' placeholder='YYYY-MM-DD'></div>
                                    <div className='LimitBox-Text'>~</div>
                                    <div className='ProjWrite-LimitBox2' placeholder='YYYY-MM-DD'></div>
                                </div>
                            </div>
                            <div className='ProjWrite-ContentBox-Salary'>
                                <p className='ProjWrite-Body-ContentBox-Title'>급여(월)</p>
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
                        </div>                     
                        <button className='Create-Button'>작성 완료</button>
                        </div>


                </div>
            </div>

        </div>
    )
}

export default ProjWrite