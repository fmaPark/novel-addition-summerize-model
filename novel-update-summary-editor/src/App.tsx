import React, { useState } from 'react';
import { Editor } from 'react-draft-wysiwyg';
import { EditorState } from 'draft-js';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import './App.css';

interface Version {
  date: string;
  details: string;
}

const VersionItem: React.FC<{
  version: Version;
  isOpen: boolean;
  onClick: () => void;
}> = ({ version, isOpen, onClick }) => {
  return (
    <div className="version-item">
      <div className={`version-header ${isOpen ? 'open' : ''}`} onClick={onClick}>
        <span>{isOpen ? '▼' : '▶'}</span> {version.date}
      </div>
      {isOpen && <div className="version-details">{version.details}</div>}
    </div>
  );
};

const App: React.FC = () => {
  const [isLeftSidebarOpen, setIsLeftSidebarOpen] = useState(true);
  const [isRightSidebarOpen, setIsRightSidebarOpen] = useState(true);
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const now_version: Version[] = [
    { date: '24-05-23 07:23', details: '○○한 내용이 추가됨.' },
  ]; 

  const versions: Version[] = [
    { date: '24-05-23 07:23', details: '○○한 내용이 추가됨.' },
    { date: '24-05-22 22:30', details: '' },
    { date: '24-05-22 17:49', details: '' },
  ]; 

  const toggleLeftSidebar = () => {
    setIsLeftSidebarOpen(!isLeftSidebarOpen);
  };

  const toggleRightSidebar = () => {
    setIsRightSidebarOpen(!isRightSidebarOpen);
  };

  const handleClick = (index: number) => {
    setOpenIndex(index === openIndex ? null : index);
  };


  return (
    <div className="app-container">
      <aside className={`sidebar left-sidebar ${isLeftSidebarOpen ? '' : 'collapsed'}`}>
        <div className="menu">
          <button className="new-post-button">새 글 쓰기</button>
          <div className="menu-item">
            <span className="icon">⭐</span>
            <span>중요 글</span>
          </div>
          <div className="menu-item">
            <span className="icon">🔍</span>
            <span>최근 항목</span>
          </div>
          <hr />
          <nav>
            <ul className="folder-list">
              <li>
                <span className="folder-icon">▶</span>
                <span>폴더1</span>
              </li>
              <ul className="file-list">
                <li>글1</li>
                <li>글2</li>
              </ul>
            </ul>
          </nav>
        </div>
      </aside>
      
      <main className="main-content">
        <header className="header">
          <div className="header-top">
            <button className="sidebar-toggle left" onClick={toggleLeftSidebar}>&#9776;</button>
            <input type="text" placeholder="글에서 검색" className="search-input" />
            <button className="search-button">🔍</button>
            <button className="sidebar-toggle right" onClick={toggleRightSidebar}>&#9776;</button>
          </div>
          <div className="header-bottom">
            <button>저장</button>
            <button>버전 기록</button>
            <button>되돌리기</button>
            <button>삭제</button>
            <button>폴더 이동</button>
          </div>
        </header>
        
        <section className="editor">
          <input type="text" placeholder="제목을 입력하세요." className="title-input" />
          <input type="text" placeholder="소제목을 입력하세요." className="subtitle-input" />
          <hr />
          <textarea placeholder="내용을 입력하세요." className="context-input"></textarea>

        </section>
      </main>
      
      <aside className={`sidebar right-sidebar ${isRightSidebarOpen ? '' : 'collapsed'}`}>
        <h2>Version</h2>
      
        <div className="version"></div>

        {now_version.map((version, index) => (
          <VersionItem
            key={index}
            version={version}
            isOpen={index === openIndex}
            onClick={() => handleClick(index)}
          />
        ))}

        <hr />

        {versions.map((version, index) => (
          <VersionItem
            key={index}
            version={version}
            isOpen={index === openIndex}
            onClick={() => handleClick(index)}
          />
        ))}
        
      </aside>
    </div>
  );
};

export default App;
