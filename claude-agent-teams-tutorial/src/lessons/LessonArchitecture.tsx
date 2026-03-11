import CodeBlock from '../components/ui/CodeBlock.tsx'
import CompareTable from '../components/ui/CompareTable.tsx'
import InfoBox from '../components/ui/InfoBox.tsx'
import JsonPreview from '../components/ui/JsonPreview.tsx'

const teamConfigExample = {
  name: 'ui-refactor',
  description: 'PicTacticAgent 前端 UI 全面重构团队',
  createdAt: 1770550538081,
  leadAgentId: 'team-lead@ui-refactor',
  leadSessionId: '0dadb679-cf28-44b3-bd6a-a7aacdf9cef1',
  members: [
    {
      agentId: 'team-lead@ui-refactor',
      name: 'team-lead',
      agentType: 'team-lead',
      model: 'claude-opus-4-6',
      joinedAt: 1770550538081,
      cwd: '/PicTacticAgent/frontend',
    },
    {
      agentId: 'landing-dev@ui-refactor',
      name: 'landing-dev',
      agentType: 'general-purpose',
      model: 'claude-opus-4-6',
      prompt: '你是 UI 重构团队的成员，负责重构落地页...',
      color: 'blue',
      joinedAt: 1770550733500,
      cwd: '/PicTacticAgent/frontend',
    },
    {
      agentId: 'auth-dev@ui-refactor',
      name: 'auth-dev',
      agentType: 'general-purpose',
      model: 'claude-opus-4-6',
      prompt: '你是 UI 重构团队的成员，负责重构认证页面...',
      color: 'green',
      joinedAt: 1770550749868,
      cwd: '/PicTacticAgent/frontend',
    },
    {
      agentId: 'layout-dev@ui-refactor',
      name: 'layout-dev',
      agentType: 'general-purpose',
      model: 'claude-opus-4-6',
      prompt: '你是 UI 重构团队的成员，负责重构主应用布局...',
      color: 'yellow',
      joinedAt: 1770550764414,
      cwd: '/PicTacticAgent/frontend',
    },
    {
      agentId: 'components-dev@ui-refactor',
      name: 'components-dev',
      agentType: 'general-purpose',
      model: 'claude-opus-4-6',
      prompt: '你是 UI 重构团队的成员，负责重构生成流程和画廊组件...',
      color: 'purple',
      joinedAt: 1770550939307,
      cwd: '/PicTacticAgent/frontend',
    },
  ],
}

