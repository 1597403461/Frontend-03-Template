// useState
(function () {
    let hooksState = [];
    let hooksIndex = 0;
    function useState(initialState) {
        hooksState[hooksIndex] = hooksState[hooksIndex] || initialState;
        let currentIndex = hooksIndex;
        function setState(newState) {
            hooksState[currentIndex] = newState;
            hooksIndex = 0;
            render();
        }
        return [hooksState[hooksIndex++], setState]
    }
    return useState;
})()



// useCallback
(function () {
    let lastCallback;
    let cacheDep;
    function useCallback(func, dep) {
        if (dep) {
            const status = cacheDep.every((item, index) => item == dep[index]);
            if (status) return;
            lastCallback = func;
            cacheDep = dep;
        } else {
            lastCallback = func;
            cacheDep = dep;
        }
        return lastCallback;
    }
    return useCallback;
})()

// useMemo
(function () {
    let cacheResult;
    let cacheDep;
    function useMemo(func, dep) {
        if (dep) {
            const status = cacheDep.every((item, index) => item == dep[index]);
            if (status) return;
            cacheResult = func.call(this,...arguments);
            cacheDep = dep;
        } else {
            cacheResult = func.call(this,...arguments);
            cacheDep = dep;
        }
        return cacheResult;
    }
    return useMemo;
})()

// useReducer
(function() {
    let state;
    function useReducer(reducer,initialState){
        state = state || initialState;
        function dispatch(action) {
            state = reducer(state, action);
        }
        return [state, dispatch]
    }
    return useReducer;
})()

// useEffect
(function () {
    let cacheDep;
    function useEffect(func, dep) {
        if (dep) {
            const status = cacheDep.every((item, index) => item == dep[index]);
            if (status) return;
            setTimeout(func());
            cacheDep = dep;
        } else {
            setTimeout(func());
            cacheDep = dep;
        }
    }
    return useEffect;
})()

// useLayouyEffect
(function () {
    let cacheDep;
    function useLayouyEffect(func, dep) {
        if (dep) {
            const status = cacheDep.every((item, index) => item == dep[index]);
            if (status) return;
            Promise.resolve().then(func);
            cacheDep = dep;
        } else {
            Promise.resolve().then(func);
            cacheDep = dep;
        }
    }
    return useLayouyEffect;
})()