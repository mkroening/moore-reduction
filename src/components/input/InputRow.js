import React from 'react';

import PropTypes from 'prop-types';

import 'katex/dist/katex.min.css';
import {InlineMath} from 'react-katex';

import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';

import NumberInputCell from './NumberInputCell';

class InputRow extends React.Component {
    constructor(props) {
        super(props);
        this.handleCellChange = this.handleCellChange.bind(this);
    }

    handleCellChange(cellIndex, value) {
        const {index, onChange} = this.props;
        onChange(index, cellIndex, value);
    }

    render() {
        const {values} = this.props;
        return (
            <TableRow>
                <TableCell padding="checkbox">
                    <InlineMath>{String.raw`Z_{${values[0]}}`}</InlineMath>
                </TableCell>
                {values.slice(1, values.length - 1).map((cell, index) => (
                    <NumberInputCell key={index.toString()} label="Z" value={cell} index={index + 1} onChange={this.handleCellChange}/>
                ))}
                <NumberInputCell label="Y" value={values[values.length - 1]} index={values.length - 1} onChange={this.handleCellChange}/>
            </TableRow>
        );
    }
}

InputRow.propTypes = {
    index: PropTypes.number.isRequired,
    values: PropTypes.array.isRequired,
    onChange: PropTypes.func.isRequired,
};

export default InputRow;
