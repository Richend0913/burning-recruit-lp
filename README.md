# burning-recruit-lp（MIMORIA RECRUIT LP）

株式会社MIMORIA の採用支援サービス **MIMORIA RECRUIT** の営業LP。

- 公開URL: https://richend0913.github.io/burning-recruit-lp/
- ページ: トップ（index）/ 導入事例（case.html）/ プライバシーポリシー（privacy.html）
- 旧URL（case.html / privacy.html）はそのまま維持している。

## 技術構成

- **Astro 5 + TypeScript**（静的出力）。ソースは `src/`（layouts / components / data / scripts / styles）に分割。デザインはデザインカンプ2（日本の優良B2B系：白基調＋淡いブルーグレーのバンド＋グリーンのアクセント）に準拠。
- 掲載内容（価格・お試し条件・FAQ など）は `src/data/content.ts` を正とする。
- 日本語の改行制御: BudouX（`budoux`）で見出し・リード・本文を文節分割し、文節の途中では折り返さない。
- お問い合わせフォームは formsubmit.co 経由で info@mimoria.jp へ送信（`src/scripts/inquiry.ts`）。
- og.png / og-template.html は従来のものを維持。

## ビルドと公開

```bash
npm install
npm run build   # docs/ に出力
```

GitHub Pages の公開元は `master` ブランチの `/docs`。`docs/` へのビルド成果物をコミットすると公開に反映される。
