/**
 * The playable orchestration script.
 *
 * Every step folds a mutation into a world snapshot, so rendering stays a pure
 * function of the step index. Shapes mirror the plugin's durable types:
 * TeamState (team.json) and TeamMessage (inbox/<agent>.jsonl).
 */

export type TaskStatus = 'pending' | 'claimed' | 'in_progress' | 'completed' | 'failed' | 'cancelled'
export type MemberStatus = 'idle' | 'working' | 'removed'
export type VisualTaskState = 'blocked' | 'open' | 'claimed' | 'running' | 'completed'

export interface Task {
  id: string
  subject: string
  description?: string
  status: TaskStatus
  assignee?: string
  dependencies: string[]
  attempt: number
  attemptId?: string
  output?: string
  createdAt: number
  updatedAt: number
}

export interface Member {
  id: string
  name: string
  role: string
  art: string
  provider: string
  model: string
  joinedAt: number
  status: MemberStatus
}

export interface Message {
  id: string
  from: string
  to: string
  content: string
  ts: number
  deliveryClaimedAt?: number
  deliveredAt?: number
  readAt?: number
}

export type BeamKind = 'spawn' | 'dispatch' | 'peer' | 'report' | 'archive'

export interface Beam {
  from: string
  to: string | string[]
  kind: BeamKind
  label: string
}

export interface World {
  teamCreated: boolean
  archived: boolean
  members: Member[]
  tasks: Task[]
  taskSeq: number
  mailboxes: Record<string, Message[]>
  beam: Beam | null
  /** File the viewer should focus for this step. */
  focus: string | null
  /** Actors that should read as "lit" this step. */
  spotlight: string[]
}

export const CAPTAIN = 'captain'
export const TEAM_ID = 'repo-review'
export const CAPTAIN_SESSION = 'session-c31909d0-5858-4478-8b66-673c049ead31'

const T0 = 1_786_681_800_000
const t = (m: number) => T0 + m * 1000

const MEMBER_SEEDS: Member[] = [
  {
    id: 'af44599b-d5c6-4b17-aea0-187fec81d0c4',
    name: 'git-historian',
    role: 'researcher',
    art: 'researcher',
    provider: 'deepseek',
    model: 'deepseek-v4-flash',
    joinedAt: t(2),
    status: 'idle',
  },
  {
    id: '7c1e0b93-42af-4d80-9a55-1f3ec6b0d271',
    name: 'feature-analyst',
    role: 'engineer',
    art: 'engineer',
    provider: 'deepseek',
    model: 'deepseek-v4-flash',
    joinedAt: t(3),
    status: 'idle',
  },
  {
    id: 'e5d84a10-9f27-4c6b-b3a8-06c95fd41e77',
    name: 'security-reviewer',
    role: 'reviewer',
    art: 'security-reviewer',
    provider: 'deepseek',
    model: 'deepseek-v4-flash',
    joinedAt: t(4),
    status: 'idle',
  },
]

const TASK_SEEDS: Omit<Task, 'createdAt' | 'updatedAt' | 'attempt' | 'status'>[] = [
  {
    id: 't1',
    subject: '收集最近两周提交历史并分类',
    description: '按 feature / fix / refactor 分桶，输出提交清单。',
    assignee: 'git-historian',
    dependencies: [],
  },
  {
    id: 't2',
    subject: '分析新增功能与行为变更',
    assignee: 'feature-analyst',
    dependencies: ['t1'],
  },
  {
    id: 't3',
    subject: '审查权限与输入校验风险',
    assignee: 'security-reviewer',
    dependencies: ['t1'],
  },
  {
    id: 't4',
    subject: '汇总最终分析报告',
    dependencies: ['t2', 't3'],
  },
]

export interface ToolCall {
  name: string
  args: Record<string, unknown>
  by: string
  returns?: Record<string, unknown>
}

export interface Step {
  id: string
  chapter: string
  title: string
  /** Narration line shown under the stage. */
  caption: string
  /** The mechanism sentence — what actually happens in the source. */
  mechanism: string
  calls: ToolCall[]
  apply: (w: World) => void
  /** Seconds this step holds during autoplay. */
  hold?: number
}

