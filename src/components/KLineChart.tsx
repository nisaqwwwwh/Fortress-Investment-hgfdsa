import React, { useEffect, useRef, useState } from 'react';

interface CandleData {
  time: string;
  timestamp?: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

interface KLineChartProps {
  data: CandleData[];
  isPositive: boolean;
  height?: number;
}

const KLineChart: React.FC<KLineChartProps> = ({ data, isPositive, height = 303 }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const volumeCanvasRef = useRef<HTMLCanvasElement>(null);
  const [hoveredCandle, setHoveredCandle] = useState<CandleData | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [timeframe, setTimeframe] = useState('1m');

  useEffect(() => {
    if (!data || data.length === 0) return;
    
    const canvas = canvasRef.current;
    const volumeCanvas = volumeCanvasRef.current;
    if (!canvas || !volumeCanvas) return;

    const ctx = canvas.getContext('2d');
    const volumeCtx = volumeCanvas.getContext('2d');
    if (!ctx || !volumeCtx) return;

    // Set canvas size
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    
    canvas.width = rect.width * dpr;
    canvas.height = height * dpr;
    volumeCanvas.width = rect.width * dpr;
    volumeCanvas.height = 50 * dpr;
    
    ctx.scale(dpr, dpr);
    volumeCtx.scale(dpr, dpr);

    // Clear canvases
    ctx.clearRect(0, 0, rect.width, height);
    volumeCtx.clearRect(0, 0, rect.width, 50);

    // Calculate dimensions
    const padding = 10;
    const rightPadding = 70; // Space for price labels
    const chartWidth = rect.width - padding - rightPadding;
    const chartHeight = height - padding * 2;
    const candleWidth = Math.max(1, Math.min(8, chartWidth / data.length - 1));
    const candleSpacing = chartWidth / data.length;

    // Find price range with some padding
    const prices = data.flatMap(d => [d.high, d.low]);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    const priceRange = maxPrice - minPrice;
    const paddedMin = minPrice - priceRange * 0.05;
    const paddedMax = maxPrice + priceRange * 0.05;
    const paddedRange = paddedMax - paddedMin;

    // Find volume range
    const volumes = data.map(d => d.volume);
    const maxVolume = Math.max(...volumes);

    // Draw background
    ctx.fillStyle = '#1f2937';
    ctx.fillRect(0, 0, rect.width, height);

    // Draw grid lines
    ctx.strokeStyle = '#374151';
    ctx.lineWidth = 0.5;
    
    // Horizontal grid lines (price levels)
    const gridLines = 8;
    for (let i = 0; i <= gridLines; i++) {
      const y = padding + (chartHeight / gridLines) * i;
      ctx.beginPath();
      ctx.moveTo(padding, y);
      ctx.lineTo(rect.width - rightPadding, y);
      ctx.stroke();
    }

    // Vertical grid lines (time)
    const timeGridLines = 6;
    for (let i = 0; i <= timeGridLines; i++) {
      const x = padding + (chartWidth / timeGridLines) * i;
      ctx.beginPath();
      ctx.moveTo(x, padding);
      ctx.lineTo(x, height - padding);
      ctx.stroke();
    }

    // Draw candlesticks
    data.forEach((candle, index) => {
      const x = padding + index * candleSpacing + candleSpacing / 2;
      
      // Calculate y positions using padded range
      const highY = padding + ((paddedMax - candle.high) / paddedRange) * chartHeight;
      const lowY = padding + ((paddedMax - candle.low) / paddedRange) * chartHeight;
      const openY = padding + ((paddedMax - candle.open) / paddedRange) * chartHeight;
      const closeY = padding + ((paddedMax - candle.close) / paddedRange) * chartHeight;

      const isGreen = candle.close >= candle.open;
      const color = isGreen ? '#10b981' : '#ef4444';
      const shadowColor = isGreen ? '#065f46' : '#7f1d1d';

      // Draw wick (shadow)
      ctx.strokeStyle = color;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(x, highY);
      ctx.lineTo(x, lowY);
      ctx.stroke();

      // Draw body
      const bodyTop = Math.min(openY, closeY);
      const bodyHeight = Math.abs(closeY - openY);
      
      if (bodyHeight < 1) {
        // Doji - draw a horizontal line
        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(x - candleWidth / 2, openY);
        ctx.lineTo(x + candleWidth / 2, openY);
        ctx.stroke();
      } else {
        // Regular candle body
        if (isGreen) {
          // Green candle - filled
          ctx.fillStyle = color;
          ctx.fillRect(x - candleWidth / 2, bodyTop, candleWidth, bodyHeight);
        } else {
          // Red candle - hollow with border
          ctx.fillStyle = color;
          ctx.fillRect(x - candleWidth / 2, bodyTop, candleWidth, bodyHeight);
        }
        
        // Add subtle border for definition
        ctx.strokeStyle = shadowColor;
        ctx.lineWidth = 0.5;
        ctx.strokeRect(x - candleWidth / 2, bodyTop, candleWidth, bodyHeight);
      }

      // Draw volume bar
      const volumeHeight = (candle.volume / maxVolume) * 45;
      const volumeY = 50 - volumeHeight;
      
      volumeCtx.fillStyle = isGreen ? '#10b981' : '#ef4444';
      volumeCtx.globalAlpha = 0.7;
      volumeCtx.fillRect(x - candleWidth / 2, volumeY, candleWidth, volumeHeight);
      volumeCtx.globalAlpha = 1;
    });

    // Draw price labels on right axis
    ctx.fillStyle = '#9ca3af';
    ctx.font = '11px monospace';
    ctx.textAlign = 'left';
    
    for (let i = 0; i <= gridLines; i++) {
      const price = paddedMax - (paddedRange / gridLines) * i;
      const y = padding + (chartHeight / gridLines) * i;
      
      // Only show labels for reasonable price levels
      if (price >= minPrice && price <= maxPrice) {
        const priceText = price.toFixed(price > 1000 ? 0 : price > 100 ? 1 : 2);
        ctx.fillText(`$${priceText}`, rect.width - rightPadding + 5, y + 4);
      }
    }

    // Draw current price line
    if (data.length > 0) {
      const lastCandle = data[data.length - 1];
      const currentPriceY = padding + ((paddedMax - lastCandle.close) / paddedRange) * chartHeight;
      
      ctx.strokeStyle = lastCandle.close >= lastCandle.open ? '#10b981' : '#ef4444';
      ctx.lineWidth = 1;
      ctx.setLineDash([5, 5]);
      ctx.beginPath();
      ctx.moveTo(padding, currentPriceY);
      ctx.lineTo(rect.width - rightPadding, currentPriceY);
      ctx.stroke();
      ctx.setLineDash([]);
      
      // Current price label
      ctx.fillStyle = lastCandle.close >= lastCandle.open ? '#10b981' : '#ef4444';
      ctx.fillRect(rect.width - rightPadding, currentPriceY - 10, rightPadding - 5, 20);
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 11px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(
        lastCandle.close.toFixed(2), 
        rect.width - rightPadding / 2, 
        currentPriceY + 4
      );
    }

  }, [data, height]);

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas || !data || data.length === 0) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setMousePos({ x: e.clientX, y: e.clientY });

