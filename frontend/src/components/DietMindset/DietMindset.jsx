import React from "react";
import "./styles/DietMindset.css";

const DietMindset = () => {
  const mindsetItems = [
    {
      title: "結果を焦らない",
      description: "健康的なダイエットは1ヶ月あたり2kg〜3kgの減量が理想的です。急激な変化を期待せず、継続することが大切です。"
    },
    {
      title: "小さな成功を祝う",
      description: "大きな目標だけでなく、日々の小さな成功（運動を続けた、食事を記録したなど）にも目を向けましょう。"
    },
    {
      title: "完璧を求めない",
      description: "時には計画通りにいかないこともあります。挫折してもまた始めればいいのです。完璧より継続を重視しましょう。"
    },
    {
      title: "自分を責めない",
      description: "失敗は学びの機会です。食べ過ぎたり、トレーニングをサボってしまっても、自分を責めるのではなく、次に活かすことを考えましょう。"
    },
    {
      title: "食事を楽しむ",
      description: "制限ばかりでは長続きしません。継続できる範囲で食事を制限しつつ、時には好きなものを楽しむことも大切です。"
    },
    {
      title: "継続を意識",
      description: "体重の記録だけでもいいので、毎日継続することを意識しましょう。習慣化することが成功への近道です。"
    }
  ];

  const motivationTips = [
    {
      title: "アプリで記録を続ける",
      description: "体重、カロリー摂取量、消費カロリー、歩数、トレーニング内容を毎日記録しましょう。データが可視化されることでモチベーションが維持できます。"
    },
    {
      title: "成果をシェアする",
      description: "アプリの「成果をシェア」機能を使って、達成した記録をSNSで共有しましょう。周囲からの応援が励みになります。"
    },
    {
      title: "具体的な目標を設定する",
      description: "「目標設定」機能で達成したい体重と期限を明確にしましょう。具体的な数値があると達成に向けた意識が高まります。"
    },
    {
      title: "基礎代謝を理解する",
      description: "自分の基礎代謝を知ることで、必要な摂取カロリーと消費カロリーのバランスが分かりやすくなり、食べ過ぎをコントロールしやすくなります。"
    },
    {
      title: "トレーニング記録を活用する",
      description: "提案されたトレーニングを実践し、記録することで継続的な運動習慣を身につけることができます。"
    }
  ];

  return (
    <div className="diet-mindset-container">
      <header className="diet-mindset-header">
        <h1>ダイエット成功のための心構え</h1>
        <div className="diet-mindset-intro">
          <p>
            ダイエットの継続は意外と難しいです。なのでダイエットを成功させるためには、適切なマインドセットを持つことが重要です。
            このページでは、ダイエット継続の難しさと、成功させるためのマインドセットについて説明しています。
          </p>
        </div>
      </header>

      <section className="stats-section">
        <h2>ダイエットを継続することの難しさ</h2>
        <div className="stats-container">
          <div className="stat-item">
            <p className="stat-label">ダイエットを始める人</p>
            <p className="stat-value">約50〜60%</p>
          </div>
          <div className="stat-item">
            <p className="stat-label">ダイエット1〜2ヶ月以内の挫折率</p>
            <p className="stat-value">約50%</p>
          </div>
          <div className="stat-item">
            <p className="stat-label">ダイエット3ヶ月以上の継続率</p>
            <p className="stat-value highlight">約30%</p>
          </div>
          <div className="stat-item">
            <p className="stat-label">ダイエット成功率</p>
            <p className="stat-value">約20〜30%</p>
          </div>
          <div className="stat-item">
            <p className="stat-label">2〜5年以内のリバウンド率</p>
            <p className="stat-value">約80%</p>
          </div>
        </div>
        <div className="stats-conclusion">
          <p>
            ダイエットを成功させることは難しく、成功させても維持できる人も少ないのが現実です。
            しかし、<strong>3ヶ月継続できた人の成功率は格段に高く</strong>なります。
            まずは3ヶ月の継続を目指しましょう！
          </p>
        </div>
      </section>

      <section className="mindset-section">
        <h2>基本となるマインドセット</h2>
        <div className="mindset-items">
          {mindsetItems.map((item, index) => (
            <div key={index} className="mindset-item">
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="motivation-section">
        <h2>アプリを活用したモチベーション維持</h2>
        <div className="motivation-tips-container">
          {motivationTips.map((tip, index) => (
            <div key={index} className="motivation-tip-card">
              <h3>{tip.title}</h3>
              <p>{tip.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="three-month-section">
        <h2>3ヶ月継続のチカラ</h2>
        <div className="three-month-content">
          <div className="three-month-image">
            <div className="milestone">
              <div className="milestone-marker">START</div>
              <div className="milestone-line"></div>
              <div className="milestone-marker highlight">3ヶ月</div>
              <div className="milestone-line"></div>
              <div className="milestone-marker">GOAL</div>
            </div>
          </div>
          <div className="three-month-text">
            <p>ダイエットを<strong>3ヶ月以上継続できた人は成功率が大幅に上昇</strong>します。</p>
            <p>この3ヶ月間が最も重要な「習慣形成期間」となります。</p>

            <h3>あなたの3ヶ月計画を立てよう</h3>
            <ul className="three-month-tips">
              <li>最初の1ヶ月：小さな目標から始め、毎日の記録習慣をつける</li>
              <li>2ヶ月目：日常生活に「運動」と「食事管理」を組み込む</li>
              <li>3ヶ月目：無理なく継続できるペースを見つける</li>
            </ul>
            <p className="highlight-message">まずは3ヶ月を目標に。この期間を乗り越えれば、ダイエット成功への道は大きく開けます！</p>
          </div>
        </div>
      </section>

      <footer className="diet-mindset-footer">
        <p>自分のペースで進み、自分の体と心に耳を傾けることも忘れないでください。</p>
        <p>体調不良や体に痛みがある場合には、休む勇気も大切です。</p>
        <div className="footer-highlight">
          <p><strong>まずは3ヶ月続けることを目標にしましょう!</strong></p>
          <p><strong>「継続は力なり」</strong></p>
          <p><strong>あなたのダイエット成功を応援しています！</strong></p>
        </div>
      </footer>
    </div>
  );
};

export default DietMindset;