const clone = <T,>(value: T): T => structuredClone(value)

function findTask(w: World, id: string): Task {
  const task = w.tasks.find((candidate) => candidate.id === id)
  if (!task) throw new Error(`unknown task ${id}`)
  return task
}

function findMember(w: World, name: string): Member {
  const member = w.members.find((candidate) => candidate.name === name)
  if (!member) throw new Error(`unknown member ${name}`)
  return member
}

/** Mirrors state.ts#beginTaskAttempt. */
function beginAttempt(task: Task, assignee: string, attemptId: string, at: number) {
  task.attempt += 1
  task.status = 'claimed'
  task.assignee = assignee
  task.attemptId = attemptId
  task.output = undefined
  task.updatedAt = at
}

function push(w: World, box: string, message: Message) {
  w.mailboxes[box] = [...(w.mailboxes[box] ?? []), message]
}

export const STEPS: Step[] = [
  {
    id: 'prompt',
    chapter: '00 · 起点',
    title: '一句自然语言',
    caption: '在 DeepSeek Harness Web UI 里发一句话。当前这个会话不会新建什么调度进程，它就地成为队长。',
    mechanism: 'systemPrompt.section() 注入的团队协议告诉模型：接下来按 create → add_member → create_task → 调度 → 汇总 的顺序走。',
    calls: [],
    apply: () => undefined,
    hold: 5,
  },
  {
    id: 'create',
    chapter: '01 · 建队',
    title: 'agent_teams_create',
    caption: '工具在工作区下开出团队目录，写下 team.json。从这一刻起，磁盘就是这支队伍的唯一真相。',
    mechanism: 'createTeamDir() → mkdir <workspace>/.agent-teams/repo-review/inbox/ + 原子写 team.json（临时文件 + rename）。',
    calls: [
      {
        name: 'agent_teams_create',
        by: CAPTAIN,
        args: { name: 'repo-review', description: '审查最近两周的仓库更新' },
        returns: { team_id: 'repo-review', state_dir: '.agent-teams/repo-review' },
      },
    ],
    apply: (w) => {
      w.teamCreated = true
      w.focus = 'team.json'
      w.spotlight = [CAPTAIN]
    },
    hold: 6,
  },
  {
    id: 'members',
    chapter: '02 · 招募',
    title: 'agent_teams_add_member × 3',
    caption: '成员不是一次性的 subagent，而是可续聊的子会话：各自有 persona、有独立对话历史，进程重启也还在。',
    mechanism: 'ctx.subagents.startContinuable() 返回 durable child session id，连同队长当前的 provider / model / 思考强度快照一起写进 members[]。',
    calls: [
      {
        name: 'agent_teams_add_member',
        by: CAPTAIN,
        args: { name: 'git-historian', role: 'researcher' },
        returns: { member_id: 'af44599b…', status: 'idle' },
      },
      { name: 'agent_teams_add_member', by: CAPTAIN, args: { name: 'feature-analyst', role: 'engineer' } },
      { name: 'agent_teams_add_member', by: CAPTAIN, args: { name: 'security-reviewer', role: 'reviewer' } },
    ],
    apply: (w) => {
      w.members = clone(MEMBER_SEEDS)
      for (const member of w.members) w.mailboxes[member.name] = []
      w.beam = { from: CAPTAIN, to: w.members.map((m) => m.name), kind: 'spawn', label: 'startContinuable()' }
      w.focus = 'team.json'
      w.spotlight = [CAPTAIN, ...w.members.map((m) => m.name)]
    },
    hold: 7,
  },
  {
    id: 'tasks',
    chapter: '03 · 拆解',
    title: 'agent_teams_create_task × 4',
    caption: '目标被拆成带依赖的任务。t2、t3 依赖 t1，t4 依赖 t2 和 t3 —— 依赖没完成，任务根本不可领取。',
    mechanism: 'unsatisfiedDependencies() 是领取前的硬校验；taskVisualState() 把它渲染成面板里的 blocked / open。',
    calls: [
      {
        name: 'agent_teams_create_task',
        by: CAPTAIN,
        args: { subject: '收集最近两周提交历史并分类', assignee: 'git-historian' },
      },
      {
        name: 'agent_teams_create_task',
        by: CAPTAIN,
        args: { subject: '分析新增功能与行为变更', dependencies: ['t1'], assignee: 'feature-analyst' },
      },
      {
        name: 'agent_teams_create_task',
        by: CAPTAIN,
        args: { subject: '审查权限与输入校验风险', dependencies: ['t1'], assignee: 'security-reviewer' },
      },
      {
        name: 'agent_teams_create_task',
        by: CAPTAIN,
        args: { subject: '汇总最终分析报告', dependencies: ['t2', 't3'] },
      },
    ],
    apply: (w) => {
      w.tasks = TASK_SEEDS.map((seed, index) => ({
        ...clone(seed),
        status: 'pending' as TaskStatus,
        attempt: 0,
        createdAt: t(6 + index),
        updatedAt: t(6 + index),
      }))
      w.taskSeq = 4
      w.focus = 'team.json'
      w.spotlight = [CAPTAIN]
    },
    hold: 8,
  },
  {
    id: 'dispatch-1',
    chapter: '04 · 派发',
    title: '调度器自动领取并唤醒',
    caption: '队长不用手动喊人。调度器挑一个依赖已满足的任务，原子领取，再把它作为成员的下一轮 turn 推过去。',
    mechanism: 'kickTeam() → nextReadyTask() → beginTaskAttempt() 生成 attempt=1 与唯一 attemptId → ctx.subagents.followup() 唤醒成员。',
    calls: [
      {
        name: 'scheduler.kickTeam',
        by: 'runtime',
        args: { trigger: 'agent/status: idle' },
        returns: { dispatched: 't1 → git-historian', attempt_id: '3c9f…a41e' },
      },
    ],
    apply: (w) => {
      const task = findTask(w, 't1')
      beginAttempt(task, 'git-historian', '3c9f18d0-7b64-4e02-9d31-5a2c7f08a41e', t(12))
      findMember(w, 'git-historian').status = 'working'
      w.beam = { from: CAPTAIN, to: 'git-historian', kind: 'dispatch', label: 'followup() · t1' }
      w.focus = 'team.json'
      w.spotlight = [CAPTAIN, 'git-historian']
    },
    hold: 9,
  },
  {
    id: 'claim',
    chapter: '05 · 执行',
    title: 'claim_task → in_progress',
    caption: '成员醒来第一件事是 claim，拿回同一个 attempt_id。这张票据决定它之后写的东西算不算数。',
    mechanism: '同一个成员不能同时持有两个未完成任务；memberOpenTask() 在 claim 时挡住第二次领取。',
    calls: [
      {
        name: 'agent_teams_claim_task',
        by: 'git-historian',
        args: { task_id: 't1' },
        returns: { attempt: 1, attempt_id: '3c9f…a41e' },
      },
      {
        name: 'agent_teams_update_task',
        by: 'git-historian',
        args: { task_id: 't1', status: 'in_progress', attempt_id: '3c9f…a41e' },
      },
    ],
    apply: (w) => {
      const task = findTask(w, 't1')
      task.status = 'in_progress'
      task.updatedAt = t(15)
      w.focus = 'team.json'
      w.spotlight = ['git-historian']
    },
    hold: 7,
  },
  {
    id: 'complete-1',
    chapter: '06 · 交付',
    title: 'update_task(completed)',
    caption: '完成时带着 attempt_id 写回 output。t1 一变 completed，t2、t3 立刻从 blocked 解锁成 open。',
    mechanism: '终态任务不可变：再写同一个任务会被 "terminal task is immutable" 挡回去，只能走 reassign 重试。',
    calls: [
      {
        name: 'agent_teams_update_task',
        by: 'git-historian',
        args: {
          task_id: 't1',
          status: 'completed',
          attempt_id: '3c9f…a41e',
          output: '共 61 个提交：feature 23 / fix 27 / refactor 11',
        },
      },
    ],
    apply: (w) => {
      const task = findTask(w, 't1')
      task.status = 'completed'
      task.output = '共 61 个提交：feature 23 / fix 27 / refactor 11'
      task.updatedAt = t(48)
      w.focus = 'team.json'
      w.spotlight = ['git-historian']
    },
    hold: 8,
  },
  {
    id: 'report',
    chapter: '07 · 汇报',
    title: 'send_message(to="captain")',
    caption: '汇报走邮箱：先落盘到 inbox/captain.jsonl，再用 steer() 插进队长最近的一个模型步，不用等队长这一轮跑完。',
    mechanism: 'steer() 成功返回 delivered="live" 并把这条消息标记 readAt；失败就退回 delivered="mailbox"，留在磁盘等下次读取。',
    calls: [
      {
        name: 'agent_teams_send_message',
        by: 'git-historian',
        args: { to: 'captain', content: 't1 完成：61 个提交已分类，明细见任务 output。' },
        returns: { delivered: 'live' },
      },
    ],
    apply: (w) => {
      push(w, CAPTAIN, {
        id: 'da665acd-768f-4d4e-a6df-4a796214e51b',
        from: 'git-historian',
        to: CAPTAIN,
        content: 't1 完成：61 个提交已分类，明细见任务 output。',
        ts: t(49),
        deliveredAt: t(49),
        readAt: t(49),
      })
      findMember(w, 'git-historian').status = 'idle'
      w.beam = { from: 'git-historian', to: CAPTAIN, kind: 'report', label: 'steer() · live' }
      w.focus = 'inbox/captain.jsonl'
      w.spotlight = ['git-historian', CAPTAIN]
    },
    hold: 9,
  },
  {
    id: 'dispatch-2',
    chapter: '08 · 并行',
    title: '解锁的任务同时落地',
    caption: '两条腿一起跑：解锁后的 t2、t3 分别落到两名空闲成员身上，各自拿一个独立的 attempt。',
    mechanism: '调度在 agent/status 的每个 idle 边沿触发，不是常驻轮询；每次只给一个成员一份就绪工作。',
    calls: [
      {
        name: 'scheduler.kickTeam',
        by: 'runtime',
        args: { ready: ['t2', 't3'] },
        returns: { dispatched: 't2 → feature-analyst, t3 → security-reviewer' },
      },
    ],
    apply: (w) => {
      beginAttempt(findTask(w, 't2'), 'feature-analyst', '81b4c7e2-0d59-4a13-8f6a-2e70b9c4d5aa', t(52))
      beginAttempt(findTask(w, 't3'), 'security-reviewer', 'ba07f36d-4c18-49e7-91b2-7d5e0af38c6b', t(52))
      findTask(w, 't2').status = 'in_progress'
      findTask(w, 't3').status = 'in_progress'
      findMember(w, 'feature-analyst').status = 'working'
      findMember(w, 'security-reviewer').status = 'working'
      w.beam = {
        from: CAPTAIN,
        to: ['feature-analyst', 'security-reviewer'],
        kind: 'dispatch',
        label: 'followup() · t2 / t3',
      }
      w.focus = 'team.json'
      w.spotlight = [CAPTAIN, 'feature-analyst', 'security-reviewer']
    },
    hold: 8,
  },
  {
    id: 'peer',
    chapter: '09 · 互通',
    title: '成员 → 成员，不经队长',
    caption: '成员之间直接说话：消息追加到对方的 inbox/<name>.jsonl，再唤醒对方。队长完全不在这条链路上。',
    mechanism: 'appendMailbox() 写对方邮箱 → deliverToMember() 即 followup() → 返回 delivered="wake"；对方不在线就留 delivered="mailbox"，等它 idle 时由调度器补投。',
    calls: [
      {
        name: 'agent_teams_send_message',
        by: 'security-reviewer',
        args: { to: 'feature-analyst', content: 'PR #482 改了鉴权中间件，你那边的行为变更清单要带上它。' },
        returns: { delivered: 'wake' },
      },
    ],
    apply: (w) => {
      push(w, 'feature-analyst', {
        id: '4f21b8ce-93a7-4d15-b60e-8c37a1f5e902',
        from: 'security-reviewer',
        to: 'feature-analyst',
        content: 'PR #482 改了鉴权中间件，你那边的行为变更清单要带上它。',
        ts: t(74),
        deliveredAt: t(74),
        readAt: t(74),
      })
      w.beam = {
        from: 'security-reviewer',
        to: 'feature-analyst',
        kind: 'peer',
        label: 'appendMailbox + followup()',
      }
      w.focus = 'inbox/feature-analyst.jsonl'
      w.spotlight = ['security-reviewer', 'feature-analyst']
    },
    hold: 10,
  },
  {
    id: 'shared-pool',
    chapter: '10 · 共享池',
    title: '无主任务归谁',
    caption: 't2、t3 完成后 t4 解锁。它没有指定负责人，属于共享池 —— 谁先空闲谁接。',
    mechanism: 'nextReadyTask() 先找指派给我的，找不到再找 assignee 为空的；领取和写盘在同一把团队锁里完成，多人抢同一任务只有一个赢。',
    calls: [
      {
        name: 'agent_teams_update_task',
        by: 'feature-analyst',
        args: { task_id: 't2', status: 'completed', output: '新增 6 项能力，3 项行为变更' },
      },
      {
        name: 'agent_teams_update_task',
        by: 'security-reviewer',
        args: { task_id: 't3', status: 'completed', output: '2 处输入校验缺口，1 处权限越界' },
      },
      { name: 'scheduler.kickTeam', by: 'runtime', args: {}, returns: { dispatched: 't4 → feature-analyst' } },
    ],
    apply: (w) => {
      const t2 = findTask(w, 't2')
      t2.status = 'completed'
      t2.output = '新增 6 项能力，3 项行为变更'
      t2.updatedAt = t(96)
      const t3 = findTask(w, 't3')
      t3.status = 'completed'
      t3.output = '2 处输入校验缺口，1 处权限越界'
      t3.updatedAt = t(98)
      beginAttempt(findTask(w, 't4'), 'feature-analyst', 'd52a9e14-6b03-4f7c-a8d9-31e6b0c72f4d', t(99))
      findTask(w, 't4').status = 'in_progress'
      findMember(w, 'security-reviewer').status = 'idle'
      push(w, CAPTAIN, {
        id: '9c0d47a2-51e8-4b3f-8a72-6df90e13c845',
        from: 'security-reviewer',
        to: CAPTAIN,
        content: 't3 完成：2 处输入校验缺口，1 处权限越界，详情已写入 output。',
        ts: t(98),
        deliveredAt: t(98),
        readAt: t(98),
      })
      w.beam = { from: CAPTAIN, to: 'feature-analyst', kind: 'dispatch', label: 'followup() · t4' }
      w.focus = 'team.json'
      w.spotlight = [CAPTAIN, 'feature-analyst']
    },
    hold: 9,
  },
  {
    id: 'summary',
    chapter: '11 · 汇总',
    title: 'agent_teams_status',
    caption: '队长读一次 status：成员实时活动、任务清单与产出、各自邮箱 —— 全部来自磁盘，不靠记忆。',
    mechanism: 'status 把 team.json 与 ctx.agents 的真实 running / idle / ready 合并；读完顺手把队长邮箱里的未读标记为已读。',
    calls: [
      {
        name: 'agent_teams_status',
        by: CAPTAIN,
        args: {},
        returns: { members: 3, tasks: '4/4 completed', captain_inbox: 3 },
      },
    ],
    apply: (w) => {
      const t4 = findTask(w, 't4')
      t4.status = 'completed'
      t4.output = '已汇总为一份报告：功能 / 缺陷 / 安全三段'
      t4.updatedAt = t(140)
      findMember(w, 'feature-analyst').status = 'idle'
      push(w, CAPTAIN, {
        id: '2e7b6f03-c94d-4a81-95e0-b3f1a70d68e5',
        from: 'feature-analyst',
        to: CAPTAIN,
        content: 't4 完成：报告已汇总，功能 / 缺陷 / 安全三段齐全。',
        ts: t(141),
        deliveredAt: t(141),
        readAt: t(141),
      })
      w.beam = { from: CAPTAIN, to: [], kind: 'report', label: 'status' }
      w.focus = 'inbox/captain.jsonl'
      w.spotlight = [CAPTAIN]
    },
    hold: 8,
  },
  {
    id: 'archive',
    chapter: '12 · 收工',
    title: 'agent_teams_delete',
    caption: '结束不是删除，是归档。任务、依赖图、邮箱整套搬进 archive/，下次打开这个会话还能原样复盘。',
    mechanism: 'archiveTeamDir() 用 rename 把整个团队目录挪到 archive/<teamId>/；成员会话被 interrupt 并写进 retired-members.json，不可再被唤醒。',
    calls: [
      { name: 'agent_teams_delete', by: CAPTAIN, args: {}, returns: { deleted: true, archived_to: 'archive/repo-review' } },
    ],
    apply: (w) => {
      w.archived = true
      for (const member of w.members) member.status = 'removed'
      w.beam = null
      w.focus = 'team.json'
      w.spotlight = [CAPTAIN]
    },
    hold: 8,
  },
]

