import React from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './styles/SignUp.css';

const API_BASE_URL = 'https://diet-maker-d07eb3099e56.herokuapp.com/';

const SignUp = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const navigate = useNavigate();

    const onSubmit = async (data) => {
        console.log('Form data:', data);
        try {
            const res = await axios.post(`${API_BASE_URL}/users`, {
                user: {
                    name: data.name,
                    email: data.email,
                    password: data.password,
                    password_confirmation: data.passwordConfirmation,
                },
            }, {
                headers: { "Content-Type": "application/json" },
                withCredentials: true
            });

            localStorage.setItem("access-token", res.headers["access-token"]);
            localStorage.setItem("client", res.headers["client"]);
            localStorage.setItem("uid", res.headers["uid"]);
            console.log('Response:', res);
            if (res.status === 201) {
                alert('新規登録に成功しました');
                navigate('/login');
            } else {
                alert('新規登録に失敗しました');
            }
        } catch (error) {
            console.error('新規登録エラー:', error);
            alert(`新規登録中にエラーが発生しました');
        }
    };

    return (
        <div className="custom-signup-container">
            <h2>新規登録</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="custom-signup-form">
                <div>
                    <label>名前</label>
                    <input
                        type="text"
                        {...register('name', { required: '名前を入力してください' })}
                    />
                    {errors.name && <p>{errors.name.message}</p>}
                </div>
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
                <div>
                    <label>パスワード確認</label>
                    <input
                        type="password"
                        {...register('passwordConfirmation', { required: 'パスワードを入力してください' })}
                    />
                    {errors.passwordConfirmation && <p>{errors.passwordConfirmation.message}</p>}
                </div>
                <button type="submit">新規登録</button>
            </form>
        </div>
    );
};

export default SignUp;
