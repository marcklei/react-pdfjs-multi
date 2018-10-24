import React, { Fragment, PureComponent } from 'react';
import RendererExample from './RendererExample';
import MultiViewerExample from './MultiViewerExample';

import './App.css';

class App extends PureComponent {
  state = {
    activeExample: 'MultiViewerExample',
  };

  changeExample = e => {
    const activeExample = e.currentTarget.innerText;
    this.setState(() => ({ activeExample }));
  };

  renderLinks(targets) {
    return targets.map(target => (
      <li
        className={this.state.activeExample === target ? 'active' : ''}
        onClick={this.changeExample}
        key={target}
      >
        {target}
      </li>
    ));
  }

  renderActiveExample() {
    switch (this.state.activeExample) {
      case 'MultiViewerExample':
        return <MultiViewerExample />;
      case 'RendererExample':
        return <RendererExample />;
      default:
        return false;
    }
  }

  render() {
    return (
      <Fragment>
        <ul className="examples-nav">
          {this.renderLinks(['MultiViewerExample', 'RendererExample'])}
        </ul>
        <div className="examples">{this.renderActiveExample()}</div>
      </Fragment>
    );
  }
}

export default App;
