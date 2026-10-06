'use client';

import { useEffect, useRef, useState } from 'react';

const layerLegend = [
  ['layer-1', '页面背景'],
  ['layer-2', '页面主框'],
  ['layer-3', '筛选模块 / 结果卡片'],
  ['layer-4', '内部选项组'],
  ['layer-5', '具体控件'],
  ['layer-6', '控件内区块'],
] as const;

const debugStyles = `
  html[data-reference-layer-debug='on'] body { background: #101b36; }
  html[data-reference-layer-debug='on'] .reference-page .reference-intro,
  html[data-reference-layer-debug='on'] .reference-page .reference-section-panel,
  html[data-reference-layer-debug='on'] .styles-page .pitch-panel,
  html[data-reference-layer-debug='on'] .styles-page .results-panel {
    background: #57213d !important;
  }
  html[data-reference-layer-debug='on'] .styles-page .workspace {
    background: transparent !important;
  }
  html[data-reference-layer-debug='on'] .reference-page .reference-intro-layout > .usage-guide,
  html[data-reference-layer-debug='on'] .reference-page .reference-stats span,
  html[data-reference-layer-debug='on'] .reference-page .reference-result-heading > span,
  html[data-reference-layer-debug='on'] .reference-page .reference-filter-module,
  html[data-reference-layer-debug='on'] .reference-page .position-filter,
  html[data-reference-layer-debug='on'] .reference-page .attribute-filter,
  html[data-reference-layer-debug='on'] .reference-page .recommendation-filter,
  html[data-reference-layer-debug='on'] .reference-page .random-limit-filter,
  html[data-reference-layer-debug='on'] .reference-page .search-box input,
  html[data-reference-layer-debug='on'] .reference-page .booster-card,
  html[data-reference-layer-debug='on'] .reference-page .booster-card-heading,
  html[data-reference-layer-debug='on'] .reference-page .booster-attributes,
  html[data-reference-layer-debug='on'] .reference-page .skill-category-list,
  html[data-reference-layer-debug='on'] .reference-page .skill-list,
  html[data-reference-layer-debug='on'] .reference-page .skill-result-count {
    background: #0b6b63 !important;
  }
  html[data-reference-layer-debug='on'] .styles-page .controls,
  html[data-reference-layer-debug='on'] .styles-page .pitch,
  html[data-reference-layer-debug='on'] .styles-page .style-list,
  html[data-reference-layer-debug='on'] .styles-page .pitch-side-filter,
  html[data-reference-layer-debug='on'] .styles-page .pitch-side-tabs {
    background: #0b6b63 !important;
  }
  html[data-reference-layer-debug='on'] .reference-page .reference-intent-option,
  html[data-reference-layer-debug='on'] .reference-page .position-options,
  html[data-reference-layer-debug='on'] .reference-page .random-limit-options,
  html[data-reference-layer-debug='on'] .reference-page .recommendation-options,
  html[data-reference-layer-debug='on'] .reference-page .recommendation-plan-options,
  html[data-reference-layer-debug='on'] .reference-page .attribute-options,
  html[data-reference-layer-debug='on'] .reference-page .position-level-options,
  html[data-reference-layer-debug='on'] .reference-page .custom-filter-options,
  html[data-reference-layer-debug='on'] .reference-page .owned-skill-options,
  html[data-reference-layer-debug='on'] .reference-page .skill-category,
  html[data-reference-layer-debug='on'] .reference-page .skill-card,
  html[data-reference-layer-debug='on'] .reference-page .skill-card summary {
    background: #8a5a00 !important;
  }
  html[data-reference-layer-debug='on'] .styles-page .position-strip,
  html[data-reference-layer-debug='on'] .styles-page .filter-row,
  html[data-reference-layer-debug='on'] .styles-page .style-card,
  html[data-reference-layer-debug='on'] .styles-page .pitch-node,
  html[data-reference-layer-debug='on'] .styles-page .pitch-side-tabs [data-slot='tabs-trigger'] {
    background: #8a5a00 !important;
  }
  html[data-reference-layer-debug='on'] .reference-page .reference-intent-option button,
  html[data-reference-layer-debug='on'] .reference-page .position-options button,
  html[data-reference-layer-debug='on'] .reference-page .random-limit-options button,
  html[data-reference-layer-debug='on'] .reference-page .recommendation-options button,
  html[data-reference-layer-debug='on'] .reference-page .recommendation-plan-option,
  html[data-reference-layer-debug='on'] .reference-page .attribute-category,
  html[data-reference-layer-debug='on'] .reference-page .position-level-options button,
  html[data-reference-layer-debug='on'] .reference-page .custom-filter-option,
  html[data-reference-layer-debug='on'] .reference-page .owned-skill-category,
  html[data-reference-layer-debug='on'] .reference-page .skill-detail {
    background: #4b236d !important;
  }
  html[data-reference-layer-debug='on'] .reference-page .owned-skill-category-options button,
  html[data-reference-layer-debug='on'] .reference-page .attribute-category-options > button,
  html[data-reference-layer-debug='on'] .reference-page .booster-attributes > span,
  html[data-reference-layer-debug='on'] .reference-page .booster-index,
  html[data-reference-layer-debug='on'] .reference-page .booster-recommendation strong,
  html[data-reference-layer-debug='on'] .reference-page .skill-number,
  html[data-reference-layer-debug='on'] .reference-page .skill-category-tag,
  html[data-reference-layer-debug='on'] .reference-page .skill-research-tag,
  html[data-reference-layer-debug='on'] .reference-page .skill-position-fit,
  html[data-reference-layer-debug='on'] .reference-page .skill-recommendation strong,
  html[data-reference-layer-debug='on'] .reference-page .skill-research {
    background: #8d3f78 !important;
  }
  html[data-reference-layer-debug='on'] .styles-page .position-chip,
  html[data-reference-layer-debug='on'] .styles-page .search-box,
  html[data-reference-layer-debug='on'] .styles-page .style-description {
    background: #4b236d !important;
  }
`;

