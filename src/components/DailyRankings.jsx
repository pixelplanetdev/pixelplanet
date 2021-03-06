/*
 * Rankings Tabs
 * @flow
 */

import React from 'react';
import { useSelector } from 'react-redux';

const DailyRankings = () => {
  const totalDailyRanking = useSelector(
    (state) => state.ranks.totalDailyRanking,
  );

  return (
    <div style={{ overflowY: 'auto', display: 'inline-block' }}>
      <table>
        <tr>
          <th>#</th>
          <th>user</th>
          <th>Pixels</th>
          <th># Total</th>
          <th>Total Pixels</th>
        </tr>
        {
          totalDailyRanking.map((rank) => (
            <tr>
              <td>{rank.dailyRanking}</td>
              <td>{rank.name}</td>
              <td>{rank.dailyTotalPixels}</td>
              <td>{rank.ranking}</td>
              <td>{rank.totalPixels}</td>
            </tr>
          ))
        }
      </table>
    </div>
  );
};

export default React.memo(DailyRankings);
