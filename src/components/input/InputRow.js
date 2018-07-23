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
                {Array.from({length: values.length - 2}, (v, k) => (
                    <NumberInputCell key={(k+1).toString()} label="Z" value={values[k + 1]} index={k + 1} onChange={this.handleCellChange}/>
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
