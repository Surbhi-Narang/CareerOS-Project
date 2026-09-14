import React from 'react';
import { Check, Clock, XCircle, PartyPopper } from 'lucide-react';
import './Tracker.css';

/**
 * ApplicationStepper Component
 * Renders a 7-stage vertical stepper pipeline with visual states:
 * ✅ Completed | ⬤ Active (Pulsing) | ○ Upcoming | ❌ Rejected | 🎉 Offer Received
 */
export default function ApplicationStepper({ stages, currentStageIndex, isRejected, isOfferReceived }) {
  return (
    <div className="stepper-pipeline">
      {stages.map((stageName, index) => {
        const isCompleted = !isRejected && index < currentStageIndex;
        const isCurrent = !isRejected && !isOfferReceived && index === currentStageIndex;
        const isUpcoming = !isRejected && index > currentStageIndex;
        const isFinalOffer = isOfferReceived && index === 6;

        return (
          <div
            key={stageName}
            className={`stepper-item ${
              isCompleted
                ? 'status-completed'
                : isCurrent
                ? 'status-current'
                : isRejected && index === currentStageIndex
                ? 'status-rejected'
                : isFinalOffer
                ? 'status-offer'
                : 'status-upcoming'
            }`}
          >
            {/* Connector line (except last item) */}
            {index < stages.length - 1 && (
              <div
                className={`stepper-line ${
                  index < currentStageIndex && !isRejected ? 'line-completed' : ''
                }`}
              />
            )}

            {/* Stage Icon Node */}
            <div className="stepper-node">
              {isRejected && index === currentStageIndex ? (
                <XCircle size={16} className="node-icon icon-red" />
              ) : isFinalOffer ? (
                <PartyPopper size={16} className="node-icon icon-gold" />
              ) : isCompleted ? (
                <Check size={16} className="node-icon icon-green" />
              ) : isCurrent ? (
                <span className="pulse-dot" />
              ) : (
                <span className="upcoming-dot" />
              )}
            </div>

            {/* Stage Label & Details */}
            <div className="stepper-content">
              <div className="stepper-header">
                <span className="stage-title">{stageName}</span>
                {isCurrent && <span className="stage-tag tag-active">In Progress</span>}
                {isCompleted && <span className="stage-tag tag-done">Completed</span>}
                {isRejected && index === currentStageIndex && (
                  <span className="stage-tag tag-rejected">Process Ended</span>
                )}
                {isFinalOffer && <span className="stage-tag tag-offer">🎉 Offer Received!</span>}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
