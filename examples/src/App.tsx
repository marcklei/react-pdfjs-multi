import React, { useState } from 'react';
import MultiViewerExample from './MultiViewerExample';
import RendererExample from './RendererExample';

enum Examples {
  MultiViewer = 'MultiViewer',
  Renderer = 'Renderer',
}

type Example = keyof typeof Examples;

const App = () => {
  const [example, setExample] = useState(Examples.MultiViewer);

  return (
    <>
      <ul className="examples-nav">
        {(Object.keys(Examples) as Example[]).map((k) => (
          <li
            key={k}
            className={example === k ? 'active' : undefined}
            onClick={() => {
              setExample(Examples[k]);
            }}
          >{`${k}Example`}</li>
        ))}
      </ul>
      <div className="examples">
        {example === Examples.MultiViewer && <MultiViewerExample />}
        {example === Examples.Renderer && <RendererExample />}
      </div>
    </>
  );
};

export default App;
