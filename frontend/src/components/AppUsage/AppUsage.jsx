import React, { useState } from 'react';
import { FaDumbbell, FaRegCalendarAlt, FaListUl, FaFireAlt } from 'react-icons/fa';
import { MdDirectionsWalk, MdShare, MdContentCopy, MdFavorite } from 'react-icons/md';
import { RiScales2Line, RiTwitterXFill } from 'react-icons/ri';
import { IoMdInformationCircleOutline } from 'react-icons/io';
import './styles/AppUsage.css';

const AppUsage = () => {
  const [activeFAQIndex, setActiveFAQIndex] = useState(null);
  const [activeStepIndex, setActiveStepIndex] = useState(null);

  const toggleFAQ = (index) => {
    setActiveFAQIndex(activeFAQIndex === index ? null : index);
  };
  
  const toggleStep = (index) => {
    setActiveStepIndex(activeStepIndex === index ? null : index);
  };

  // 主要機能
  const mainFeatures = [
    { 
      icon: <FaDumbbell />, 
      name: "トレーニング記録", 
      description: "日々のトレーニングメニューを簡単に記録できます。種目、セット数、回数、重量などを入力できます。" 
    },
    { 
      icon: <FaRegCalendarAlt />, 
      name: "目標設定", 
      description: "目標体重と達成予定日を設定し、進捗状況を視覚的に確認できます。" 
    },
    { 
      icon: <FaListUl />, 
      name: "トレーニング提案", 
      description: "あなたの目標や過去のトレーニング履歴に基づいて、最適なトレーニングメニューを提案します。" 
    },
    { 
      icon: <FaFireAlt />, 
      name: "基礎代謝計算", 
      description: "年齢、性別、身長、体重、活動量から基礎代謝を計算し、適切なカロリー摂取量を提案します。" 
    },
    { 
      icon: <RiScales2Line />, 
      name: "体重記録", 
      description: "日々の体重変化をグラフで視覚的に確認できます。体重の変動傾向を把握することができます。" 
    },
    { 
      icon: <MdDirectionsWalk />, 
      name: "カロリー記録", 
      description: "歩数と摂取カロリーを入力することで、1日のカロリー収支を記録し、ダイエット進捗を管理できます。" 
    },
    { 
      icon: <MdShare />, 
      name: "アプリ内シェア", 
      description: "トレーニング内容や成果をアプリ内でシェアして、他のユーザーとモチベーションを高め合えます。" 
    },
    { 
      icon: <RiTwitterXFill />, 
      name: "SNSシェア", 
      description: "アプリ内でシェアした内容をXにもシェアでき、より多くの人と成果や目標を共有できます。" 
    }
  ];

  // サブ機能
  const subFeatures = [
    { 
      icon: <MdContentCopy />, 
      name: "メニューコピー", 
      description: "他ユーザーがシェアしているトレーニングメニューを自分のスケジュールにコピーできます。" 
    },
    { 
      icon: <MdContentCopy />, 
      name: "自分のメニューコピー", 
      description: "過去に実施したトレーニングメニューを簡単に別の日にコピーして再利用できます。" 
    },
    { 
      icon: <FaFireAlt />, 
      name: "トレーニングの消費カロリー", 
      description: "トレーニングの種目や重量やレップ数などから消費カロリーを計算します。" 
    },
    { 
      icon: <MdFavorite />, 
      name: "いいね機能", 
      description: "他ユーザーの投稿に「いいね」をつけることができ、モチベーション向上に役立ちます。" 
    },
    { 
      icon: <MdFavorite />, 
      name: "いいね数確認", 
      description: "自分の投稿がもらった「いいね」の数を確認でき、トレーニングの成果を実感できます。" 
    }
  ];

  // 使用手順
  const usageSteps = [
    {
      title: "アプリをスマホのホーム画面に追加",
      description: "アプリをより便利に使用するために、スマホのホーム画面に追加しましょう。",
      url: "https://www.cmrc.co.jp/2013/11/2968.html"
    },
    {
      title: "アカウント作成",
      description: "アプリを初めて使用する際は、メールアドレスまたはGoogleアカウントでサインアップしてください。",
      url: "/login"
    },
    {
      title: "身体情報の入力",
      description: "基礎代謝やトレーニングの消費カロリーを計算するために性別、身長、体重、年齢などの基本情報が必要です。",
      url: "/body-info"
    },
    {
      title: "ダイエット心構え",
      description: "ダイエットに挫折しないための心構えやマインドセットについて確認します。",
      url: "/diet-mindset"
    },
    {
      title: "目標設定",
      description: "目標体重と目標達成日を設定して、ダイエットプランを立てましょう。",
      url: "/goal-setting"
    },
    {
      title: "トレーニングメニューの提案",
      description: "あなたの目標や身体情報に基づいた最適なトレーニングメニューを確認します。",
      url: "/training-menu"
    },
    {
      title: "体重を記録する（毎日）",
      description: "毎日同じ時間帯に体重を記録して、変化の推移を確認しましょう。",
      url: "/weight"
    },
    {
      title: "トレーニングを実施",
      description: "提案されたトレーニングメニューを実施し、結果を記録します。",
      url: "/"
    },
    {
      title: "カロリー関係の記録（毎日）",
      description: "摂取カロリーと消費カロリーを記録して、日々のカロリー収支を管理します。",
      url: "/calorie-info"
    },
    {
      title: "アプリ内で成果をシェア",
      description: "達成した目標やトレーニング結果をアプリ内のコミュニティでシェアします。",
      url: "/achievements"
    },
    {
      title: "Xで成果をシェア",
      description: "アプリ内でシェアした内容をXにもシェアして、より多くの人と共有しましょう。",
      url: "/posts"
    },
    {
      title: "いいねと交流",
      description: "他のユーザーの投稿にいいねをしたり、ハートをくれた人にハートを送り返したりして交流を深めましょう。",
      url: "/posts"
    }
  ];

  // よくある質問
  const faqs = [
    {
      question: "基礎代謝はどのように計算されていますか？",
      answer: "基礎代謝はミフリン・セントジオール方程式を使用して計算しています。\n\n【男性の場合】\nBMR = (10 × 体重kg) + (6.25 × 身長cm) - (5 × 年齢) + 5\n\n【女性の場合】\nBMR = (10 × 体重kg) + (6.25 × 身長cm) - (5 × 年齢) - 161\n\n■ 計算例\n30歳の男性、身長170cm、体重70kgの場合：\nBMR = (10 × 70) + (6.25 × 170) - (5 × 30) + 5\n    = 700 + 1062.5 - 150 + 5\n    = 1617.5 kcal/日\n\nこの基礎代謝量は、安静にしている状態で生命維持に必要なエネルギー量です。実際の1日の必要カロリーは、この値に活動レベルを掛けて算出します。"
    },
    {
      question: "「ユーザーデータの取得に失敗しました」と表示されます。どうすればいいですか？",
      answer: "このエラーは、ユーザー情報の取得に失敗した場合に表示されます。お手数ですが一度ログアウトをしてから、再度ログインしてみてください。"
    },
    {
      question: "随時追加",
      answer: "随時追加"
    }
  ];

  // ヒント
  const tips = [
    "毎日同じ時間に体重を測定すると、より正確な変化を追跡できます。",
    "はじめは無理なく継続できる少なめのトレーニング量で始めるのがオススメです。",
    "トレーニングメニューは事前に最低でも1週間分の計画しておくと、実行しやすくなります。",
    "週に1回は「チートデイ」を設けると、長期的なモチベーション維持に役立ちます。",
    "定期的に「ダイエット心構え」のページを読み返すことで、継続するためのマインドを定着させることができます。"
  ];

  return (
    <div className="app-usage-container">
      <header className="app-usage-header">
        <h1 className="app-usage-title">ダイエットメーカーの使い方</h1>
        <p className="app-usage-subtitle">アプリの使い方や機能についての説明</p>

        {/* 動画 */}
        <div className="video-section">
          <video
            className="usage-video"
            controls
            preload="metadata"
          >
            <source src="/videos/diet-maker-usage.mp4" type="video/mp4" />
            お使いのブラウザは動画の再生に対応していません。
          </video>
        </div>

        <p className="app-usage-subtitle-recommendation">アプリへのアクセスを良くするために、スマホのホーム画面に追加することを強くお勧めします！</p>
      </header>

      {/* 使用手順 */}
      <section className="feature-section">
        <h2 className="section-title">アプリの使い方（クリックで詳細表示）</h2>
        <div className="usage-steps">
          {usageSteps.map((step, index) => (
            <div className="step-item" key={index} onClick={() => toggleStep(index)}>
              <div className="step-number"></div>
              <div className="step-content">
                <h3 className="step-title">{step.title} <span>{activeStepIndex === index ? '▲' : '▼'}</span></h3>
                <p className="step-description">{step.description}</p>
                {activeStepIndex === index && (
                  <div className="step-details">
                    <h4>詳細な使い方</h4>
                    {index === 0 && (
                      <p>スマホで便利にアプリを使うために、ホーム画面に追加しましょう。iPhoneの場合はSafariで、Androidの場合はChromeでアプリのWebサイトを開き、共有メニューから「ホーム画面に追加」を選択します。これにより、アプリのアイコンがホーム画面に表示され、ワンタップでアクセスできるようになります。詳しい手順はリンク先のページで確認できます。</p>
                    )}
                    {index === 1 && (
                      <p>「新規登録」ボタンをクリックしし、メールアドレスとパスワードを入力するか、Googleアカウントでサインアップします。</p>
                    )}
                    {index === 2 && (
                      <p>アカウント作成後、必要な身体情報を入力します。性別、身長、体重、年齢を正確に入力することで、基礎代謝やトレーニングメニュのー消費カロリー計算が行われます。</p>
                    )}
                    {index === 3 && (
                      <p>「ダイエット心構え」のページでは、ダイエットを成功させるためのマインドセットについて説明しています。ダイエットは短期戦ではないので、継続する意識を持ちましょう。</p>
                    )}
                    {index === 4 && (
                      <p>「目標設定」ページから、達成したい目標体重と目標達成日を設定します。月に体重の5%程度の減量が健康的な範囲とされています。</p>
                    )}
                    {index === 5 && (
                      <p>入力した性別、ジムタイプ、トレーニング頻度、トレーニングボリュームに基づいて、あなたの目標達成に最適な1週間分のトレーニングメニューが提案されます。</p>
                    )}
                    {index === 6 && (
                      <p>「体重記録」ページで日付と体重を入力して記録できます。朝一に記録するなど、毎日同じ時間帯に体重を記録するのがおすすめです。</p>
                    )}
                    {index === 7 && (
                      <p>トレーニングの種目を選択して、重量とレップ数を入力することで、消費カロリーとトレーニングの記録をすることができます。</p>
                    )}
                    {index === 8 && (
                      <p>「カロリー関係」のページでは、歩数とトレーニングの消費カロリーと基礎代謝と摂取カロリーを記録します。それによりカロリーの差分などを表示させることができます。※摂取カロリーについては「あすけんダイエット」など、他のアプリを使って算出してください。</p>
                    )}
                    {index === 9 && (
                      <p>「成果」ページから「アプリ内で成果をシェア」ボタンをクリックし、トレーニング内容やカロリー関係の記録をダイエットメーカー内でシェアします。</p>
                    )}
                    {index === 10 && (
                      <p>アプリ内の投稿詳細ページで「Xでシェア」ボタンをクリックすると、Xアプリが起動します。投稿内容はコメントと投稿されたページのURLが自動的に入力されるので、必要に応じて編集し、Xにシェアしましょう。</p>
                    )}
                    {index === 11 && (
                      <p>「みんなの投稿一覧」ページで他のユーザーの投稿を閲覧し、参考になったり励みになる投稿には「いいね」をしましょう。また、あなたの投稿にハートをくれたユーザーを検索して、その方の投稿にもハートを送り返すことで、お互いにモチベーションを高め合うことができます。</p>
                    )}
                    <a href={step.url} className="step-url" target="_blank" rel="noopener noreferrer">このページへ移動する →</a>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ヒント */}
      <section className="tips-section">
        <h2 className="tips-title">効果的な活用のヒント</h2>
        <ul className="tips-list">
          {tips.map((tip, index) => (
            <li className="tips-item" key={index}>
              <div className="tip-icon"><IoMdInformationCircleOutline /></div>
              <p className="tip-text">{tip}</p>
            </li>
          ))}
        </ul>
      </section>

      {/* 主要機能 */}
      <section className="feature-section">
        <h2 className="section-title">主要機能</h2>
        <div className="features-grid">
          {mainFeatures.map((feature, index) => (
            <div className="feature-card" key={index}>
              <div className="feature-icon">{feature.icon}</div>
              <h3 className="feature-name">{feature.name}</h3>
              <p className="feature-description">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* サブ機能 */}
      <section className="feature-section">
        <h2 className="section-title">サブ機能</h2>
        <div className="features-grid">
          {subFeatures.map((feature, index) => (
            <div className="feature-card" key={index}>
              <div className="feature-icon">{feature.icon}</div>
              <h3 className="feature-name">{feature.name}</h3>
              <p className="feature-description">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="faq-section">
        <h2 className="section-title">よくある質問</h2>
        {faqs.map((faq, index) => (
          <div className="faq-item" key={index}>
            <div className="faq-question" onClick={() => toggleFAQ(index)}>
              {faq.question}
              <span>{activeFAQIndex === index ? '▲' : '▼'}</span>
            </div>
            {activeFAQIndex === index && (
              <div className="faq-answer">{faq.answer}</div>
            )}
          </div>
        ))}
      </section>

      {/* お問い合わせ */}
      <section className="contact-section">
        <h2 className="contact-title">お困りですか？</h2>
        <p className="contact-description">
          使い方についてさらに質問がある場合や、機能の提案、バグの報告などがありましたら、
          お気軽にお問い合わせください。
        </p>
        <a href="/contact" className="contact-button">お問い合わせ</a>
      </section>
    </div>
  );
};

export default AppUsage;