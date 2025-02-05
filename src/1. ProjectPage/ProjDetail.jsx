import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";

import './ProjDetail.css';
import './MainPage.css';
import searchIcon from '../images/search.png';
import firstIcon from '../images/first.png';
import prevIcon from '../images/prev.png';
import nextIcon from '../images/next.png';
import lastIcon from '../images/last.png';
import plusIcon from '../images/plusIcon.png';

function projDetail() {
    const navigate = useNavigate();


    const [isLoggedIn, setIsLoggedIn] = useState(false); // 로그인 상태 추가
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

    //라우터 핸들러
    const handleMain = () => {
        navigate('/')
    }
    const handleProjButton = () => {
        navigate('/projectWrite')
    }

    const handleFreePage = () => {
        navigate('/FreeView');
    }

    const handleMyProject = () => {
        if (isLoggedIn) {
            navigate('/MyProject');
        } else {
            alert('마이페이지는 로그인 후 이용 가능합니다.');
            setLoginModalIsOpen(true);
        }
    };

    // 로그아웃 함수
    const handleLogout = async () => {
        try {
            await signOut(auth);
            setIsLoggedIn(false); // 로그인 상태 해제
            setCurrentUser(null); // 현재 사용자 초기화
            localStorage.removeItem("isLoggedIn");
            localStorage.removeItem("user");
            sessionStorage.removeItem("isLoggedIn");
            sessionStorage.removeItem("user");
        } catch (err) {
            console.error('로그아웃 실패:', err.message);
        }
    };

    const [post, setPost] = useState(null);

    useEffect(() => {
        const savedPost = localStorage.getItem("selectedPost");
        if (savedPost) {
            setPost(JSON.parse(savedPost)); // 데이터 복구
        } else {
            navigate("/"); // 데이터 없으면 홈으로 리디렉트
        }
    }, [navigate]);

    if (!post) return null;


    return (
        <div className="Detail-Container">
            <div className="Detail-Header">
                <div className="Detail-Header-Left">
                    <div className="Detail-Header-LOGO" onClick={handleMain}><span>P</span>-eeting</div>
                    <div className="Detail-Header-Search">
                        <div className="Detail-Header-SearchIcon"><img src={searchIcon} /></div>
                        <input className="Detail-Header-InputArea" type="text" placeholder="프로젝트 미팅, 피팅" />
                    </div>
                </div>
                <div className="Detail-Header-Right">
                    <div className="Detail-Header-Right-ProMatch">프로젝트 매칭</div>
                    <div className="Detail-Header-Right-FreeMatch" onClick={handleFreePage}>프리랜서 매칭</div>
                    <div className="Detail-Header-Right-MyProject" onClick={handleMyProject}>마이 프로젝트</div>
                    {isLoggedIn ? (
                        <div className="Detail-Header-Right-LogoutButton" onClick={handleLogout}>
                            로그아웃
                        </div>
                    ) : (
                        <div className="Detail-Header-Right-LoginButton" onClick={() => setLoginModalIsOpen(true)}>
                            로그인
                        </div>
                    )}
                </div>
            </div>
            <div className="Detail-Body">
                <div className="Detail-Body-contents1">
                    <img src={post.projectPoster} alt="" />
                </div>
                <div className="Detail-Body-contents2">
                    <div className="Detail-Body-pName">
                        <div className="Detail-Body-pName-label">프로젝트명 : </div>
                        <div className="Detail-Body-pName-item">{post.name}</div>
                    </div>
                    <div className="Detail-Body-pDeadline">
                        <div className="Detail-Body-pDeadline-label">모집 기간 : </div>
                        <div className="Detail-Body-pDeadline-start">{post.deadLine[0]}</div><div> ~ </div><div className="Detail-Body-pDeadline-end">{post.deadLine[1]}</div>
                    </div>
                </div>
                <div className="Detail-Body-contents3">
                    <div className="Detail-Body-pCategory">
                        <div className="Detail-Body-pCategory-label">프로젝트 카테고리 : </div>
                        <div className="Detail-Body-pCategory-item">{post.category}</div>
                    </div>
                    <div className="Detail-Body-pTracks">
                        <div className="Detail-Body-pTracks-label">
                            모집 트랙 : 
                        </div>
                        <div className="Detail-Body-pTracks-items">
                            {post.tracks.map((track, index) => (
                                <div key={index}># {track}</div>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="Detail-Body-contents4">
                    <div className="Detail-Body-pTechStacks-label">
                        모집 기술스택 : 
                    </div>
                    <div className="Detail-Body-pTechStacks-items">
                        {post.techStack.map((tech, index) => (
                            <div key={index}># {tech}</div>
                        ))}
                    </div>
                </div>
                <div className="Detail-Body-contents5">
                    <div className="Detail-Body-pEligibility-label">
                        지원 대상 : 
                    </div>
                    <div className="Detail-Body-pEligibility-item">
                        {post.eligibility}
                    </div>
                </div>
                <div className="Detail-Body-contents6">
                    <div className="Detail-Body-contents6-left">
                        <div className="Detail-Body-pDescription-label">
                            프로젝트 설명
                        </div>
                        <div className="Detail-Body-pDescription-item">
                            {post.description}
                        </div>
                    </div>
                    <div className="Detail-Body-contents6-right">
                        <div className="Detail-Body-pSalary-box">
                            <div className="Detail-Body-pSalary-label1">1인</div>
                            <div className="Detail-Body-pSalary">{post.salary}</div>
                            <div className="Detail-Body-pSalary-label2">만원</div> 
                        </div>
                        <div className="Detail-Body-pApplicate">
                            지원하기
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

};

export default projDetail;