# OpenCode + Oh-My-OpenCode 完整配置文档

> 本文档详细说明了 OpenCode 和 Oh-My-OpenCode 的完整配置方案，包括统一的 JieKou Provider 配置和多 Agent 协作环境搭建。

## 📋 目录

- [配置概览](#配置概览)
- [环境变量配置](#环境变量配置)
- [OpenCode 配置](#opencode-配置)
- [Oh-My-OpenCode 配置](#oh-my-opencode-配置)
- [使用指南](#使用指南)

---

## 配置概览

### 架构说明

本配置采用**统一 Provider + 多 Agent 协作**的架构：

```
JieKou API 中转站 (jiekou.ai)
    ↓
OpenCode Provider 层
    ├── jiekou (统一网关 · OpenAI Compatible)
    ├── openai (中转站 · GPT-5.3 Codex 直通)
    └── anthropic (中转站)
    ↓
Oh-My-OpenCode Agent 层 (10 个专业 Agent)
    ├── sisyphus     → Claude Opus 4.6     (深度推理)
    ├── hephaestus   → GPT-5.3 Codex       (代码专家)
    ├── oracle       → GPT-5.2             (通用高性能)
    ├── librarian    → GPT-5 Mini          (信息检索)
    ├── explore      → Claude Haiku 4.5    (快速探索)
    ├── multimodal   → Gemini 3 Flash      (视觉工程)
    ├── prometheus   → Claude Opus 4.6     (项目规划)
    ├── metis        → Claude Opus 4.6     (方案设计)
    ├── momus        → GPT-5.2             (代码审查)
    └── atlas        → Claude Sonnet 4.5   (知识文档)
```

### 配置优势

- **统一管理**：所有模型通过 JieKou 中转站统一访问
- **清晰标识**：模型配置一目了然（`jiekou/model-name`）
- **安全可靠**：API Key 使用环境变量 `{env:JIEKOU_API_KEY}`，不硬编码
- **灵活扩展**：便于添加新模型和调整配置
- **多 Agent 协作**：10 个专业 Agent + 8 个任务 Category

---

## 环境变量配置

### 1. 配置 JieKou API Key

编辑 `~/.zshrc` 或 `~/.bashrc`：

```bash
# JieKou API 配置
export JIEKOU_API_KEY="your-api-key-here"
```

### 2. 使配置生效

```bash
source ~/.zshrc
```

### 3. 验证环境变量

```bash
echo $JIEKOU_API_KEY
```

---

## OpenCode 配置

### 配置文件位置

```
~/.config/opencode/opencode.json
```

### 完整配置

```json
{
  "$schema": "https://opencode.ai/config.json",
  "plugin": [
    "oh-my-opencode@latest"
  ],
  "provider": {
    "anthropic": {
      "options": {
        "baseURL": "https://api.jiekou.ai/anthropic",
        "apiKey": "{env:JIEKOU_API_KEY}"
      }
    },
    "openai": {
      "options": {
        "baseURL": "https://api.jiekou.ai/openai/v1",
        "apiKey": "{env:JIEKOU_API_KEY}"
      }
    },
    "jiekou": {
      "name": "JieKou API - Unified Gateway",
      "api": "https://api.jiekou.ai/openai/v1",
      "npm": "@ai-sdk/openai-compatible",
      "options": {
        "baseURL": "https://api.jiekou.ai/openai/v1",
        "apiKey": "{env:JIEKOU_API_KEY}"
      },
      "models": { ... }
    }
  }
}
```

> 完整的 JSON 配置文件见本目录下的 [opencode.json](./opencode.json)

### Provider 说明

| Provider | 用途 | BaseURL |
|----------|------|---------|
| **jiekou** | 统一网关，访问所有模型 | `https://api.jiekou.ai/openai/v1` |
| **openai** | OpenAI 兼容（GPT-5.3 Codex） | `https://api.jiekou.ai/openai/v1` |
| **anthropic** | Anthropic 兼容（Claude 系列） | `https://api.jiekou.ai/anthropic` |

### JieKou Provider 模型清单

#### Anthropic 模型

| 模型 ID | 名称 | 上下文窗口 | 输出限制 | 特性 |
|---------|------|-----------|---------|------|
| `claude-opus-4-6` | Claude Opus 4.6 | 1M tokens | 128K | 多模态、Thinking (32K budget) |
| `claude-sonnet-4-5` | Claude Sonnet 4.5 | 200K | 64K | 多模态 |
| `claude-sonnet-4-5-20250929` | Claude Sonnet 4.5 (特定版本) | 200K | 64K | 多模态 |
| `claude-haiku-4-5` | Claude Haiku 4.5 | 200K | 64K | 多模态、快速响应 |

#### OpenAI 模型

| 模型 ID | 名称 | 上下文窗口 | 输出限制 | 特性 |
|---------|------|-----------|---------|------|
| `gpt-5.2` | GPT-5.2 | 400K | 128K | 推理级别: high / medium |
| `gpt-5.2-codex` | GPT-5.2 Codex | 400K | 128K | 推理级别: xhigh / medium |
| `gpt-5-mini` | GPT-5 Mini | 400K | 128K | 轻量快速 |

#### Google 模型

| 模型 ID | 名称 | 上下文窗口 | 输出限制 | 特性 |
|---------|------|-----------|---------|------|
| `gemini-3-pro-preview` | Gemini 3 Pro | 1M+ | 65K | 多模态、Thinking (high) |
| `gemini-3-flash-preview` | Gemini 3 Flash | 1M+ | 65K | 多模态、快速 |

---

## Oh-My-OpenCode 配置

### 配置文件位置

```
~/.config/opencode/oh-my-opencode.json
```

### 完整配置

```json
{
  "$schema": "https://raw.githubusercontent.com/code-yeongyu/oh-my-opencode/master/assets/oh-my-opencode.schema.json",
  "agents": {
    "sisyphus":        { "model": "jiekou/claude-opus-4-6",      "variant": "max" },
    "hephaestus":      { "model": "openai/gpt-5.3-codex",        "variant": "medium" },
    "oracle":          { "model": "jiekou/gpt-5.2",              "variant": "high" },
    "librarian":       { "model": "jiekou/gpt-5-mini" },
    "explore":         { "model": "jiekou/claude-haiku-4-5" },
    "multimodal-looker": { "model": "jiekou/gemini-3-flash-preview" },
    "prometheus":      { "model": "jiekou/claude-opus-4-6",      "variant": "max" },
    "metis":           { "model": "jiekou/claude-opus-4-6",      "variant": "max" },
    "momus":           { "model": "jiekou/gpt-5.2",              "variant": "medium" },
    "atlas":           { "model": "jiekou/claude-sonnet-4-5" }
  },
  "categories": {
    "visual-engineering": { "model": "jiekou/gemini-3-pro-preview", "variant": "max" },
    "ultrabrain":        { "model": "openai/gpt-5.3-codex",        "variant": "xhigh" },
    "deep":              { "model": "openai/gpt-5.3-codex",        "variant": "medium" },
    "artistry":          { "model": "jiekou/gemini-3-pro-preview",  "variant": "max" },
    "quick":             { "model": "jiekou/gemini-3-flash-preview" },
    "unspecified-low":   { "model": "openai/gpt-5.3-codex",        "variant": "medium" },
    "unspecified-high":  { "model": "openai/gpt-5.3-codex",        "variant": "max" },
    "writing":           { "model": "jiekou/gemini-3-flash-preview" }
  }
}
```

> 完整的 JSON 配置文件见本目录下的 [oh-my-opencode.json](./oh-my-opencode.json)

### Agent 一览

| Agent | 模型 | Variant | 特长 | 使用场景 |
|-------|------|---------|------|----------|
| **sisyphus** | Claude Opus 4.6 | max | 最强推理 | 复杂问题分析、架构设计 |
| **hephaestus** | GPT-5.3 Codex | medium | 代码专家 | 代码生成、重构、调试 |
| **oracle** | GPT-5.2 | high | 通用高性能 | 问题解答、决策支持 |
| **librarian** | GPT-5 Mini | - | 信息检索 | 快速查找、轻量任务 |
| **explore** | Claude Haiku 4.5 | - | 快速探索 | 代码库探索、快速分析 |
| **multimodal-looker** | Gemini 3 Flash | - | 多模态 | 图像分析、文档理解 |
| **prometheus** | Claude Opus 4.6 | max | 项目规划 | 需求分析、系统设计 |
| **metis** | Claude Opus 4.6 | max | 方案设计 | 策略制定、技术选型 |
| **momus** | GPT-5.2 | medium | 代码审查 | 质量审查、方案评估 |
| **atlas** | Claude Sonnet 4.5 | - | 知识整合 | 文档整理、知识管理 |

### Category 一览

| Category | 模型 | Variant | 用途 |
|----------|------|---------|------|
| visual-engineering | Gemini 3 Pro | max | 视觉工程任务 |
| ultrabrain | GPT-5.3 Codex | xhigh | 超强推理任务 |
| deep | GPT-5.3 Codex | medium | 深度分析任务 |
| artistry | Gemini 3 Pro | max | 创意设计任务 |
| quick | Gemini 3 Flash | - | 快速响应任务 |
| unspecified-low | GPT-5.3 Codex | medium | 低优先级任务 |
| unspecified-high | GPT-5.3 Codex | max | 高优先级任务 |
| writing | Gemini 3 Flash | - | 写作任务 |

---

## 使用指南

### 启动 OpenCode

```bash
opencode
```

### 使用单个 Agent

```bash
# 在 OpenCode 中执行
/sisyphus "分析这个项目的架构设计"
/hephaestus "重构这段代码，提高可读性"
/oracle "这个 bug 的根本原因是什么？"
```

### 使用多 Agent 协作

```bash
# 创建团队协作
/team "分析项目架构并提出优化建议"
```

### 查看可用模型

```bash
opencode models | grep jiekou
```

---

## 故障排查

### Agent 无法调用

```bash
# 1. 检查环境变量
echo $JIEKOU_API_KEY

# 2. 检查插件是否加载（确认 opencode.json 中启用了 oh-my-opencode@latest）
```

### 模型调用失败

```bash
# 验证 API Key
curl -H "Authorization: Bearer $JIEKOU_API_KEY" \
     https://api.jiekou.ai/openai/v1/models
```

### 配置文件语法错误

```bash
python3 -m json.tool ~/.config/opencode/opencode.json
python3 -m json.tool ~/.config/opencode/oh-my-opencode.json
```

---

## 配置文件备份与恢复

```bash
# 备份
cp ~/.config/opencode/opencode.json ~/.config/opencode/opencode.json.backup
cp ~/.config/opencode/oh-my-opencode.json ~/.config/opencode/oh-my-opencode.json.backup

# 恢复
cp ~/.config/opencode/opencode.json.backup ~/.config/opencode/opencode.json
cp ~/.config/opencode/oh-my-opencode.json.backup ~/.config/opencode/oh-my-opencode.json
```

---

## 最佳实践

### API Key 安全

- **推荐**：使用环境变量 `{env:JIEKOU_API_KEY}`
- **避免**：在配置文件中硬编码 API Key

### 模型选择建议

| 场景 | 推荐 Agent | 推荐模型 |
|------|-----------|---------|
| 复杂推理 | sisyphus / prometheus / metis | Claude Opus 4.6 |
| 代码任务 | hephaestus | GPT-5.3 Codex |
| 快速任务 | explore / librarian | Claude Haiku 4.5 / GPT-5 Mini |
| 多模态 | multimodal-looker | Gemini 3 Flash |
| 代码审查 | momus | GPT-5.2 |
| 文档整理 | atlas | Claude Sonnet 4.5 |

### Variant 配置说明

| Variant | 含义 | 适用场景 |
|---------|------|---------|
| max / xhigh | 最高推理预算 | 最复杂的任务 |
| high | 高推理预算 | 复杂任务 |
| medium | 中等推理预算 | 日常任务 |
| 不设置 | 默认 | 简单任务 |

---

## 相关资源

- [OpenCode 官方文档](https://opencode.ai)
- [Oh-My-OpenCode GitHub](https://github.com/code-yeongyu/oh-my-opencode)
- [JieKou API](https://jiekou.ai)

---

**最后更新**: 2026-02-10
