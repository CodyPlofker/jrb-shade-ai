# JRB Shade AI — Handover Document

## Project Overview
- AI-powered shade matching tool for Jones Road Beauty. Users take a selfie, Claude Vision analyzes skin tone/undertone, and recommends Miracle Balm tints + complexion products with specific shade names.
- Three versions: **V1** (production, customer-facing), **V2** (CAB testing with feedback form), **V3** (latest — inline feedback, Foundation Stick)
- **Project root**: `/Users/codyplofker/Desktop/01-Projects/jrb-shade-ai/`

## Tech Stack
| Layer | Tech |
|-------|------|
| Framework | Next.js 16.2.1 + TypeScript |
| Styling | Tailwind CSS 4 |
| AI | Anthropic Claude Sonnet 4 Vision API (`@anthropic-ai/sdk`) |
| Storage | Upstash Redis (`@upstash/redis`) — feedback persistence |
| Hosting | Vercel (three separate projects) |
| Dev server | `npm run dev` → port **3000** |

## Architecture

### Key Files
```
src/
├── app/
│   ├── page.tsx              # V3: Main page — camera → results → inline feedback form
│   ├── layout.tsx            # Root layout
│   ├── globals.css           # Tailwind + global styles
│   ├── feedback/
│   │   └── page.tsx          # V3: Redirects to / (was V2 main page)
│   └── api/
│       ├── match/route.ts    # POST: sends selfie to Claude Vision, returns shade recs
│       └── feedback/route.ts # POST/GET: save/retrieve feedback entries from Redis
├── components/
│   ├── CameraCapture.tsx     # Camera component with selfie capture
│   ├── AnalyzingState.tsx    # Loading state during AI analysis
│   └── Results.tsx           # V3: Shade results with 3-tier Step 1 (JETM/WTF/FS)
└── lib/
    ├── shade-data.ts         # V3 shade engine — FS shades, getComplexionShades(), MB recs
    └── types.ts              # ShadeResult interface (includes foundationStickShade)
```

### Data Flow (V3)
1. User opens `/` → takes selfie
2. Image sent to `/api/match` → Claude Vision API (V3 system prompt)
3. `getComplexionShades(skinTone, undertone)` returns undertone-aware shades including Foundation Stick
4. Results displayed: MB section + 3-tier complexion routine (JETM / WTF / Foundation Stick)
5. Inline feedback form appears below results — user submits → saved to Redis with `version: "v3"`

## Three Vercel Projects

| | V1 | V2 | V3 |
|---|---|---|---|
| **Project name** | `jrb-shade-ai` | `jrb-shade-ai-v2` | `jrb-shade-ai-v3` |
| **Project ID** | `prj_1L6LhVDHTP7hJkCRQjxDi55MxHHm` | `prj_atq7j5fdJmKlwCWwIwJWjdUnT9yS` | `prj_x9EvRCnI1hd5pHyYcnfpaYXK8VHd` |
| **URL** | https://jrb-shade-ai.vercel.app | https://jrb-shade-ai-v2.vercel.app | https://jrb-shade-ai-v3.vercel.app |
| **Branch** | `main` | `overnight/shade-ai-v2` | `overnight/shade-ai-v3` |
| **Purpose** | Production (customer-facing) | CAB testing (V2 feedback form) | Latest — inline feedback + FS |

**IMPORTANT**: `.vercel/project.json` is currently pointed at **V1** (`prj_1L6LhVDHTP7hJkCRQjxDi55MxHHm`).

### Deploying to V2
```bash
echo '{"projectId":"prj_atq7j5fdJmKlwCWwIwJWjdUnT9yS","orgId":"team_woE2wFm5eNRyL1G4ybV9Nsij","projectName":"jrb-shade-ai-v2"}' > .vercel/project.json
echo '{"framework": "nextjs"}' > vercel.json
vercel deploy --prod
rm vercel.json
echo '{"projectId":"prj_1L6LhVDHTP7hJkCRQjxDi55MxHHm","orgId":"team_woE2wFm5eNRyL1G4ybV9Nsij","projectName":"jrb-shade-ai"}' > .vercel/project.json
```

### Deploying to V3
```bash
echo '{"projectId":"prj_x9EvRCnI1hd5pHyYcnfpaYXK8VHd","orgId":"team_woE2wFm5eNRyL1G4ybV9Nsij","projectName":"jrb-shade-ai-v3"}' > .vercel/project.json
echo '{"framework": "nextjs"}' > vercel.json
vercel deploy --prod
rm vercel.json
echo '{"projectId":"prj_1L6LhVDHTP7hJkCRQjxDi55MxHHm","orgId":"team_woE2wFm5eNRyL1G4ybV9Nsij","projectName":"jrb-shade-ai"}' > .vercel/project.json
```

## V3 Changes (overnight/shade-ai-v3 — April 11, 2026)

