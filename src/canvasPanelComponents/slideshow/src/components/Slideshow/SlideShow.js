import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Manifest,
  Fullscreen,
  RangeNavigationProvider,
  withBemClass,
  Responsive,
} from '@canvas-panel/core';
import MobilePageView from '../MobilePageView/MobilePageView';
import SimpleSlideTransition from '../SimpleSlideTransition/SimpleSlideTransition';
import ProgressIndicator from '../ProgressIndicator/ProgressIndicator';
import Slide from '../Slide/Slide';
import CanvasNavigation from '../CanvasNavigation/CanvasNavigation.tsx';

import './SlideShow.scss';

class SlideShow extends Component {
  state = {
    innerWidth: window.innerWidth,
    rangeProps: {},
    inFocus: false,
  };

  static propTypes = {
    manifestUri: PropTypes.string,
    jsonLd: PropTypes.object,
    mobileBreakpoint: PropTypes.number,
    addressable: PropTypes.bool,
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    backgroundColor: PropTypes.string,
  };

  static defaultProps = {
    mobileBreakpoint: 767,
    backgroundColor: '#000000',
  };

  componentDidMount() {
    window.addEventListener('resize', this.setSize);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.setSize);
  }

  setSize = () => {
    this.setState({
      innerWidth: window.innerWidth,
    });
  };

  qualifiesForMobile = () => {
    return this.state.innerWidth <= this.props.mobileBreakpoint;
  };

  render() {
    const {
      manifestUri,
      jsonLd,
      renderPanel,
      bem,
      backgroundColor,
    } = this.props;
    return (
      <div
        className={bem.modifiers({
          isMobile: Responsive.md.phone(),
        })}
        onMouseOver={() => this.setState({ inFocus: true })}
        onMouseLeave={() => this.setState({ inFocus: false })}
      >
        <Fullscreen>
          {({ ref, ...fullscreenProps }) => (
            <Manifest url={manifestUri} jsonLd={jsonLd}>
              <RangeNavigationProvider>
                {rangeProps => {
                  const {
                    manifest,
                    canvas,
                    canvasList,
                    currentIndex,
                    previousRange,
                    nextRange,
                    region,
                    goToRange,
                  } = rangeProps;
                  return (
                    <div
                      className={bem.element('inner-frame')}
                      ref={ref}
                      style={{ background: backgroundColor }}
                    >
                      {this.qualifiesForMobile() ? (
                        <MobilePageView
                          manifest={manifest}
                          previousRange={previousRange}
                          nextRange={nextRange}
                          fullscreenProps={fullscreenProps}
                          {...rangeProps}
                        />
                      ) : (
                        <React.Fragment>
                          <SimpleSlideTransition id={currentIndex}>
                            <Slide
                              fullscreenProps={fullscreenProps}
                              behaviors={canvas.__jsonld.behavior || []}
                              manifest={manifest}
                              canvas={canvas}
                              region={region}
                              renderPanel={renderPanel}
                              backgroundColor={backgroundColor}
                            />
                          </SimpleSlideTransition>
                          <CanvasNavigation
                            previousRange={previousRange}
                            nextRange={nextRange}
                            canvasList={canvasList}
                            currentIndex={currentIndex}
                            addressable={this.props.addressable}
                            goToRange={goToRange}
                            id={this.props.id}
                            parentInFocus={this.state.inFocus}
                          />
                          <ProgressIndicator
                            currentCanvas={currentIndex}
                            totalCanvases={canvasList.length}
                          />
                        </React.Fragment>
                      )}
                    </div>
                  );
                }}
              </RangeNavigationProvider>
            </Manifest>
          )}
        </Fullscreen>
      </div>
    );
  }
}

export default withBemClass('slideshow')(SlideShow);
