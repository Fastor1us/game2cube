import React, { useEffect, useState } from 'react';
import { Range, getTrackBackground } from 'react-range';

const STEP = 1;

const RangeSlider = ({
  min, max, step, width, handleChange
}) => {
  const [values, setValues] = useState([min, max]);
  const trackWidth = width - 36;

  useEffect(() => {
    handleChange({
      target: {
        name: 'slider',
        value: {
          min: values[0],
          max: values[1]
        }
      }
    });
  }, [values]);

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        flexWrap: 'wrap',
        padding: '0 10px'
      }}
    >
      <Range
        values={values}
        step={step || STEP}
        min={min}
        max={max}
        onChange={(values) => {
          setValues(values);
        }}
        renderTrack={({ props, children }) => (
          <div
            onMouseDown={props.onMouseDown}
            onTouchStart={props.onTouchStart}
            style={{
              ...props.style,
              height: '36px',
              display: 'flex',
              width: '100%',
              position: 'relative',
              margin: '10px 8px 26px',
            }}
          >
            <div
              ref={props.ref}
              style={{
                height: '5px',
                width: `${trackWidth}px`,
                borderRadius: '4px',
                background: getTrackBackground({
                  values,
                  colors: ['#ccc', '#548BF4', '#ccc'],
                  min: min,
                  max: max,
                }),
                alignSelf: 'center',
              }}
            >
              {children}
            </div>

            {[...Array(max - min + 1)].map((_, index) => {
              const value = min + index;
              const position = (value - min) / (max - min) * trackWidth;

              return (
                <div
                  key={value}
                  style={{
                    position: 'absolute',
                    top: '30%',
                    left: `${position}px`,
                    transform: 'translateX(-50%)',
                    zIndex: 2,
                    width: '5px',
                    height: '14px',
                    background: `
                    ${value > values[0] &&
                        value < values[1] ?
                        '#548BF4' : '#CCC'
                      }`,
                  }}
                >
                  <br />
                  <div
                    style={{
                      marginTop: '8px',
                    }}
                  >
                    {value}

                  </div>
                </div>
              );
            })}
          </div>
        )
        }

        renderThumb={({ props, isDragged }) => (
          <div
            {...props}
            style={{
              ...props.style,
              zIndex: 3,
              height: '35px',
              width: '35px',
              borderRadius: '50%',
              backgroundColor: '#FFF',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              boxShadow: '0px 2px 6px #AAA',
              outline: 'none'
            }}
          >
            <div
              style={{
                height: '16px',
                width: '5px',
                backgroundColor: isDragged ? '#548BF4' : '#CCC'
              }}
            />
          </div>
        )}
      />
      {/* <output style={{ marginTop: '60px' }}>
        {values[0]} - {values[1]}
      </output> */}
    </div >
  );
};

export default RangeSlider;