### System Prompt Calibration (from 89 CAB submissions)
1. **Lean darker** — model historically skewed 1 shade too light. Now defaults to darker when between two tones.
2. **Expand neutral bucket** — "Neutral" no longer requires obvious cast. Default to Neutral when ambiguous; only assign Cool/Warm when clearly evidenced.
3. **Darker skin tone guidance** — explicit FP range reminders for Med-Dark/Dark; WTF Almond for Dark, Cinnamon for Deep.

### Foundation Stick Integration (new product)
- `foundationStickByTone` lookup table in `shade-data.ts` — 8 skin tones × 3 undertones with confirmed shade names
- `getComplexionShades()` now returns `foundationStickShade` (undertone-aware)
- Step 1 in results shows 3-tier coverage selector: Sheer (JETM) / Light-Medium (WTF) / Full (Foundation Stick)

Foundation Stick shade mapping:
| Skin Tone | Cool | Warm | Neutral |
|-----------|------|------|---------|
| Pale | Pale Alabaster | Bisque | Alabaster |
| Fair | Porcelain | Warm Linen | Neutral Fair |
| Light | Fair | Sand | Ivory |
| Light-Medium | Beige | Warm Beige | Neutral Beige |
| Medium | Medium | Warm Medium | Neutral Medium |
| Medium-Dark | Medium Honey | Warm Honey | Neutral Honey |
| Dark | Pecan | Golden | Hazelnut |
| Deep | Almond | Almond | Almond |

### App Restructure
- `/` is now the full tool: camera → results → inline feedback form
- `/feedback` redirects to `/` (V3 no longer uses a separate feedback page)
- Feedback tagged with `version: "v3"` in Redis

## V2 Changes (for reference — overnight/shade-ai-v2)
Seven data-driven improvements over V1 from 30,697 shade consultations + 2,735 Junip cross-references. See `shade-matching-data/training-data-summary.md` for details.

## Current State

### Working
- **V1** at https://jrb-shade-ai.vercel.app — fully operational, customer-facing
- **V2** at https://jrb-shade-ai-v2.vercel.app — CAB testing with separate feedback form
- **V3** at https://jrb-shade-ai-v3.vercel.app — latest: Foundation Stick + inline feedback + V3 calibration
- All versions share the same Redis instance (key: `shade-feedback-entries`); distinguished by `version` field

### Git Status
- **Branch**: `overnight/shade-ai-v3`
- All changes committed and pushed
- `.vercel/project.json` points to V1 (correct)

### Known Issues
- V2 and V3 Vercel projects have `framework: null` in project settings → each deploy requires temporary `vercel.json`
- `shade-matching-data/` directory is untracked (training scripts, analysis docs) — not committed intentionally

## What's NOT Done / Next Steps
1. **Share V3 with team** — send https://jrb-shade-ai-v3.vercel.app to `#ai-shadematching` (C091ZCS2CR3)
2. **Monitor V3 feedback** — check Redis for `version: "v3"` entries
3. **Foundation Stick shade verification** — shades from quiz-logic.html were marked provisional. Confirm with product team or Cheyenne that the mapping is correct before going wider.
4. **Darker skin tone gap** — V3 prompt has guidance but training data still underrepresents Med-Dark/Dark. Pull more Richpanel conversations from darker-skinned customers.
5. **CC tag extraction** — `shade-matching-data/extract-cc-conversations.py` script needs re-run (timed out mid-run)
6. **Future: promote V3 → production** — once validated, deploy V3 code to V1 project (jrb-shade-ai.vercel.app)

## Quick Start
```bash
cd /Users/codyplofker/Desktop/01-Projects/jrb-shade-ai
git checkout overnight/shade-ai-v3
npm run dev  # starts on port 3000
```

### Env Vars (in `.env.local`)
- `ANTHROPIC_API_KEY`
- `UPSTASH_REDIS_REST_URL`
- `UPSTASH_REDIS_REST_TOKEN`

### Read Feedback from Redis
```bash
curl https://jrb-shade-ai-v3.vercel.app/api/feedback | jq '.count'
curl https://jrb-shade-ai-v3.vercel.app/api/feedback | jq '[.feedback[] | select(.version == "v3")]'
```

### Key Data & Links
- **V3 live**: https://jrb-shade-ai-v3.vercel.app
- **V2 live**: https://jrb-shade-ai-v2.vercel.app
- **Richpanel shade conversations**: `shade-matching-data/richpanel-shade-conversations.json` (43,905 tagged)
- **Training data**: `shade-matching-data/shade-training-data.jsonl`
- **Junip CSV**: `~/Desktop/review_export_7180 (2).csv`

### API Access
- **Richpanel API key**: env var `RICHPANEL_API_KEY`
- **Richpanel MCP**: `mcp__33f95001` — `list_conversations`, `get_conversation`, `list_tags`
