import React from 'react';

export default function(props) {
  const { query } = props;

  return (
    <div className="detail">
      <div className="detail-item">
        <span>Module</span>
        <span>{query.module}</span>
      </div>
      <div className="detail-item">
        <span>Method</span>
        <span>{query.method}</span>
      </div>
      <div className="detail-item">
        <span>Args</span>
        <section className="args">
          <ol>
            {(query.args || []).map((arg, index) => {
              return <li key={index}>{arg}</li>;
            })}
          </ol>
        </section>
      </div>
    </div>
  );
}
