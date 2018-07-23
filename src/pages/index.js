import React from 'react';

import 'katex/dist/katex.min.css';

import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from '@material-ui/core/Grid';

import createMuiTheme from '@material-ui/core/styles/createMuiTheme';
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider';

import EquivalencePartitionTable from '../components/output/EquivalencePartitionTable';
import InputTable from '../components/input/InputTable';
import States from '../utils/States';
import StateTransitionTable from '../components/output/StateTransitionTable';

const theme = createMuiTheme({
    typography: {
        fontSize: 18,
    },
});

class Simplifier extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            reductionSteps: [],
        };
        this.simplify = this.simplify.bind(this);
    }

    simplify(rawTable) {
        const reductionSteps = States.reductionSteps(States.fromRawTable(rawTable));
        const reducedStates = StateTransitionTable.reduceStates(reductionSteps[reductionSteps.length - 1]);
        this.setState({
            reductionSteps: reductionSteps,
            reducedStates: reducedStates,
        });
    }

    render() {
        const {reductionSteps, reducedStates} = this.state;
        return (
            <MuiThemeProvider theme={theme}>
                <Grid style={{ padding: 10 }} container spacing={16} alignItems={'center'} justify={'center'}>
                    <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500"/>
                    <CssBaseline/>
                    <Grid xs item>
                        <InputTable onSubmit={this.simplify}/>
                    </Grid>
                    {reductionSteps.map(step =>
                        <Grid key={step.equivalence.toString()} xs item>
                            <EquivalencePartitionTable states={step}/>
                        </Grid>
                    )}
                    {reducedStates === undefined ? undefined :
                        <Grid xs item>
                            <StateTransitionTable states={reducedStates}/>
                        </Grid>
                    }
                </Grid>
            </MuiThemeProvider>
        );
    }
}

export default Simplifier;
