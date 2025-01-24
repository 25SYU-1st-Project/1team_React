import React, { useState } from 'react';
import Modal from 'react-modal';
import searchIcon from '../images/search.png';
import './MainPage.css';

import firstIcon from '../images/first.png';
import prevIcon from '../images/prev.png';
import nextIcon from '../images/next.png';
import lastIcon from '../images/last.png';

Modal.setAppElement('#root');

function MainPage() {
  // 그리드에 표시되는 포스트들, 페이징 버튼
  const posts = Array.from({ length: 30 }, (_, index) => `Post ${index + 1}`);

  const postsPerPage = 6;
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

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedTracks, setSelectedTracks] = useState([]);
  const trackOptions = ['디자이너', 'BE 개발자', 'FE 개발자', 'PM'];

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  const handleTrackSelect = (track) => {
    setSelectedTracks((prev) =>
      prev.includes(track) ? prev.filter((item) => item !== track) : [...prev, track]
    );
  };

  return (
    <div className="MainPage-container">
      <div className="MainPage-Header">
        <div className="MainPage-Header-Left">
          <div className="MainPage-Header-LOGO"><span>P</span>-eeting</div>
          <div className="MainPage-Header-Search">
            <div className="MainPage-Header-SearchIcon"><img src={searchIcon} alt="돋보기아이콘" /></div>
            <input className="MainPage-Header-InputArea" type="text" placeholder="프로젝트 미팅, 피팅" />
          </div>
        </div>
        <div className="MainPage-Header-Right">
          <div className="MainPage-Header-Right-ProMatch">프로젝트 매칭</div>
          <div className="MainPage-Header-Right-FreeMatch">프리랜서 매칭</div>
          <div className="MainPage-Header-Right-MyProject">마이 프로젝트</div>
          <div className="MainPage-Header-Right-LoginButton" onClick={openLoginModal}>로그인</div>
        </div>
      </div>
      <div className="MainPage-Contents">
        <div className="MainPage-Contents-header">
          <div className="MainPage-Contents-header-title">프로젝트 목록</div>
          <div className="MainPage-Contents-header-category">
            <div className="MainPage-Contents-header-category1">문화 · 스포츠</div>
            <div className="MainPage-Contents-header-category2">금융 · 보험</div>
            <div className="MainPage-Contents-header-category3">의료서비스</div>
            <div className="MainPage-Contents-header-category4">건설 · 건축</div>
          </div>
        </div>
        <div className="MainPage-Contents-body">
          {currentPosts.map((post, index) => (
            <div key={index} className="MainPage-Contents-item">
              {post}
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
      <div className="AdSlide" />
      <Modal
        isOpen={loginModalIsOpen}
        onRequestClose={closeLoginModal}
        contentLabel="로그인"
        className="modal1"
        overlayClassName="overlay"
      >
        <div className="modal1-content">
          <div className="modal1-content-loginTitle">로그인</div>
          <form className="modal1-content-loginContents">
            <input className="modal1-content-Email" type="text" placeholder='이메일' />
            <input className="modal1-content-Password" type="password" placeholder='비밀번호' />
          </form>
          <div className="modal1-content-joinSuggestion">
            <div className="modal1-content-openJoin1">P-eeting이 처음이라면?</div>
            <div className="modal1-content-openJoin2" onClick={openSignupModal}>회원가입하기</div>
          </div>
          <div className="modal1-content-loginButton">로그인</div>
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
          <form className="modal2-content-joinContents">
            <input className="modal2-content-Email" type="text" placeholder='이메일' />
            <input className="modal2-content-Password" type="password" placeholder='비밀번호' />
            <input className="modal2-content-Password2" type="password" placeholder='비밀번호 확인' />
            <div className="modal2-content-Track">
              <button
                type="button"
                className={`modal2-content-Track-Dropdown ${selectedTracks.length === 0 ? 'placeholder' : ''
                  }`}
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
                      className={`dropdown-item ${selectedTracks.includes(track) ? 'selected' : ''
                        }`}
                      onClick={() => handleTrackSelect(track)}
                    >
                      {track}
                    </li>
                  ))}
                </ul>
              )}
              <input className="modal2-content-Age" type="text" placeholder='나이' />
            </div>

          </form>
          <div className="modal2-content-joinButton">회원가입</div>
        </div>
      </Modal>
    </div>
  )
}

export default MainPage
