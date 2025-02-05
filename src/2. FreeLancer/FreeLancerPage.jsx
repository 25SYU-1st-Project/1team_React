import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
//firebase 임포트
import { getDocs, collection } from "firebase/firestore";
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import { db } from '../firebase';

import searchIcon from '../images/search.png';
import firstIcon from '../images/first.png';
import prevIcon from '../images/prev.png';
import nextIcon from '../images/next.png';
import lastIcon from '../images/last.png';
import defaultProfile from '../images/profileImage.png';
import './FreeLancerPage.css';

function FreeLancerPage() {
    //라우터 핸들러
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

    // 그리드에 표시되는 포스트들, 페이징 버튼
    const [posts, setPosts] = useState([]);

    const postsPerPage = 4;
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

    // useEffect(() => {
    //     const fetchProjects = async () => {
    //         try {
    //             const querySnapshot = await getDocs(collection(db, "users"));
    //             const fetchedProjects = querySnapshot.docs.map(doc => ({
    //                 id: doc.id,
    //                 ...doc.data(),
    //             }));
    //             setPosts(fetchedProjects);
    //         } catch (error) {
    //             console.error("프로젝트 데이터를 가져오는 중 오류:", error);
    //         }
    //     };

    //     fetchProjects();
    // }, []);

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, "users"));
                const fetchedProjects = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                }));

                // Firebase Storage에서 이미지 URL 변환
                const storage = getStorage();
                const updatedProjects = await Promise.all(
                    fetchedProjects.map(async (post) => {
                        if (post.profileImage && post.profileImage.startsWith("gs://")) {
                            try {
                                const storageRef = ref(storage, post.profileImage);
                                post.profileImage = await getDownloadURL(storageRef);
                            } catch (error) {
                                console.error("이미지 URL 변환 실패:", error);
                            }
                        }
                        return post;
                    })
                );

                setPosts(updatedProjects);
            } catch (error) {
                console.error("프로젝트 데이터를 가져오는 중 오류:", error);
            }
        };

        fetchProjects();
    }, []);

    // 카테고리별 필터링 함수
    const [selectedCategory, setSelectedCategory] = useState("전체");
    const filteredPosts = selectedCategory === "전체"
        ? posts
        : posts.filter(post => post.tracks.includes(selectedCategory));

    const currentFilteredPosts = filteredPosts.slice(
        (currentPage - 1) * postsPerPage,
        currentPage * postsPerPage
    );

    const handleCategoryClick = (category) => {
        setSelectedCategory(category);
        setCurrentPage(1);
    };

    return (
        <div className="FreeLancer-container">
            <div className="FreeLancer-Header">
                <div className="FreeLancer-Header-Left">
                    <div className="FreeLancer-Header-LOGO" onClick={handleMain}><span>P</span>-eeting</div>
                    <div className="FreeLancer-Header-Search">
                        <div className="FreeLancer-Header-SearchIcon"><img src={searchIcon} alt="돋보기아이콘" /></div>
                        <input className="FreeLancer-Header-InputArea" type="text" placeholder="프로젝트 미팅, 피팅" />
                    </div>
                </div>
                <div className="FreeLancer-Header-Right">
                    <div className="FreeLancer-Header-Right-ProMatch" onClick={handleMain}>프로젝트 매칭</div>
                    <div className="FreeLancer-Header-Right-FreeMatch" onClick={handleFreePage}>프리랜서 매칭</div>
                    <div className="FreeLancer-Header-Right-MyProject">마이 프로젝트</div>
                    <div className="FreeLancer-Header-Right-LoginButton">로그인</div>
                </div>
            </div>

            <div className="FreeLancer-Body">
                <div className="FreeLancer-Body-Kategory">
                    <div className="FreeLancer-Body-Kategory-Left">프리랜서 추천</div>

                    <div className="FreeLancer-Body-Kategory-Right">
                        {["전체", "FE 개발자", "BE 개발자", "PM", "디자이너"].map((category) => (
                            <div
                                key={category}
                                className={`FreeLancer-Body-Kategory-Right-item ${selectedCategory === category ? "active" : ""
                                    }`}
                                onClick={() => handleCategoryClick(category)}
                            >
                                {category}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="FreeLancer-Body-Content">
                    {currentFilteredPosts.map((post, index) => (
                        <div key={index} className="FreeLancer-Body-Content-Box1">
                            <div className="FreeLancer-Body-Content-Box1-Profile">
                                <img
                                    src={post.profileImage || defaultProfile}
                                    alt={`${post.name}의 프로필`}
                                    className="FreeLancer-Body-Content-profileImage"
                                />
                            </div>
                            <div className="FreeLancer-Body-Content-Box1-Inform">
                                <div className="FreeLancer-Body-Content-Box1-Inform-Name">이름 : {post.name}</div>
                                <div className="FreeLancer-Body-Content-Box1-Inform-Email">이메일 : {post.email}</div>
                                <div className="FreeLancer-Body-Content-Box1-Inform-record">이력<br />{post.resume}</div>
                                <div>트랙 : {post.tracks.join(', ')}</div>
                            </div>
                        </div>
                    ))}

                </div>

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
    )
}

export default FreeLancerPage