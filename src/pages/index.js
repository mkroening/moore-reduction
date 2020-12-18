import React, { lazy, Suspense } from 'react';

const Grid = lazy(() => import('@material-ui/core/Grid'));

const Layout = lazy(() => import('../components/layout'));
const InputTable = lazy(() => import('../components/input/InputTable'));
const EquivalencePartitionTable = lazy(() => import('../components/output/EquivalencePartitionTable'));
const StateTransitionTable = lazy(() => import('../components/output/StateTransitionTable'));

import States from '../utils/States';

class Simplifier extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            reductionSteps: [],
        };
        this.simplify = this.simplify.bind(this);
    }

    static reduceStates(states) {
        return Array.from({length: States.getEquivalencePartitionCount(states)}, (v, k) => k)
            .map(equivalencePartition => states.find(state => state.equivalencePartition === equivalencePartition));
    }

    simplify(rawTable) {
        const reductionSteps = States.reductionSteps(States.fromRawTable(rawTable));
        const reducedStates = Simplifier.reduceStates(reductionSteps[reductionSteps.length - 1]);
        this.setState({
            reductionSteps: reductionSteps,
            reducedStates: reducedStates,
        });
    }

    render() {
        const {reductionSteps, reducedStates} = this.state;
        const isSSR = typeof window === "undefined";
        return (
            <>
                {!isSSR && (
                    <Suspense fallback={<p>Loading</p>}>
                        <Layout>
                            <Grid style={{padding: 10}} container spacing={2} alignItems="center" justify="center">
                                <Grid xs item>
                                    <InputTable onSubmit={this.simplify}/>
                                </Grid>
                                {reductionSteps.map(step =>
                                    <Suspense key={step.equivalence.toString()} fallback={<div />}>
                                        <Grid xs item>
                                            <EquivalencePartitionTable states={step}/>
                                        </Grid>
                                    </Suspense>
                                )}
                                {reducedStates === undefined ? undefined :
                                    <Suspense fallback={<div />}>
                                        <Grid xs item>
                                            <StateTransitionTable states={reducedStates}/>
                                        </Grid>
                                    </Suspense>
                                }
                            </Grid>
                        </Layout>
                    </Suspense>
                )}
            </>
        );
    }
}

export default Simplifier;
