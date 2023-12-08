import React, { useEffect } from 'react';
import { gameAPI } from '../../utils/api/game-api.js';
import { useDispatch, useSelector } from 'react-redux';
import { setGridData, setLevels } from '../../store/slicers/gameSlicer.js';
import { levelsSelector } from '../../store/selectors/gameSelectors.js';
import { cellPattern } from '../../utils/constants.js';
import Game from '../../components/Game/Game.jsx';


export default function HomePage() {
  const dispatch = useDispatch();
  const [get, { data, isSuccess }] = gameAPI.useGetMutation();

  const levels = useSelector(levelsSelector);

  useEffect(() => {
    get({ main: true });
  }, []);

  useEffect(() => {
    data && dispatch(setLevels(data.levels));
  }, [data]);

  useEffect(() => {
    levels && levels.length > 0 && console.log('levels', levels);
    if (levels && levels.length > 0) {
      const currLevel = 0;
      const size = levels[currLevel].size;
      // tech - технический стороковый массив координат цветных ячеек
      const tech = levels[currLevel].cells.map(item => {
        return item.row + '' + item.col;
      });
      const belongSet = new Set();
      dispatch(setGridData(
        new Array(size).fill(0).map(() => new Array(size).fill(0))
          .map((row, rowIndex) => {
            return row.map((_, colIndex) => {
              const matchIndex = tech.indexOf(rowIndex + '' + colIndex);
              if (matchIndex > -1) {
                const number = levels[currLevel].cells[matchIndex].number;
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
  }, [levels]);

  return (
    <>

      {isSuccess && <Game />}
    </>
  );
}

