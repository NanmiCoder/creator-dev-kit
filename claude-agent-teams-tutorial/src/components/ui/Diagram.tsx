import { useState } from 'react'

interface TooltipState {
  text: string
  x: number
  y: number
}

const nodes = [
  {
    id: 'user',
    label: 'User',
    sub: '用户',
    tooltip: '用户：向 Team Lead 发起任务请求，接收最终结果',
    x: '50%',
    y: '9%',
    style: 'bg-bg-200/80 border-accent-200/60 text-text-100',
  },
  {
    id: 'tasks',
    label: 'Tasks',
    sub: 'TaskList',
    tooltip: '共享任务列表（TaskList）：所有 Agent 可见，用于任务分配与状态跟踪',
    x: '18%',
    y: '33%',
    style: 'bg-primary-300/10 border-primary-300/40 text-text-200',
  },
  {
    id: 'lead',
    label: 'Lead',
    sub: 'Team Lead',
    tooltip: 'Team Lead：协调团队、分解任务、管理 TaskList、汇总结果反馈用户',
    x: '50%',
    y: '33%',
    style: 'bg-primary-100/12 border-primary-100/50 text-primary-100',
  },
  {
    id: 'mail',
    label: 'Mail',
    sub: 'SendMessage',
    tooltip: '消息通道（SendMessage）：Agent 之间的点对点通信工具',
    x: '82%',
    y: '33%',
    style: 'bg-accent-200/10 border-accent-200/40 text-accent-200',
  },
  {
    id: 'tm1',
    label: 'TM-1',
    sub: 'Teammate',
    tooltip: 'Teammate 1：独立执行分配的任务，完成后向 Lead 汇报',
    x: '18%',
    y: '70%',
    style: 'bg-primary-200/10 border-primary-200/40 text-primary-200',
  },
  {
    id: 'tm2',
    label: 'TM-2',
    sub: 'Teammate',
    tooltip: 'Teammate 2：独立执行分配的任务，完成后向 Lead 汇报',
    x: '50%',
    y: '70%',
    style: 'bg-primary-200/10 border-primary-200/40 text-primary-200',
  },
  {
    id: 'tm3',
    label: 'TM-3',
    sub: 'Teammate',
    tooltip: 'Teammate 3：独立执行分配的任务，完成后向 Lead 汇报',
    x: '82%',
    y: '70%',
    style: 'bg-primary-200/10 border-primary-200/40 text-primary-200',
  },
]

