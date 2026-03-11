import type { Step } from '../types/index.ts'

export const STEPS: Step[] = [
  { id: 'overview', title: '什么是 Claude Code Agent Teams', subtitle: '了解核心概念', tag: 'concept', tagLabel: '概念' },
  { id: 'vs-subagents', title: 'Claude Code Agent Teams vs Subagents', subtitle: '选择正确的工具', tag: 'concept', tagLabel: '概念' },
  { id: 'enable', title: '启用 Claude Code Agent Teams', subtitle: '配置与设置', tag: 'practice', tagLabel: '实操' },
  { id: 'first-team', title: '创建第一个团队', subtitle: '动手实践', tag: 'practice', tagLabel: '实操' },
  { id: 'architecture', title: '架构与通信', subtitle: '深入理解工作原理', tag: 'advanced', tagLabel: '进阶' },
  { id: 'usecases', title: '实战用例', subtitle: '代码审查、调试、开发', tag: 'advanced', tagLabel: '进阶' },
  { id: 'bestpractices', title: '最佳实践与排障', subtitle: '技巧与常见问题', tag: 'tips', tagLabel: '技巧' },
]
