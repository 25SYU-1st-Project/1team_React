import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { db } from "../firebase"; // Firebase 초기화 파일에서 가져옴
import { doc, getDoc } from "firebase/firestore";

import searchIcon from '../images/search.png';
import trashIcon from '../images/trash.png';
import firstIcon from '../images/first.png';
import prevIcon from '../images/prev.png';
import nextIcon from '../images/next.png';
import lastIcon from '../images/last.png';
import './MyProjectPage.css';

function MyProjectPage() {
    const navigate = useNavigate();

    const handleMain = () => {
        navigate('/')
    }

    const handleFreePage = () => {
        navigate('/FreeView');
    }

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


    const [posts, setPosts] = useState([]);
    const postsPerPage = 3;
    const [currentPage, setCurrentPage] = useState(1);

    const totalPages = Math.ceil(posts.length / postsPerPage);
    const maxPageButtons = 5;

    const getPageNumbers = () => {
        const pageGroup = Math.floor((currentPage - 1) / maxPageButtons) * maxPageButtons;
        const startPage = pageGroup + 1;
        const endPage = Math.min(startPage + maxPageButtons - 1, totalPages);

        return Array.from({ length: endPage - startPage + 1 }, (_, index) => startPage + index);
    };

    const currentPosts = posts.slice(
        (currentPage - 1) * postsPerPage,
        currentPage * postsPerPage
    );

    const handleClick = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const handleFirstPage = () => {
        setCurrentPage(1);
    };

    const handleLastPage = () => {
        setCurrentPage(totalPages);
    };

    const handlePrevPage = () => {
        setCurrentPage(prev => (prev > 1 ? prev - 1 : 1));
    };

    const handleNextPage = () => {
        setCurrentPage(prev => (prev < totalPages ? prev + 1 : totalPages));
    };

    const [userInfo, setUserInfo] = useState(null);
    const [currentFilteredPosts, setCurrentPosts] = useState([]);

    useEffect(() => {
        const fetchUserAndProjects = async () => {
            const storedUser = localStorage.getItem("user");
            if (!storedUser) return;

            const { uid } = JSON.parse(storedUser); // 로컬스토리지에서 UID 가져오기

            try {
                const userDoc = await getDoc(doc(db, "users", uid));
                if (userDoc.exists()) {
                    const userData = userDoc.data();
                    setUserInfo(userData);

                    const { joinedProjects } = userData; // 참여한 프로젝트 목록 가져오기

                    if (!joinedProjects || joinedProjects.length === 0) {
                        setPosts([]);  // posts 상태를 비우기
                        return;
                    }

                    // 프로젝트 정보 가져오기
                    const projectPromises = joinedProjects.map(async (projectId) => {
                        const projectRef = doc(db, "projects", projectId);
                        const projectSnap = await getDoc(projectRef);
                        return projectSnap.exists() ? { id: projectId, ...projectSnap.data() } : null;
                    });

                    const projects = await Promise.all(projectPromises);
                    setPosts(projects.filter((project) => project !== null)); // 유효한 프로젝트만 저장
                } else {
                    console.log("User not found");
                }
            } catch (error) {
                console.error("Error fetching user and project data:", error);
            }
        };

        fetchUserAndProjects();
    }, []);

    return (
        <div>
            <div className="MyProject-container">
                <div className="MyProject-Header">
                    <div className="MyProject-Header-Left">
                        <div className="MyProject-Header-LOGO" onClick={handleMain}><span>P</span>-eeting</div>
                        <div className="MyProject-Header-Search">
                            <div className="MyProject-Header-SearchIcon"><img src={searchIcon} alt="돋보기아이콘" /></div>
                            <input className="MyProject-Header-InputArea" type="text" placeholder="프로젝트 미팅, 피팅" /></div>
                    </div>
                    <div className="MyProject-Header-Right">
                        <div className="MyProject-Header-Right-ProMatch" onClick={handleMain}>프로젝트 매칭</div>
                        <div className="MyProject-Header-Right-FreeMatch" onClick={handleFreePage}>프리랜서 매칭</div>
                        <div className="MyProject-Header-Right-MyProject">마이 프로젝트</div>
                        <div className="MyProject-Header-Right-LoginButton">로그아웃</div>
                    </div>
                </div>
                {userInfo ? (
                    <div className="MyProject-Body">
                        <div className="MyProject-Body-Left">
                            <div className="MyProject-Body-Left-Profile"></div>
                            <div className="MyProject-Body-Left-Inform">
                                <div className="MyProject-Body-Left-Inform-Name">이름 : {userInfo.name}</div>
                                <div className="MyProject-Body-Left-Inform-Email"> 이메일 : {userInfo.email}</div>
                                <div className="MyProject-Body-Left-Inform-Password">비밀번호</div>
                                <div className="MyProject-Body-Left-Inform-Track">트랙 :{userInfo.tracks}</div>
                                <div className="MyProject-Body-Left-Inform-Record">이력 : {userInfo.resume}</div>
                            </div>
                            <div className="MyProject-Body-Left-Complete">수정 완료</div>
                        </div>
                        <div className="MyProject-Body-Right">
                            <div className="MyProject-Body-Right-Content">
                            {currentPosts.map((post, index) => (
                                <div key={index} className="MyProject-Body-Right-Content-Box1">
                                    <div className="MyProject-Body-Right-Content-Box1-Record">
                                        {/* 프로젝트 이름 */}
                                        <div className="MyProject-Body-Right-Content-Box1-PrjName">{post.name}</div>

                                        {/* 카테고리 */}
                                        <div className="MyProject-Body-Right-Content-Box1-Kategory">
                                            <div className="MyProject-Body-Right-Content-Box1-Kategory-K">
                                                {post.category}
                                            </div>
                                        </div>

                                        {/* 트랙 (추가적인 정보) */}
                                        <div className="MyProject-Body-Right-Content-Box1-Tracks">
                                            {post.tracks?.join(", ")}
                                        </div>

                                        {/* 급여 정보 */}
                                        <div className="MyProject-Body-Right-Content-Box1-Salary">급여: {post.salary}</div>

                                        {/* 상세 설명 */}
                                        <div className="MyProject-Body-Right-Content-Box1-Detail">{post.description}</div>
                                    </div>

                                    {/* 삭제 버튼 */}
                                    <div className="MyProject-Body-Right-Content-Box1-Trash">
                                        <img src={trashIcon} alt="Trash" width="20" height="20" />
                                    </div>
                                </div>
                            ))}
                            </div>
                            <div className="pagination">
                                <button onClick={handleFirstPage}>
                                    <img src={firstIcon} alt="First" width="20" height="20" />
                                </button>
                                <button onClick={handlePrevPage}>
                                    <img src={prevIcon} alt="Previous" width="20" height="20" />
                                </button>
                                {getPageNumbers().map((pageNumber) => (
                                    <button
                                        key={pageNumber}
                                        onClick={() => handleClick(pageNumber)}
                                        className={pageNumber === currentPage ? 'active' : ''}
                                    >
                                        {pageNumber}
                                    </button>
                                ))}
                                <button onClick={handleNextPage}>
                                    <img src={nextIcon} alt="Next" width="20" height="20" />
                                </button>
                                <button onClick={handleLastPage}>
                                    <img src={lastIcon} alt="Last" width="20" height="20" />
                                </button>
                            </div>

                        </div>

                    </div>
                ) : (
                    <p>please, login</p>
                )
                }

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
        </div>
    )
} export default MyProjectPage;