import searchIcon from '../images/search.png';
import './MainPage.css';

function MainPage() {

  return (
    <div className="MainPage-container">
      <div className="MainPage-Header">
        <div className="MainPage-Header-Left">
          <div className="MainPage-Header-LOGO"><span>P</span>-eeting</div>
          <div className="MainPage-Header-Search">
            <div className="MainPage-Header-SearchIcon"><img src={searchIcon} alt="돋보기아이콘" /></div>
            <input className="MainPage-Header-InputArea" type="text" placeholder="프로젝트 미팅, 피팅"/>
          </div>
        </div>
        <div className="MainPage-Header-Right">
          <div className="MainPage-Header-Right-ProMatch">프로젝트 매칭</div>
          <div className="MainPage-Header-Right-FreeMatch">프리랜서 매칭</div>
          <div className="MainPage-Header-Right-MyProject">마이 프로젝트</div>
          <div className="MainPage-Header-Right-LoginButton">로그인</div>
        </div>
      </div>
    </div>
  )
}

export default MainPage
