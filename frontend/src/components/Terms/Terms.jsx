import React from "react";
import './styles/Terms.css';

const Terms = () => {
  return (
    <div className="terms-container">
      <h1>利用規約</h1>

      <p>この利用規約（以下、「本規約」といいます。）は、「ダイエットメーカー」（以下、「本サービス」といいます。）の利用条件を定めるものです。本サービスを利用するすべてのユーザーに適用されます。</p>

      <h2>第1条（本規約への同意）</h2>
      <p>1. ユーザーは、本サービスを利用することによって、本規約に同意したものとみなされます。本規約に同意しない場合、本サービスを利用することはできません。</p>
      <p>2. 本規約は、予告なく変更される場合があります。本規約の変更後も本サービスを利用し続ける場合、変更後の規約に同意したものとみなされます。</p>

      <h2>第2条（利用登録）</h2>
      <p>1. 本サービスの利用を希望する方は、本規約に同意の上、当社が定める方法で利用登録を申請し、当社が承認することによって、利用登録が完了します。</p>
      <p>2. 当社は、以下のいずれかに該当すると判断した場合、利用登録を承認しないことがあります。</p>
      <ul>
        <li>虚偽の情報を提供した場合</li>
        <li>過去に本規約違反により利用停止措置を受けたことがある場合</li>
        <li>その他、当社が利用登録を適当でないと判断した場合</li>
      </ul>

      <h2>第3条（未成年者の利用）</h2>
      <p>1. ユーザーが未成年の場合、法定代理人（親権者など）の同意を得た上で、本サービスを利用するものとします。</p>
      <p>2. 法定代理人の同意を得ずに本サービスを利用した場合、成年に達した時点で未成年時の利用行為を追認したものとみなします。</p>

      <h2>第4条（アカウント情報の管理）</h2>
      <p>1. ユーザーは、自身の責任において、ログイン情報（メールアドレス・パスワード）を適切に管理するものとします。</p>
      <p>2. ユーザーは、ログイン情報を第三者に貸与・譲渡・共有することはできません。</p>
      <p>3. ユーザーの過失によりアカウントが不正利用された場合、当社は一切の責任を負いません。</p>

      <h2>第5条（本サービスの内容）</h2>
      <p>1. 本サービスは、ユーザーの体重・食事・運動履歴を記録し、適切なダイエットサポートを提供するアプリです。</p>
      <p>2. 本サービス内の情報（食事・運動プラン等）は、医学的・栄養学的アドバイスではなく、参考情報として提供されるものです。ユーザーは、自己の判断と責任において本サービスを利用するものとします。</p>
      <p>3. 当社は、本サービスの品質向上のため、通知なく本サービスの内容を変更することがあります。</p>

      <h2>第6条（禁止事項）</h2>
      <p>ユーザーは、本サービスを利用するにあたり、以下の行為をしてはなりません。</p>
      <ul>
        <li>虚偽の健康データ（体重、運動履歴等）を登録する行為</li>
        <li>医師の指示に反する形で本サービスを利用する行為</li>
        <li>他のユーザーの健康状態に関する誤解を招く情報を発信する行為</li>
        <li>過度なダイエットや健康被害を助長する内容を投稿する行為</li>
        <li>本サービスを不正に利用して金銭的利益を得る行為</li>
        <li>他のユーザーを誹謗中傷する行為</li>
        <li>反社会的勢力との関係がある、または関与する行為</li>
        <li>その他、当社が不適切と判断する行為</li>
      </ul>
      <p>当社は、上記に違反したユーザーに対し、利用制限やアカウント削除を含む措置を取ることができます。</p>

      <h2>第7条（ユーザーの投稿）</h2>
      <p>1. ユーザーは、自ら投稿した情報（食事・運動記録、コメント等）について、著作権を保持しますが、当社は本サービスの提供・改善のためにこれを利用することができます。</p>
      <p>2. ユーザーが投稿した内容が以下に該当すると判断した場合、当社は予告なく削除することができます。</p>
      <ul>
        <li>虚偽または誤解を招く情報</li>
        <li>他者のプライバシーや権利を侵害する内容</li>
        <li>不適切な表現（暴力的・わいせつな内容）</li>
        <li>その他、当社が不適切と判断する情報</li>
      </ul>

      <h2>第8条（利用料金）</h2>
      <p>1. 本サービスの基本機能は無料で利用できますが、一部の追加機能（プレミアムプラン等）は有料となる場合があります。<br />
      ※現在、有料機能はございません。</p>
      <p>2. 有料機能の利用料金、支払い方法については、本サービスのウェブサイトまたはアプリ内の案内に従います。</p>
      <p>3. ユーザーが利用料金の支払いを遅滞した場合、年14.6%の割合による遅延損害金が発生することがあります。</p>

      <h2>第9条（本サービスの提供停止）</h2>
      <p>当社は、以下のいずれかの理由により、本サービスの全部または一部の提供を停止することがあります。</p>
      <ul>
        <li>システムのメンテナンスを行う場合</li>
        <li>天災、通信障害等により本サービスの提供が困難な場合</li>
        <li>その他、当社が本サービスの提供が不適切と判断した場合</li>
      </ul>
      <p>当社は、これによって生じた損害について、一切の責任を負いません。</p>

      <h2>第10条（退会）</h2>
      <p>1. ユーザーは、当社の定める手続により、利用登録を抹消し、本サービスから退会することができます。</p>
      <p>2. 退会後、ユーザーの登録データは削除されますが、システムの都合上、一定期間バックアップデータとして保持されることがあります。</p>

      <h2>第11条（免責事項）</h2>
      <p>1. 当社は、本サービスの提供にあたり、健康効果やダイエット効果を保証するものではありません。</p>
      <p>2. ユーザーが本サービスを利用したことにより発生した健康被害や損害について、当社は一切の責任を負いません。</p>
      <p>3. ユーザー間のトラブルについて、当社は関与せず、一切の責任を負いません。</p>

      <h2>第12条（個人情報の取扱い）</h2>
      <p>本サービスの利用に関する個人情報の取扱いについては、当社のプライバシーポリシーに従います。</p>

      <h2>第13条（準拠法・裁判管轄）</h2>
      <p>1. 本規約の解釈には、日本法を準拠法とします。</p>
      <p>2. 本サービスに関する紛争が生じた場合、当社の本店所在地を管轄する裁判所を専属的合意管轄とします。</p>

      <p>2025年2月26日 制定</p>
    </div>
  );
};

export default Terms;