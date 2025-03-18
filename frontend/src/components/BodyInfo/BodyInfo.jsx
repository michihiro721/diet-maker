import React, { useState, useEffect } from "react";
import axios from "axios";
import "./styles/BodyInfo.css";
import CalculatorModal from "./CalculatorModal";

const BodyInfo = () => {
  const [gender, setGender] = useState("");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [age, setAge] = useState("");
  const [bmr, setBmr] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentField, setCurrentField] = useState("");
  const [error, setError] = useState("");
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);

  // ユーザーIDを取得し、既存のデータがあれば読み込む
  useEffect(() => {
    const storedUserId = localStorage.getItem('userId');
    if (storedUserId) {
      setUserId(parseInt(storedUserId, 10));
      fetchUserData(storedUserId);
    } else {
      setError("ユーザーIDが見つかりません。ログインしてください。");
      setLoading(false);
    }
  }, []);

  // ユーザーデータを取得する関数
  const fetchUserData = async (userId) => {
    try {
      const apiUrl = process.env.REACT_APP_API_BASE_URL || 'https://diet-maker-d07eb3099e56.herokuapp.com';
      const token = localStorage.getItem('jwt');
      
      if (!token) {
        setError("認証情報が見つかりません。再度ログインしてください。");
        setLoading(false);
        return;
      }

      const response = await axios.get(`${apiUrl}/users/show`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('取得したユーザーデータ:', response.data);
      const userData = response.data;
      
      // 取得したデータをセット (データが存在する場合のみ)
      if (userData.gender) setGender(userData.gender);
      if (userData.height) setHeight(`${userData.height} cm`);
      if (userData.weight) setWeight(`${userData.weight} kg`);
      if (userData.age) setAge(`${userData.age} 歳`);
      
      // 計算
      if (userData.gender && userData.height && userData.weight && userData.age) {
        const heightValue = parseFloat(userData.height);
        const weightValue = parseFloat(userData.weight);
        const ageValue = parseFloat(userData.age);
        
        let bmrValue;
        if (userData.gender === "男性") {
          bmrValue = (10 * weightValue) + (6.25 * heightValue) - (5 * ageValue) + 5;
        } else if (userData.gender === "女性") {
          bmrValue = (10 * weightValue) + (6.25 * heightValue) - (5 * ageValue) - 161;
        }
        if (bmrValue) {
          setBmr(bmrValue);
        }
      }
      
      setLoading(false);
    } catch (error) {
      console.error("ユーザーデータの取得に失敗しました:", error);
      console.error("エラーの詳細:", error.response?.data);
      setError("ユーザーデータの取得に失敗しました。");
      setLoading(false);
    }
  };

  const calculateBMR = () => {
    const heightValue = parseFloat(height.replace(" cm", ""));
    const weightValue = parseFloat(weight.replace(" kg", ""));
    const ageValue = parseFloat(age.replace(" 歳", ""));

    let bmrValue;
    if (gender === "男性") {
      bmrValue = (10 * weightValue) + (6.25 * heightValue) - (5 * ageValue) + 5;
    } else if (gender === "女性") {
      bmrValue = (10 * weightValue) + (6.25 * heightValue) - (5 * ageValue) - 161;
    }
    setBmr(bmrValue);
    return bmrValue;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!userId) {
      setError("ユーザーIDが見つかりません。ログインしてください。");
      return;
    }
    
    if (!gender || !height || !weight || !age) {
      setError("全ての項目を入力してください");
      return;
    }
    
    setError("");
    const bmrValue = calculateBMR();
    
    // データをサーバーに保存
    try {
      const apiUrl = process.env.REACT_APP_API_BASE_URL || 'https://diet-maker-d07eb3099e56.herokuapp.com';
      const token = localStorage.getItem('jwt');
      
      if (!token) {
        setError("認証情報が見つかりません。再度ログインしてください。");
        return;
      }
      
      const heightValue = parseFloat(height.replace(" cm", ""));
      const weightValue = parseFloat(weight.replace(" kg", ""));
      const ageValue = parseFloat(age.replace(" 歳", ""));
      
      const response = await axios.put(`${apiUrl}/users/${userId}`, {
        user: {
          height: heightValue,
          weight: weightValue,
          age: ageValue,
          gender: gender
        }
      }, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.status === 200) {
        setBmr(bmrValue);
        alert("身体情報が正常に保存されました。");
      }
    } catch (error) {
      console.error("データの保存に失敗しました:", error);
      setError("データの保存に失敗しました: " + (error.response?.data?.errors?.join(", ") || error.message));
    }
  };

  const handleInputClick = (field) => {
    setCurrentField(field);
    setModalOpen(true);
  };

  const handleSave = (value) => {
    if (currentField === "height") {
      setHeight(value + " cm");
    } else if (currentField === "weight") {
      setWeight(value + " kg");
    } else if (currentField === "age") {
      setAge(value + " 歳");
    }
    setModalOpen(false);
  };

  if (loading) {
    return <div className="body-info-loading">データを読み込み中...</div>;
  }

  return (
    <div className="body-info-wrapper">
      <div className="body-info-container">
        <form onSubmit={handleSubmit} className="body-info-form">
          {error && <p className="body-info-error-message">{error}</p>}
          <div className="body-info-form-group">
            <label>性別</label>
            <select value={gender} onChange={(e) => setGender(e.target.value)} className="body-info-select">
              <option value="">選択してください</option>
              <option value="男性">男性</option>
              <option value="女性">女性</option>
            </select>
          </div>
          <div className="body-info-form-group">
            <label>身長</label>
            <input
              type="text"
              value={height}
              onClick={() => handleInputClick("height")}
              readOnly
              className="body-info-input"
              placeholder="クリックして入力"
            />
          </div>
          <div className="body-info-form-group">
            <label>体重</label>
            <input
              type="text"
              value={weight}
              onClick={() => handleInputClick("weight")}
              readOnly
              className="body-info-input"
              placeholder="クリックして入力"
            />
          </div>
          <div className="body-info-form-group">
            <label>年齢</label>
            <input
              type="text"
              value={age}
              onClick={() => handleInputClick("age")}
              readOnly
              className="body-info-input"
              placeholder="クリックして入力"
            />
          </div>
          <button type="submit" className="body-info-button">設定</button>
        </form>
        {bmr && (
          <div className="body-info-bmr-result">
            <h2>基礎代謝</h2>
            <p>{bmr.toFixed(2)} kcal/day</p>
          </div>
        )}
      </div>
      <CalculatorModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
      />
    </div>
  );
};

export default BodyInfo;