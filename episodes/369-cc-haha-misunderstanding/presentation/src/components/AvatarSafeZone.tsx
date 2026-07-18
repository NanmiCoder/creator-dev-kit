import "./AvatarSafeZone.css";

/** 头像贴哪个角。`null` = 不出镜 / 不预留（默认，TTS 或无头像视频用）。 */
export type AvatarCorner =
  | "top-right"
  | "bottom-left"
  | "top-left"
  | "bottom-right"
  | null;

interface Props {
  /** 头像所在角。出镜叠头像的视频设成对应角，只避让对应小角落。 */
  corner: AvatarCorner;
}

/**
 * 出镜视频的「圆形头像安全区」开发辅助层。
 *
 * 主内容仍按头像所在角避让，但辅助圆环默认不显示，避免普通预览或录屏露出后台标注。
 * 需要检查安全边界时在 URL 加 `?safe=1`。
 *
 * `corner = null`（默认）→ 不渲染，对不出镜 / TTS 视频零影响。
 *
 * 在 stage-frame 内渲染（与 `.scene` 同级），跟随舞台一起 scale，pointer-events
 * 关闭，点击穿透不影响推进。
 *
 * 安全区只保留右上角的小头像位置：约 320×320，圆 236 直径 + 四周呼吸。
 * **不要把整条右侧都当成禁区**，只避开这个角落。
 */
export function AvatarSafeZone({ corner }: Props) {
  if (!corner) return null;
  const shouldShow =
    typeof window !== "undefined" &&
    new URLSearchParams(window.location.search).get("safe") === "1";
  if (!shouldShow) return null;

  return (
    <div className={`avatar-safe avatar-safe--${corner}`} aria-hidden>
      <div className="avatar-safe-ring">
        <span className="avatar-safe-label">口播头像</span>
        <span className="avatar-safe-sub">头像区</span>
      </div>
    </div>
  );
}
