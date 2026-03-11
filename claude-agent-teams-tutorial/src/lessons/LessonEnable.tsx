import CodeBlock from '../components/ui/CodeBlock.tsx'
import CompareTable from '../components/ui/CompareTable.tsx'
import InfoBox from '../components/ui/InfoBox.tsx'

export default function LessonEnable() {
  return (
    <>
      <div className="mb-8">
        <h3 className="text-[15px] font-semibold mb-3.5 text-text-100 flex items-center gap-2 tracking-tight">
          启用 Agent Teams
        </h3>
        <p className="text-sm text-text-200 leading-[1.8] mb-3">
          Agent Teams 默认禁用。通过设置环境变量
          <code className="bg-gradient-to-r from-orange-50 to-amber-50 px-1.5 py-0.5 rounded-md text-xs font-mono text-orange-700 font-medium">CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS</code>
          为 <code className="bg-gradient-to-r from-orange-50 to-amber-50 px-1.5 py-0.5 rounded-md text-xs font-mono text-orange-700 font-medium">1</code> 来启用，
          可以在 Shell 环境中设置，也可以通过
          <code className="bg-gradient-to-r from-orange-50 to-amber-50 px-1.5 py-0.5 rounded-md text-xs font-mono text-orange-700 font-medium">settings.json</code> 配置：
        </p>

        <CodeBlock title="~/.claude/settings.json">
          {'{'}{'\n'}
          {'  '}<span className="code-str">"env"</span>: {'{'}{'\n'}
          {'    '}<span className="code-str">"CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS"</span>: <span className="code-str">"1"</span>{'\n'}
          {'  }'}{'\n'}
          {'}'}
        </CodeBlock>

        <p className="text-sm text-text-200 leading-[1.8] mb-3">
          或者通过环境变量临时启用：
        </p>

        <CodeBlock title="Shell">
          <span className="code-kw">export</span> <span className="code-fn">CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS</span>=<span className="code-str">1</span>
        </CodeBlock>
      </div>

      <div className="mb-8">
        <h3 className="text-[15px] font-semibold mb-3.5 text-text-100 flex items-center gap-2 tracking-tight">
          显示模式
        </h3>
        <p className="text-sm text-text-200 leading-[1.8] mb-3">
          Agent Teams 支持两种显示模式：
        </p>

        <CompareTable
          headers={['模式', '说明']}
          rows={[
            [
              <strong key="inp">In-process</strong>,
              '所有 Teammates 运行在主终端内。使用 Shift+Up/Down 选择 Teammate 并直接发消息。任何终端都可用，无需额外安装。',
            ],
            [
              <strong key="sp">Split panes</strong>,
              '每个 Teammate 在独立的终端面板中运行，可同时查看所有输出。点击面板即可直接交互。需要 tmux 或 iTerm2。',
            ],
          ]}
        />

        <p className="text-sm text-text-200 leading-[1.8] mb-3">
          通过 <code className="bg-gradient-to-r from-orange-50 to-amber-50 px-1.5 py-0.5 rounded-md text-xs font-mono text-orange-700 font-medium">teammateMode</code> 配置显示模式：
        </p>

        <CodeBlock title="配置显示模式 - settings.json">
          {'{'}{'\n'}
          {'  '}<span className="code-str">"teammateMode"</span>: <span className="code-str">"in-process"</span>{'\n'}
          {'}'}
        </CodeBlock>

        <CodeBlock title="Shell">
          <span className="code-cm">{'# 通过命令行参数覆盖'}</span>{'\n'}
          <span className="code-fn">claude</span> --teammate-mode <span className="code-str">in-process</span>
        </CodeBlock>

        <InfoBox type="note" title="默认行为">
          默认值为 <strong>"auto"</strong>：如果你已经运行在 tmux 会话中，自动使用 split panes；
          否则使用 in-process 模式。设置 <strong>"tmux"</strong> 会启用分屏模式，
          并自动检测使用 tmux 还是 iTerm2。
        </InfoBox>
      </div>

      <div className="mb-8">
        <h3 className="text-[15px] font-semibold mb-3.5 text-text-100 flex items-center gap-2 tracking-tight">
          Split panes 安装要求
        </h3>
        <p className="text-sm text-text-200 leading-[1.8] mb-3">
          Split panes 模式需要 <strong>tmux</strong> 或 <strong>iTerm2</strong>（配合 <code className="bg-gradient-to-r from-orange-50 to-amber-50 px-1.5 py-0.5 rounded-md text-xs font-mono text-orange-700 font-medium">it2</code> CLI）：
        </p>

        <CompareTable
          headers={['工具', '安装方式']}
          rows={[
            [
              <strong key="tmux">tmux</strong>,
              '通过系统包管理器安装（macOS: brew install tmux, Linux: apt install tmux）',
            ],
            [
              <strong key="iterm">iTerm2</strong>,
              <>安装 <code className="bg-gradient-to-r from-orange-50 to-amber-50 px-1.5 py-0.5 rounded-md text-xs font-mono text-orange-700 font-medium">it2</code> CLI，然后在 iTerm2 → Settings → General → Magic 中启用 Python API</>,
            ],
          ]}
        />

        <InfoBox type="tip" title="iTerm2 推荐用法">
          <code className="bg-gradient-to-r from-orange-50 to-amber-50 px-1.5 py-0.5 rounded-md text-xs font-mono text-orange-700 font-medium">tmux</code> 在某些操作系统上有已知限制，传统上在 macOS 上效果最好。
          建议在 iTerm2 中使用 <code className="bg-gradient-to-r from-orange-50 to-amber-50 px-1.5 py-0.5 rounded-md text-xs font-mono text-orange-700 font-medium">tmux -CC</code> 作为入口。
        </InfoBox>
      </div>

      <InfoBox type="warning" title="不支持的终端">
        Split panes 模式不支持 VS Code 内置终端、Windows Terminal 和 Ghostty。
        在这些终端中请使用 in-process 模式。
      </InfoBox>
    </>
  )
}
