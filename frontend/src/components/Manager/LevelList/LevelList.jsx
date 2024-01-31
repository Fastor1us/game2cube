import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { currLevelIndexSelector, levelsSelector } from '../../../store/selectors/managerSelectors';
import styles from './LevelList.module.css';
import { setGridData, setIsCompleted, setLinkedColors } from '../../../store/slicers/gameSlicer';
import { cellPattern } from '../../../utils/constants';
import { setCurrLevelIndex } from '../../../store/slicers/managerSlicer';


export default function LevelList() {
  const dispatch = useDispatch();
  const levels = useSelector(levelsSelector);
  const currLevelIndex = useSelector(currLevelIndexSelector);
  const [currentPage, setCurrentPage] = useState(0);

  useEffect(() => {
    if (currLevelIndex === null) {
      dispatch(setCurrLevelIndex(0));
    }
  }, []);

  useEffect(() => {
    dispatch(setCurrLevelIndex(0));
    setCurrentPage(0);
    dispatch(setLinkedColors({}));
    dispatch(setIsCompleted(false));
  }, [levels]);

  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.key === "ArrowLeft" && currLevelIndex > 0) {
        dispatch(setCurrLevelIndex(currLevelIndex - 1));
      }
      if (
        event.key === "ArrowRight" &&
        currLevelIndex < levels.length - 1
      ) {
        dispatch(setCurrLevelIndex(currLevelIndex + 1));
      }
    };
    window.addEventListener("keydown", handleKeyPress);
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [currLevelIndex, levels]);

  useEffect(() => {
    if (levels && levels.length > 0) {
      const index = currLevelIndex ? (
        currLevelIndex > levels.length - 1 ? 0 : currLevelIndex
      ) : 0;
      const size = levels[index].size;
      const tech = levels[index].cells.map(item => {
        return item.row + '' + item.col;
      });
      const belongSet = new Set();
      dispatch(setGridData(
        new Array(size).fill(0).map(() => new Array(size).fill(0))
          .map((row, rowIndex) => {
            return row.map((_, colIndex) => {
              const matchIndex = tech.indexOf(rowIndex + '' + colIndex);
              if (matchIndex > -1) {
                const number = levels[index].cells[matchIndex].number;
                let belong = 1;
                if (belongSet.has(number)) {
                  belong = 2;
                } else {
                  belongSet.add(number);
                }
                return {
                  ...cellPattern,
                  color: number,
                  sequenceNumber: 1,
                  belong
                }
              }
              return cellPattern;
            })
          })
      ));
    }
  }, [levels, currLevelIndex]);

  const onClick = (index) => {
    if (currLevelIndex !== index) {
      dispatch(setCurrLevelIndex(index));
      dispatch(setLinkedColors({}));
      dispatch(setIsCompleted(false));
    }
  }

  useEffect(() => {
    if (currLevelIndex) {
      const index = currLevelIndex;
      if (index < 9) {
        setCurrentPage(0);
      } else {
        setCurrentPage(Math.floor((index - 1) / (8)));
      }
    }
  }, [currLevelIndex]);

  return (
    <section className={styles.levelList}>
      {levels.length > 10 ? (<>
        {currentPage > 0 && (
          <div
            onClick={() => { setCurrentPage(currentPage - 1) }}
            className={styles.levelItem}
          >
            ...
          </div>
        )}

        {levels && levels.map((_, index) => {
          const tech = currentPage ? 1 : 0;
          if (currentPage === 0) {
            if (index > 8) {
              return null;
            }
          } else if (
            index < currentPage * 8 + tech
            || index >= (currentPage + 1) * 8 + tech
          ) {
            return null;
          }
          return (
            <div
              key={index}
              onClick={() => { onClick(index) }}
              className={`
                ${styles.levelItem} 
                ${currLevelIndex === index ? styles.active : ''}
              `}
            >
              {index + 1}
            </div>
          );
        })}

        {levels && levels.length > (currentPage + 1) * 8 && (
          <div
            onClick={() => { setCurrentPage(currentPage + 1) }}
            className={styles.levelItem}
          >
            ...
          </div>
        )}
      </>) : (<>
        {levels && levels.map((_, index) => (
          <div
            key={index}
            onClick={() => { onClick(index) }}
            className={`
              ${styles.levelItem} 
              ${currLevelIndex === index ? styles.active : ''}
            `}
          >
            {index + 1}
          </div>
        ))}
      </>)
      }
    </section>
  );
}
