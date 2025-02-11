import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Modal from 'react-modal';
//firebase 임포트
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { getDocs, collection } from "firebase/firestore";
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import { auth, db } from '../firebase';

import searchIcon from '../images/search.png';
import firstIcon from '../images/first.png';
import prevIcon from '../images/prev.png';
import nextIcon from '../images/next.png';
import lastIcon from '../images/last.png';
import defaultProfile from '../images/profileImage.png';
import './FreeLancerPage.css';

function FreeLancerPage() {

    // 회원 정보 변수
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [selectedTracks, setSelectedTracks] = useState([]);
    const [selectedMemberClass, setSelectedMemberClass] = useState("");
    const [error, setError] = useState("");
    const [signupSuccess, setSignupSuccess] = useState(false);


    const [isLoggedIn, setIsLoggedIn] = useState(false); // 로그인 상태 추가
    const [currentUser, setCurrentUser] = useState(null); // 현재 로그인한 사용자 정보

    // 회원가입 라디오버튼 핸들러
    const handleRadioChange = (event) => {
        setSelectedMemberClass(event.target.value);
    };

    //라우터 핸들러
    const navigate = useNavigate();

    const handleMain = () => {
        navigate('/')
    }
    const handleProjButton = () => {
        navigate('/projectWrite')
    }

    const handleFreePage = () => {
        navigate('/FreeView');
    }

    const handleDetail = (post) => {
        localStorage.setItem("selectedPost", JSON.stringify(post)); // 데이터 저장
        navigate("/detail");
    };

    const handleMyProject = () => {
        if (isLoggedIn) {
            navigate('/MyProject');
        } else {
            alert('마이페이지는 로그인 후 이용 가능합니다.');
            setLoginModalIsOpen(true);
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
                            }
                        }
                        return post;
                    })
                );

                setPosts(updatedProjects);
            } catch (error) {
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

    // 로그인, 로그아웃, 회원가입 함수
    //모달 함수
    const [loginModalIsOpen, setLoginModalIsOpen] = useState(false);
    const [signupModalIsOpen, setSignupModalIsOpen] = useState(false);

    const openLoginModal = () => {
        setLoginModalIsOpen(true);
    };

    const closeLoginModal = () => {
        setLoginModalIsOpen(false);
    };

    const openSignupModal = () => {
        setSignupModalIsOpen(true);
        setLoginModalIsOpen(false);
    };

    const closeSignupModal = () => {
        setSignupModalIsOpen(false);
    };

    //트랙 선택 드롭다운 함수
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const trackOptions = ['디자이너', 'BE 개발자', 'FE 개발자', 'PM'];

    const toggleDropdown = () => {
        setIsDropdownOpen((prev) => !prev);
    };

    const handleTrackSelect = (track) => {
        setSelectedTracks((prev) =>
            prev.includes(track) ? prev.filter((item) => item !== track) : [...prev, track]
        );
    };

    // 로그인 세션 로컬 선택
    useEffect(() => {
        const storedLoginStatus = localStorage.getItem("isLoggedIn") || sessionStorage.getItem("isLoggedIn");
        if (storedLoginStatus === "true") {
            setIsLoggedIn(true);
        }
    }, []);


    const [keepLoggedIn, setKeepLoggedIn] = useState(false);

    const handleCheckboxChange = () => {
        setKeepLoggedIn(!keepLoggedIn); // 체크 여부 토글
    };

    // 로그인 함수
    const handleLogin = async (e) => {
        e.preventDefault();
        setError(""); // 기존 에러 초기화

        if (!email || !password) {
            setError("이메일과 비밀번호를 입력해주세요.");
            return;
        }

        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            setIsLoggedIn(true); // 로그인 상태 변경
            setCurrentUser(user); // 현재 사용자 설정

            setLoginModalIsOpen(false); // 로그인 모달 닫기
            setEmail('');
            setPassword('');

            if (keepLoggedIn) {
                localStorage.setItem("isLoggedIn", "true");
                localStorage.setItem("user", JSON.stringify(user)); // 사용자 정보 저장
            } else {
                sessionStorage.setItem("isLoggedIn", "true");
                sessionStorage.setItem("user", JSON.stringify(user)); // 사용자 정보 저장
            }
        } catch (err) {
            setError(`로그인 실패`);
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
        }
    };

    //회원가입 함수
    const handleSignup = async (e) => {
        e.preventDefault();
        if (!email || !password || !confirmPassword || !selectedMemberClass || selectedTracks.length === 0) {
            setError("모든 필드를 채워주세요.");
            return;
        }

        if (password !== confirmPassword) {
            setError("비밀번호가 일치하지 않습니다.");
            return;
        }

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            await setDoc(doc(db, "users", user.uid), {
                email,
                memberClass: selectedMemberClass,
                tracks: selectedTracks,
                appliedProjects: [],
                joinedProjects: [],
                profileImage: "",
                resume: "",
                name: "",
            });

            setSignupSuccess(true);
            setEmail("");
            setPassword("");
            setConfirmPassword("");
            setSelectedMemberClass("");
            setSelectedTracks([]);
        } catch (err) {
            setError(`회원가입 실패: ${err.message}`);
        }
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
                    <div className="FreeLancer-Header-Right-MyProject" onClick={handleMyProject}>마이 프로젝트</div>
                    {isLoggedIn ? (
                        <div className="FreeLancer-Header-Right-LogoutButton" onClick={handleLogout}>
                            로그아웃
                        </div>
                    ) : (
                        <div className="FreeLancer-Header-Right-LoginButton" onClick={() => setLoginModalIsOpen(true)}>
                            로그인
                        </div>
                    )}
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
            <Modal
                isOpen={loginModalIsOpen}
                onRequestClose={closeLoginModal}
                contentLabel="로그인"
                className="modal1"
                overlayClassName="overlay"
            >
                <div className="modal1-content">
                    <div className="modal1-content-loginTitle">로그인</div>
                    <form className="modal1-content-loginContents" onSubmit={handleLogin}>
                        <input
                            className="modal1-content-Email"
                            type="email"
                            placeholder="이메일"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <input
                            className="modal1-content-Password"
                            type="password"
                            placeholder="비밀번호"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        {error && <div className="modal1-content-error">{error}</div>}
                    </form>
                    <div className="modal1-content-loginType">
                        <input
                            className="modal1-content-memberClass-radio"
                            type="checkbox"
                            checked={keepLoggedIn}
                            onChange={handleCheckboxChange}
                        />
                        로그인 상태 유지
                    </div>
                    <div className="modal1-content-loginButton" onClick={handleLogin}>로그인</div>
                    <div className="modal1-content-joinSuggestion">
                        <div className="modal1-content-openJoin1">P-eeting이 처음이라면?</div>
                        <div className="modal1-content-openJoin2" onClick={openSignupModal}>회원가입하기</div>
                    </div>
                </div>
            </Modal>

            <Modal
                isOpen={signupModalIsOpen}
                onRequestClose={closeSignupModal}
                contentLabel="회원가입"
                className="modal2"
                overlayClassName="overlay"
            >
                <div className="modal2-content">
                    <div className="modal2-content-joinTitle">회원가입</div>
                    {signupSuccess ? (
                        <div className="modal2-content-success">회원가입이 완료되었습니다!</div>
                    ) : (
                        <form className="modal2-content-joinContents" onSubmit={handleSignup}>
                            <input
                                className="modal2-content-Email"
                                type="email"
                                placeholder="이메일"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            <input
                                className="modal2-content-Password"
                                type="password"
                                placeholder="비밀번호"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <input
                                className="modal2-content-Password2"
                                type="password"
                                placeholder="비밀번호 확인"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                            <div className="modal2-content-Track">
                                <button
                                    type="button"
                                    className={`modal2-content-Track-Dropdown ${selectedTracks.length === 0 ? 'placeholder' : ''}`}
                                    onClick={toggleDropdown}
                                >
                                    {selectedTracks.length > 0
                                        ? `${selectedTracks.join(', ')}`
                                        : '트랙 선택'}
                                </button>
                                {isDropdownOpen && (
                                    <ul className="dropdown-list">
                                        {trackOptions.map((track, index) => (
                                            <li
                                                key={index}
                                                className={`dropdown-item ${selectedTracks.includes(track) ? 'selected' : ''}`}
                                                onClick={() => handleTrackSelect(track)}
                                            >
                                                {track}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                                <div className="modal2-content-memberClass">
                                    <div className="modal2-content-memberClass-personal">
                                        <input
                                            className="modal2-content-memberClass-radio"
                                            type="radio"
                                            name="memberClass"
                                            value="basic"
                                            checked={selectedMemberClass === "basic"}
                                            onChange={handleRadioChange}
                                        /> 개인
                                    </div>
                                    <div className="modal2-content-memberClass-group">
                                        <input
                                            className="modal2-content-memberClass-radio"
                                            type="radio"
                                            name="memberClass"
                                            value="premium"
                                            checked={selectedMemberClass === "premium"}
                                            onChange={handleRadioChange}
                                        /> 단체
                                    </div>
                                </div>
                            </div>

                            {error && <div className="modal2-content-error">{error}</div>}
                            <button type="submit" className="modal2-content-joinButton">회원가입</button>
                        </form>
                    )}
                </div>
            </Modal>
        </div>
    )
}

export default FreeLancerPage