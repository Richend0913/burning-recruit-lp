/**
 * お問い合わせフォーム送信（formsubmit.co 経由で info@mimoria.jp へ）。
 * 初回送信時に formsubmit から有効化（activation）メールがその受信箱に届くので、
 * 運営側で一度だけリンクをクリックして有効化すること。
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
      会社名: val('f-company').trim(),
      担当者名: val('f-name').trim(),
      メールアドレス: val('f-email').trim(),
      電話番号: val('f-tel').trim(),
      従業員規模: val('f-size'),
      相談内容: val('f-message').trim(),
    };
    btn.disabled = true;
    btn.textContent = '送信中…';
    fetch('https://formsubmit.co/ajax/info@mimoria.jp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(data),
    })
      .then((res) => {
        if (!res.ok) throw new Error('HTTP ' + res.status);
        return res.json();
      })
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
