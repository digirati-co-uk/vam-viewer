import React, { Component } from 'react';
import { withBemClass, Responsive } from 'canvas-panel-beta';
import './ExploreButton.scss';

class ExploreButton extends Component {
  render() {
    const { bem, onClick, interactive, style } = this.props;
    return (
      <Responsive
        phoneOnly={() => (
          <button
            className={bem.modifiers({ interactive, mobile: true })}
            onClick={onClick}
            style={style}
          >
            {interactive ? 'Back to tour' : 'Free explore'}
          </button>
        )}
      >
        <button
          className={bem.modifiers({ interactive })}
          onClick={onClick}
          style={style}
        >
          {interactive ? 'Back to tour' : 'Free explore'}
        </button>
      </Responsive>
    );
  }
}

export default withBemClass('explore-button')(ExploreButton);
