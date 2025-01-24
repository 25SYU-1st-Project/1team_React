import React, { useState } from 'react';
import searchIcon from '../images/search.png';
import firstIcon from '../images/first.png';
import prevIcon from '../images/prev.png';
import nextIcon from '../images/next.png';
import lastIcon from '../images/last.png';
import './FreeLancerPage.css';

function FreeLancerPage() {

    // 그리드에 표시되는 포스트들, 페이징 버튼
    const posts = Array.from({ length: 30 }, (_, index) => `Post ${index + 1}`);

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


    return (
        <div className="FreeLancer-container">
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
                    <div className="MainPage-Header-Right-LoginButton">로그인</div>
                </div>
            </div>

            <div className="FreeLancer-Body">
                <div className="FreeLancer-Body-Kategory">
                    <div className="FreeLancer-Body-Kategory-Left">프리랜서 추천</div>

                    <div className="FreeLancer-Body-Kategory-Right">
                        <input className="FreeLancer-Body-Kategory-Right-Designer" type="button" value="디자이너" />
                        <input className="FreeLancer-Body-Kategory-Right-BE" type="button" value="BE 개발자" />
                        <input className="FreeLancer-Body-Kategory-Right-FE" type="button" value="FE 개발자" />
                        <input className="FreeLancer-Body-Kategory-Right-PM" type="button" value="PM" />
                    </div>
                </div>

                <div className="FreeLancer-Body-Content">
                    {currentPosts.map((post, index) => (
                        <div key={index} className="FreeLancer-Body-Content-Box1">
                            <div className="FreeLancer-Body-Content-Box1-Profile"></div>
                            <div className="FreeLancer-Body-Content-Box1-Inform">
                                <div className="FreeLancer-Body-Content-Box1-Inform-Name">이름 : </div>
                                <div className="FreeLancer-Body-Content-Box1-Inform-age">나이 : </div>
                                <div className="FreeLancer-Body-Content-Box1-Inform-Email">이메일 : </div>
                                <div className="FreeLancer-Body-Content-Box1-Inform-record">이력</div>
                                <div>{post}</div>
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
        </div>
    )
}

export default FreeLancerPage