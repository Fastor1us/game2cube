import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { currLevelSelector, levelsSelector } from '../../../store/selectors/managerSelectors';
import styles from './LevelList.module.css';
import { setGridData, setIsCompleted, setLinkedColors } from '../../../store/slicers/gameSlicer';
import { cellPattern } from '../../../utils/constants';
import { setCurrLevel } from '../../../store/slicers/managerSlicer';


export default function LevelList() {
  const dispatch = useDispatch();
  const levels = useSelector(levelsSelector);
  const currLevel = useSelector(currLevelSelector);
  const [currentPage, setCurrentPage] = useState(0);

  useEffect(() => {
    if (currLevel.index === null) {
      dispatch(setCurrLevel({ index: 0 }));
    }
  }, []);

  useEffect(() => {
    dispatch(setCurrLevel({ index: 0 }));
    setCurrentPage(0);
    dispatch(setLinkedColors({}));
    dispatch(setIsCompleted(false));
  }, [levels]);

  useEffect(() => {
    if (levels && levels.length > 0) {
      const index = currLevel?.index ? (
        currLevel?.index > levels.length - 1 ? 0 : currLevel.index
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
  }, [levels, currLevel]);

  const onClick = (index) => {
    if (currLevel.index !== index) {
      dispatch(setCurrLevel({
        index: index,
      }));
      dispatch(setLinkedColors({}));
      dispatch(setIsCompleted(false));
    }
  }

  useEffect(() => {
    if (currLevel?.index) {
      const index = currLevel.index;
      if (index < 9) {
        setCurrentPage(0);
      } else {
        setCurrentPage(Math.floor((index - 1) / (8)));
      }
    }
  }, [currLevel]);

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
              ${styles.levelItem} ${currLevel.index === index ? styles.active : ''}
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
          <div key={index}
            onClick={() => { onClick(index) }}
            className={`
            ${styles.levelItem} ${currLevel.index === index ? styles.active : ''}
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
