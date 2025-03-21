
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { auth, db } from "../firebase"; // Firebase 초기화 파일에서 가져옴
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { signOut } from 'firebase/auth';
import { updatePassword } from "firebase/auth";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

import searchIcon from '../images/search.png';
import trashIcon from '../images/trash.png';
import firstIcon from '../images/first.png';
import prevIcon from '../images/prev.png';
import nextIcon from '../images/next.png';
import lastIcon from '../images/last.png';
import defaultProfile from '../images/profileImage.png';
import imageEditIcon from '../images/imageEdit.png';
import './MyProjectPage.css';

function MyProjectPage() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);
    const navigate = useNavigate();

    const handleMain = () => {
        navigate('/')
    }

    const handleFreePage = () => {
        navigate('/FreeView');
    }

    const handleLogout = async () => {
        try {
            await signOut(auth);
            setIsLoggedIn(false); // 로그인 상태 해제
            setCurrentUser(null); // 현재 사용자 초기화
            localStorage.removeItem("isLoggedIn");
            localStorage.removeItem("user");
            sessionStorage.removeItem("isLoggedIn");
            sessionStorage.removeItem("user");
            navigate('/')
        } catch (err) {
            console.error('로그아웃 실패');
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
    const [profileImage, setProfileImage] = useState(defaultProfile);
    const [isUploading, setIsUploading] = useState(false);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [tracks, setTracks] = useState([]);
    const [resume, setResume] = useState("");

    //트랙 선택 드롭다운 함수
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const trackOptions = ['디자이너', 'BE 개발자', 'FE 개발자', 'PM'];

    const toggleDropdown = () => {
        setIsDropdownOpen((prev) => !prev);
    };

    const handleTrackSelect = (track) => {
        setTracks((prev) =>
        prev.includes(track) ? prev.filter((item) => item !== track) : [...prev, track]
        );
    };

    useEffect(() => {
        const fetchUserAndProjects = async () => {
            const storedUser = localStorage.getItem("user");
            if (!storedUser) return;
    
            const { uid } = JSON.parse(storedUser);
    
            try {
                const userDoc = await getDoc(doc(db, "users", uid));
                if (userDoc.exists()) {
                    const userData = userDoc.data();
    
                    setUserInfo(userData);
                    setProfileImage(userData.profileImage || defaultProfile);
                    setName(userData.name || ""); 
                    setEmail(userData.email || ""); 
                    setTracks(userData.tracks || []); 
                    setResume(userData.resume || ""); 
    
                    const joinedProjects = userData.joinedProjects || [];
                    if (joinedProjects.length === 0) {
                        setPosts([]);
                        return;
                    }
    
                    const projectPromises = joinedProjects.map(async (projectId) => {
                        const projectRef = doc(db, "projects", projectId);
                        const projectSnap = await getDoc(projectRef);
                        return projectSnap.exists() ? { id: projectId, ...projectSnap.data() } : null;
                    });
    
                    const projects = await Promise.all(projectPromises);
                    setPosts(projects.filter((project) => project !== null));
                }
            } catch (error) {
                console.error("Error fetching user and project data");
            }
        };
    
        fetchUserAndProjects();
    }, []);
    

    const handleEditButton = async () => {
        const storedUser = localStorage.getItem("user");
        if (!storedUser) return;
    
        const { uid } = JSON.parse(storedUser); 
        const userDocRef = doc(db, "users", uid); 
    
        try {
            await updateDoc(userDocRef, {
                name: name,
                email: email,
                tracks: tracks,
                resume: resume
            });
    
            // 비밀번호 변경 로직 추가
            if (password) {
                const user = auth.currentUser;
                await updatePassword(user, password);
            }
            alert("수정 완료");
        } catch (error) {
            console.error("수정 실패");
        }
    };

    //프로필 이미지 변환
     const handleProfileImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setIsUploading(true);

            // Firebase Storage에 파일 업로드
            const storage = getStorage();
            const storageRef = ref(storage, `profileImage/${file.name}`);
            const uploadTask = uploadBytesResumable(storageRef, file);

            uploadTask.on(
                "state_changed",
                (snapshot) => {
                },
                (error) => {
                    console.error("파일 업로드 실패");
                    setIsUploading(false);
                },
                () => {
                    // 업로드 완료
                    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                        const storedUser = localStorage.getItem("user");
                        if (!storedUser) return;

                        const { uid } = JSON.parse(storedUser);
                        const userDocRef = doc(db, "users", uid);
                        
                        updateDoc(userDocRef, {
                            profileImage: downloadURL
                        }).then(() => {
                            setProfileImage(downloadURL);
                            setIsUploading(false);
                        }).catch((error) => {
                            console.error("Firestore 업데이트 실패");
                            setIsUploading(false);
                        });
                    });
                }
            );
        }
    };

    const handleDelte = async (postId) => {
        const confirmDelete = window.confirm("삭제하시겠습니까?");
        if (!confirmDelete) return;

        const storedUser = localStorage.getItem("user");
        if (!storedUser) return;

        const { uid } = JSON.parse(storedUser); 
        const userDocRef = doc(db, "users", uid); 

        try {
            // joinedProjects에서 삭제할 프로젝트 ID 제외
            let updatedJoinedProjects = userInfo.joinedProjects || [];  // 비어있으면 빈 배열로 초기화
            updatedJoinedProjects = updatedJoinedProjects.filter(project => project !== postId);

            // Firestore에서 업데이트된 프로젝트 목록 반영
            await updateDoc(userDocRef, {
                joinedProjects: updatedJoinedProjects
            });

            // 상태 업데이트
            setUserInfo((prevUserInfo) => ({
                ...prevUserInfo,
                joinedProjects: updatedJoinedProjects,
            }));

            // 로컬 상태에서 해당 프로젝트 삭제
            setPosts((prevPosts) => prevPosts.filter(post => post.id !== postId));
            alert("삭제 완료");
        } catch (error) {
            console.error("프로젝트 삭제 오류");
            alert("삭제 실패");
        }
    };

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
                        <div className="MyProject-Header-Right-Logout" onClick={handleLogout}>로그아웃</div>
                    </div>
                </div>
                {userInfo ? (
                    <div className="MyProject-Body">
                        <div className="MyProject-Body-Left">
                            <div className="MyProject-Body-Left-Profile">
                                <div className="MyProject-Body-Left-ProfileImage">
                                    <img
                                            src={userInfo.profileImage || defaultProfile}
                                            alt={'${userInfo.name}의 프로필'}
                                    />
                                </div>
                                <div className="MyProject-Body-Left-NewProfileImage">
                                    <input
                                        id="profileImage"
                                        type="file"
                                        style={{display: 'none'}}
                                        accept="image/*"
                                        onChange={handleProfileImageChange}
                                        disabled={isUploading}
                                    />
                                    <label className="MyProject-Body-Left-NewProfileImage-Button" htmlFor="profileImage">
                                        <img src={imageEditIcon} alt="ImageEdit"/>
                                    </label>
                                </div>
                            </div>
                            <div className="MyProject-Body-Left-Name">
                                <input
                                    type="text"
                                    value={name}
                                    placeholder='이름 입력'
                                    onChange={(e) => setName(e.target.value)}
                                />
                            </div>
                            <div className="MyProject-Body-Left-Inform">
                                <div className="MyProject-Body-Left-Inform-Email"> 이메일
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />    
                                </div>
                                <div className="MyProject-Body-Left-Inform-Password">비밀번호 
                                    <input
                                        type="password"
                                        value={password}
                                        placeholder='변경하실 비밀번호를 입력해주세요.'
                                        onChange={(e) => setPassword(e.target.value)}
                                    />  
                                </div>
                                <div className="MyProject-Body-Left-Inform-Track">트랙
                                    <button
                                        type="button"
                                        className={`MyProject-Body-Left-Inform-Track-Dropdown ${tracks.length === 0 ? 'placeholder' : ''}`}
                                        onClick={toggleDropdown}
                                    >
                                        {tracks.length > 0
                                            ? `# ${tracks.join(' # ')}`
                                            : ''}
                                        </button>
                                        {isDropdownOpen && (
                                        <ul className="dropdown-list">
                                            {trackOptions.map((track, index) => (
                                            <li
                                                key={index}
                                                className={`dropdown-item ${tracks.includes(track) ? 'selected' : ''}`}
                                                onClick={() => handleTrackSelect(track)}
                                            >
                                                {track}
                                            </li>
                                            ))}
                                        </ul>
                                        )}
                                </div>
                                <div className="MyProject-Body-Left-Inform-Resume">이력
                                    <textarea
                                        type="text"
                                        value={resume}
                                        onChange={(e) => setResume(e.target.value)}
                                    />  
                                </div>
                            </div>
                            <div className="MyProject-Body-Left-Complete" onClick={handleEditButton}>저장하기</div>
                        </div>
                        <div className="MyProject-Body-Right">
                            <div className="MyProject-Body-Right-Content">
                            {currentPosts.map((post, index) => (
                                <div key={index} className="MyProject-Body-Right-Content-Box1">
                                    <div className="MyProject-Body-Right-Content-Box1-Resume">
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
                                            {post.tracks.map((track, index) => (
                                                <div key={index} className="track-box">
                                                    {track}
                                                </div>
                                            ))}
                                        </div>

                                        {/* 급여 정보 */}
                                        <div className="MyProject-Body-Right-Content-Box1-Salary">급여: {post.salary}</div>

                                        {/* 상세 설명 */}
                                        <div className="MyProject-Body-Right-Content-Box1-Detail">
                                            <div className="MyProject-Body-Right-Content-Box1-DetailContent">
                                                {post.description}
                                            </div>
                                        </div>
                                    </div>

                                    {/* 삭제 버튼 */}
                                    <div className="MyProject-Body-Right-Content-Box1-Trash" onClick={() => handleDelte(post.id)}>
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