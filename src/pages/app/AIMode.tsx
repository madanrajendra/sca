import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, Send, Bot, User, ArrowLeft, Copy, Check, RotateCcw, 
  TrendingUp, Building2, ArrowUpRight, Share2, Plus, Zap, 
  Network, Activity, FileText, BarChart3, HelpCircle
} from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

interface FloatingNode {
  id: string;
  label: string;
  value: string;
  icon: React.ReactNode;
  offsetX: number; // Target offset from cursor
  offsetY: number;
  lerpFactor: number; // How sluggishly it follows (0.01 - 0.2)
  orbitRadius: number;
  orbitSpeed: number;
  currentX: number;
  currentY: number;
}

interface Message {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  type?: 'text' | 'chart' | 'post-draft' | 'network-matches';
  chartData?: any[];
  draftData?: {
    title: string;
    body: string;
    hashtags: string[];
  };
  matchesData?: any[];
}

export const AIMode: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputVal, setInputVal] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  
  // Mouse position tracking
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [targetMousePos, setTargetMousePos] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Floating nodes configuration
  const nodesRef = useRef<FloatingNode[]>([
    {
      id: 'reach',
      label: 'Network Reach',
      value: '2.4M Est.',
      icon: <TrendingUp className="w-3.5 h-3.5 text-[#e50914]" />,
      offsetX: -140,
      offsetY: -100,
      lerpFactor: 0.05,
      orbitRadius: 25,
      orbitSpeed: 0.8,
      currentX: 0,
      currentY: 0
    },
    {
      id: 'audience',
      label: 'Match Rate',
      value: '98.4% Match',
      icon: <Network className="w-3.5 h-3.5 text-emerald-400" />,
      offsetX: 140,
      offsetY: -80,
      lerpFactor: 0.08,
      orbitRadius: 30,
      orbitSpeed: -0.6,
      currentX: 0,
      currentY: 0
    },
    {
      id: 'members',
      label: 'Alliance Nodes',
      value: '42 Businesses',
      icon: <Building2 className="w-3.5 h-3.5 text-amber-400" />,
      offsetX: -100,
      offsetY: 120,
      lerpFactor: 0.04,
      orbitRadius: 35,
      orbitSpeed: 0.5,
      currentX: 0,
      currentY: 0
    },
    {
      id: 'campaigns',
      label: 'Active Campaigns',
      value: '18 Running',
      icon: <Activity className="w-3.5 h-3.5 text-[#e50914]" />,
      offsetX: 120,
      offsetY: 90,
      lerpFactor: 0.06,
      orbitRadius: 28,
      orbitSpeed: -0.7,
      currentX: 0,
      currentY: 0
    }
  ]);

  const [uiNodes, setUiNodes] = useState<FloatingNode[]>([]);

  // Update target mouse pos
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setTargetMousePos({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top
        });
        setIsHovering(true);
      }
    };

    const handleMouseLeave = () => {
      setIsHovering(false);
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);
    
    // Set initial position to center of screen
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      setTargetMousePos({ x: centerX, y: centerY });
      setMousePos({ x: centerX, y: centerY });
      
      // Initialize nodes at center
      nodesRef.current.forEach(node => {
        node.currentX = centerX + node.offsetX;
        node.currentY = centerY + node.offsetY;
      });
      setUiNodes([...nodesRef.current]);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  // requestAnimationFrame Loop for spring physics cursor tracking
  useEffect(() => {
    let animationFrameId: number;
    let time = 0;

    const animate = () => {
      time += 0.015;
      
      // Smoothly interpolate cursor position (lerp)
      setMousePos(prev => {
        const nextX = prev.x + (targetMousePos.x - prev.x) * 0.1;
        const nextY = prev.y + (targetMousePos.y - prev.y) * 0.1;
        
        // Update nodes based on this lerped pointer pos
        nodesRef.current.forEach(node => {
          // Add organic circular orbit motion
          const orbitAngle = time * node.orbitSpeed;
          const orbitX = Math.cos(orbitAngle) * node.orbitRadius;
          const orbitY = Math.sin(orbitAngle) * node.orbitRadius;

          const targetNodeX = nextX + node.offsetX + orbitX;
          const targetNodeY = nextY + node.offsetY + orbitY;

          node.currentX += (targetNodeX - node.currentX) * node.lerpFactor;
          node.currentY += (targetNodeY - node.currentY) * node.lerpFactor;
        });
        
        return { x: nextX, y: nextY };
      });

      setUiNodes([...nodesRef.current]);
      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrameId);
  }, [targetMousePos]);

  // Scroll to bottom on new messages
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = (text: string) => {
    if (!text.trim()) return;

    const userMsg: Message = {
      id: `msg_${Date.now()}`,
      sender: 'user',
      text: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputVal('');
    setIsTyping(true);

    // Simulated responses based on keywords
    setTimeout(() => {
      let aiMsg: Message;
      const lower = text.toLowerCase();
      const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      if (lower.includes('reach') || lower.includes('analysis') || lower.includes('chart') || lower.includes('traffic')) {
        aiMsg = {
          id: `msg_ai_${Date.now()}`,
          sender: 'assistant',
          text: "I've analyzed the collective reach projections for Spin City Alliance campaigns. Here is the estimated reach progression across our 42 member directories for the next 6 months, assuming category-exclusivity promotions are fully leveraged:",
          timestamp: nowStr,
          type: 'chart',
          chartData: [
            { month: 'Sep', Reach: 450000, Leads: 1200 },
            { month: 'Oct', Reach: 890000, Leads: 2500 },
            { month: 'Nov', Reach: 1350000, Leads: 3900 },
            { month: 'Dec', Reach: 1820000, Leads: 5200 },
            { month: 'Jan', Reach: 2100000, Leads: 6800 },
            { month: 'Feb', Reach: 2450000, Leads: 8100 }
          ]
        };
      } else if (lower.includes('draft') || lower.includes('post') || lower.includes('hvac') || lower.includes('heating')) {
        aiMsg = {
          id: `msg_ai_${Date.now()}`,
          sender: 'assistant',
          text: "Certainly! I have generated a high-converting, localized cross-promotion draft post tailored for **ABC Heating & Air Conditioning** to share across the Alliance network. It highlights special fall energy audits:",
          timestamp: nowStr,
          type: 'post-draft',
          draftData: {
            title: "🍂 Pre-Winter Energy Audit - Exclusive Alliance Rate!",
            body: "The cold months are approaching fast! ❄️ Spin City Alliance partners get exclusive priority booking and 20% off our 28-point Home Thermal Energy Audits this month. Keep your family warm, optimize your furnace performance, and lower your bills. Call today or check our directory card to claim your discount coupon!",
            hashtags: ['SpinCityAlliance', 'HVACSpecialist', 'EnergyAudit', 'ShopLocal']
          }
        };
      } else if (lower.includes('match') || lower.includes('partner') || lower.includes('directory') || lower.includes('network')) {
        aiMsg = {
          id: `msg_ai_${Date.now()}`,
          sender: 'assistant',
          text: "Based on geographic proximity, customer synergy, and complementary business categories in Bangalore, I found 3 prime cross-promotion opportunities for you inside the Alliance network:",
          timestamp: nowStr,
          type: 'network-matches',
          matchesData: [
            {
              id: 'biz_electric',
              name: 'VoltStrike Electrical',
              category: 'Electrician Services',
              synergy: '98% Match',
              reason: 'Complementary trades. You can bundle HVAC energy audits with electrical safety checks.',
              reach: '150,000 Reach'
            },
            {
              id: 'biz_plumbing',
              name: 'AquaGuard Plumbing & Drain',
              category: 'Plumbing Services',
              synergy: '94% Match',
              reason: 'Excellent history of commercial building client handoffs in North Bangalore.',
              reach: '120,000 Reach'
            },
            {
              id: 'biz_realty',
              name: 'Apex Residential Realty',
              category: 'Real Estate Agents',
              synergy: '89% Match',
              reason: 'High volume of home buyers requiring instant post-closing system inspections.',
              reach: '220,000 Reach'
            }
          ]
        };
      } else {
        aiMsg = {
          id: `msg_ai_${Date.now()}`,
          sender: 'assistant',
          text: "Hello! I am your Spin City Alliance Assistant. I can help you compile metrics, analyze shared market reach, match synergy with partner businesses, or write engaging social copy. Try one of these questions:\n\n* 'Analyze our joint reach chart'\n* 'Draft a fall post for ABC Heating & Air'\n* 'Show me compatible partner matches'",
          timestamp: nowStr,
          type: 'text'
        };
      }

      setMessages(prev => [...prev, aiMsg]);
      setIsTyping(false);
    }, 1200);
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const quickPrompts = [
    { text: "📊 Analyse joint reach and traffic growth", label: "Reach Chart" },
    { text: "✍️ Draft a seasonal campaign post for ABC HVAC", label: "Draft Post" },
    { text: "🔍 Find local synergy matches in our alliance", label: "Synergy Partners" }
  ];

  return (
    <div 
      ref={containerRef}
      className="relative flex flex-col min-h-[calc(100vh-64px)] w-full bg-[#050505] overflow-hidden select-none"
    >
      {/* Decorative Interactive SVG Background Line Constellation */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
        <defs>
          <radialGradient id="cursorGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#e50914" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#e50914" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Glow behind cursor */}
        {isHovering && (
          <circle 
            cx={mousePos.x} 
            cy={mousePos.y} 
            r="180" 
            fill="url(#cursorGlow)" 
            className="transition-all duration-300 ease-out"
          />
        )}

        {/* Constellation lines between nodes and cursor */}
        {uiNodes.map((node) => {
          const dx = node.currentX - mousePos.x;
          const dy = node.currentY - mousePos.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          // Only draw line if reasonably close
          if (distance > 400) return null;
          
          const opacity = Math.max(0.05, 1 - distance / 400) * 0.45;
          return (
            <line
              key={node.id}
              x1={mousePos.x}
              y1={mousePos.y}
              x2={node.currentX}
              y2={node.currentY}
              stroke="#e50914"
              strokeWidth="1.5"
              strokeOpacity={opacity}
              strokeDasharray="4 6"
              className="animate-[dash-flow_20s_linear_infinite]"
            />
          );
        })}

        {/* Connections between some nodes */}
        {uiNodes.length >= 4 && (
          <>
            <line 
              x1={uiNodes[0].currentX} y1={uiNodes[0].currentY}
              x2={uiNodes[1].currentX} y2={uiNodes[1].currentY}
              stroke="rgba(255,255,255,0.06)" strokeWidth="1"
            />
            <line 
              x1={uiNodes[1].currentX} y1={uiNodes[1].currentY}
              x2={uiNodes[3].currentX} y2={uiNodes[3].currentY}
              stroke="rgba(255,255,255,0.06)" strokeWidth="1"
            />
            <line 
              x1={uiNodes[2].currentX} y1={uiNodes[2].currentY}
              x2={uiNodes[0].currentX} y2={uiNodes[0].currentY}
              stroke="rgba(255,255,255,0.06)" strokeWidth="1"
            />
          </>
        )}
      </svg>

      {/* Floating Animated UI Elements Following Cursor */}
      <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden">
        {uiNodes.map((node) => (
          <div
            key={node.id}
            style={{
              transform: `translate3d(${node.currentX}px, ${node.currentY}px, 0) translate(-50%, -50%)`,
            }}
            className="absolute left-0 top-0 pointer-events-auto bg-[#0b0b0b]/90 backdrop-blur-md border border-red-600/25 px-4 py-2.5 rounded-2xl flex items-center gap-2.5 shadow-xl transition-shadow hover:shadow-red-600/10 hover:border-red-600/40 select-none group"
          >
            <div className="p-1.5 rounded-lg bg-neutral-900 border border-neutral-800">
              {node.icon}
            </div>
            <div>
              <p className="text-[9px] text-neutral-400 font-bold uppercase tracking-wider leading-none">
                {node.label}
              </p>
              <p className="text-xs font-black text-white leading-none mt-1">
                {node.value}
              </p>
            </div>
            <div className="w-1.5 h-1.5 rounded-full bg-red-600 animate-ping absolute -top-0.5 -right-0.5" />
          </div>
        ))}
      </div>

      {/* Chat / Prompt Window Container */}
      <div className="flex-1 flex flex-col justify-between max-w-4xl w-full mx-auto p-4 md:p-6 z-20">
        
        {/* State A: Starting state, empty history (Initial Centered View) */}
        {messages.length === 0 ? (
          <div className="flex-1 flex flex-col justify-center items-center text-center px-4 my-auto select-text">
            {/* Header branding */}
            <div className="relative mb-6">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#e50914] to-red-950 flex items-center justify-center border border-red-600/30 shadow-2xl shadow-red-600/20">
                <Bot className="w-9 h-9 text-white" />
              </div>
              <Sparkles className="w-5 h-5 text-red-500 absolute -top-1.5 -right-1.5 animate-pulse" />
            </div>

            <h1 className="text-3xl md:text-4.5xl font-black uppercase tracking-tight text-white mb-2 leading-none">
              SCA CO-PILOT
            </h1>
            <p className="text-neutral-400 text-sm max-w-md mb-10 leading-relaxed font-medium">
              Your intelligent command assistant. Generate network analytics, match cross-promotional partners, or draft marketing assets.
            </p>

            {/* Centered Large Prompt Input Card */}
            <div className="w-full max-w-2xl bg-[#0b0b0b]/90 backdrop-blur-xl border border-red-600/20 rounded-3xl p-4 md:p-6 shadow-2xl shadow-red-950/20 space-y-4">
              <div className="flex items-center gap-3">
                <textarea
                  rows={2}
                  value={inputVal}
                  onChange={(e) => setInputVal(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSend(inputVal);
                    }
                  }}
                  placeholder="How is our shared alliance audience reach trending next month?"
                  className="flex-1 resize-none bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-3 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-red-600/40 focus:ring-1 focus:ring-red-600/20 transition-all font-medium"
                />
                <button
                  onClick={() => handleSend(inputVal)}
                  disabled={!inputVal.trim()}
                  className="adshare-red-btn p-4 rounded-xl flex items-center justify-center disabled:opacity-40 disabled:hover:bg-[#e50914] disabled:hover:scale-100 disabled:hover:shadow-none cursor-pointer"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>

              {/* Quick suggestions */}
              <div className="space-y-2 pt-2 text-left">
                <div className="flex items-center gap-1.5 text-[10px] text-neutral-500 uppercase font-extrabold tracking-wider">
                  <HelpCircle className="w-3.5 h-3.5" />
                  <span>Suggested Prompts</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
                  {quickPrompts.map((qp, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSend(qp.text)}
                      className="w-full text-left bg-neutral-900/60 hover:bg-[#0b0b0b] border border-neutral-800/80 hover:border-red-600/30 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-neutral-300 hover:text-white transition-all duration-200 cursor-pointer flex flex-col justify-between h-18 group"
                    >
                      <span className="line-clamp-2 leading-tight">{qp.text}</span>
                      <span className="text-[9px] text-red-500 font-extrabold uppercase tracking-wider mt-1 inline-flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform">
                        Run Command <ArrowUpRight className="w-3 h-3" />
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* State B: Chat active view (Input at bottom, scrollable messages) */
          <div className="flex-1 flex flex-col justify-between overflow-hidden select-text">
            
            {/* Header controls to clear chat */}
            <div className="flex items-center justify-between border-b border-red-600/20 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <div className="p-1 bg-[#e50914] rounded-lg">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <span className="text-xs font-extrabold uppercase tracking-wider text-white">Active Session</span>
              </div>
              <button
                onClick={() => setMessages([])}
                className="text-[10px] font-extrabold uppercase text-neutral-400 hover:text-red-500 flex items-center gap-1 cursor-pointer transition-colors"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset Chat</span>
              </button>
            </div>

            {/* Message Feed Area */}
            <div className="flex-1 overflow-y-auto pr-1 space-y-6 scroll-smooth pb-4">
              {messages.map((msg) => (
                <div 
                  key={msg.id} 
                  className={`flex gap-4 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {/* Left Avatar for Assistant */}
                  {msg.sender === 'assistant' && (
                    <div className="w-8 h-8 rounded-lg bg-[#e50914] border border-red-600/30 flex items-center justify-center shrink-0 shadow-lg shadow-red-950/40">
                      <Bot className="w-4 h-4 text-white" />
                    </div>
                  )}

                  {/* Message Bubble Content */}
                  <div className={`max-w-2xl space-y-3.5 ${msg.sender === 'user' ? 'w-auto' : 'flex-1'}`}>
                    
                    {/* Main Bubble Card */}
                    <div 
                      className={`px-5 py-3.5 rounded-2xl text-sm leading-relaxed ${
                        msg.sender === 'user' 
                          ? 'bg-neutral-900 border border-neutral-800 text-white font-medium'
                          : 'bg-[#0b0b0b]/90 backdrop-blur-md border border-neutral-900 text-neutral-200'
                      }`}
                    >
                      <p className="whitespace-pre-wrap">{msg.text}</p>
                    </div>

                    {/* Rich Render Cards (Assistant Only) */}
                    {msg.sender === 'assistant' && msg.type === 'chart' && msg.chartData && (
                      <div className="bg-[#0b0b0b]/95 border border-red-600/20 p-4 md:p-5 rounded-2xl shadow-xl space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-[10px] text-neutral-400 font-extrabold uppercase">Analytics Projection</p>
                            <h4 className="text-sm font-black text-white uppercase">6-Month Shared Reach Growth</h4>
                          </div>
                          <span className="text-[9px] font-extrabold px-2 py-0.5 rounded bg-red-950 text-[#e50914] border border-red-800 uppercase">
                            98% Confidence
                          </span>
                        </div>
                        <div className="h-64 w-full">
                          <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={msg.chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                              <defs>
                                <linearGradient id="colorReach" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="5%" stopColor="#e50914" stopOpacity={0.4}/>
                                  <stop offset="95%" stopColor="#e50914" stopOpacity={0}/>
                                </linearGradient>
                              </defs>
                              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
                              <XAxis dataKey="month" stroke="#6b6b6b" fontSize={10} tickLine={false} />
                              <YAxis stroke="#6b6b6b" fontSize={10} tickLine={false} />
                              <Tooltip 
                                contentStyle={{ backgroundColor: '#0b0b0b', borderColor: 'rgba(229, 9, 20, 0.3)', borderRadius: '12px' }}
                                labelStyle={{ color: '#fff', fontWeight: 'bold', fontSize: '12px' }}
                                itemStyle={{ color: '#e50914', fontSize: '11px' }}
                              />
                              <Area type="monotone" dataKey="Reach" stroke="#e50914" strokeWidth={2.5} fillOpacity={1} fill="url(#colorReach)" />
                            </AreaChart>
                          </ResponsiveContainer>
                        </div>
                      </div>
                    )}

                    {msg.sender === 'assistant' && msg.type === 'post-draft' && msg.draftData && (
                      <div className="bg-[#0b0b0b]/95 border border-red-600/20 p-5 rounded-2xl shadow-xl space-y-4 relative group">
                        <div className="flex items-center justify-between border-b border-neutral-900 pb-3">
                          <div className="flex items-center gap-2">
                            <FileText className="w-4 h-4 text-red-500" />
                            <h4 className="text-xs font-black text-white uppercase tracking-wider">Social Copy Template</h4>
                          </div>
                          <button
                            onClick={() => copyToClipboard(
                              `${msg.draftData?.title}\n\n${msg.draftData?.body}\n\n${msg.draftData?.hashtags.map(h => `#${h}`).join(' ')}`,
                              msg.id
                            )}
                            className="text-[10px] font-extrabold uppercase text-red-500 hover:text-white flex items-center gap-1 transition-colors cursor-pointer"
                          >
                            {copiedId === msg.id ? (
                              <>
                                <Check className="w-3.5 h-3.5 text-emerald-400" />
                                <span className="text-emerald-400">Copied!</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3.5 h-3.5" />
                                <span>Copy Text</span>
                              </>
                            )}
                          </button>
                        </div>

                        <div className="space-y-3 font-mono text-xs text-neutral-300 bg-neutral-950/70 p-4 rounded-xl border border-neutral-900/60 leading-relaxed select-text">
                          <p className="font-extrabold text-white">{msg.draftData.title}</p>
                          <p>{msg.draftData.body}</p>
                          <p className="text-[#e50914]">
                            {msg.draftData.hashtags.map(h => `#${h}`).join(' ')}
                          </p>
                        </div>

                        <div className="flex items-center justify-between text-[10px] text-neutral-500 pt-1">
                          <span>Target: Business Feed / Customer Pages</span>
                          <span>Est. Read Time: ~35s</span>
                        </div>
                      </div>
                    )}

                    {msg.sender === 'assistant' && msg.type === 'network-matches' && msg.matchesData && (
                      <div className="space-y-3">
                        <div className="flex items-center gap-1.5 text-[10px] text-neutral-400 font-extrabold uppercase tracking-wider px-1">
                          <Network className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                          <span>Recommended Alliances</span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                          {msg.matchesData.map((match, mIdx) => (
                            <div 
                              key={mIdx}
                              className="bg-[#0b0b0b] hover:bg-neutral-950 border border-neutral-800/80 hover:border-emerald-500/30 p-4 rounded-2xl flex flex-col justify-between space-y-3.5 transition-all shadow-md"
                            >
                              <div className="space-y-1.5">
                                <div className="flex items-center justify-between">
                                  <span className="text-[9px] bg-emerald-950 text-emerald-400 border border-emerald-800/80 px-2 py-0.5 rounded font-extrabold uppercase">
                                    {match.synergy}
                                  </span>
                                  <span className="text-[9px] text-neutral-500 font-mono font-bold">{match.reach}</span>
                                </div>
                                <h5 className="text-xs font-black text-white uppercase">{match.name}</h5>
                                <p className="text-[10px] text-neutral-400 font-bold uppercase">{match.category}</p>
                                <p className="text-[10px] text-neutral-400 leading-normal pt-1.5 border-t border-neutral-900">{match.reason}</p>
                              </div>

                              <button className="w-full text-center py-2 bg-neutral-950 hover:bg-emerald-950/20 border border-neutral-900 hover:border-emerald-500/30 text-[10px] font-black uppercase text-emerald-400 rounded-xl transition-all cursor-pointer inline-flex items-center justify-center gap-1">
                                <span>Initiate Partnership</span>
                                <ArrowUpRight className="w-3 h-3" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Timestamp and Sender metadata */}
                    <div className="flex items-center gap-2 text-[10px] text-neutral-500 font-mono px-1">
                      <span>{msg.sender === 'user' ? 'Me' : 'SCA Co-pilot'}</span>
                      <span>•</span>
                      <span>{msg.timestamp}</span>
                    </div>

                  </div>

                  {/* Right Avatar for User */}
                  {msg.sender === 'user' && (
                    <div className="w-8 h-8 rounded-lg bg-neutral-900 border border-neutral-800 flex items-center justify-center shrink-0 shadow-lg">
                      <User className="w-4 h-4 text-white" />
                    </div>
                  )}

                </div>
              ))}

              {/* Typing indicator bubble */}
              {isTyping && (
                <div className="flex gap-4 justify-start">
                  <div className="w-8 h-8 rounded-lg bg-[#e50914] border border-red-600/30 flex items-center justify-center shrink-0 shadow-lg shadow-red-950/40 animate-pulse">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                  <div className="bg-[#0b0b0b]/90 border border-neutral-900 px-5 py-3.5 rounded-2xl flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-bounce [animation-delay:-0.3s]"></span>
                    <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-bounce [animation-delay:-0.15s]"></span>
                    <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-bounce"></span>
                  </div>
                </div>
              )}
              
              <div ref={chatEndRef} />
            </div>

            {/* Input Bar (Sticky at Bottom) */}
            <div className="bg-[#050505]/80 backdrop-blur-md pt-4 border-t border-neutral-900/60">
              <div className="bg-[#0b0b0b] border border-neutral-800/80 focus-within:border-red-600/40 rounded-2xl p-2.5 flex items-center gap-3 transition-colors shadow-lg">
                <textarea
                  rows={1}
                  value={inputVal}
                  onChange={(e) => setInputVal(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSend(inputVal);
                    }
                  }}
                  placeholder="Ask for post drafts, partnerships, or reach insights..."
                  className="flex-1 resize-none bg-transparent border-0 px-3.5 py-1.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:ring-0 font-medium max-h-20"
                />
                <button
                  onClick={() => handleSend(inputVal)}
                  disabled={!inputVal.trim()}
                  className="adshare-red-btn p-3.5 rounded-xl flex items-center justify-center disabled:opacity-40 disabled:hover:bg-[#e50914] disabled:hover:scale-100 disabled:hover:shadow-none cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
              <p className="text-[9px] text-neutral-600 text-center mt-2 uppercase font-extrabold tracking-wide">
                AI Copilot pulls secure real-time metadata from Bangalore Exclusivity Calendars.
              </p>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
