import CompareTable from '../components/ui/CompareTable.tsx'
import InfoBox from '../components/ui/InfoBox.tsx'
import Quiz from '../components/ui/Quiz.tsx'

export default function LessonVsSubagents() {
  return (
    <>
      <div className="mb-8">
        <h3 className="text-[15px] font-semibold mb-3.5 text-text-100 flex items-center gap-2 tracking-tight">
          核心差异对比
        </h3>
        <CompareTable
          headers={['', 'Subagents', 'Agent Teams']}
          rows={[
            [
              <strong key="ctx">上下文</strong>,
              '独立上下文窗口，结果返回给调用者',
              '独立上下文窗口，完全独立运作',
            ],
            [
              <strong key="comm">通信方式</strong>,
              '只能向主 Agent 报告结果',
              'Teammates 可以直接互相发送消息',
            ],
            [
              <strong key="coord">协调</strong>,
              '主 Agent 管理所有工作',
              '共享任务列表 + 自主协调',
            ],
            [
              <strong key="use">适用场景</strong>,
              '只需要结果的专注任务',
              '需要讨论与协作的复杂任务',
            ],
            [
              <strong key="token">Token 成本</strong>,
              '较低：结果被摘要后返回主上下文',
              '较高：每个 Teammate 是一个独立的 Claude 实例',
            ],
          ]}
        />
      </div>

      <InfoBox type="tip" title="选择规则">
        需要快速、专注的工作者来完成任务并报告结果 &rarr; <strong>Subagent</strong>。
        Teammates 需要分享发现、互相质疑并自主协调 &rarr; <strong>Agent Teams</strong>。
      </InfoBox>

      <div className="mb-8">
        <p className="text-sm text-text-200 leading-[1.8] mb-3">
          选择正确的工具可以显著降低 Token 消耗并提高任务完成质量。
          以下测验帮助你巩固理解：
        </p>

        <Quiz
          id="q1"
          question="场景：你需要在 5 个目录中搜索特定模式的文件。应该选择？"
          options={[
            { value: 'a', label: 'Subagents — 简单的并行搜索任务' },
            { value: 'b', label: 'Agent Teams — 需要多角度分析' },
          ]}
          correct="a"
          feedbackCorrect="正确！简单的并行搜索是 Subagent 的典型场景，无需跨会话协调。"
          feedbackWrong="再想想 — 搜索文件是简单的可委派任务，不需要 Teammates 之间互相通信。"
        />

        <Quiz
          id="q2"
          question="场景：你要做 PR 审查，希望多个审查者能互相质疑对方的发现。应该选择？"
          options={[
            { value: 'a', label: 'Subagents — 各自独立审查即可' },
            { value: 'b', label: 'Agent Teams — 需要独立上下文和对等通信' },
          ]}
          correct="b"
          feedbackCorrect="正确！互相质疑需要独立的推理空间和 peer-to-peer 通信，这正是 Agent Teams 的优势。"
          feedbackWrong="注意 — 互相质疑意味着需要独立会话来形成不同观点，并通过消息系统交流。"
        />
      </div>
    </>
  )
}