const EMPTY: World = {
  teamCreated: false,
  archived: false,
  members: [],
  tasks: [],
  taskSeq: 0,
  mailboxes: { [CAPTAIN]: [] },
  beam: null,
  focus: null,
  spotlight: [],
}

/** One immutable world snapshot per step. */
export const SNAPSHOTS: World[] = (() => {
  const frames: World[] = []
  let current = clone(EMPTY)
  for (const step of STEPS) {
    const next = clone(current)
    next.beam = null
    step.apply(next)
    frames.push(next)
    current = next
  }
  return frames
})()

/** Mirrors state.ts#taskVisualState, with `claimed` split out for teaching. */
export function visualState(task: Task, tasks: Task[]): VisualTaskState {
  if (task.status === 'completed') return 'completed'
  if (task.status === 'in_progress') return 'running'
  if (task.status === 'claimed') return 'claimed'
  const byId = new Map(tasks.map((candidate) => [candidate.id, candidate]))
  const blocked = task.dependencies.some((id) => {
    const dependency = byId.get(id)
    return dependency !== undefined && dependency.status !== 'completed'
  })
  return blocked ? 'blocked' : 'open'
}

/** The exact JSON the plugin would have on disk for this snapshot. */
export function teamJsonText(w: World): string {
  if (!w.teamCreated) return ''
  return JSON.stringify(
    {
      name: TEAM_ID,
      id: TEAM_ID,
      description: '审查最近两周的仓库更新',
      captainSessionId: CAPTAIN_SESSION,
      createdAt: T0,
      members: w.members.map((member) => ({
        id: member.id,
        name: member.name,
        role: member.role,
        provider: member.provider,
        model: member.model,
        joinedAt: member.joinedAt,
        status: member.status,
      })),
      tasks: w.tasks.map((task) => ({
        id: task.id,
        subject: task.subject,
        status: task.status,
        ...(task.assignee === undefined ? {} : { assignee: task.assignee }),
        dependencies: task.dependencies,
        attempt: task.attempt,
        ...(task.attemptId === undefined ? {} : { attemptId: task.attemptId }),
        ...(task.output === undefined ? {} : { output: task.output }),
        createdAt: task.createdAt,
        updatedAt: task.updatedAt,
      })),
      taskSeq: w.taskSeq,
    },
    null,
    2,
  )
}

/** One JSON object per line, exactly like the plugin's mailbox files. */
export function mailboxText(w: World, agentKey: string): string {
  return (w.mailboxes[agentKey] ?? []).map((message) => JSON.stringify(message)).join('\n')
}
