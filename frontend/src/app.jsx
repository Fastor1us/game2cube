import React from 'react';


export default function App() {
  const [count, setCount] = React.useState(0);

  return (<>
    <h1>React 18</h1>

    <p>
      fsdfs
    </p>

    <button onClick={() => setCount(count + 1)}>
      count is: {count}
    </button>
  </>
  );
}
