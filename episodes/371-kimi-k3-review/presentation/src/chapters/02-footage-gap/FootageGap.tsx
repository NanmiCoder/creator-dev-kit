import type { ChapterStepProps } from "../../registry/types";
import "./FootageGap.css";

export default function FootageGap({ step }: ChapterStepProps) {
  if (step === 0 || step === 1 || step === 2) {
    return <section className="fg-scene" aria-label="实测运行视频替换区" />;
  }

  return null;
}
