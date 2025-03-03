import React from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './styles/Login.css';

const API_BASE_URL = 'https://diet-maker-d07eb3099e56.herokuapp.com';

const Login = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const navigate = useNavigate();

    const onSubmit = async (data) => {
        try {
            const res = await axios.post(`${API_BASE_URL}/auth/sign_in`, {
                email: data.email,
                password: data.password,
            }, {
                headers: { "Content-Type": "application/json" }
            });

            console.log("レスポンスヘッダー:", res.headers);

            // すべてのレスポンスヘッダーを表示
            Object.keys(res.headers).forEach(key => console.log(`${key}: ${res.headers[key]}`));

            // `Authorization` ヘッダーの取得を試みる
            const token = res.headers['authorization'] || res.headers['Authorization'];
            console.log("取得したトークン:", token);

            if (token) {
                localStorage.setItem('jwt', token);
                alert('ログインに成功しました');
                navigate('/');
            } else {
                alert('ログインに失敗しました: JWTトークンが見つかりません');
            }

        } catch (error) {
            console.error('ログインエラー:', error);
            
            if (error.response) {
                const { status, data } = error.response;
                if (status === 401) {
                    alert('認証に失敗しました。メールアドレスまたはパスワードが正しくありません。');
                } else if (status === 500) {
                    alert('サーバーエラーが発生しました。しばらくしてから再試行してください。');
                } else {
                    alert(`エラーが発生しました: ${data.message || '不明なエラー'}`);
                }
            } else {
                alert('ネットワークエラーが発生しました。インターネット接続を確認してください。');
            }
        }
    };

    const goToSignUp = () => {
        navigate('/signup');
    };

    return (
        <div className="custom-login-container">
            <h2>ログイン</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="custom-login-form">
                <div>
                    <label>メールアドレス</label>
                    <input
                        type="email"
                        {...register('email', { required: 'メールアドレスを入力してください' })}
                    />
                    {errors.email && <p>{errors.email.message}</p>}
                </div>
                <div>
                    <label>パスワード</label>
                    <input
                        type="password"
                        {...register('password', { required: 'パスワードを入力してください' })}
                    />
                    {errors.password && <p>{errors.password.message}</p>}
                </div>
                <button type="submit">ログイン</button>
            </form>
            <button onClick={goToSignUp} className="signup-button">新規登録</button>
        </div>
    );
};

export default Login;