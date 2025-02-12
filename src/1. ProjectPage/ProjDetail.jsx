import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { Link } from 'react-scroll';
import Modal from 'react-modal';

import './ProjDetail.css';
import searchIcon from '../images/search.png';

import firstIcon from '../images/first.png';
import prevIcon from '../images/prev.png';
import nextIcon from '../images/next.png';
import lastIcon from '../images/last.png';
import plusIcon from '../images/plusIcon.png';

//firebase 임포트
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, collection, getDoc, addDoc, onSnapshot, orderBy, query } from "firebase/firestore";
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import { updateDoc, arrayUnion } from "firebase/firestore";
import { auth, db } from '../firebase';

function projDetail() {
  // 회원 정보 변수
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [selectedTracks, setSelectedTracks] = useState([]);
  const [selectedMemberClass, setSelectedMemberClass] = useState("");
  const [error, setError] = useState("");
  const [signupSuccess, setSignupSuccess] = useState(false);


  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [userName, setUserName] = useState("");

  const [post, setPost] = useState(null);
  const projectId = post?.id;
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const [isPostOwner, setIsPostOwner] = useState(false);


  // 회원가입 라디오버튼 핸들러
  const handleRadioChange = (event) => {
    setSelectedMemberClass(event.target.value);
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

  //라우터 핸들러

  const navigate = useNavigate();

  const handleMain = () => {
    navigate('/')
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
      console.error('로그아웃 실패');
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
  // 댓글 입력 핸들러
  const handleCommentChange = (e) => {
    setComment(e.target.value);
  };

  // Firestore에 댓글 추가
  const handlePostComment = async () => {
    if (!comment.trim()) return; // 빈 댓글 방지

    if (!auth.currentUser) {
      alert("로그인 후 이용해주세요.");

      return;
    }

    const currentDate = new Date();
    const userId = auth.currentUser.uid;

    try {
      await addDoc(collection(db, `projects/${projectId}/comments`), {
        contents: comment,
        createdAt: currentDate,
        creatorId: userId,
        creatorName: userName, // 기존의 name 대신 userName 사용
        participateStatus: "none"
      });
      setComment(""); // 입력 필드 초기화
    } catch (error) {
      console.error("댓글 저장 오류");
    }
  };

  const fetchUserName = async (userId) => {
    if (!userId) return;

    try {
      const userDoc = await getDoc(doc(db, "users", userId));
      if (userDoc.exists()) {
        return userDoc.data().name;
      } else {
        console.error("사용자 정보가 없습니다.");
      }
    } catch (error) {
      console.error("사용자 정보 가져오기 오류");
    }
  };

  useEffect(() => {
    if (auth.currentUser) {
      fetchUserName(auth.currentUser.uid).then((name) => {
        if (name) setUserName(name);
      });
    }
  }, [auth.currentUser]);

  const storage = getStorage();

  const fetchUserProfileImage = async (userId) => {
    try {
      const userDoc = await getDoc(doc(db, "users", userId));
      if (userDoc.exists()) {
        const profileImagePath = userDoc.data().profileImage;

        if (profileImagePath) {
          const imageRef = ref(storage, profileImagePath);
          const imageUrl = await getDownloadURL(imageRef); // 이미지 URL 가져오기
          return imageUrl;
        }
      }
    } catch (error) {
      console.error("프로필 이미지 가져오기 오류:", error);
    }
    return "/default-profile.png"; // 오류 시 기본 이미지 반환
  };

  // Firestore에서 댓글 가져오기 (실시간 업데이트)
  useEffect(() => {
    const unsubscribe = onSnapshot(
      query(
        collection(db, `projects/${projectId}/comments`),
        orderBy("createdAt", "desc")
      ),
      async (snapshot) => {
        const commentsWithImages = await Promise.all(
          snapshot.docs.map(async (doc) => {
            const commentData = doc.data();
            const profileImage = await fetchUserProfileImage(commentData.creatorId);
            return {
              id: doc.id,
              ...commentData,
              profileImage, // 프로필 이미지 추가
            };
          })
        );

        setComments(commentsWithImages);

        if (post && auth.currentUser) {
          setIsPostOwner(String(post.creatorId) === String(auth.currentUser.uid));
        }
      }
    );

    return () => unsubscribe();
  }, [projectId, post, auth?.currentUser]);




  const handleAccept = async (commentItem) => {
    if (!isPostOwner) return;

    const commentRef = doc(db, `projects/${projectId}/comments`, commentItem.id);
    
    try {
      await updateDoc(commentRef, {
        participateStatus: "accepted",
      });
      // 해당 사용자의 joinedProjects 업데이트
      const userRef = doc(db, "users", commentItem.creatorId);
      await updateDoc(userRef, {
        joinedProjects: arrayUnion(projectId),
      });
  
    } catch (error) {
    }
  };

  const handleReject = async (commentItem) => {
    if (!isPostOwner) return;

    const commentRef = doc(db, `projects/${projectId}/comments`, commentItem.id);
    
    try {
      await updateDoc(commentRef, {
        participateStatus: "rejected",
      });
    } catch (error) {
    }
  };


  // 그리드에 표시되는 포스트들, 페이징 버튼
  const commentsPerPage = 4; // 한 페이지에 표시할 댓글
  const [currentCommentPage, setCurrentCommentPage] = useState(1);
  const maxPageButtons = 5; // 페이지 버튼 최대 개수

  // 전체 페이지 수 계산
  const totalCommentPages = Math.ceil(comments.length / commentsPerPage);

  const getPageNumbers = () => {
    const pageGroup = Math.floor((currentCommentPage - 1) / maxPageButtons) * maxPageButtons;
    const startPage = pageGroup + 1;
    const endPage = Math.min(startPage + maxPageButtons - 1, totalCommentPages);

    return Array.from({ length: endPage - startPage + 1 }, (_, index) => startPage + index);
  };

  const currentFilteredPosts = comments.slice(
    (currentCommentPage - 1) * commentsPerPage,
    currentCommentPage * commentsPerPage
  );

  const handleCommentPageChange = (pageNumber) => {
    setCurrentCommentPage(pageNumber);
  };

  const handleFirstPage = () => {
    setCurrentCommentPage(1);
  };

  const handleLastPage = () => {
    setCurrentCommentPage(totalCommentPages);
  };

  const handlePrevPage = () => {
    setCurrentCommentPage(prev => (prev > 1 ? prev - 1 : 1));
  };

  const handleNextPage = () => {
    setCurrentCommentPage(prev => (prev < totalCommentPages ? prev + 1 : totalCommentPages));
  };


  useEffect(() => {
    const savedPost = localStorage.getItem("selectedPost");
    if (savedPost) {
      setPost(JSON.parse(savedPost));
    } else {
      navigate("/");
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
            <Link to="DetailSubbody" smooth={true} duration={500} offset={-50}>
              <div className="Detail-Body-pApplicate">
                지원하기
              </div >
            </Link>
          </div>
        </div>
      </div>

      <div id="DetailSubbody" className="Detail-SubBody">
        <div className="Detail-SubBody-applicateBox">
          <textarea
            className="Detail-SubBody-applicateBox-textarea"
            placeholder="지원신청 댓글을 입력해주세요."
            value={comment}
            onChange={handleCommentChange}
          />
          <div className="Detail-SubBody-applicateButton" onClick={handlePostComment}>
            지원하기
          </div>
        </div>
        <div className="Detail-SubBody-commentBox">
          {currentFilteredPosts.map((c, index) => (
            <div key={index} className="Detail-SubBody-comment">
              <div className="Detail-SubBody-commentBox-comment-header">
                <div className="Detail-SubBody-commentBox-comment-header-profile">
                  <div className="Detail-SubBody-commentBox-comment-header-profileImage">
                    <img src={c.profileImage} alt="" />
                  </div>
                  <div className="Detail-SubBody-commentBox-comment-header-profileName">
                    {c.creatorName}
                  </div>
                </div>
                <div className="Detail-SubBody-commentBox-comment-header-dayAgo">
                  {c.createdAt?.toDate().toLocaleDateString("ko-KR", {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </div>
              </div>
              <div className="Detail-SubBody-commentBox-comment-contents">
                <div className="Detail-SubBody-commentBox-comment-Box">
                  {c.contents}
                </div>
                {/* {c.participateStatus} */}
                {isPostOwner && c.participateStatus === "none" && (
      <div className="Detail-SubBody-commentBox-comment-decision">
        <div className="Detail-SubBody-commentBox-comment-Accept" onClick={() => handleAccept(c)}>
          수락
        </div>
        <div className="Detail-SubBody-commentBox-comment-Reject" onClick={() => handleReject(c)}>
          거절
        </div>
      </div>
    )}

    {c.participateStatus === "accepted" && <div className="accepted-status">✅ 수락됨</div>}
    {c.participateStatus === "rejected" && <div className="rejected-status">❌ 거절됨</div>}
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

              onClick={() => handleCommentPageChange(pageNumber)}
              className={pageNumber === currentCommentPage ? 'active' : ''}
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

      <div className="AdSlide-detail">
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
  );

};

export default projDetail;