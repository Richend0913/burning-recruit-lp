/**
 * お問い合わせフォーム送信。
 * 主経路: mimoria-forms Worker（KV保存）へ {lp, fields} を POST。
 * 副経路: 主経路が失敗（通信エラー / 非2xx）した場合のみ formsubmit.co 経由で info@mimoria.jp へ。
 * 副経路の formsubmit は、初回送信時に有効化（activation）メールがその受信箱に届くので、
 * 運営側で一度だけリンクをクリックして有効化すること。
 * 送信者への自動返信（_autoresponse）も、この一度きりの有効化が完了してから機能する。
 */

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

const form = document.getElementById('inquiry-form') as HTMLFormElement | null;

if (form) {
  const msg = document.getElementById('f-msg') as HTMLParagraphElement;
  const btn = document.getElementById('f-submit') as HTMLButtonElement;
  const val = (id: string) =>
    (document.getElementById(id) as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement)
      .value;

  const show = (text: string, ok: boolean) => {
    msg.textContent = text;
    msg.className = 'msg ' + (ok ? 'ok' : 'err');
  };

  form.addEventListener('submit', (ev) => {
    ev.preventDefault();
    // honeypot: bot が入力していたら送信せず成功表示だけ返す
    if (val('f-honey')) {
      show('送信しました。内容を確認のうえ、担当よりご連絡します。', true);
      form.reset();
      return;
    }
    if (!form.checkValidity()) {
      show(
        '必須項目（会社名・担当者名・メールアドレス）とプライバシーポリシーへの同意をご確認ください。',
        false,
      );
      form.reportValidity();
      return;
    }
    const data = {
      _subject: 'MIMORIA RECRUIT 相談（LPフォーム）',
      _template: 'table',
      _replyto: val('f-email').trim(),
      _autoresponse:
        'MIMORIA RECRUIT へのご相談ありがとうございます。株式会社MIMORIA です。\n\nご相談フォームの送信を受け付けました。\n内容を確認のうえ、1営業日以内に担当よりご連絡いたします。\n次回のご連絡では、ヒアリング（60分程度）の日程候補をお伺いします。\n\nなお、MIMORIA RECRUIT は3ヶ月のお試し期間（月額無料、初期費用はお試し後に継続される場合のみ）をご用意しています。詳しくはヒアリング時にご案内します。\n\nお急ぎの場合は info@mimoria.jp へ直接ご連絡ください。\n※このメールは自動送信です。',
      会社名: val('f-company').trim(),
      担当者名: val('f-name').trim(),
      メールアドレス: val('f-email').trim(),
      電話番号: val('f-tel').trim(),
      従業員規模: val('f-size'),
      相談内容: val('f-message').trim(),
    };
    btn.disabled = true;
    btn.textContent = '送信中…';
    fetch('https://mimoria-forms.burningbros.workers.dev/v1/form', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ lp: 'recruit', fields: data }),
    })
      .then((res) => {
        if (!res.ok) throw new Error('HTTP ' + res.status);
      })
      .catch(() =>
        fetch('https://formsubmit.co/ajax/info@mimoria.jp', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify(data),
        }).then((res) => {
          if (!res.ok) throw new Error('HTTP ' + res.status);
          return res.json();
        }),
      )
      .then(() => {
        if (window.gtag) window.gtag('event', 'inquiry_submit', { page_area: 'burning-recruit' });
        show(
          '送信しました。内容を確認のうえ、担当よりご連絡します。しつこい営業はしませんのでご安心ください。',
          true,
        );
        form.reset();
      })
      .catch(() => {
        show(
          '送信に失敗しました。お手数ですが、メール info@mimoria.jp へ直接ご連絡ください。',
          false,
        );
      })
      .finally(() => {
        btn.disabled = false;
        btn.textContent = 'この内容で相談する';
      });
  });
}