export function ReferenceDebugPanel() {
  const [layersEnabled, setLayersEnabled] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const dragStart = useRef({ pointerX: 0, pointerY: 0, x: 0, y: 0 });
  const dragging = useRef(false);

  useEffect(() => {
    document.documentElement.dataset.referenceLayerDebug = layersEnabled
      ? 'on'
      : 'off';

    return () => {
      delete document.documentElement.dataset.referenceLayerDebug;
    };
  }, [layersEnabled]);

  function handlePointerDown(event: React.PointerEvent<HTMLDivElement>) {
    dragging.current = true;
    dragStart.current = {
      pointerX: event.clientX,
      pointerY: event.clientY,
      x: position.x,
      y: position.y,
    };
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function handlePointerMove(event: React.PointerEvent<HTMLDivElement>) {
    if (!dragging.current) return;
    setPosition({
      x: dragStart.current.x + event.clientX - dragStart.current.pointerX,
      y: dragStart.current.y + event.clientY - dragStart.current.pointerY,
    });
  }

  function stopDragging(event: React.PointerEvent<HTMLDivElement>) {
    dragging.current = false;
    event.currentTarget.releasePointerCapture(event.pointerId);
  }

  return (
    <>
      <style>{debugStyles}</style>
      <aside
        aria-label="开发调试工具"
        style={{
          position: 'fixed',
          top: 70,
          right: 16,
          zIndex: 100,
          width: 'min(248px, calc(100vw - 32px))',
          transform: `translate(${position.x}px, ${position.y}px)`,
          border: '1px solid rgb(255 255 255 / 45%)',
          borderRadius: 10,
          background: 'rgb(3 12 72 / 96%)',
          boxShadow: '0 12px 28px rgb(0 0 0 / 30%)',
          color: 'white',
          fontSize: 12,
        }}
      >
        <div
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={stopDragging}
          onPointerCancel={stopDragging}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 8,
            padding: '8px 10px',
            borderBottom: '1px solid rgb(255 255 255 / 18%)',
            cursor: 'grab',
            touchAction: 'none',
            userSelect: 'none',
          }}
        >
          <strong>开发调试</strong>
          <span style={{ color: '#aebeff', fontSize: 10 }}>拖动此处移动</span>
        </div>
        <div style={{ display: 'grid', gap: 8, padding: 10 }}>
          <button
            type="button"
            aria-pressed={layersEnabled}
            onClick={() => setLayersEnabled((current) => !current)}
            style={{
              padding: '7px 9px',
              border: `1px solid ${layersEnabled ? '#efff27' : '#5bf4f2'}`,
              borderRadius: 7,
              background: layersEnabled ? '#efff27' : 'transparent',
              color: layersEnabled ? '#06115c' : '#5bf4f2',
              cursor: 'pointer',
              fontSize: 11,
              fontWeight: 700,
            }}
          >
            {layersEnabled ? '关闭视图层级' : '开启视图层级'}
          </button>
          {layersEnabled && (
            <div style={{ display: 'grid', gap: 5 }}>
              {layerLegend.map(([layer, label]) => (
                <span
                  key={layer}
                  style={{ display: 'flex', alignItems: 'center', gap: 7 }}
                >
                  <i
                    aria-hidden="true"
                    style={{
                      width: 13,
                      height: 13,
                      flex: '0 0 13px',
                      border: '1px solid rgb(255 255 255 / 35%)',
                      borderRadius: 3,
                      background: {
                        'layer-1': '#101b36',
                        'layer-2': '#57213d',
                        'layer-3': '#0b6b63',
                        'layer-4': '#8a5a00',
                        'layer-5': '#4b236d',
                        'layer-6': '#8d3f78',
                      }[layer],
                    }}
                  />
                  {label}
                </span>
              ))}
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
