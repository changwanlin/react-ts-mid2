import { useEffect, useRef, useState } from 'react';
import '../style/App.css';
import { asyncGet, asyncDelete } from '../utils/fetch';
import { api } from '../enum/api';
import { Student } from '../interface/Student';
import { resp } from '../interface/resp';

function App() {
  const [students, setStudents] = useState<Array<Student>>([]);
  const [filteredStudents, setFilteredStudents] = useState<Array<Student>>([]);
  const [currentTab, setCurrentTab] = useState<string>('list'); // 控制顯示的區域
  const [formData, setFormData] = useState<Partial<Student>>({});
  const [searchKeyword, setSearchKeyword] = useState<string>('');
  const [absenceCount, setAbsenceCount] = useState<number | string>('');

  const cache = useRef<boolean>(false);

  useEffect(() => {
    if (!cache.current) {
      cache.current = true;
      asyncGet(api.findAll).then((res: resp<Array<Student>>) => {
        if (res.code === 200) {
          // 為每位學生隨機生成缺席次數
          const studentsWithRandomAbsences = res.body.map((student) => ({
            ...student,
            absences: Math.floor(Math.random() * 11), // 隨機生成 0-10 的數字
          }));
          setStudents(studentsWithRandomAbsences);
          setFilteredStudents(studentsWithRandomAbsences);
        }
      });
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const addStudent = async () => {
    try {
      const response = await fetch(api.create, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const result = await response.json();
      if (result.code === 200) {
        alert('新增成功');
        refreshStudents();
      } else {
        alert(`新增失敗: ${result.message}`);
      }
    } catch (error) {
      alert('新增過程中發生錯誤');
    }
  };

  const deleteStudent = async () => {
    try {
      const response = await fetch(`${api.deleteStudent}?id=${formData.sid}`, {
        method: 'DELETE',
      });
      const result = await response.json();
      if (result.code === 200) {
        alert('刪除成功');
        refreshStudents();
      } else {
        alert(`刪除失敗: ${result.message}`);
      }
    } catch (error) {
      console.error('刪除過程中發生錯誤:', error);
      alert('刪除過程中發生錯誤');
    }
  };

  const updateStudent = async () => {
    const { _id, name } = formData;

    if (!_id || !name) {
      alert('請輸入完整的資料');
      return;
    }

    const body = { id: _id, name }; // 構造請求的 body
    console.log('Request Body:', body);

    try {
      const response = await fetch(api.update, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const errorResult = await response.json();
        console.error('API 返回錯誤:', errorResult);
        alert(`修改失敗: ${errorResult.message || '未知錯誤'}`);
        return;
      }

      const result = await response.json();
      if (result.code === 200) {
        alert('修改成功');
        refreshStudents();
      } else {
        alert(`修改失敗: ${result.message || '伺服器回傳未知錯誤'}`);
      }
    } catch (error) {
      console.error('修改過程中發生錯誤:', error);
      alert('修改過程中發生錯誤，請稍後再試');
    }
  };

  const refreshStudents = () => {
    asyncGet(api.findAll).then((res: resp<Array<Student>>) => {
      if (res.code === 200) {
        setStudents(res.body);
        setFilteredStudents(res.body);
      }
    });
  };

  const searchByName = () => {
    const searchResult = students.filter((student) =>
      student.name.toLowerCase().includes(searchKeyword.toLowerCase())
    );
    setFilteredStudents(searchResult);
  };

  const filterByAbsences = () => {
    const absences = typeof absenceCount === 'number' ? absenceCount : parseInt(absenceCount, 10);
    if (isNaN(absences)) {
      alert('請輸入有效的數字');
      return;
    }
    const absentees = students.filter((student) => student.absences === absences);
    setFilteredStudents(absentees);
  };

  const calculateDepartmentCount = () => {
    const departmentCount = students.reduce((acc: any, student: Student) => {
      acc[student.department] = (acc[student.department] || 0) + 1;
      return acc;
    }, {});
    alert(
      Object.entries(departmentCount)
        .map(([department, count]) => `${department}: ${count} 人`)
        .join('\n')
    );
  };

  const studentList = filteredStudents.length
  ? filteredStudents.map((student: Student) => (
      <div className="student" key={student._id}>
        <p>ID: {student._id}</p> {/* 顯示 ID */}
        <p>帳號: {student.userName}</p>
        <p>座號: {student.sid}</p>
        <p>姓名: {student.name}</p>
        <p>院系: {student.department}</p>
        <p>年級: {student.grade}</p>
        <p>班級: {student.class}</p>
        <p>Email: {student.Email}</p>
        <p>缺席次數: {student.absences ? student.absences : 0}</p>
      </div>
    ))
  : '無相關資料';


  return (
    <>
      <div className="container">
        <div
          className="action-grid"
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            border: '2px solid #ccc',
            borderRadius: '12px',
            padding: '30px',
            marginBottom: '20px',
            width: '80%',
            maxWidth: '600px',
            backgroundColor: '#f9f9f9',
          }}
        >
          {currentTab === 'list' ? (
            <>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                <button onClick={() => setCurrentTab('add')} style={{ marginRight: '10px' }}>
                  新增資料
                </button>
                <button onClick={() => setCurrentTab('delete')} style={{ marginRight: '10px' }}>
                  刪除資料
                </button>
                <button onClick={() => setCurrentTab('update')} style={{ marginRight: '10px' }}>
                  修改資料
                </button>
              </div>
              <button onClick={calculateDepartmentCount} style={{ marginBottom: '10px' }}>
                各系人數
              </button>
              <div style={{ marginBottom: '10px' }}>
                <input
                  type="text"
                  placeholder="輸入缺席次數篩選"
                  value={absenceCount}
                  onChange={(e) => setAbsenceCount(e.target.value)}
                  style={{ marginRight: '5px' }}
                />
                <button onClick={filterByAbsences}>篩選</button>
              </div>
              <input
                type="text"
                placeholder="輸入姓名搜尋"
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
              />
              <button onClick={searchByName}>搜尋</button>
            </>
          ) : (
            <>
              <button onClick={() => setCurrentTab('list')} style={{ marginBottom: '20px' }}>
                返回主頁
              </button>
              {currentTab === 'add' && (
                <div>
                  <h2>新增資料</h2>
                  <input
                    type="text"
                    name="userName"
                    placeholder="帳號"
                    value={formData.userName || ''}
                    onChange={handleInputChange}
                  />

                  <input
                    type="text"
                    name="name"
                    placeholder="姓名"
                    value={formData.name || ''}
                    onChange={handleInputChange}
                  />
                  <input
                    type="text"
                    name="department"
                    placeholder="院系"
                    value={formData.department || ''}
                    onChange={handleInputChange}
                  />
                  <input
                    type="text"
                    name="grade"
                    placeholder="年級"
                    value={formData.grade || ''}
                    onChange={handleInputChange}
                  />
                  <input
                    type="text"
                    name="class"
                    placeholder="班級"
                    value={formData.class || ''}
                    onChange={handleInputChange}
                  />
                  <input
                    type="email"
                    name="Email"
                    placeholder="Email"
                    value={formData.Email || ''}
                    onChange={handleInputChange}
                  />
                  <button onClick={addStudent}>新增</button>
                </div>
              )}
              {currentTab === 'delete' && (
                <div>
                  <h2>刪除資料</h2>
                  <p>請輸入ID以刪除學生</p>
                  <input
                    type="text"
                    name="sid"
                    placeholder="ID"
                    value={formData.sid || ''}
                    onChange={handleInputChange}
                  />
                  <button onClick={deleteStudent}>刪除</button>
                </div>
              )}
              {currentTab === 'update' && (
                <div>
                  <h2>修改資料</h2>
                  <input
                    type="text"
                    name="_id"
                    placeholder="學生 ID"
                    value={formData._id || ''}
                    onChange={handleInputChange}
                  />
                  <input
                    type="text"
                    name="name"
                    placeholder="姓名"
                    value={formData.name || ''}
                    onChange={handleInputChange}
                  />
                  <button onClick={updateStudent}>修改</button>
                </div>
              )}
            </>
          )}
        </div>
        {currentTab === 'list' && studentList}
      </div>
    </>
  );
}

export default App;
