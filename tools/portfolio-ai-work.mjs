// Public expression of source-inspected builds. No inbox, model call, or private data.
export const aiWork = `<section class="section ai-work-section" id="ai-work" aria-labelledby="ai-work-heading">
  <div class="library-heading"><div><p class="eyebrow blue">AI in practice</p><h2 id="ai-work-heading">Better decisions.<br>Systems built for results.</h2></div><p>I use AI where it improves a decision or a workflow—not simply to produce more output. These builds show how I turn diagnosis into practical implementation.</p></div>
  <div class="build-cases">
    <article class="build-case build-case--radar">
      <p class="build-kind">AI-assisted opportunity intelligence</p>
      <h3>Turn an alert into a next action.</h3>
      <p>I built a workflow that reads incoming opportunity alerts, checks fit against a defined rubric, prepares a tailored draft for matches and routes it to a review queue.</p>
      <ol class="build-sequence" aria-label="Opportunity workflow"><li><span>Read</span>Incoming alerts</li><li><span>Qualify</span>Fit and scope</li><li><span>Draft</span>Relevant response</li><li><span>Review</span>Human decision</li></ol>
      <details class="build-details"><summary>Inside the build <span aria-hidden="true">+</span></summary><div><p><strong>Rules decide fit. AI prepares the draft.</strong> Keeping those jobs separate makes the workflow easier to adjust and inspect. When AI drafting is unavailable, the queue receives a clearly labelled template instead.</p><p><strong>My contribution:</strong> the workflow design, matching logic, drafting instructions and implementation with AI coding tools.</p><p class="build-note">Implementation walkthrough. This page is not connected to my private inbox or running the AI drafter. Final applications are reviewed and sent manually.</p></div></details>
    </article>
    <article class="build-case build-case--model">
      <p class="build-kind">Interactive growth model</p>
      <h3>Find the constraint before buying more traffic.</h3>
      <p>Cheap leads can still be expensive business. I built a model that connects acquisition to bookings, sales assumptions and margin—so the next decision starts with the economics.</p>
      <div class="economics-chain" aria-label="Economic model connects acquisition to margin"><span>Lead cost</span><b aria-hidden="true">→</b><span>Bookings</span><b aria-hidden="true">→</b><span>Sales</span><b aria-hidden="true">→</b><span>Margin</span></div>
      <p>Change the inputs. Compare the trade-offs. See which part of the funnel deserves attention.</p>
      <a class="text-link" href="./model.html">Explore the interactive model <span aria-hidden="true">↗</span></a>
      <p class="build-note">Illustrative scenarios, not a claim about client revenue. This is a calculation tool, not a live AI model.</p>
    </article>
  </div>
</section>`;
export const aiWorkCSS = `
/* Two source-inspected builds, using the approved portfolio palette and type. */
.ai-work-section{background:var(--paper-bright)}
.build-cases{display:grid;grid-template-columns:1fr 1fr;gap:24px;margin-top:36px}
.build-case{border:1px solid var(--ink);padding:32px;display:flex;flex-direction:column;min-width:0}
.build-case--radar{border-top:5px solid var(--blue)}
.build-case--model{background:var(--paper);border-top:5px solid var(--ink)}
.build-kind{font-size:12px;font-weight:750;letter-spacing:.035em;color:var(--blue);margin-bottom:20px}
.build-case h3{font-size:clamp(28px,2.6vw,38px);line-height:1.08;font-weight:780;letter-spacing:-.045em;max-width:20ch;margin-bottom:20px}
.build-case>p:not(.build-kind):not(.build-note),.build-details p{font-size:16px;line-height:1.7;color:var(--ink-soft)}
.build-sequence{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));margin:28px 0;list-style:none;padding:0;border-block:1px solid var(--line)}
.build-sequence li{font-size:12px;line-height:1.45;padding:18px 8px 18px 0}
.build-sequence span{font-size:15px;font-weight:750;display:block;color:var(--ink);margin-bottom:6px}
.build-details{margin-top:auto;border-top:1px solid var(--line)}
.build-details summary{display:flex;justify-content:space-between;align-items:center;gap:20px;cursor:pointer;min-height:48px;font-size:14px;font-weight:700;padding-block:12px}
.build-details[open] summary span{transform:rotate(45deg)}
.build-details p{margin-bottom:16px}
.build-case .build-note,.build-details .build-note{font-size:13px;line-height:1.6;color:var(--quiet);margin-top:16px}
.economics-chain{display:flex;align-items:center;justify-content:space-between;gap:8px;flex-wrap:wrap;border-block:1px solid var(--line);padding:23px 0;margin:28px 0;font-size:14px;font-weight:700}
.economics-chain b{font-weight:400;color:var(--blue)}
.build-case .text-link{margin-top:18px}
#lightbox-image{width:auto;height:auto;max-width:100%;max-height:100%;object-fit:contain}
@media(max-width:760px){.build-cases{grid-template-columns:1fr;gap:20px;margin-top:28px}.build-case{padding:24px 20px}.build-case h3{font-size:30px;max-width:none}.build-sequence{grid-template-columns:1fr 1fr}.build-sequence li{padding:14px 8px 14px 0}.economics-chain{font-size:13px;gap:5px}.build-kind{font-size:12px}}
`;
