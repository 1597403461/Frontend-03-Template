let hooksList = [];
let hooksIndex = 0;

function useState(initialState) {
    hooksList[hooksIndex] = hooksList[hooksIndex] || initialState;

    let currentIndex = hooksIndex;
    const setState = (newState) => {
        hooksList[currentIndex] = newState;
        hooksIndex = 0;
        render();
    }
    return [hooksList[hooksIndex++], setState]
}

function useCallback(callback, deps) {
    if (hooksList[hooksIndex]) {
        let [preCallbak, preDeps] = hooksList[hooksIndex];
        const status = deps.every((item, index) => item === preDeps[index]);
        if (status) {
            hooksIndex++;
            return preCallbak;
        } else {
            hooksList[hooksIndex++] = [callback, deps];
            return callback;
        }
    } else {
        hooksList[hooksIndex] = [callback, deps];
        return callback;
    }
}

function useMome(callback, deps) {
    if (hooksList[hooksIndex]) {
        let [precache, preDeps] = hooksList[hooksIndex];
        const status = deps.every((item, index) => item === preDeps[index]);
        if (status) {
            hooksIndex++;
            return precache;
        } else {
            let cache = callback();
            hooksList[hooksIndex++] = [cache, deps];
            return cache;
        }
    } else {
        let cache = callback();
        hooksList[hooksIndex] = [cache, deps];
        return cache;
    }
}

function useEffect(callback, deps) {
    if (hooksList[hooksIndex]) {
        let { cacheDeps } = hooksList[hooksIndex];
        const status = deps.every((item, index) => item === cacheDeps[index]);
        if (status){
            hooksIndex++;
            return;
        };
        hooksList[hooksIndex++] = { type: 'useEffect', cacheDeps: deps };
        setTimeout(callback)
    } else {
        hooksList[hooksIndex] = { type: 'useEffect', cacheDeps: deps };
        setTimeout(callback)
    }
}


function useLayoutEffect(callback, deps) {
    if (hooksList[hooksIndex]) {
        let { cacheDeps } = hooksList[hooksIndex];
        const status = deps.every((item, index) => item === cacheDeps[index]);
        if (status){
            hooksIndex++;
            return;
        };
        hooksList[hooksIndex++] = { type: 'useEffect', cacheDeps: deps };
        Promise.resolve().then(callback);
        // 或者
        // queueMicrotask(callback);
    } else {
        hooksList[hooksIndex] = { type: 'useEffect', cacheDeps: deps };
        Promise.resolve().then(callback);
        // 或者
        // queueMicrotask(callback);
    }
}

function useReducer(reducer,initialState) {
    let currentIndex = hooksIndex;
    hooksList[currentIndex] = hooksList[currentIndex] || initialState;

    function dispatch(action) {
        hooksList[currentIndex] = reducer(hooksList[currentIndex], action);
        hooksIndex = 0;
        render();
    }
    return [hooksList[hooksIndex++], dispatch]
}