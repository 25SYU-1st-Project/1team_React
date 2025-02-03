import React, { useState } from 'react';
import searchIcon from '../images/search.png';
import trashIcon from '../images/trash.png';
import firstIcon from '../images/first.png';
import prevIcon from '../images/prev.png';
import nextIcon from '../images/next.png';
import lastIcon from '../images/last.png';
import './MyProjectPage.css';

function MyProjectPage() {
    

    const posts = Array.from({ length: 30 }, (_, index) => `Post ${index + 1}`);
    
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

    return(
        <div>
            <div className="MyProject-container">
                <div className="MyProject-Header">
                    <div className="MyProject-Header-Left">
                        <div className="MyProject-Header-LOGO"><span>P</span>-eeting</div>
                        <div className="MyProject-Header-Search">
                        <div className="MyProject-Header-SearchIcon"><img src={searchIcon} alt="돋보기아이콘"/></div>
                        <input className="MyProject-Header-InputArea" type="text" placeholder="프로젝트 미팅, 피팅" /></div>
                    </div>
                    <div className="MyProject-Header-Right">
                        <div className="MyProject-Header-Right-ProMatch">프로젝트 매칭</div>
                        <div className="MyProject-Header-Right-FreeMatch" type="button" >프리랜서 매칭</div>
                        <div className="MyProject-Header-Right-MyProject">마이 프로젝트</div>
                        <div className="MyProject-Header-Right-LoginButton">로그인</div>
                    </div>
                </div>   
                <div className="MyProject-Body">
                    <div className="MyProject-Body-Left">
                        <div className="MyProject-Body-Left-Profile"></div>
                        <div className="MyProject-Body-Left-Inform">
                            <div className="MyProject-Body-Left-Inform-Name">이름 : </div>
                            <div className="MyProject-Body-Left-Inform-Email"> 이메일</div>
                            <div className="MyProject-Body-Left-Inform-Password">비밀번호</div>
                            <div className="MyProject-Body-Left-Inform-Track">트랙</div>
                            <div className="MyProject-Body-Left-Inform-Record">이력</div>
                        </div>
                        <div className="MyProject-Body-Left-Complete">수정 완료</div>
                    </div>
                    <div className="MyProject-Body-Right">
                        <div className="MyProject-Body-Right-Content">
                        {currentPosts.map((post, index) => (
                            <div key={index} className="MyProject-Body-Right-Content-Box1">
                                <div className="MyProject-Body-Right-Content-Box1-Record">
                                    <div className="MyProject-Body-Right-Content-Box1-PrjName">Wad</div>
                                    <div className="MyProject-Body-Right-Content-Box1-Kategory">
                                        <div className="MyProject-Body-Right-Content-Box1-Kategory-K1"># FE 개발자</div>
                                        <div className="MyProject-Body-Right-Content-Box1-Kategory-K2"># BE 개발자</div>
                                        <div className="MyProject-Body-Right-Content-Box1-Kategory-K3"># 디자이너</div>
                                    </div>
                                    <div className="MyProject-Body-Right-Content-Box1-Salary">급여: </div>
                                    <div className="MyProject-Body-Right-Content-Box1-Detail">초보개발자 {post}</div>
                                </div>
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
            </div>
        </div>
    )
} export default MyProjectPage