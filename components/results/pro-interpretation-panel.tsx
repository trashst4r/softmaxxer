/**
 * Sprint 14: Pro Interpretation Panel
 * Causal reasoning and priority framing for Pro results view.
 * Consumes interpretation logic from lib/interpretation/skin-state-analyzer.ts
 */

import type { AnalysisResult } from "@/types/analysis";
import { interpretSkinState, generatePriorityFramework } from "@/lib/interpretation/skin-state-analyzer";

interface ProInterpretationPanelProps {
  result: AnalysisResult;
}

export function ProInterpretationPanel({ result }: ProInterpretationPanelProps) {
  const interpretation = interpretSkinState(result);
  const priorities = generatePriorityFramework(result);

  return (
    <div className="clinical-card space-y-6 bg-primary/5 border-primary/30">
      <div className="space-y-3 border-b border-primary/30 pb-4">
        <h2 className="text-xl font-light text-foreground">Causal Interpretation</h2>
        <p className="text-xs text-muted uppercase tracking-wider">Pro Feature - Why Your Skin Behaves This Way</p>
      </div>

      {/* Underlying Pattern */}
      <div className="space-y-3">
        <h3 className="clinical-label">Underlying Pattern</h3>
        <div className="flex items-center gap-3">
          <div className="w-1.5 h-1.5 rounded-full bg-primary" />
          <span className="text-sm font-medium text-foreground">{interpretation.underlyingPattern}</span>
        </div>
      </div>

      {/* Primary Driver + Secondary Factors */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-3">
          <h3 className="clinical-label">Primary Driver</h3>
          <p className="text-sm text-foreground capitalize">{interpretation.primaryDriver}</p>
        </div>
        {interpretation.secondaryFactors.length > 0 && (
          <div className="space-y-3">
            <h3 className="clinical-label">Secondary Factors</h3>
            <ul className="space-y-1.5">
              {interpretation.secondaryFactors.map((factor, index) => (
                <li key={index} className="text-sm text-muted flex gap-2">
                  <span className="text-primary">•</span>
                  <span className="capitalize">{factor}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Causal Explanation */}
      <div className="space-y-3 pt-4 border-t border-border">
        <h3 className="clinical-label">Causal Explanation</h3>
        <p className="text-sm text-foreground/90 leading-relaxed">
          {interpretation.causalExplanation}
        </p>
      </div>

      {/* Priority Framework */}
      <div className="space-y-4 pt-4 border-t border-border">
        <h3 className="clinical-label">Priority Framework</h3>

        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-red-700 dark:text-red-400 uppercase tracking-wider">
                Immediate
              </span>
              <div className="h-px flex-1 bg-red-700/20 dark:bg-red-400/20" />
            </div>
            <p className="text-sm text-foreground">{priorities.immediate}</p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-yellow-700 dark:text-yellow-400 uppercase tracking-wider">
                Secondary
              </span>
              <div className="h-px flex-1 bg-yellow-700/20 dark:bg-yellow-400/20" />
            </div>
            <p className="text-sm text-foreground">{priorities.secondary}</p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-muted uppercase tracking-wider">
                Maintenance
              </span>
              <div className="h-px flex-1 bg-border" />
            </div>
            <p className="text-sm text-foreground">{priorities.maintenance}</p>
          </div>

          {/* Reasoning */}
          <div className="space-y-2 pt-2">
            <h4 className="text-xs font-medium text-muted uppercase tracking-wider">Reasoning</h4>
            <p className="text-xs text-muted leading-relaxed">
              {priorities.reasoning}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