    // Find which candle is being hovered
    const padding = 10;
    const rightPadding = 70;
    const chartWidth = rect.width - padding - rightPadding;
    const candleSpacing = chartWidth / data.length;
    
    const candleIndex = Math.floor((x - padding) / candleSpacing);
    
    if (candleIndex >= 0 && candleIndex < data.length) {
      setHoveredCandle(data[candleIndex]);
    } else {
      setHoveredCandle(null);
    }
  };

  const handleMouseLeave = () => {
    setHoveredCandle(null);
  };

  if (!data || data.length === 0) {
    return (
      <div className="h-64 md:h-96 w-full flex items-center justify-center bg-gray-800">
        <div className="text-gray-400">Loading chart data...</div>
      </div>
    );
  }

  return (
    <div className="relative bg-gray-800">
      {/* Chart Header */}
      <div className="flex items-center justify-between p-2 border-b border-gray-700">
        <div className="flex items-center space-x-4">
          <div className="flex space-x-2">
            {['1m', '5m', '15m', '1h', '4h', '1d'].map((tf) => (
              <button 
                key={tf}
                onClick={() => setTimeframe(tf)}
                className={`px-2 py-1 text-xs rounded ${
                  timeframe === tf 
                    ? 'bg-yellow-400 text-gray-900' 
                    : 'text-gray-400 hover:text-white hover:bg-gray-700'
                }`}
              >
                {tf}
              </button>
            ))}
          </div>
        </div>
        <div className="flex items-center space-x-4 text-xs text-gray-400">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-1 bg-blue-400"></div>
            <span>MA(7)</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-1 bg-orange-400"></div>
            <span>MA(25)</span>
          </div>
          <span className="text-yellow-400">VOL</span>
        </div>
      </div>

      {/* Main Chart */}
      <div className="relative" style={{ height: `${height}px` }}>
        <canvas
          ref={canvasRef}
          className="absolute top-0 left-0 w-full cursor-crosshair"
          style={{ height: `${height}px` }}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        />
        
        {/* Crosshair tooltip */}
        {hoveredCandle && (
          <div 
            className="absolute z-10 bg-gray-900 border border-gray-600 rounded-lg p-3 text-xs pointer-events-none shadow-lg"
            style={{
              left: Math.min(mousePos.x - 120, window.innerWidth - 240),
              top: Math.max(mousePos.y - 140, 10)
            }}
          >
            <div className="space-y-1">
              <div className="text-gray-400 font-semibold border-b border-gray-600 pb-1">
                {hoveredCandle.time}
              </div>
              <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                <div className="text-gray-400">Open:</div>
                <div className="text-white font-mono">${hoveredCandle.open.toFixed(2)}</div>
                <div className="text-gray-400">High:</div>
                <div className="text-green-400 font-mono">${hoveredCandle.high.toFixed(2)}</div>
                <div className="text-gray-400">Low:</div>
                <div className="text-red-400 font-mono">${hoveredCandle.low.toFixed(2)}</div>
                <div className="text-gray-400">Close:</div>
                <div className="text-white font-mono">${hoveredCandle.close.toFixed(2)}</div>
                <div className="text-gray-400">Volume:</div>
                <div className="text-yellow-400 font-mono">
                  {hoveredCandle.volume.toLocaleString()}
                </div>
              </div>
              <div className="pt-1 border-t border-gray-600">
                <div className={`text-sm font-semibold ${
                  hoveredCandle.close >= hoveredCandle.open ? 'text-green-400' : 'text-red-400'
                }`}>
                  {hoveredCandle.close >= hoveredCandle.open ? '+' : ''}
                  {((hoveredCandle.close - hoveredCandle.open) / hoveredCandle.open * 100).toFixed(2)}%
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Volume Chart */}
      <div className="relative border-t border-gray-700" style={{ height: '50px' }}>
        <canvas
          ref={volumeCanvasRef}
          className="absolute top-0 left-0 w-full"
          style={{ height: '50px' }}
        />
        <div className="absolute top-1 left-2 text-xs text-gray-400 font-semibold">Volume</div>
        {data.length > 0 && (
          <div className="absolute top-1 right-2 text-xs text-gray-400">
            Max: {Math.max(...data.map(d => d.volume)).toLocaleString()}
          </div>
        )}
      </div>

      {/* Time axis */}
      <div className="h-6 border-t border-gray-700 relative bg-gray-800">
        <div className="absolute inset-0 flex justify-between items-center px-2 text-xs text-gray-400">
          {data.length > 0 && (
            <>
              <span>{data[0]?.time}</span>
              <span>{data[Math.floor(data.length * 0.25)]?.time}</span>
              <span>{data[Math.floor(data.length * 0.5)]?.time}</span>
              <span>{data[Math.floor(data.length * 0.75)]?.time}</span>
              <span>{data[data.length - 1]?.time}</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default KLineChart;
