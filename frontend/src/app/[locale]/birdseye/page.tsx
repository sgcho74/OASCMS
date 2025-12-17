'use client';

import { useState, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { clsx } from 'clsx';
import { Building2, Home, Info } from 'lucide-react';

interface Block {
  id: number;
  name: string;
  households: number;
  description: string;
  points: string;
}

const blocks: Block[] = [
  {
    id: 1,
    name: "1 Block",
    households: 1020,
    description: "쾌적한 공원 뷰와 조용한 주거 환경",
    points: "45.11% 57.16%, 69.04% 60.52%, 69.80% 85.81%, 32.95% 78.55%, 27.92% 71.42%"
  },
  {
    id: 2,
    name: "2 Block",
    households: 980,
    description: "지하철역 인접, 교통 편리",
    points: "25.07% 40.53%, 43.59% 55.35%, 25.93% 70.02%, 9.12% 48.78%"
  },
  {
    id: 3,
    name: "3 Block",
    households: 1050,
    description: "중앙 공원 조망, 프리미엄 위치",
    points: "8.07% 48.08%, 0.85% 37.46%, 5.22% 29.63%, 12.82% 24.32%, 22.60% 26.97%, 18.14% 33.40%, 24.31% 39.69%"
  },
  {
    id: 4,
    name: "4 Block",
    households: 995,
    description: "상업시설 인접, 생활 편의성 우수",
    points: "14.53% 23.06%, 22.51% 17.47%, 29.63% 19.43%, 32.38% 22.78%, 23.55% 26.28%"
  },
  {
    id: 5,
    name: "5 Block",
    households: 1035,
    description: "학교 인접, 교육 환경 최적화",
    points: "45.96% 23.06%, 50.81% 18.59%, 66.95% 22.22%, 63.72% 26.97%"
  },
  {
    id: 6,
    name: "6 Block",
    households: 1010,
    description: "넓은 조경 공간, 쾌적한 환경",
    points: "31.91% 19.85%, 33.52% 22.64%, 38.18% 21.66%, 44.73% 22.36%, 49.67% 18.17%, 38.18% 15.93%"
  },
  {
    id: 7,
    name: "7 Block",
    households: 990,
    description: "주차 시설 완비, 주거 편의성",
    points: "68.66% 27.11%, 69.99% 22.08%, 80.72% 24.60%, 84.52% 26.28%, 74.26% 29.35%"
  },
  {
    id: 8,
    name: "8 Block",
    households: 1045,
    description: "중앙 위치, 모든 시설 접근 용이",
    points: "74.36% 30.75%, 85.95% 27.39%, 93.54% 41.51%, 75.88% 39.97%"
  },
  {
    id: 9,
    name: "9 Block",
    households: 1005,
    description: "조용한 주거 환경, 프라이버시 보장",
    points: "76.26% 42.35%, 95.06% 44.16%, 99.62% 54.79%, 77.97% 52.55%"
  },
  {
    id: 10,
    name: "10 Block",
    households: 1025,
    description: "공원과 인접, 자연 친화적",
    points: "78.25% 54.23%, 99.53% 56.60%, 99.62% 70.72%, 80.44% 60.10%"
  },
  {
    id: 11,
    name: "11 Block",
    households: 975,
    description: "상가 인접, 일상 생활 편리",
    points: "88.98% 69.88%, 98.96% 76.17%, 98.86% 90.57%, 88.89% 89.03%, 85.00% 75.61%"
  },
  {
    id: 12,
    name: "12 Block",
    households: 1020,
    description: "최신 시설, 프리미엄 라이프스타일",
    points: "59.35% 37.74%, 52.90% 48.08%, 67.52% 53.53%, 69.80% 47.66%, 68.47% 40.39%"
  }
];

export default function BirdseyePage() {
  const tCommon = useTranslations('Common');
  const tBirdseye = useTranslations('Birdseye');
  const [selectedBlockId, setSelectedBlockId] = useState<number | null>(null);
  const [imgDims, setImgDims] = useState({ w: 0, h: 0 });

  const selectedBlock = blocks.find(b => b.id === selectedBlockId);

  // Convert percentage string points to pixel points based on image natural dimensions
  const getPolygonPoints = (pointsStr: string) => {
    if (imgDims.w === 0 || imgDims.h === 0) return '';

    return pointsStr.split(',').map(p => {
      const [xPct, yPct] = p.trim().replace(/%/g, '').split(' ').map(Number);
      const x = (xPct / 100) * imgDims.w;
      const y = (yPct / 100) * imgDims.h;
      return `${x},${y}`;
    }).join(' ');
  };

  return (
    <div className="h-[calc(100vh-theme('spacing.32'))] flex flex-col lg:flex-row gap-6">
      {/* Left: Map Section */}
      <div className="flex-1 min-h-0 flex flex-col bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 overflow-hidden relative group">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">{tBirdseye('title')}</h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">{tBirdseye('description')}</p>
        </div>
        <div className="relative flex-1 bg-gray-100 dark:bg-gray-900 p-4 flex items-center justify-center">
          <div className="relative w-full h-full max-w-full max-h-full aspect-video">
            <Image
              src="/images/map_2d.png"
              alt="Bird's Eye View"
              fill
              className="object-contain"
              priority
              onLoad={(e) => {
                const img = e.target as HTMLImageElement;
                setImgDims({ w: img.naturalWidth, h: img.naturalHeight });
              }}
            />
            {imgDims.w > 0 && (
              <svg
                viewBox={`0 0 ${imgDims.w} ${imgDims.h}`}
                className="absolute inset-0 w-full h-full pointer-events-none"
                preserveAspectRatio="xMidYMid meet"
              >
                {blocks.map((block) => (
                  <polygon
                    key={block.id}
                    points={getPolygonPoints(block.points)}
                    className={clsx(
                      "cursor-pointer transition-all duration-300",
                      selectedBlockId === block.id
                        ? "fill-blue-500/50 stroke-blue-600 stroke-[3]"
                        : "fill-transparent stroke-transparent hover:fill-green-500/40 hover:stroke-green-600 hover:stroke-[2]"
                    )}
                    style={{ pointerEvents: 'all' }}
                    onClick={() => setSelectedBlockId(block.id)}
                    onMouseEnter={() => setSelectedBlockId(block.id)}
                  />
                ))}
              </svg>
            )}

            {imgDims.w === 0 && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-900 z-10">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-white"></div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Right: Info Panel */}
      <div className="w-full lg:w-96 flex-shrink-0 bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 flex flex-col">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
            <Building2 className="mr-2 h-6 w-6 text-blue-500" />
            {tCommon('blocks')}
          </h2>
        </div>

        <div className="p-6 flex-1 overflow-y-auto">
          {selectedBlock ? (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
              <div className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-xl p-6 shadow-lg mb-6">
                <h3 className="text-2xl font-bold mb-2">{selectedBlock.name}</h3>
                <div className="flex items-center space-x-2 text-blue-100 mb-4">
                  <Home className="h-5 w-5" />
                  <span className="text-lg font-medium">{selectedBlock.households.toLocaleString()} 세대</span>
                </div>
                <p className="text-white/90 leading-relaxed">
                  {selectedBlock.description}
                </p>
              </div>

              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 border border-gray-100 dark:border-gray-600">
                <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2 flex items-center">
                  <Info className="h-4 w-4 mr-2" />
                  상세 정보
                </h4>
                <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                  <p>• 전세대 남향 위주 배치</p>
                  <p>• 친환경 마감재 사용</p>
                  <p>• 스마트 홈 IoT 시스템 적용</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-gray-400 dark:text-gray-500 p-8 text-center bg-gray-50 dark:bg-gray-700/30 rounded-lg border-2 border-dashed border-gray-200 dark:border-gray-600">
              <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
                <Building2 className="h-8 w-8 text-gray-400" />
              </div>
              <p className="text-lg font-medium">구역을 선택하세요</p>
              <p className="text-sm mt-2">지도에서 블록을 클릭하여<br />상세 정보를 확인하실 수 있습니다.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