export default function LessonArchitecture() {
  return (
    <>
      <div className="mb-8">
        <h3 className="text-[15px] font-semibold mb-3.5 text-text-100 flex items-center gap-2 tracking-tight">
          架构组件
        </h3>
        <p className="text-sm text-text-200 leading-[1.8] mb-3">
          一个 Agent Team 由以下 4 个核心组件构成：
        </p>

        <CompareTable
          headers={['组件', '职责']}
          rows={[
            [
              <strong key="lead">Team Lead</strong>,
              '创建团队的主 Claude Code 会话，负责 Spawn Teammates 并协调工作',
            ],
            [
              <strong key="tm">Teammates</strong>,
              '独立的 Claude Code 实例，各自处理分配的任务',
            ],
            [
              <strong key="tl">Task List</strong>,
              '共享的任务列表，Teammates 从中认领和完成工作',
            ],
            [
              <strong key="mb">Mailbox</strong>,
              '消息系统，用于 Agent 之间的直接通信',
            ],
          ]}
        />
      </div>

      <div className="mb-8">
        <h3 className="text-[15px] font-semibold mb-3.5 text-text-100 flex items-center gap-2 tracking-tight">
          存储结构
        </h3>
        <p className="text-sm text-text-200 leading-[1.8] mb-3">
          团队配置和任务信息存储在本地：
        </p>

        <CodeBlock title="文件路径">
          <span className="code-cm">{'# 团队配置'}</span>{'\n'}
          ~/.claude/teams/<span className="code-str">{'<team-name>'}</span>/config.json{'\n'}
          {'\n'}
          <span className="code-cm">{'# 共享任务列表'}</span>{'\n'}
          ~/.claude/tasks/<span className="code-str">{'<team-name>'}</span>/
        </CodeBlock>

        <p className="text-sm text-text-200 leading-[1.8] mb-3">
          团队配置包含一个 <code className="bg-gradient-to-r from-orange-50 to-amber-50 px-1.5 py-0.5 rounded-md text-xs font-mono text-orange-700 font-medium">members</code> 数组，
          记录每个 Teammate 的 <strong>name</strong>（名称）、<strong>agentId</strong>（唯一标识）和 <strong>agentType</strong>（类型）。
          Teammates 可以读取这个文件来发现其他团队成员。
        </p>

        <JsonPreview
          title="config.json — 真实团队配置示例"
          data={teamConfigExample}
          collapsed={1}
        />
      </div>

      <div className="mb-8">
        <h3 className="text-[15px] font-semibold mb-3.5 text-text-100 flex items-center gap-2 tracking-tight">
          上下文与通信
        </h3>
        <p className="text-sm text-text-200 leading-[1.8] mb-3">
          每个 Teammate 拥有独立的上下文窗口。Spawn 时，Teammate 会加载与普通会话相同的项目上下文：
          <code className="bg-gradient-to-r from-orange-50 to-amber-50 px-1.5 py-0.5 rounded-md text-xs font-mono text-orange-700 font-medium">CLAUDE.md</code>、MCP 服务器和 Skills。
          它还会收到 Lead 的 spawn prompt。
        </p>

        <InfoBox type="warning" title="重要">
          Lead 的 <strong>对话历史不会</strong>传递给 Teammates。因此在 spawn prompt 中要提供足够的上下文信息。
        </InfoBox>

        <CompareTable
          headers={['机制', '说明']}
          rows={[
            [
              <strong key="auto">自动消息投递</strong>,
              'Teammates 发送的消息会自动投递给接收者，Lead 无需轮询。',
            ],
            [
              <strong key="idle">空闲通知</strong>,
              'Teammate 完成当前工作停下来时，会自动通知 Lead。',
            ],
            [
              <strong key="tl2">共享 Task List</strong>,
              '所有 Agent 都可以查看任务状态并认领可用工作。',
            ],
            [
              <strong key="msg">message</strong>,
              '向特定的某一个 Teammate 发送消息。',
            ],
            [
              <strong key="bc">broadcast</strong>,
              '向所有 Teammates 同时发送消息。谨慎使用，成本随团队规模线性增长。',
            ],
          ]}
        />
      </div>

      <div className="mb-8">
        <h3 className="text-[15px] font-semibold mb-3.5 text-text-100 flex items-center gap-2 tracking-tight">
          权限规则
        </h3>
        <p className="text-sm text-text-200 leading-[1.8] mb-3">
          Teammates 继承 Lead 的权限设置。如果 Lead 使用
          <code className="bg-gradient-to-r from-orange-50 to-amber-50 px-1.5 py-0.5 rounded-md text-xs font-mono text-orange-700 font-medium">--dangerously-skip-permissions</code>，
          所有 Teammates 也会如此。Spawn 后可以修改单个 Teammate 的模式，但不能在 spawn 时设置。
        </p>

        <InfoBox type="tip" title="权限提示">
          在 spawn Teammates 之前，在权限设置中预先批准常用操作，可以减少后续的权限提示中断。
        </InfoBox>
      </div>

      <div className="mb-8">
        <h3 className="text-[15px] font-semibold mb-3.5 text-text-100 flex items-center gap-2 tracking-tight">
          任务依赖与认领
        </h3>
        <p className="text-sm text-text-200 leading-[1.8] mb-3">
          任务有三种状态：<strong>pending</strong>（待处理）、<strong>in progress</strong>（进行中）和
          <strong> completed</strong>（已完成）。
          任务可以设置依赖关系，被阻塞的任务在依赖完成前无法被认领。
          当 Teammate 完成一个任务时，依赖它的任务会自动解除阻塞。
        </p>
        <p className="text-sm text-text-200 leading-[1.8] mb-3">
          任务认领使用 <strong>文件锁</strong>机制来防止多个 Teammates 同时认领同一任务的竞争条件。
        </p>
      </div>

      <div className="mb-8">
        <h3 className="text-[15px] font-semibold mb-3.5 text-text-100 flex items-center gap-2 tracking-tight">
          Token 使用
        </h3>
        <p className="text-sm text-text-200 leading-[1.8] mb-3">
          每个 Teammate 拥有独立的上下文窗口，Token 消耗随活跃 Teammates 数量线性增长。
          对于研究、审查和新功能开发任务，额外的 Token 消耗通常值得。
          对于日常任务，单个会话更具成本效益。
        </p>

        <InfoBox type="tip" title="性价比建议">
          为不需要最强推理能力的 Teammates 指定使用更轻量的模型（如 Sonnet）来降低成本。
          Lead 使用 Opus，Teammates 使用 Sonnet 是常见的高性价比配置。
        </InfoBox>
      </div>
    </>
  )
}
