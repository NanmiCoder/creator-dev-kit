import Diagram from '../components/ui/Diagram.tsx'
import FlowSteps from '../components/ui/FlowSteps.tsx'
import InfoBox from '../components/ui/InfoBox.tsx'

export default function LessonOverview() {
  return (
    <>
      <div className="mb-8">
        <h3 className="text-[15px] font-semibold mb-3.5 text-text-100 flex items-center gap-2 tracking-tight">
          核心概念
        </h3>
        <p className="text-sm text-text-200 leading-[1.8] mb-3">
          <code className="bg-gradient-to-r from-orange-50 to-amber-50 px-1.5 py-0.5 rounded-md text-xs font-mono text-orange-700 font-medium">Agent Teams</code> 允许多个 Claude Code 实例协同工作。一个
          <code className="bg-gradient-to-r from-orange-50 to-amber-50 px-1.5 py-0.5 rounded-md text-xs font-mono text-orange-700 font-medium">Team Lead</code> 负责协调工作、分配任务并汇总结果，多个
          <code className="bg-gradient-to-r from-orange-50 to-amber-50 px-1.5 py-0.5 rounded-md text-xs font-mono text-orange-700 font-medium">Teammates</code> 独立执行任务，每个 Teammate 都有自己的上下文窗口。
        </p>
        <p className="text-sm text-text-200 leading-[1.8] mb-3">
          与 <strong>Subagents</strong> 不同的是，Subagents 只能向主 Agent 报告结果，而 Agent Teams 中的 <strong>Teammates 可以直接互相通信</strong>。
          你也可以直接与任何 Teammate 交互，而不必通过 Lead 中转。
        </p>
      </div>

      <div className="mb-8">
        <h3 className="text-[15px] font-semibold mb-3.5 text-text-100 flex items-center gap-2 tracking-tight">
          架构总览
        </h3>
        <Diagram />
        <p className="text-xs text-text-200/60 text-center -mt-2 mb-4">
          悬停或聚焦节点查看说明
        </p>
      </div>

      <div className="mb-8">
        <h3 className="text-[15px] font-semibold mb-3.5 text-text-100 flex items-center gap-2 tracking-tight">
          最佳使用场景
        </h3>
        <FlowSteps steps={[
          { icon: '\uD83D\uDD0D', color: 'blue', title: '研究与审查', description: '多个 Teammates 可以同时调查问题的不同方面，然后分享并质疑彼此的发现' },
          { icon: '\uD83D\uDCBB', color: 'green', title: '新模块开发', description: 'Teammates 各自负责独立的功能模块，互不干扰' },
          { icon: '\uD83D\uDC1B', color: 'purple', title: '竞争假说调试', description: 'Teammates 并行测试不同的假说，更快地收敛到正确答案' },
          { icon: '\uD83D\uDEE0', color: 'orange', title: '跨层协调', description: '前端、后端、测试由不同 Teammate 负责，同步推进', isLast: true },
        ]} />
      </div>

      <InfoBox type="warning" title="实验性功能">
        Agent Teams 目前是 <strong>实验性功能</strong>，默认禁用，需要手动启用。
        Agent Teams 会引入协调开销，并且消耗的 Token <strong>远多于</strong>单个会话。
        对于顺序任务、同文件编辑或依赖链较多的工作，单个会话或 Subagents 更高效。
      </InfoBox>
    </>
  )
}
