import type { ChapterStepProps } from "../../registry/types";
import "./CostQuota.css";

const A = `${import.meta.env.BASE_URL}assets/`;

function Kicker({ children }: { children: string }) {
  return <div className="cq-kicker">{children}</div>;
}

const tokenBlocks = Array.from({ length: 12 }, (_, index) => index);
const weekCells = Array.from({ length: 7 }, (_, index) => index);

const topics = [
  ["价格订阅", "468", "cq-heat-1"],
  ["生态", "368", "cq-heat-2"],
  ["编程能力", "327", "cq-heat-3"],
  ["稳定性", "213", "cq-heat-4"],
  ["综合能力", "208", "cq-heat-5"],
  ["Agent", "155", "cq-heat-6"],
  ["速度", "124", "cq-heat-7"],
  ["多模态", "113", "cq-heat-8"],
] as const;

export default function CostQuota({ step }: ChapterStepProps) {
  if (step === 0) {
    return (
      <section className="cq-scene cq-split">
        <Kicker>SPEED AND COST · TWO DIFFERENT AXES</Kicker>
        <div className="cq-speed-side">
          <span>FAST</span>
          <strong className="hero-num">快</strong>
          <div className="cq-speed-lines" aria-hidden="true"><i /><i /><i /><i /></div>
        </div>
        <div className="cq-split-blade"><i /></div>
        <div className="cq-cost-side">
          <span>CHEAP?</span>
          <strong className="hero-num">省</strong>
          <div className="cq-cost-dial"><i><b /></i><em>?</em></div>
        </div>
        <div className="cq-separate">分开算</div>
      </section>
    );
  }

  if (step === 1) {
    return (
      <section className="cq-scene cq-api-input">
        <Kicker>API PRICE · INPUT</Kicker>
        <div className="cq-token-stream" aria-hidden="true">
          {tokenBlocks.map((block) => <i key={block} />)}
        </div>
        <div className="cq-api-gate"><span>INPUT</span><i /></div>
        <div className="cq-api-price">
          <span>PER 1M TOKENS</span>
          <strong className="hero-num"><b>$</b>2</strong>
          <em>API</em>
        </div>
      </section>
    );
  }

  if (step === 2) {
    return (
      <section className="cq-scene cq-output">
        <Kicker>API PRICE · OUTPUT</Kicker>
        <div className="cq-output-machine">
          <div className="cq-output-in"><span>1M</span><i /></div>
          <div className="cq-output-core"><b>×3</b><i /></div>
          <div className="cq-output-out"><span>OUTPUT</span><strong className="hero-num">$6</strong></div>
        </div>
        <div className="cq-subscription-warning">
          <span>API</span><i /><strong>SUBSCRIPTION</strong>
        </div>
      </section>
    );
  }

  if (step === 3) {
    return (
      <section className="cq-scene cq-monthly">
        <Kicker>MONTHLY SUBSCRIPTION · ENTRY TIER</Kicker>
        <div className="cq-plan cq-plan-grok">
          <img src={`${A}xai.svg`} alt="xAI" />
          <span>SUPERGROK</span>
          <strong className="hero-num">$30</strong>
          <em>/ MONTH</em>
        </div>
        <div className="cq-price-gap"><span>+$10</span><i /></div>
        <div className="cq-plan cq-plan-gpt">
          <img src={`${A}openai.svg`} alt="OpenAI" />
          <span>CHATGPT PLUS</span>
          <strong className="hero-num">$20</strong>
          <em>/ MONTH</em>
        </div>
      </section>
    );
  }

  if (step === 4) {
    return (
      <section className="cq-scene cq-premium">
        <Kicker>HIGH TIER · MONTHLY</Kicker>
        <div className="cq-elevator cq-elevator-grok">
          <div className="cq-elevator-car">
            <img src={`${A}xai.svg`} alt="xAI" />
            <span>GROK HIGH TIER</span>
            <strong className="hero-num">$300</strong>
          </div>
          <i><b /></i>
        </div>
        <div className="cq-premium-delta">
          <span>PRICE GAP</span>
          <strong className="hero-num">+$100</strong>
        </div>
        <div className="cq-elevator cq-elevator-gpt">
          <div className="cq-elevator-car">
            <img src={`${A}openai.svg`} alt="OpenAI" />
            <span>CHATGPT PRO</span>
            <strong className="hero-num">$200</strong>
          </div>
          <i><b /></i>
        </div>
      </section>
    );
  }

  if (step === 5) {
    return (
      <section className="cq-scene cq-weekly">
        <Kicker>WEEKLY QUOTA · RESET CYCLE</Kicker>
        <div className="cq-week-label">
          <span>WEEK</span>
          <strong className="hero-num">7</strong>
          <em>DAYS</em>
        </div>
        <div className="cq-battery">
          <div className="cq-battery-body">
            {weekCells.map((cell) => <i key={cell}><span>{cell + 1}</span></i>)}
          </div>
          <b />
        </div>
        <div className="cq-reset-loop" aria-hidden="true"><i /><span>RESET</span></div>
      </section>
    );
  }

  if (step === 6) {
    return (
      <section className="cq-scene cq-heatmap">
        <Kicker>5,842 COMMENTS · ASPECT CLUSTERS</Kicker>
        <div className="cq-heat-grid">
          {topics.map(([name, count, heat]) => (
            <div className={`cq-heat-cell ${heat}`} key={name}>
              <span>{name}</span>
              <strong className="hero-num">{count}</strong>
              <i><b /></i>
            </div>
          ))}
        </div>
        <div className="cq-heat-verdict"><span>#1</span><strong>价格 / 订阅</strong></div>
      </section>
    );
  }

  return (
    <section className="cq-scene cq-burnout">
      <Kicker>TYPICAL NEGATIVE EXPERIENCE · X</Kicker>
      <div className="cq-fast-badge"><span>MODEL</span><strong>FAST</strong><i /></div>
      <div className="cq-afternoon">
        <div className="cq-clock-face">
          <span>13:00</span><span>18:00</span><i><b /></i>
        </div>
        <strong>一下午</strong>
      </div>
      <div className="cq-week-drain">
        <span>WEEKLY QUOTA</span>
        <div className="cq-drain-cells">{weekCells.map((cell) => <i key={cell} />)}</div>
        <strong className="hero-num">0 / 7</strong>
      </div>
      <div className="cq-burn-line"><i /></div>
    </section>
  );
}
