#!/usr/bin/env bash
# 一键复跑：原始样本 -> 阅读版还原产物 -> 验证
set -euo pipefail
cd "$(dirname "$0")/.."

ORIGINAL="source/original/fullpage.9.2.0-guwyxh.js"
STEP1="intermediate/fullpage_step1_literals.js"
STEP2="intermediate/fullpage_step2_alias_cleanup.js"
STEP3="intermediate/fullpage_step3_unflattened.js"
STEP4="intermediate/fullpage_step4_readable.js"
FINAL="source/deobfuscated/fullpage_9.2.0_deobf.js"

node scripts/step1_resolve_constants.js "$ORIGINAL" "$STEP1"
node scripts/step2_cleanup_alias.js "$STEP1" "$STEP2"
node scripts/step3_unflatten_chain.js "$STEP2" "$STEP3" 15
node scripts/step4_readability.js "$STEP3" "$STEP4"
node scripts/step5_rename_locals.js "$STEP4" "$FINAL"
node scripts/validate_output.js "$ORIGINAL" "$FINAL"
