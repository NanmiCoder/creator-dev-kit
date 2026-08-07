# 音色速查

完整列表：`mmx speech voices --output json`（共 303 个，含日/韩/英/越/荷等语种）。

## 重要：音色 ID 含空格和括号

普通话音色 ID 形如 `Chinese (Mandarin)_Radio_Host`，**带空格和括号**。
在 shell 里必须加引号，否则会被拆成多个参数：

```bash
mmx speech synthesize --voice "Chinese (Mandarin)_Radio_Host" --text "..."
```

`scripts/synth.py` 用 `subprocess` 列表传参，不走 shell，天然安全。

## 普通话（26 个）

自媒体口播常用：

| ID | 适合 |
|---|---|
| `Chinese (Mandarin)_Radio_Host` | 电台主播感，节奏稳，**通用首选** |
| `Chinese (Mandarin)_News_Anchor` | 新闻播报，正式、权威 |
| `Chinese (Mandarin)_Male_Announcer` | 男声播音，浑厚 |
| `Chinese (Mandarin)_Reliable_Executive` | 沉稳职场感，适合商业/科技解读 |
| `Chinese (Mandarin)_Sincere_Adult` | 诚恳自然，适合口述/自白 |
| `Chinese (Mandarin)_Gentleman` | 温和男声 |
| `Chinese (Mandarin)_Wise_Women` | 知性女声，适合知识科普 |
| `Chinese (Mandarin)_Warm_Girl` | 温暖女声，亲和 |
| `Chinese (Mandarin)_Warm_Bestie` | 闺蜜感，轻松聊天调性 |
| `Chinese (Mandarin)_Humorous_Elder` | 诙谐长者，适合吐槽/段子 |

其余：`Mature_Woman`、`Unrestrained_Young_Man`、`Kind-hearted_Antie`、
`HK_Flight_Attendant`、`Sweet_Lady`、`Southern_Young_Man`、`Gentle_Youth`、
`Kind-hearted_Elder`、`Cute_Spirit`、`Lyrical_Voice`、`Straightforward_Boy`、
`Gentle_Senior`、`Stubborn_Friend`、`Crisp_Girl`、`Pure-hearted_Boy`、`Soft_Girl`
（均需加 `Chinese (Mandarin)_` 前缀）

## 粤语（6 个）

`Cantonese_ProfessionalHost（F)`、`Cantonese_ProfessionalHost（M)`、
`Cantonese_GentleLady`、`Cantonese_PlayfulMan`、`Cantonese_CuteGirl`、
`Cantonese_KindWoman`

注意这两个 ID 里的 `（` 是**全角**左括号、`)` 是**半角**右括号，照抄别改。

## 早期音色（仍可用）

`male-qn-qingse`、`female-shaonv`、`female-yujie` 等，以及带 `-jingpin` 后缀的精品版。
音质不如上面的新音色，除非有特定需求否则不推荐。

## 复刻音色

复刻出的 `voice_id` 与系统音色用法完全一致，直接传给 `--voice`。

两个约束：
- 复刻需要账号**已完成个人/企业实名认证**
- 复刻音色 **7 天内未被正式调用会被平台自动删除**——长期不用要定期跑一次合成保活

重建：`scripts/clone_voice.sh <素材> <新voice_id>`（voice_id 不可与已有重复）
