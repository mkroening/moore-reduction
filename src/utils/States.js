class States {
    static fromRawTable(rawTable) {
        const states = JSON.parse(JSON.stringify(rawTable))
            .map(rawRow => ({
                number: rawRow[0],
                output: rawRow[rawRow.length - 1],
                equivalencePartition: rawRow[rawRow.length - 1],
                nextStates: rawRow.slice(1, rawRow.length - 1).map(cell => ({number: cell})),
            }));
        states.equivalence = 0;
        this.sort(states);
        this.applyEquivalencePartitions(states);
        return states;
    }

    static applyEquivalencePartitions(states) {
        states.forEach((state, index, states) =>
            state.nextStates.forEach(state =>
                state.equivalencePartition = states.find(nextState => nextState.number === state.number).equivalencePartition));
    }

    static sort(states) {
        states.forEach((state, index) => state.tmp = index);
        states.sort((state1, state2) => {
            const equivalencePartitionDifference = state1.equivalencePartition - state2.equivalencePartition;
            return equivalencePartitionDifference !== 0 ? equivalencePartitionDifference : state1.tmp - state2.tmp;
        });
    }

    static getHighestEquivalencePartition(states) {
        return states[states.length - 1].equivalencePartition;
    }

    static isOptimal(states) {
        return Array.from({length: this.getHighestEquivalencePartition(states)}, (v, k) => k + 1)
            .map(equivalencePartition => states.filter(state => state.equivalencePartition === equivalencePartition))
            .every(group => group.slice(1)
                .every(state => state.nextStates
                    .every((state, index) => state.equivalencePartition === group[0].nextStates[index].equivalencePartition)));
    }

    static regroup(states) {
        const sameGroupAsFirst = states.filter((state, index, states) => state.nextStates.every((state, index) => state.equivalencePartition === states[0].nextStates[index].equivalencePartition));
        const notSameGroupAsFirst = states.filter((state, index, states) => state.nextStates.some((state, index) => state.equivalencePartition !== states[0].nextStates[index].equivalencePartition));
        return notSameGroupAsFirst.length === 0 ? [sameGroupAsFirst] : [sameGroupAsFirst].concat(this.regroup(notSameGroupAsFirst));
    }

    static step(states) {
        const groups = Array.from({length: this.getHighestEquivalencePartition(states)}, (v, k) => k + 1)
            .map(equivalencePartition => JSON.parse(JSON.stringify(States.regroup(states.filter(state => state.equivalencePartition === equivalencePartition)))))
            .reduce((acc, val) => acc.concat(val), []);                         // TODO: Array.prototype.flatMap()
        groups.forEach((group, index) => group.forEach(state => state.equivalencePartition = index + 1));
        const nextStates = groups.reduce((acc, val) => acc.concat(val), []);    // TODO: Array.prototype.flatMap()
        this.sort(nextStates);
        this.applyEquivalencePartitions(nextStates);
        nextStates.equivalence = states.equivalence + 1;
        return nextStates;
    }

    static reductionSteps(states) {
        return this.isOptimal(states) ? [states] : [states].concat(this.reductionSteps(this.step(states)));
    }
}

export default States;
