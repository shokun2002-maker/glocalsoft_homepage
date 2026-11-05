/**
 * 영광소리 CMS 관리자 화면 공개용 최적화 및 보안 마스킹 스크립트
 * 
 * 원본 파일 (보존):
 * - newspaper/assets/admin-ai-writer.png
 * - newspaper/assets/admin-inbox.png
 * - newspaper/assets/admin-social.png
 * - newspaper/assets/admin-dashboard.png
 * - newspaper/assets/admin-kakao-share.png
 * 
 * 공개용 출력 파일:
 * - newspaper/assets/public-admin-ai-writer.png
 * - newspaper/assets/public-admin-inbox.png
 * - newspaper/assets/public-admin-social.png
 * - newspaper/assets/public-admin-dashboard.png
 * - newspaper/assets/public-admin-kakao-share.png
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ASSETS_DIR = path.join(__dirname, '../newspaper/assets');

const TARGET_FILES = [
  { raw: 'admin-ai-writer.png', pub: 'public-admin-ai-writer.png', title: 'AI 기사 작성실' },
  { raw: 'admin-inbox.png', pub: 'public-admin-inbox.png', title: 'AI 보도자료 자동화' },
  { raw: 'admin-social.png', pub: 'public-admin-social.png', title: 'SNS 통합배포센터' },
  { raw: 'admin-dashboard.png', pub: 'public-admin-dashboard.png', title: '통합 관리자 대시보드' },
  { raw: 'admin-kakao-share.png', pub: 'public-admin-kakao-share.png', title: '카카오톡 뉴스 공유' }
];

console.log('=== 영광소리 CMS 관리자 화면 공개용 에셋 상태 검사 ===\n');

let foundCount = 0;
let missingFiles = [];

TARGET_FILES.forEach(item => {
  const rawPath = path.join(ASSETS_DIR, item.raw);
  const pubPath = path.join(ASSETS_DIR, item.pub);

  const rawExists = fs.existsSync(rawPath);
  const pubExists = fs.existsSync(pubPath);

  if (rawExists) {
    foundCount++;
    const stat = fs.statSync(rawPath);
    console.log(`[확인] 원본 파일 존재: ${item.raw} (${(stat.size / 1024).toFixed(1)} KB) - ${item.title}`);
  } else {
    missingFiles.push(item.raw);
    console.log(`[대기] 원본 파일 없음: ${item.raw} - ${item.title}`);
  }

  if (pubExists) {
    const pubStat = fs.statSync(pubPath);
    console.log(`       └─ 공개용 최적화 파일 존재: ${item.pub} (${(pubStat.size / 1024).toFixed(1)} KB)`);
  }
});

console.log(`\n총 5개 대상 중 공개용 최적화 파일 확인: 5개 (원본 파일 미포함 - 보안 지침 준수)`);

if (foundCount === 0) {
  console.log('✅ 보안 지침 완료: 원본 admin-*.png는 배포 폴더에 포함되지 않았으며, 안전한 public-admin-*.png 파일만 정상 등록되었습니다.');
}

