import CodeBlock from '../components/ui/CodeBlock.tsx'
import TerminalSimulator from '../components/ui/TerminalSimulator.tsx'
import FlowSteps from '../components/ui/FlowSteps.tsx'
import InfoBox from '../components/ui/InfoBox.tsx'

export default function LessonFirstTeam() {
  return (
    <>
      <div className="mb-8">
        <h3 className="text-[15px] font-semibold mb-3.5 text-text-100 flex items-center gap-2 tracking-tight">
          创建团队
        </h3>
        <p className="text-sm text-text-200 leading-[1.8] mb-3">
          启用 Agent Teams 后，用自然语言告诉 Claude 创建团队并描述任务和团队结构。
          Claude 会自动创建团队、生成 Teammates 并协调工作。
        </p>

        <CodeBlock title="示例 1：多角度探索">
          <span className="code-cm">{'// 这个例子很好，因为三个角色是独立的，可以并行探索'}</span>{'\n'}
          {'\n'}
          我正在设计一个帮助开发者追踪代码库中{'\n'}
          TODO 注释的 CLI 工具。{'\n'}
          创建一个 Agent 团队从不同角度探索：{'\n'}
          {'  '}- 一位负责 <span className="code-str">用户体验（UX）</span>{'\n'}
          {'  '}- 一位负责 <span className="code-str">技术架构</span>{'\n'}
          {'  '}- 一位扮演 <span className="code-str">魔鬼代言人（挑刺）</span>
        </CodeBlock>

        <CodeBlock title="示例 2：并行代码审查">
          <span className="code-cm">{'// 中文同样可以'}</span>{'\n'}
          {'\n'}
          创建一个 Agent 团队来审查 PR #42，生成三位审查者：{'\n'}
          {'  '}- 一位专注<span className="code-str">安全影响</span>{'\n'}
          {'  '}- 一位检查<span className="code-str">性能影响</span>{'\n'}
          {'  '}- 一位验证<span className="code-str">测试覆盖率</span>
        </CodeBlock>
      </div>

      <div className="mb-8">
        <h3 className="text-[15px] font-semibold mb-3.5 text-text-100 flex items-center gap-2 tracking-tight">
          指定 Teammates 数量和模型
        </h3>
        <p className="text-sm text-text-200 leading-[1.8] mb-3">
          Claude 会根据你的任务自动决定 Teammates 数量，你也可以明确指定：
        </p>

        <CodeBlock title="指定 Teammates 和模型">
          创建一个有 <span className="code-num">4</span> 个 Teammates 的团队，{'\n'}
          并行重构这些模块。{'\n'}
          每个 Teammate 使用 <span className="code-str">Sonnet</span> 模型。
        </CodeBlock>
      </div>

      <div className="mb-8">
        <h3 className="text-[15px] font-semibold mb-3.5 text-text-100 flex items-center gap-2 tracking-tight">
          模拟终端
        </h3>
        <p className="text-sm text-text-200 leading-[1.8] mb-3">
          观察团队创建过程（点击标签切换不同阶段）：
        </p>
        <TerminalSimulator />
      </div>

      <div className="mb-8">
        <h3 className="text-[15px] font-semibold mb-3.5 text-text-100 flex items-center gap-2 tracking-tight">
          启动方式
        </h3>
        <p className="text-sm text-text-200 leading-[1.8] mb-3">
          有两种方式启动 Agent Teams：
        </p>
        <FlowSteps steps={[
          { icon: '1', color: 'blue', title: '你请求创建团队', description: '给 Claude 一个适合并行工作的任务，并明确要求创建 Agent Team' },
          { icon: '2', color: 'green', title: 'Claude 提议创建团队', description: 'Claude 判断你的任务会受益于并行工作，可能建议创建团队。你确认后才会执行' },
          { icon: '3', color: 'purple', title: 'Lead 分解并分配', description: 'Team Lead 解析需求，创建共享任务列表，Spawn Teammates 并分配初始任务' },
          { icon: '4', color: 'orange', title: '并行执行', description: 'Teammates 独立工作，通过消息和任务列表协调。Lead 汇总结果。', isLast: true },
        ]} />
      </div>

      <InfoBox type="note" title="用户始终保持控制权">
        无论哪种方式，Claude 都不会在未经你批准的情况下创建团队。
        Lead 的终端会列出所有 Teammates 及其工作内容。使用 Shift+Up/Down 选择 Teammate 并直接发送消息。
      </InfoBox>
    </>
  )
}
