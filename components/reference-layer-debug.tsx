'use client';

import { useEffect, useState } from 'react';

export function ReferenceLayerDebug() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    document.documentElement.dataset.referenceLayerDebug = enabled
      ? 'on'
      : 'off';

    return () => {
      delete document.documentElement.dataset.referenceLayerDebug;
    };
  }, [enabled]);

  return (
    <>
      <button
        type="button"
        className="reference-layer-debug-toggle"
        aria-pressed={enabled}
        onClick={() => setEnabled((current) => !current)}
      >
        {enabled ? '关闭层级调试' : '开启层级调试'}
      </button>
      {enabled && (
        <aside className="reference-layer-debug-legend" aria-label="视图层级图例">
          <strong>视图层级</strong>
          {[
            ['layer-1', '1 页面背景'],
            ['layer-2', '2 页面主框'],
            ['layer-3', '3 搜索框 / 筛选模块 / 结果卡片'],
            ['layer-4', '4 内部选项组 / 卡片内部区块'],
            ['layer-5', '5 具体控件 / 技能分类'],
            ['layer-6', '6 控件内具体技能'],
          ].map(([layer, label]) => (
            <span key={layer}>
              <i className={layer} aria-hidden="true" />
              {label}
            </span>
          ))}
        </aside>
      )}
    </>
  );
}
