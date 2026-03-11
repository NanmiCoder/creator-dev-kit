import CodeBlock from '../components/ui/CodeBlock.tsx'
import Quiz from '../components/ui/Quiz.tsx'
import InfoBox from '../components/ui/InfoBox.tsx'

export default function LessonUsecases() {
  return (
    <>
      <div className="mb-8">
        <h3 className="text-[15px] font-semibold mb-3.5 text-text-100 flex items-center gap-2 tracking-tight">
          用例 1：并行代码审查
        </h3>
        <p className="text-sm text-text-200 leading-[1.8] mb-3">
          单个审查者容易在某一类问题上过度关注。将审查标准拆分为独立领域，
          安全、性能和测试覆盖率都能得到同时且充分的关注：
        </p>

        <CodeBlock title="创建审查团队">
          创建一个 Agent 团队来审查 PR #142。{'\n'}
          生成三位审查者：{'\n'}
          {'  '}- 一位专注 <span className="code-str">安全影响</span>{'\n'}
          {'  '}- 一位检查 <span className="code-str">性能影响</span>{'\n'}
          {'  '}- 一位验证 <span className="code-str">测试覆盖率</span>{'\n'}
          {'\n'}
          让他们各自审查并汇报发现。
        </CodeBlock>

        <p className="text-sm text-text-200 leading-[1.8] mb-3">
          每位审查者从同一个 PR 出发，但使用不同的过滤器。
          Lead 在他们完成后汇总所有发现。
        </p>
      </div>

      <div className="mb-8">
        <h3 className="text-[15px] font-semibold mb-3.5 text-text-100 flex items-center gap-2 tracking-tight">
          用例 2：竞争假说调试
        </h3>
        <p className="text-sm text-text-200 leading-[1.8] mb-3">
          当根因不明确时，单个 Agent 倾向于找到一个看似合理的解释就停止。
          <strong>辩论结构</strong>是关键机制 — 让 Teammates 明确地互相对抗，
          每个人不仅要调查自己的理论，还要试图推翻别人的理论：
        </p>

        <CodeBlock title="调试团队">
          用户反馈应用在发送一条消息后就退出了，{'\n'}
          而不是保持连接。{'\n'}
          {'\n'}
          生成 <span className="code-num">5</span> 个 Teammates 调查不同的假说。{'\n'}
          让他们<span className="code-str">互相交流，</span>{'\n'}
          <span className="code-str">尝试推翻对方的理论</span>，{'\n'}
          像科学辩论一样。{'\n'}
          {'\n'}
          将最终达成的共识更新到调查文档中。
        </CodeBlock>

        <InfoBox type="tip" title="为什么有效">
          顺序调查容易受到锚定效应影响：一旦探索了某个理论，后续调查就会偏向它。
          多个独立调查者主动尝试推翻对方，存活下来的理论更可能是真正的根因。
        </InfoBox>
      </div>

      <div className="mb-8">
        <h3 className="text-[15px] font-semibold mb-3.5 text-text-100 flex items-center gap-2 tracking-tight">
          用例 3：跨层协调开发
        </h3>
        <p className="text-sm text-text-200 leading-[1.8] mb-3">
          前端、后端、测试由不同 Teammate 负责，同步推进：
        </p>

        <CodeBlock title="开发团队">
          <span className="code-cm">{'// Prompt'}</span>{'\n'}
          实现用户配置文件功能，创建开发团队：{'\n'}
          {'\n'}
          <span className="code-str">Teammate 1 (backend-dev)</span>:{'\n'}
          {'  '}- 设计 REST API 端点{'\n'}
          {'  '}- 实现数据模型和业务逻辑{'\n'}
          {'  '}- 完成后通知 frontend-dev API 接口{'\n'}
          {'\n'}
          <span className="code-str">Teammate 2 (frontend-dev)</span>:{'\n'}
          {'  '}- 创建 React 组件和页面布局{'\n'}
          {'  '}- 等待 backend-dev 的 API 接口定义{'\n'}
          {'  '}- 集成 API 调用{'\n'}
          {'\n'}
          <span className="code-str">Teammate 3 (test-dev)</span>:{'\n'}
          {'  '}- 编写 E2E 测试用例{'\n'}
          {'  '}- 为 API 编写集成测试{'\n'}
          {'  '}- 确保测试覆盖率 {'>'} 80%
        </CodeBlock>
      </div>

      <div className="mb-8">
        <Quiz
          id="q3"
          question="以下哪个场景最不适合使用 Agent Teams？"
          options={[
            { value: 'a', label: '并行审查一个大型 PR 的安全、性能和测试' },
            { value: 'b', label: '多角色同时开发前端、后端和测试' },
            { value: 'c', label: '在单个文件中修复一个简单的拼写错误' },
            { value: 'd', label: '多个假说同时调试一个复杂的生产 bug' },
          ]}
          correct="c"
          feedbackCorrect="正确！修复简单拼写错误不需要多代理协作，直接操作或使用 Subagent 更高效。Agent Teams 最适合并行探索有价值的任务。"
          feedbackWrong="想想 — Agent Teams 的优势在于并行和多角色协作。简单的单一任务不需要这种复杂性和额外的 Token 开销。"
        />
      </div>
    </>
  )
}
