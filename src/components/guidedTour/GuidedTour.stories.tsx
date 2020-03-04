import React from 'react';
import { PopOutViewer } from '../../canvasPanelComponents/full-page-plugin/src/index';
export default { title: 'Guided Tour| GuidedTour' };

export const GuidedTour: React.FC = () => {
  return (
    <PopOutViewer
      style={{
        background: '#fff',
        marginTop: 40,
        position: 'fixed',
        left: 0,
        right: 0,
        bottom: 0,
        top: 0,
        zIndex: 10,
      }}
      manifest="https://stephenwf.github.io/ocean-liners.json"
      title="Ocean liners"
      innerHtml={`
            <article class="b-promo__item js-object-fit-container">
                <a class="b-promo__anchor" data-open-viewer href="javascript: void(0)">
                  <div class="b-promo__content">
                    <div class="u-btn u-btn--arrowed s-themed s-themed--background-color s-themed--background-color--hover s-themed--border-color s-themed--border-color--hover">
                      Start tour
                    </div>

                  </div>
                </a>
              </article>
          `}
    >
      <p>Full page plugin. Scroll down to start experience.</p>
      <span className="muted">© Victoria and Albert Museum, London 2018</span>
    </PopOutViewer>
  );
};
