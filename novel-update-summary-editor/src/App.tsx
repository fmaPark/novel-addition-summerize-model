import React, { useState, useRef, useEffect } from 'react';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import './App.css';

interface Version {
  date: string;
  details: string;
}

interface VersionModelData {
  origin : string;
  added : string;
}

interface LogData {
  index : number;
  title : string;
  subtitle : string;
  content: string;
  timestamp: string;
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
  const titleInputRef = useRef<HTMLInputElement>(null);
  const subtitleInputRef = useRef<HTMLInputElement>(null);
  const contextInputRef = useRef<HTMLTextAreaElement>(null);

  const [isLeftSidebarOpen, setIsLeftSidebarOpen] = useState(true);
  const [isRightSidebarOpen, setIsRightSidebarOpen] = useState(true);

  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [openNowVersionIndex, setOpenNowVersionIndex] = useState<number | null>(0);

  const [message, setMessage] = useState('');
  // const [context, setContext] = useState(null);
  const [nowVersion, setNowVersion] = useState<LogData | null>(null);
  const [versions, setVersions] = useState<LogData[]>([]);
  const [versionIndex, setVersionIndex] = useState<number>(0);
  

  // const now_version: Version[] = [
  //   { date: '24-05-23 07:23', details: '○○dd한 내용이 추가됨.' },
  // ]; 

  // const versions: Version[] = [
  //   { date: '24-05-23 07:23', details: '○○한 내용이 추가됨.' },
  //   { date: '24-05-22 22:30', details: '' },
  //   { date: '24-05-22 17:49', details: '' },
  // ]; 

  const toggleLeftSidebar = () => {
    setIsLeftSidebarOpen(!isLeftSidebarOpen);
  };

  const toggleRightSidebar = () => {
    setIsRightSidebarOpen(!isRightSidebarOpen);
  };

  const handleNowVersionClick = (index: number) => {
    setOpenNowVersionIndex(index === openNowVersionIndex ? null : index);
  };

  const handleClick = (index: number) => {
    setOpenIndex(index === openIndex ? null : index);
  };

  useEffect(() => {
    fetchVersions();
  }, []);

  const fetchVersions = async () => {
    try {
      const response = await fetch('http://localhost:8000/logs/');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data: LogData[] = await response.json();
      if (data.length > 0) {
        setNowVersion(data[data.length - 1]);
        setVersions(data.slice(0, -1));
        setVersionIndex(data.length);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleVersionLog = async () => {
    if (contextInputRef.current && titleInputRef.current && subtitleInputRef.current) {
      const title = titleInputRef.current.value;
      const subtitle = subtitleInputRef.current.value;
      const content = contextInputRef.current.value;
      const timestamp = new Date().toLocaleString();

      let original = '';
      let added = '';

      if (nowVersion) {
        const nowContent = nowVersion.content;

        // Find the common prefix
        let i = 0;
        while (i < nowContent.length && i < content.length && nowContent[i] === content[i]) {
          original += nowContent[i];
          i++;
        }
        added = content.slice(i);

        // Split original into sentences
        let originalSentences = original.split('.').filter(sentence => sentence.trim().length > 0);

        // If there are more than 3 sentences, keep only the last 2
        if (originalSentences.length > 2) {
          original = originalSentences.slice(-2).join('.') + '.';
        } else {
          original = originalSentences.join('.') + '.';
        }
      }

      // Prepare data for the prediction request
      const versionModelData: VersionModelData = { origin: original, added };

      try {
        // Send data to the predict endpoint
        const predictionResponse = await fetch('http://localhost:8000/predict/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(versionModelData)
        });

        if (!predictionResponse.ok) {
          throw new Error(`HTTP error! status: ${predictionResponse.status}`);
        }

        const predictedText = await predictionResponse.json();

        // Prepare LogData with the predicted details
        const data: LogData = {
          index: versionIndex + 1,
          title,
          subtitle,
          content: predictedText,
          timestamp
        };

        // Add the new version to the versions array
        setVersions([...versions, data]);

        try {
          const response = await fetch('http://localhost:8000/log/', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
          });

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const result = await response.json();
          setMessage(result.message);

          // After adding new version, fetch and update versions
          await fetchVersions();
        } catch (error) {
          console.error('Error:', error);
          setMessage(`Error: ${error}`);
        }
      } catch (error) {
        console.error('Error:', error);
        setMessage(`Error: ${error}`);
      }
    }
  };

  const handleRollback = () => {
    if (openIndex !== null && openIndex !== -1) {
      const confirmRollback = window.confirm('선택된 버전으로 되돌리시겠습니까? 버전 기록을 수행하지 않은 문서는 유실될 수 있습니다.');
      if (confirmRollback) {
        const selectedVersion = versions[openIndex];
        const newVersions = versions.filter((_, idx) => idx !== openIndex);
        if (nowVersion) {
          newVersions.push(nowVersion);
        }
        setNowVersion(selectedVersion);
        setVersions(newVersions);

        if (titleInputRef.current) titleInputRef.current.value = selectedVersion.title;
        if (subtitleInputRef.current) subtitleInputRef.current.value = selectedVersion.subtitle;
        if (contextInputRef.current) contextInputRef.current.value = selectedVersion.content;

        setOpenIndex(null);
      }
    }
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
            <button onClick={handleVersionLog}>버전 기록</button>
            <button onClick={handleRollback}>되돌리기</button>
            <button>삭제</button>
            <button>폴더 이동</button>
          </div>
        </header>
        
        <section className="editor">
          <input ref={titleInputRef} type="text" placeholder="제목을 입력하세요." className="title-input" />
          <input ref={subtitleInputRef} type="text" placeholder="소제목을 입력하세요." className="subtitle-input" />
          <hr />
          <textarea ref={contextInputRef} placeholder="내용을 입력하세요." className="context-input"></textarea>

        </section>
      </main>
      
      <aside className={`sidebar right-sidebar ${isRightSidebarOpen ? '' : 'collapsed'}`}>

        
      <h2>Version</h2>
        <div className="version"></div>
        {nowVersion && (
          <VersionItem
            key={nowVersion.index}
            version={{ date: nowVersion.timestamp, details: nowVersion.content }}
            isOpen={openNowVersionIndex === nowVersion.index}
            onClick={() => handleNowVersionClick(nowVersion.index)}
          />
        )}
        <hr />
        {versions.map((version, index) => (
          <VersionItem
            key={index}
            version={{ date: version.timestamp, details: version.content }}
            isOpen={openIndex === index}
            onClick={() => handleClick(index)}
          />
        ))}
        
      </aside>
    </div>
  );
};

export default App;
