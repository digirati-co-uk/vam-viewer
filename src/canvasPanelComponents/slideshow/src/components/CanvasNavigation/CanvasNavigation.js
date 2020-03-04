import React, { Component, useEffect } from 'react';
import { withBemClass } from '@canvas-panel/core';
import withLocation from '../withLocation/withLocation';

import './CanvasNavigation.scss';

class CanvasNavigation extends Component {
  componentDidMount() {
    if (this.props.addressable && this.props.hash) {
      let slideId =
        this.props.hash.includes('slide') && this.props.hash.split('=')[1];
      if (
        !this.props.hash ||
        !slideId ||
        slideId < 0 ||
        !Number.isInteger(parseInt(slideId)) ||
        slideId >= this.props.canvasList.length
      ) {
        this.goToSlide(0);
        return;
      } else {
        this.props.goToRange(parseInt(slideId));
      }
    }
  }
  goToSlide = index => {
    if (this.props.addressable) {
      document.location.hash = '#?slide=' + index;
    }
  };

  render() {
    const {
      previousRange,
      nextRange,
      canvasList,
      currentIndex,
      bem,
    } = this.props;
    const size = canvasList ? canvasList.length : this.props.size;
    return (
      <div className={bem}>
        <button
          className={bem
            .element('previous')
            .modifiers({ isFirstPage: currentIndex === 0 })}
          onClick={ev => {
            ev.preventDefault();
            previousRange();
            this.goToSlide(currentIndex - 1);
          }}
        >
          <svg viewBox="0 0 100 100" width="20px" height="20px">
            <path fill="none" d="M-1-1h582v402H-1z" />
            <g>
              <path
                d="M70.173 12.294L57.446.174l-47.62 50 47.62 50 12.727-12.122-36.075-37.879z"
                fill="currentColor"
                fillRule="nonzero"
              />
            </g>
          </svg>
        </button>
        <button
          className={bem
            .element('next')
            .modifiers({ isLastPage: currentIndex === size - 1 })}
          onClick={ev => {
            ev.preventDefault();
            nextRange();
            this.goToSlide(currentIndex + 1);
          }}
        >
          <svg viewBox="0 0 100 100" width="20px" height="20px">
            <path fill="none" d="M-1-1h582v402H-1z" />
            <g>
              <path
                d="M20 88.052l12.727 12.121 47.62-50-47.62-50L20 12.294l36.075 37.88z"
                fill="currentColor"
                fillRule="nonzero"
              />
            </g>
          </svg>
        </button>
      </div>
    );
  }
}

const navigation = withBemClass('canvas-navigation')(CanvasNavigation);

export default withLocation(navigation);
