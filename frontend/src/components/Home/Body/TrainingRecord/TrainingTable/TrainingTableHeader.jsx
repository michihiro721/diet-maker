import React from "react";
import PropTypes from 'prop-types';
import './styles/training-table-header.css';

const TrainingTableHeader = ({ isAerobic }) => (
  <thead>
    <tr>
      <th>セット</th>
      {isAerobic ? <th>分</th> : <th>kg</th>}
      {isAerobic ? <th></th> : <th>回</th>}
      <th>タイマー</th>
      <th>完了</th>
      <th>操作</th>
    </tr>
  </thead>
);


TrainingTableHeader.propTypes = {
  isAerobic: PropTypes.bool
};

export default TrainingTableHeader;