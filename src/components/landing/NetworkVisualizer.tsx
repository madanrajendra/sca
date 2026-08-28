import React, { useState } from 'react';
import { Building, Shield, Wind, Utensils, Calculator, Scale, Megaphone, Lock } from 'lucide-react';

interface Node {
  id: string;
  label: string;
  category: string;
  x: number;
  y: number;
  icon: React.ReactNode;
  audience: string;
}

export const NetworkVisualizer: React.FC = () => {
  const [activeNode, setActiveNode] = useState<string | null>(null);

  const centerNode = {
    x: 250,
    y: 200,
    label: 'AD SHARE MARKETPLACE',
  };

  const nodes: Node[] = [
    { id: 'realtor', label: 'REALTOR', category: 'Turman Realty', x: 250, y: 50, icon: <Building className="w-5 h-5 text-red-500" />, audience: '24,000 Reach' },
    { id: 'hvac', label: 'HVAC', category: 'ABC Heating & Air', x: 420, y: 130, icon: <Wind className="w-5 h-5 text-red-500" />, audience: '18,500 Reach' },
    { id: 'insurance', label: 'INSURANCE', category: 'Premier Insurance', x: 420, y: 270, icon: <Shield className="w-5 h-5 text-red-500" />, audience: '15,200 Reach' },
    { id: 'restaurant', label: 'RESTAURANT', category: 'Neighborhood Bistro', x: 250, y: 350, icon: <Utensils className="w-5 h-5 text-red-500" />, audience: '16,700 Reach' },
    { id: 'cpa', label: 'CPA GROUP', category: 'Local CPA Group', x: 80, y: 270, icon: <Calculator className="w-5 h-5 text-red-500" />, audience: '14,300 Reach' },
    { id: 'attorney', label: 'ATTORNEY', category: 'Trusted Legal', x: 80, y: 130, icon: <Scale className="w-5 h-5 text-red-500" />, audience: '13,100 Reach' },
  ];

  return (
    <div className="relative w-full max-w-xl mx-auto p-6 bg-[#0b0b0b] border border-red-600/30 rounded-2xl shadow-2xl overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(#e50914_1px,transparent_1px)] [background-size:16px_16px] opacity-10" />

      <div className="relative z-10 flex items-center justify-between border-b border-red-600/20 pb-4 mb-4">
        <div className="flex items-center space-x-2">
          <Megaphone className="w-5 h-5 text-[#e50914]" />
          <span className="text-[#ffffff] font-bold text-sm tracking-wider uppercase">Private Co-op Network</span>
        </div>
        <div className="flex items-center space-x-1 text-xs text-emerald-400 bg-emerald-950/40 border border-emerald-800/40 px-2.5 py-1 rounded-full">
          <Lock className="w-3 h-3 mr-1" />
          Customer Data Isolated
        </div>
      </div>

      <div className="relative z-10 h-[380px]">
        <svg className="w-full h-full" viewBox="0 0 500 400">
          {nodes.map((node) => {
            const isHovered = activeNode === node.id;
            return (
              <g key={`line-${node.id}`}>
                <line
                  x1={centerNode.x}
                  y1={centerNode.y}
                  x2={node.x}
                  y2={node.y}
                  stroke={isHovered ? '#e50914' : 'rgba(229, 9, 20, 0.3)'}
                  strokeWidth={isHovered ? '3' : '1.5'}
                  className={isHovered ? '' : 'animate-dash-flow'}
                />
                <circle r={isHovered ? '4' : '3'} fill="#e50914">
                  <animateMotion
                    path={`M ${centerNode.x} ${centerNode.y} L ${node.x} ${node.y}`}
                    dur={`${2 + Math.random() * 1.5}s`}
                    repeatCount="indefinite"
                  />
                </circle>
              </g>
            );
          })}

          <g transform={`translate(${centerNode.x}, ${centerNode.y})`}>
            <circle r="42" fill="#050505" stroke="#e50914" strokeWidth="2.5" className="shadow-lg" />
            <circle r="34" fill="#e50914" opacity="0.15" className="animate-pulse" />
            <text
              textAnchor="middle"
              dy="-4"
              fill="#ffffff"
              fontSize="10"
              fontWeight="bold"
              letterSpacing="1"
            >
              AD SHARE
            </text>
            <text
              textAnchor="middle"
              dy="10"
              fill="#e50914"
              fontSize="8"
              fontWeight="bold"
              letterSpacing="1"
            >
              MARKETPLACE
            </text>
          </g>

          {nodes.map((node) => {
            const isHovered = activeNode === node.id;
            return (
              <g
                key={node.id}
                transform={`translate(${node.x}, ${node.y})`}
                onMouseEnter={() => setActiveNode(node.id)}
                onMouseLeave={() => setActiveNode(null)}
                className="cursor-pointer transition-all duration-300"
              >
                <circle
                  r={isHovered ? '26' : '22'}
                  fill="#0b0b0b"
                  stroke={isHovered ? '#e50914' : 'rgba(229, 9, 20, 0.4)'}
                  strokeWidth={isHovered ? '2.5' : '1.5'}
                />
                <foreignObject x="-10" y="-10" width="20" height="20">
                  <div className="flex items-center justify-center w-full h-full">
                    {node.icon}
                  </div>
                </foreignObject>

                <text
                  textAnchor="middle"
                  dy={isHovered ? '38' : '34'}
                  fill="#ffffff"
                  fontSize="9"
                  fontWeight="bold"
                  letterSpacing="0.5"
                >
                  {node.label}
                </text>
              </g>
            );
          })}
        </svg>

        {activeNode && (
          <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 bg-[#050505] border border-red-600/50 px-4 py-2 rounded-lg text-center shadow-xl animate-fade-in">
            {nodes.filter(n => n.id === activeNode).map(n => (
              <div key={n.id}>
                <div className="text-xs font-bold text-[#ffffff]">{n.category} ({n.label})</div>
                <div className="text-[10px] text-red-400 font-semibold">{n.audience} • 100% Data Private</div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="text-center text-xs text-neutral-400 border-t border-red-600/20 pt-3">
        Hover nodes to view trusted local business audience reach
      </div>
    </div>
  );
};