export default function Diagram() {
  const [tooltip, setTooltip] = useState<TooltipState | null>(null)

  const showTooltip = (text: string, e: React.MouseEvent | React.FocusEvent) => {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
    const parent = (e.currentTarget as HTMLElement).offsetParent?.getBoundingClientRect()
    if (!parent) return
    setTooltip({
      text,
      x: rect.left - parent.left + rect.width / 2,
      y: rect.top - parent.top - 8,
    })
  }

  return (
    <div className="relative w-full h-96 my-6 diagram-grid rounded-xl border border-bg-300/30 overflow-hidden">
      {/* SVG Connections */}
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 400 340"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          {/* 橙色正向箭头 */}
          <marker
            id="arrow"
            markerWidth="8"
            markerHeight="6"
            refX="7"
            refY="3"
            orient="auto"
          >
            <path d="M0,0 L8,3 L0,6" fill="#ff6600" opacity="0.8" />
          </marker>
          {/* 橙色反向箭头 */}
          <marker
            id="arrow-reverse"
            markerWidth="8"
            markerHeight="6"
            refX="1"
            refY="3"
            orient="auto"
          >
            <path d="M8,0 L0,3 L8,6" fill="#ff6600" opacity="0.8" />
          </marker>
          {/* 灰色正向箭头 */}
          <marker
            id="arrow-gray"
            markerWidth="8"
            markerHeight="6"
            refX="7"
            refY="3"
            orient="auto"
          >
            <path d="M0,0 L8,3 L0,6" fill="#929292" opacity="0.6" />
          </marker>
          {/* 灰色反向箭头 */}
          <marker
            id="arrow-gray-reverse"
            markerWidth="8"
            markerHeight="6"
            refX="1"
            refY="3"
            orient="auto"
          >
            <path d="M8,0 L0,3 L8,6" fill="#929292" opacity="0.6" />
          </marker>
        </defs>

        {/* #1 User <-> Lead 双向实线(灰) */}
        <line
          x1="200" y1="48"
          x2="200" y2="95"
          stroke="#929292"
          strokeWidth="1.5"
          opacity="0.5"
          markerEnd="url(#arrow-gray)"
          markerStart="url(#arrow-gray-reverse)"
        />

        {/* #2 Tasks -- Lead 水平虚线(橙) */}
        <line
          x1="100" y1="112"
          x2="170" y2="112"
          stroke="#ff983f"
          strokeWidth="1.2"
          strokeDasharray="4 3"
          opacity="0.35"
        />

        {/* #3 Lead -- Mail 水平虚线(灰) */}
        <line
          x1="230" y1="112"
          x2="300" y2="112"
          stroke="#929292"
          strokeWidth="1.2"
          strokeDasharray="4 3"
          opacity="0.3"
        />

        {/* #4 Lead <-> TM-1 双向虚线(橙) */}
        <line
          x1="185" y1="130"
          x2="85" y2="220"
          stroke="#ff6600"
          strokeWidth="2"
          strokeDasharray="6 3"
          opacity="0.55"
          markerEnd="url(#arrow)"
          markerStart="url(#arrow-reverse)"
        />
        {/* #5 Lead <-> TM-2 双向虚线(橙) */}
        <line
          x1="200" y1="130"
          x2="200" y2="220"
          stroke="#ff6600"
          strokeWidth="2"
          strokeDasharray="6 3"
          opacity="0.55"
          markerEnd="url(#arrow)"
          markerStart="url(#arrow-reverse)"
        />
        {/* #6 Lead <-> TM-3 双向虚线(橙) */}
        <line
          x1="215" y1="130"
          x2="315" y2="220"
          stroke="#ff6600"
          strokeWidth="2"
          strokeDasharray="6 3"
          opacity="0.55"
          markerEnd="url(#arrow)"
          markerStart="url(#arrow-reverse)"
        />

        {/* #7 Tasks -- TM-1 垂直虚线(共享访问) */}
        <line
          x1="72" y1="130"
          x2="72" y2="220"
          stroke="#ff983f"
          strokeWidth="1"
          strokeDasharray="3 3"
          opacity="0.2"
        />

        {/* #8 Mail -- TM-3 垂直虚线(共享访问) */}
        <line
          x1="328" y1="130"
          x2="328" y2="220"
          stroke="#929292"
          strokeWidth="1"
          strokeDasharray="3 3"
          opacity="0.2"
        />

        {/* #9 Peer 通信弧线(动画) TM-1 ~ TM-3 */}
        <path
          className="peer-link"
          d="M85,256 Q200,290 315,256"
        />

        {/* Animated dots on peer link */}
        <circle r="3" className="peer-signal">
          <animateMotion
            dur="2.5s"
            repeatCount="indefinite"
            path="M85,256 Q200,290 315,256"
          />
        </circle>
        <circle r="2.5" className="peer-signal" opacity="0.7">
          <animateMotion
            dur="3s"
            repeatCount="indefinite"
            path="M315,256 Q200,290 85,256"
          />
        </circle>
      </svg>

      {/* Nodes */}
      {nodes.map((node) => (
        <div
          key={node.id}
          tabIndex={0}
          onMouseEnter={(e) => showTooltip(node.tooltip, e)}
          onFocus={(e) => showTooltip(node.tooltip, e)}
          onMouseLeave={() => setTooltip(null)}
          onBlur={() => setTooltip(null)}
          className={`absolute -translate-x-1/2 -translate-y-1/2 px-3 py-2 rounded-lg border text-center cursor-default select-none ${node.style}`}
          style={{ left: node.x, top: node.y }}
        >
          <div className="text-xs font-semibold">{node.label}</div>
          <div className="text-[10px] opacity-70">{node.sub}</div>
        </div>
      ))}

      {/* Tooltip */}
      {tooltip && (
        <div
          className="absolute z-10 px-3 py-1.5 rounded-md bg-text-100 text-white text-xs max-w-52 text-center pointer-events-none -translate-x-1/2 -translate-y-full"
          style={{ left: tooltip.x, top: tooltip.y }}
        >
          {tooltip.text}
        </div>
      )}
    </div>
  )
}
