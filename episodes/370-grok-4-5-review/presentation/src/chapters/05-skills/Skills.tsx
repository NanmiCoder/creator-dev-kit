import type { ChapterStepProps } from "../../registry/types";
import "./Skills.css";

const skills = [
  ["70", "DISCOVERED"],
  ["01", "NEWS-EXTRACTOR"],
  ["02", "LOAD_SKILL"],
  ["LIVE", "ACTIVE STATE"],
] as const;

function Label({ children }: { children: string }) {
  return <div className="sk-label">{children} · SKILLS AGENT</div>;
}

export default function Skills({ step }: ChapterStepProps) {
  if (step === 0) return (
    <section className="sk-scene sk-brief">
      <Label>PROJECT 02</Label>
      <div className="sk-cli"><span>EXISTING CORE</span><strong>CLI</strong><i>Skills Agent</i></div>
      <div className="sk-arrow"><b /><span>产品化</span></div>
      <div className="sk-web"><span>DELIVERABLE</span><strong>WEB</strong><i>Application</i></div>
    </section>
  );

  if (step === 1) return (
    <section className="sk-scene sk-boot">
      <Label>ONE-SHOT BOOT</Label>
      <div className="sk-terminal">
        <span>$ npm run dev</span>
        <i /><i /><i />
        <strong>READY</strong>
      </div>
      <div className="sk-boot-ring"><span>1×</span><small>一次启动</small></div>
    </section>
  );

  if (step === 2) return (
    <section className="sk-scene sk-toolkit">
      <Label>CAPABILITIES VISIBLE</Label>
      <div className="sk-skill-core">AGENT</div>
      {skills.map(([number, name], index) => <div className={`sk-skill sk-skill-${index + 1}`} key={name}><span>{number}</span><strong>{name}</strong></div>)}
      <div className="sk-orbit" aria-hidden="true" />
    </section>
  );

  if (step === 3) return (
    <section className="sk-scene sk-flow">
      <Label>INTERACTION LOOP</Label>
      <div className="sk-flow-node"><span>YOU</span><strong>Prompt</strong></div>
      <div className="sk-flow-track"><i /><i /><i /></div>
      <div className="sk-flow-node sk-flow-agent"><span>AGENT</span><strong>Act</strong></div>
      <div className="sk-flow-panel"><small>LIVE STATUS</small><b>●</b><strong>CONNECTED</strong></div>
    </section>
  );

  return (
    <section className="sk-scene sk-proof">
      <Label>BUILD PROOF</Label>
      <div className="sk-test"><span>PROJECT TESTS</span><strong className="hero-num">101</strong><i>ALL PASSED</i></div>
      <div className="sk-build"><span>FRONTEND</span><strong>BUILD</strong><i>✓ PASSED</i></div>
      <div className="sk-final"><span>FINAL SCORE</span><strong className="hero-num">9.35</strong><i>/ 10</i></div>
      <div className="sk-proof-line"><b /></div>
    </section>
  );
}
