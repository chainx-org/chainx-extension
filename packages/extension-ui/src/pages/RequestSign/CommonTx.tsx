import React from 'react';

export default function(props) {
  const { query } = props;

  return (
    <div className="detail">
      <div className="detail-item">
        <span>Module</span>
        <span>{query.module
                .toLowerCase()}
        </span>
      </div>
      <div className="detail-item">
        <span>Method</span>
        <span>{query.method
                .replace(/([A-Z])/g, '_' + '$1')
                .toLowerCase()}
        </span>
      </div>
      <div className="detail-item">
        <span>Args</span>
        <section className="args">
          <ol>
            {(query.args || []).map((arg, index) => {
              if (!arg) {
                return;
              }
              return (
                <li key={index}>
                  {arg.toString().length > 10000
                    ? '[object Object]'
                    : arg.toString()}
                </li>
              );
            })}
          </ol>
        </section>
      </div>
    </div>
  );
}
