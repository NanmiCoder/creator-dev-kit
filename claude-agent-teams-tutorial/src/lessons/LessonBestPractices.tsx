import FlowSteps from '../components/ui/FlowSteps.tsx'
import CompareTable from '../components/ui/CompareTable.tsx'
import InfoBox from '../components/ui/InfoBox.tsx'
import CodeBlock from '../components/ui/CodeBlock.tsx'

export default function LessonBestPractices() {
  return (
    <>
      <div className="mb-8">
        <h3 className="text-[15px] font-semibold mb-3.5 text-text-100 flex items-center gap-2 tracking-tight">
          最佳实践
        </h3>

        <FlowSteps steps={[
          { icon: '1', color: 'blue', title: '给 Teammates 足够上下文', description: 'Teammates 会加载 CLAUDE.md 等项目上下文，但不继承 Lead 的对话历史。在 spawn prompt 中包含任务特定的细节' },
          { icon: '2', color: 'green', title: '合理划分任务粒度', description: '太小 → 协调开销超过收益。太大 → 长时间无反馈。刚好 → 独立单元，产出明确交付物（函数、测试文件、审查报告）' },
          { icon: '3', color: 'purple', title: '等待 Teammates 完成', description: 'Lead 有时会不等 Teammates 就自己开始干活。如果发现这种情况，指示 Lead 等待' },
          { icon: '4', color: 'orange', title: '从研究和审查任务入手', description: '新手建议从边界清晰、不需要写代码的任务开始：审查 PR、研究库、调查 Bug' },
          { icon: '5', color: 'blue', title: '避免文件冲突', description: '两个 Teammates 编辑同一文件会导致覆盖。按模块/目录划分，确保每个 Teammate 负责不同的文件集' },
          { icon: '6', color: 'green', title: '监控并调整', description: '检查 Teammates 进度，重定向无效的方向，及时汇总发现。放任团队长时间不管会增加浪费', isLast: true },
        ]} />

        <InfoBox type="tip" title="任务数量建议">
          Lead 会自动将工作分解为任务并分配给 Teammates。如果它创建的任务不够多，
          让它把工作拆得更细。每个 Teammate <strong>5-6 个任务</strong>可以保持高效，
          也让 Lead 在有人卡住时能重新分配工作。
        </InfoBox>

        <CodeBlock title="给 Teammate 提供充足上下文的示例">
          生成一个安全审查 Teammate，prompt 为：{'\n'}
          "审查 <span className="code-str">src/auth/</span> 目录下的认证模块，{'\n'}
          查找安全漏洞。重点关注 Token 处理、{'\n'}
          会话管理和输入验证。{'\n'}
          应用使用存储在 httpOnly Cookie 中的{'\n'}
          JWT Token。{'\n'}
          报告所有问题并标注严重等级。"
        </CodeBlock>
      </div>

      <div className="mb-8">
        <h3 className="text-[15px] font-semibold mb-3.5 text-text-100 flex items-center gap-2 tracking-tight">
          常见问题排查
        </h3>

        <CompareTable
          headers={['问题', '解决方案']}
          rows={[
            [
              'Teammates 不出现',
              <>检查实验性功能标志是否已启用。在 in-process 模式中按 Shift+Down 可能已经在运行但未显示。如果用了 split panes，确认 tmux 已安装（<code className="bg-gradient-to-r from-orange-50 to-amber-50 px-1.5 py-0.5 rounded-md text-xs font-mono text-orange-700 font-medium">which tmux</code>）。</>,
            ],
            [
              '权限提示过多',
              '权限请求会冒泡到 Lead，造成中断。在 spawn Teammates 之前，在权限设置中预先批准常用操作。',
            ],
            [
              'Teammates 遇错停止',
              '查看其输出（Shift+Up/Down 或点击面板），然后给它额外指示或 spawn 替代的 Teammate 继续工作。',
            ],
            [
              'Lead 提前退出',
              '告诉 Lead 继续等待。也可以让 Lead 在 Teammates 完成前不要开始自己的工作。',
            ],
            [
              '孤立的 tmux 会话',
              <>团队结束后如果 tmux 会话残留：<code className="bg-gradient-to-r from-orange-50 to-amber-50 px-1.5 py-0.5 rounded-md text-xs font-mono text-orange-700 font-medium">tmux ls</code> 列出会话，<code className="bg-gradient-to-r from-orange-50 to-amber-50 px-1.5 py-0.5 rounded-md text-xs font-mono text-orange-700 font-medium">tmux kill-session -t &lt;name&gt;</code> 清理。</>,
            ],
            [
              '任务状态滞后',
              'Teammates 有时未标记任务为完成，阻塞依赖任务。检查工作是否实际已完成，手动更新状态或让 Lead 提醒 Teammate。',
            ],
          ]}
        />
      </div>

      <div className="mb-8">
        <InfoBox type="warning" title="已知限制">
          <ul className="list-disc list-inside space-y-1 mt-1">
            <li><strong>不支持会话恢复</strong>：<code className="bg-gradient-to-r from-orange-50 to-amber-50 px-1.5 py-0.5 rounded-md text-xs font-mono text-orange-700 font-medium">/resume</code> 和 <code className="bg-gradient-to-r from-orange-50 to-amber-50 px-1.5 py-0.5 rounded-md text-xs font-mono text-orange-700 font-medium">/rewind</code> 不会恢复 in-process Teammates</li>
            <li><strong>任务状态可能滞后</strong>：Teammates 有时未标记任务完成，阻塞依赖任务</li>
            <li><strong>关闭较慢</strong>：Teammates 完成当前请求或工具调用后才会关闭</li>
            <li><strong>每个会话一个团队</strong>：一个 Lead 同时只能管理一个团队</li>
            <li><strong>不支持嵌套团队</strong>：Teammates 不能创建自己的团队或 Teammates</li>
            <li><strong>Lead 角色固定</strong>：不能将领导权转移给 Teammate</li>
            <li><strong>权限在 spawn 时确定</strong>：所有 Teammates 继承 Lead 的权限模式，spawn 后可单独修改</li>
            <li><strong>Split panes 终端限制</strong>：不支持 VS Code 终端、Windows Terminal 和 Ghostty</li>
          </ul>
        </InfoBox>
      </div>

      <InfoBox type="note" title="CLAUDE.md 正常工作">
        Teammates 会从工作目录加载 <code className="bg-gradient-to-r from-orange-50 to-amber-50 px-1.5 py-0.5 rounded-md text-xs font-mono text-orange-700 font-medium">CLAUDE.md</code> 文件。
        利用这个特性为所有 Teammates 提供项目级别的指导。
      </InfoBox>

      <div className="mt-6">
        <InfoBox type="tip" title="入门建议">
          从 <strong>2-3 个 Teammates</strong> 的小团队开始。选一个你熟悉的项目，
          尝试不需要写代码的任务（如 PR 审查、库研究、Bug 调查）。
          这些任务能展示并行探索的价值，又避免了并行实现带来的协调挑战。
        </InfoBox>
      </div>
    </>
  )
}
